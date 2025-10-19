# Wireframes

Technische UI-Spezifikationen (Low-Fidelity, textbasiert).

Stand: 2025-10-19

Siehe [INDEX.md](INDEX.md) für Navigation im Knowledge Vault und [design.md](design.md) für UI/UX-Konzept.

### Datenbasis

Details siehe [data.md](data.md#kern-statistiken).
- **Datenquellen:** CMIF (Correspondence Metadata Interchange Format), SNDB (Stammdatenbank)
- **Normierungssysteme:** GND, SNDB, GeoNames, AGRELON (44 Beziehungstypen)

### Systemarchitektur

#### 1. Globale Navigation
Horizontale Hauptnavigation mit den Bereichen: Entdecken, Personen, Briefe, Orte, Netzwerk, Stories, Suchfunktion. Permanente KPI-Anzeige im Header-Bereich.

#### 2. Explorer-Komponente
Drei-Tab-Struktur (Karte/Zeit/Netz) mit synchronisierten Ansichten nach dem Shneiderman-Mantra "Overview → Zoom/Filter → Details". Implementierung von Brushing & Linking zwischen allen Visualisierungen.

**Facettierungsebenen:**
- Rolle (Absenderin, Erwähnte, Indirekt-SNDB)
- Normierungsstatus (GND, SNDB, keine)
- Zeitraum (Range-Slider)
- Geografische Eingrenzung
- Sprache (de, fr, en, it, la, vls)
- Textbasis (Manuscript, Print, Copy, Draft)
- Publikationstyp (Abstract, Transcription)
- AGRELON-Beziehungstypen

#### 3. Kartenvisualisierung
Leaflet/WebGL-basierte Implementierung mit Cluster-/Heatmap-Modi. Performance-Ziel: TTI ≤ 2 Sekunden. Erwartete Hotspots: Weimar, Jena, Berlin.

#### 4. Zeitachsenvisualisierung
Jahresbasierte Timeline mit identifiziertem Peak in den 1810er Jahren (Höchstjahr 1817). 87,6% der Briefe sind exakt datiert. Brush-Interaktion zur Filterung verknüpfter Ansichten.

#### 5. Netzwerkvisualisierung
Dual-Layer-Architektur: Ko-Erwähnungen aus CMIF und SNDB-Relationen über AGRELON. Visuelle Kodierung: Form (Entitätstyp), Farbe (Rolle), Größe (Häufigkeit).

### Entitätsprofile

#### 6-7. Personenprofile
Strukturierte Darstellung mit Tabs für: Überblick, Korrespondenz, Netz, Orte, Berufe/Rollen, Quellen. Integration von Kurzbiogrammen aus Projekt-XML, Verlinkung zu GND, SNDB, Wikidata, PROPYLÄEN, Zenodo.

#### 8. Briefdetailansicht
Metadatenfelder gemäß CMIF-Standard: isAvailableAsTEIfile, hasLanguage, hasTextBase, isPublishedWith. Bereitstellung von Regest, TEI-Zugang, Permalink und Zitationsfunktion.

#### 9. Ortsprofile
Georeferenzierte Orte mit GeoNames-Verlinkung (Details siehe [data.md](data.md#kern-statistiken)). Darstellung von Brieforten, assoziierten Personen und zeitlichem Verlauf.

### Zusatzfunktionen

#### 10. Stories-Modul
Hybride Präsentationsform aus narrativen Elementen und eingebetteten Visualisierungen mit Deep-Links zu Systementitäten.

#### 11. Unified Search
Entitätsübergreifende Suche mit gruppierten Ergebnissen (Personen, Briefe, Orte, Stories) und persistenter Facettierung.

#### 12. Datenschnittstellen
- CMIF TEI-API: `/exist/apps/api/v1.0/tei/get-records.xql`
- SNDB-Links: `https://ores.klassik-stiftung.de/ords/f?p=900:2:::::P2_ID:[ID]`
- Exportformate: CSV, JSON

### Responsive Design
Drei Breakpoints mit Overlay-basierten Facets für mobile Endgeräte, seitlichen Panels für Desktop-Ansichten.

### Systemzustände
- **Ladeindikator:** Skeleton Loading für Visualisierungen
- **Leerzustände:** Kontextsensitive Handlungsaufforderungen
- **Fehlermeldungen:** Spezifische Hinweise bei nicht verfügbaren TEI-Dateien mit Fallback zu Regesten