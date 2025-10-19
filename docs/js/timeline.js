/**
 * Timeline Module for HerData
 * D3.js histogram with brush selection for temporal filtering
 */

import { Debug } from './app.js';

export class Timeline {
    constructor(containerId, onBrushCallback) {
        this.containerId = containerId;
        this.onBrushCallback = onBrushCallback;
        this.svg = null;
        this.data = null;
        this.brush = null;
        this.xScale = null;
        this.yScale = null;

        // Dimensions
        this.margin = { top: 20, right: 30, bottom: 60, left: 60 };
        this.width = 0;
        this.height = 0;
    }

    /**
     * Load CMIF data and extract letter dates
     */
    async loadLetterData() {
        Debug.log('INIT', 'Loading CMIF data for timeline...');

        try {
            const response = await fetch('data/ra-cmif.xml');
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

            // Extract dates from letters
            const letters = xmlDoc.querySelectorAll('correspDesc');
            const lettersByYear = new Map();

            letters.forEach(corresp => {
                const sentAction = corresp.querySelector('correspAction[type="sent"]');
                if (sentAction) {
                    const dateElem = sentAction.querySelector('date');
                    if (dateElem && dateElem.hasAttribute('when')) {
                        const when = dateElem.getAttribute('when');
                        const year = parseInt(when.substring(0, 4));

                        if (year >= 1762 && year <= 1824) {
                            lettersByYear.set(year, (lettersByYear.get(year) || 0) + 1);
                        }
                    }
                }
            });

            // Convert to array format for D3
            this.data = [];
            for (let year = 1762; year <= 1824; year++) {
                this.data.push({
                    year: year,
                    count: lettersByYear.get(year) || 0
                });
            }

            Debug.log('INIT', `Loaded ${this.data.length} years, ${letters.length} total letters`);
            return this.data;

        } catch (error) {
            Debug.log('ERROR', `Failed to load CMIF data: ${error.message}`);
            throw error;
        }
    }

    /**
     * Initialize and render the timeline
     */
    async initialize() {
        Debug.log('INIT', 'Initializing timeline...');

        // Load data if not already loaded
        if (!this.data) {
            await this.loadLetterData();
        }

        // Setup dimensions
        const container = document.getElementById(this.containerId);
        const containerRect = container.getBoundingClientRect();
        this.width = containerRect.width - this.margin.left - this.margin.right;
        this.height = containerRect.height - this.margin.top - this.margin.bottom;

        // Clear any existing SVG
        d3.select(`#${this.containerId}`).selectAll('*').remove();

        // Create SVG
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        // Create scales
        this.xScale = d3.scaleLinear()
            .domain([1762, 1824])
            .range([0, this.width]);

        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.count)])
            .range([this.height, 0])
            .nice();

        // Add axes
        const xAxis = d3.axisBottom(this.xScale)
            .tickFormat(d3.format('d'))
            .ticks(10);

        const yAxis = d3.axisLeft(this.yScale)
            .ticks(5);

        this.svg.append('g')
            .attr('class', 'timeline-axis')
            .attr('transform', `translate(0,${this.height})`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        this.svg.append('g')
            .attr('class', 'timeline-axis')
            .call(yAxis);

        // Add axis labels
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height + 50)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text('Jahr');

        this.svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -this.height / 2)
            .attr('y', -45)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text('Anzahl Briefe');

        // Draw bars
        const barWidth = this.width / (1824 - 1762 + 1) - 1;

        this.svg.selectAll('.timeline-bar')
            .data(this.data)
            .enter()
            .append('rect')
            .attr('class', 'timeline-bar')
            .attr('x', d => this.xScale(d.year))
            .attr('y', d => this.yScale(d.count))
            .attr('width', barWidth)
            .attr('height', d => this.height - this.yScale(d.count))
            .append('title')
            .text(d => `${d.year}: ${d.count} Briefe`);

        // Add brush
        this.brush = d3.brushX()
            .extent([[0, 0], [this.width, this.height]])
            .on('end', (event) => this.handleBrush(event));

        this.svg.append('g')
            .attr('class', 'brush')
            .call(this.brush);

        Debug.log('RENDER', 'Timeline rendered successfully');
    }

    /**
     * Handle brush selection
     */
    handleBrush(event) {
        if (!event.selection) {
            // No selection - reset filter
            Debug.log('EVENT', 'Timeline brush cleared');
            this.onBrushCallback(null);
            this.updateSelectionDisplay(null);
            return;
        }

        const [x0, x1] = event.selection;
        const yearStart = Math.round(this.xScale.invert(x0));
        const yearEnd = Math.round(this.xScale.invert(x1));

        Debug.log('EVENT', `Timeline brush: ${yearStart}-${yearEnd}`);

        // Callback to parent with year range
        this.onBrushCallback({ start: yearStart, end: yearEnd });
        this.updateSelectionDisplay({ start: yearStart, end: yearEnd });
    }

    /**
     * Update selection display text
     */
    updateSelectionDisplay(range) {
        const display = document.getElementById('timeline-selection');
        const resetBtn = document.getElementById('reset-timeline');

        if (range) {
            display.textContent = `Zeitraum: ${range.start}–${range.end}`;
            resetBtn.disabled = false;
        } else {
            display.textContent = '';
            resetBtn.disabled = true;
        }
    }

    /**
     * Reset brush selection programmatically
     */
    reset() {
        if (this.svg) {
            this.svg.select('.brush').call(this.brush.move, null);
            this.updateSelectionDisplay(null);
        }
    }

    /**
     * Resize timeline on window resize
     */
    resize() {
        if (this.data) {
            this.initialize();
        }
    }
}
