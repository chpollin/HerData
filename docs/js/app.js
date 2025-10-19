// HerData - Minimal validation script for Day 3
// Data processing and map rendering will be implemented in Day 4

// Compact data validation
async function validateData() {
    const loading = document.getElementById('loading');

    try {
        const response = await fetch('data/persons.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        // Validate structure
        const checks = {
            'Meta exists': !!data.meta,
            'Persons array exists': Array.isArray(data.persons),
            'Expected count': data.persons.length === 3617,
            'Has geodata': data.persons.some(p => p.places?.length > 0)
        };

        const allPassed = Object.values(checks).every(v => v);

        // Update loading message
        if (allPassed) {
            loading.textContent = `Daten geladen: ${data.meta.total_women} Frauen, ${data.meta.with_geodata} mit Geodaten`;
            loading.style.background = '#d1fae5';
            loading.style.color = '#065f46';
        } else {
            loading.textContent = 'Fehler: Datenstruktur ungültig';
            loading.style.background = '#fee2e2';
            loading.style.color = '#991b1b';
            console.error('Validation failed:', checks);
        }

    } catch (error) {
        loading.textContent = `Fehler beim Laden: ${error.message}`;
        loading.style.background = '#fee2e2';
        loading.style.color = '#991b1b';
        console.error('Load error:', error);
    }
}

// Run validation on load
validateData();
