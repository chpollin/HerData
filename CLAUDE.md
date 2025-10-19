# Claude Code Guidelines

This document defines coding and documentation style rules for the HerData project when working with Claude.

## Documentation Style

### Forbidden Elements
- Never use bold text formatting (text)
- Never use emojis in any documentation
- Never include "Estimated Time" sections
- Never use exclamation marks for emphasis

### Preferred Style
- Use clear headings with # markdown syntax
- Use plain text for emphasis when needed
- Use bullet points for lists
- Use code blocks for technical content
- Keep language neutral and factual

## Code Style

### Python
- Use docstrings for functions
- Follow PEP 8 conventions
- Include type hints where appropriate
- Keep functions focused and single-purpose

### JavaScript
- Use ES6+ syntax
- Prefer const/let over var
- Use async/await for asynchronous operations
- Keep functions pure when possible

### HTML/CSS
- Semantic HTML5 elements
- BEM naming convention for CSS classes
- Mobile-first responsive design
- Accessibility attributes (ARIA when needed)

## Commit Messages

Format:
```
Short descriptive title

- Bullet point list of changes
- Focus on what and why, not how
- Reference issues/PRs when relevant

Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Documentation Files

### README.md
- Project overview
- Installation instructions
- Usage examples
- License and attribution

### JOURNAL.md
- Date-based entries
- Aggregated session summaries
- Key decisions with rationale
- No timestamps, only dates

### Requirements
- User stories format: "Als Nutzer*in möchte ich... um zu..."
- Acceptance criteria clearly defined
- Functional requirements (FR-XX)
- Non-functional requirements (NFR-XX)

## Development Workflow

1. Read existing documentation before starting
2. Update JOURNAL.md at session end
3. Create feature branches for major changes
4. Test before committing
5. Write clear commit messages

## File Naming

- Lowercase with underscores: `build_pipeline.py`
- Descriptive names: `analyze_goethe_letters.py` not `script.py`
- Markdown files in UPPERCASE: `README.md`, `JOURNAL.md`

## Comments

### In Code
- Explain why, not what
- Keep comments up-to-date
- Remove commented-out code before committing

### In Documentation
- Neutral, objective tone
- Avoid superlatives
- State facts with sources
- Use references to other docs

## Data Documentation

- Always include absolute numbers with percentages
- Cite data sources
- Note data snapshot dates
- Document data quality issues transparently
- Reference other documentation files with relative links

## Language

- Documentation can be in German or English as appropriate
- User stories in German: "Als Nutzer*in möchte ich..."
- Technical terms use original forms (GND, SNDB, TEI, CMIF)
- Code comments in English

## This File

This file should be updated when new style conventions are established. Always follow these guidelines unless explicitly asked otherwise.
