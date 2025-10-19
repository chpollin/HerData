# Knowledge Vault - Regeln

Kompakte Richtlinien für das HerData-Wissenssystem.

## Prinzipien

### 1. Single Source of Truth
- Jede Information existiert nur an einem Ort
- Andere Dateien verlinken, nicht wiederholen
- Zahlen und Statistiken nur in data.md

### 2. Atomare Dateien
- Eine Datei = ein Thema
- Klare Verantwortlichkeiten
- Keine Überlappungen

### 3. Verlinkung
- Markdown-Links: `[Dateiname](datei.md)`
- Interne Anker: `[Abschnitt](datei.md#abschnitt)`
- Bidirektionale Verweise wo sinnvoll

### 4. Hierarchie
- INDEX.md = Map of Content (nur Navigation)
- Dateien enthalten Inhalt
- Keine Verschachtelung von Informationen

## Struktur

```
knowledge/
├── INDEX.md              # Map of Content
├── VAULT-REGELN.md       # Diese Datei
├── data.md               # Datenmodell, Statistiken (autoritativ)
├── project.md            # Projektziel, Status
├── research-context.md   # Wissenschaftlicher Kontext
├── design.md             # UI/UX-System
├── wireframe.md          # Technische UI-Specs
├── requirements.md       # User Stories, Anforderungen
└── decisions.md          # ADRs
```

## Sprache

- Dokumentation: Deutsch
- Fachbegriffe: Englisch (CMIF, SNDB, GND, TEI, API, etc.)
- Code: Englisch

## Stil (gemäß CLAUDE.md)

- Keine Fettschrift
- Keine Emojis
- Keine Ausrufezeichen für Emphase
- Neutrale, sachliche Sprache
- Überschriften mit `#` Markdown-Syntax
- Listen mit `-` oder nummeriert
- Code-Blöcke mit ` ``` `

## Wartung

### Bei Änderungen
1. Prüfen: Ist Information bereits vorhanden?
2. Wenn ja: Link ergänzen, nicht duplizieren
3. Wenn nein: An logischer Stelle einfügen
4. Verweise aktualisieren

### Bei neuen Zahlen
- Nur in data.md eintragen
- Andere Dateien verlinken zu data.md
- Datum der Aktualisierung notieren

### Bei neuen Entscheidungen
- ADR in decisions.md erstellen
- Von betroffenen Dateien verlinken
- Format: ADR-00X mit Status (Accepted/Rejected/Superseded)

## Verbotene Muster

- Informationen kopieren statt verlinken
- Überlappende Inhalte ohne klare Abgrenzung
- "Siehe auch" ohne konkreten Link
