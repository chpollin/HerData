# Design.md — HerData UI/UX

*Stand: 19.10.2025*

## Zweck dieses Dokuments

Dieses Dokument definiert das Zielbild für Interaktion, Informationsarchitektur und Visualisierung der HerData-Plattform. HerData erschließt Frauen in Goethes Briefkorrespondenz für eine breitere, kulturinteressierte Öffentlichkeit und verbindet dafür CMIF-Briefmetadaten mit SNDB-Normdaten. Die Formulierungen sind präskriptiv: Sie beschreiben das *intendierte* Verhalten des Systems, nicht nur Optionen. 

## 1. Kontext & Ausgangslage (komprimiert)

Implikation fürs Design: explorative *Overview first → zoom & filter → details on demand*; progressive Offenlegung bei hoher Dichte; robuste Facettierung; Brückenschlag zwischen narrativen Biogrammen und analytischen Sichten. (Patterns: Shneiderman-Mantra, Munzner Nested Model)

## 2. Zielgruppen & Kernaufgaben

Primär: kultur- und literaturinteressierte Laien; sekundär: Studierende, Forschende, Lehrende. 

Top-Tasks (Task Analysis, abgeleitet):

1. *Person finden & verstehen:* Wer ist X? Welche Beziehung zu Goethe? Wo/wan lebte X? Welche Briefe/Erwähnungen existieren?
2. *Räume erkunden:* Wo konzentriert sich weibliche Korrespondenz? (z. B. Weimar/Jena/Berlin)
3. *Zeitverlauf sehen:* Wann häufen sich Erwähnungen/Briefe? (1810er Peak; 1817) 
4. *Netzwerke entdecken:* Wie sind Frauen über Beziehungen (AGRELON) und Ko-Erwähnungen verbunden? 
5. *Quellenzugriff:* TEI/Regest und externe Normdaten (GND, SNDB) direkt öffnen. 

## 3. Informationsarchitektur (IA)

### 3.1 Primäre Navigationsstruktur

* Entdecken (Landing-Explorer mit Karte/Timeline/Netz)
* Personen (Listen- & Kartenansicht → Personenprofil)
* Briefe (Suche → Briefdetail mit Regest/Links)
* Orte (Karte, Ortsprofil)
* Netzwerk (Person‐↔Person, filterbar nach Beziehungstypen)
* Stories (kuratierte Dossiers/Narrative)
* Daten & API (Download/Endpunkte, Zitierhinweise)

### 3.2 Sekundäre Navigationsachsen (Filter/Facetten)

* Rolle: Absenderin / Erwähnte / indirekt (Netzwerk) 
* Normierung: GND vorhanden / nur SNDB / keine Normdaten 
* Zeit: exakte Datierung / Datumsbereich (mit Slider) 
* Ort(e): Briefort (CMIF) / Wirkungsort(e) (SNDB) 
* Sprache: de/fr/en/it/la/vls (ISO) 
* Textbasis & Publikation: Manuscript/Print/Copy/Draft; Abstract/Transcription 
* Beziehungstyp (AGRELON, 44 Typen) 

## 4. Schlüsselansichten & Interaktionen

### 4.1 Start/Explorer

* Hero-Explorer mit drei gleichwertigen Einstiegen (Tabs): Karte, Zeit, Netz.
* KPI-Teaser (live aus Daten): „15.312 Briefe • 3.617 Frauen • 633 Orte“ (mit Link auf Datenquellen).  
* Guided prompts („Zeige Frauen mit Briefen 1810–1819 in Weimar“).

### 4.2 Kartenexploration (Leaflet/WebGL)

* Clustering + Dichte-Layer: Start in Europa; Level-of-Detail mit Clusterzählung; Heatmap optional. Weimar/Jena/Berlin als Hotspots sichtbar. 
* Facet-on-Map: Filter wirken sofort; Brushing & Linking zu Timeline/Netz.
* Performance-Ziel: ≤ 2 s TTI bei initialem View (MVP belegt Machbarkeit). 

### 4.3 Zeitachse

* Histogramm/Area-Chart mit Jahr-Binning; Fokus 1810er; Markierung Höchstjahr 1817.
  Interaktion: Range-Selection → filtert Karte/Liste/Netz. 

### 4.4 Netzwerk

* Dualer Layer: (a) Ko-Erwähnung in Briefen, (b) SNDB-Beziehungen (AGRELON-Typen filterbar). Node-Shape = Entität (Person/Ort), Color = Rolle, Size = Häufigkeit. 
* Zeit-Slider: temporale Projektion (Edge-Fading außerhalb Selektionsfenster).
* Detail-on-Demand: Tooltip → Mini-Profil, Klick → Personenprofil.

### 4.5 Personenprofil (Kanonische Entität)

Zweck: kontextualisiertes, narratives und analytisches Portrait.

* Header: Name, Lebensdaten (falls vorhanden), Rolle(n), Normdaten-Badges (GND, SNDB, Wikidata), „Zitieren“-Aktion. 
* Tabs:

  1. Überblick (Kurzbiogramm aus projekt-XML + Key-Fakten) 
  2. Korrespondenz (Liste/Timeline der Briefe mit Regesten/Transkription, API-Links) 
  3. Netz (SNDB-Relationen + Ko-Erwähnungen; Filter nach AGRELON) 
  4. Orte (Wirkungsorte + Brieforte, Kartenansicht) 
  5. Berufe/Rollen (aus SNDB, mehrere je Person) 
  6. Quellen & Links (GND, SNDB, PROPYLÄEN, Zenodo) 
* Datenqualitäts-Hinweise: Kennzeichnung, wenn keine GND (oder unsichere Zuordnung). 

### 4.6 Briefdetail

* Metadaten: Absender(in), Empfänger (Goethe), Datum (exakt/Spanne), Ort (GeoNames), Sprache, Publikationsstatus, Textbasis. 
* Inhalt: Regest; bei Verfügbarkeit TEI-Transkription (API-Link). TEI-Verfügbarkeit aktuell ~15,7 %. 
* Entitäten-Panel: erwähnte Personen/Werke/Organisationen (mit Rollenchips).

### 4.7 Suche & Facettierung (Unified Search)

* Query-First + Facets: Live-Suggestions (Personen/GND/Orte/Briefe).
* Sortierung: Relevanz, Datum, Häufigkeit (Erwähnungen).
* Export: CSV/JSON der Suchergebnisse, inkl. Permalinks.

### 4.8 Stories (Narrativierung)

* Kuratierte Dossiers verbinden Personenprofile, Netzwerkgrafiken, Karten-Ausschnitte und Brief-Regesten (Deep-Links). Biogrammtexte stammen aus projekt-XML. 

## 5. Visual-Coding & Gestaltungsprinzipien

* Nested Model (Munzner):
  *Domain/Task* → Frauen & Korrespondenz erkunden; *Data/Operation* → Personen/Briefe/Orte/Beziehungen, Filter/Drilldown; *Encoding/Interaction* → Map/Timeline/Graph, Brushing/Linking; *Algorithm* → Clustering, Graph-Layout.
* Information Seeking Mantra: Overview → Zoom/Filter → Details.
* Cognitive Load: progressive Offenlegung, Chunking (max. 7–9 primäre UI-Elemente je Ansicht), Inline-Erklärungen (i-Tooltips).
* Semiotik & Bertin:

  * Farbe: Rolle (Absenderin/Erwähnte/Indirekt)
  * Größe: Häufigkeit (Erwähnungen/Briefe)
  * Position: Raum/Zeit (Karte/Timeline)
  * Form: Entitätstyp (Person/Ort/Brief)
* Datenqualität sichtbar machen: Badges (GND/GeoNames vorhanden), Confidence-Hinweise bei Fallback-Matching. 

## 6. Designsystem (Atomic Design)

### 6.1 Tokens

* Typografie-Skala (z. B. 12/14/16/20/24/32), Zeilenabstände ≥ 1,4; Spacing 4/8/12/16/24/32; Kontraste WCAG AA/AAA.
* Iconographie: Normdaten/Externe Links/Export/Filter/Netz/Karte/Zeit.

### 6.2 Atome (Beispiele)

* Badge (GND/SNDB), Chip (Rolle/Beziehung), Pill-Toggle (Ansicht), Tag (Sprache), Counter (Trefferzahl).

### 6.3 Moleküle

* Suchfeld mit Typeahead (Entitätsvorschläge).
* Facet-Panel (Akkordeon: Rolle, Zeit, Ort, Sprache, Textbasis, Publikation, Beziehungstyp). 
* Mini-Karte/Mini-Netz in Tooltips.

### 6.4 Organismen

* Personenkarte (Name, Rollen, Lebensdaten, Normdaten-Badges, Key-Metriken).
* Briefliste (Regest-Snippets, Datum, Ort, Sprache). 
* Netzwerk-Canvas (AGRELON-Filter). 

### 6.5 Templates

* Persons Index, Person Profile, Letter Detail, Place Profile, Explorer, Story.
* Responsiv: 3 Breakpoints (≤ 640, ≤ 1024, > 1024); Karten/Netz im Mobilportrait als Fokus-Ansicht (Panel-Overlay).

---

## 7. Design Space Exploration (Morphologischer Kasten)

| Parameter              | Optionen                               | Entscheidung (v1)                           |
| ---------------------- | -------------------------------------- | ------------------------------------------- |
| Navigationsstrategie   | Global Top-Nav • Kontext-Tabs • Wizard | Top-Nav + Kontext-Tabs                  |
| Primär-Entry           | Karte • Zeit • Netz • Story            | Karte (mit Tabs)                        |
| Visualisierung (Sek.)  | Timeline • Netzwerk • Liste            | Timeline + Netzwerk                     |
| Informationsdichte     | Low • Medium • High                    | Medium (progressive Offenlegung)        |
| Facettierung           | Seitlich • Overlay • Horizontal        | Seitlich (Desktop), Overlay (Mobil) |
| Normdaten-Sichtbarkeit | dezent • prominent                     | prominent (Badges)                      |
| Datenqualität          | versteckt • sichtbar                   | sichtbar (Badges/Hinweise)              |
| Export                 | deaktiviert • CSV • CSV+JSON           | CSV+JSON                                |
| Story-Format           | Textlastig • Hybrid                    | Hybrid (Text+Viz)                       |

Begründung: Datenfülle (15k+ Briefe) & Hotspots (Weimar) sprechen für *Overview-first* mit leistungsfähigen Filtern.  

## 10. Validierung & Evaluation

Rahmen: Design Science Research (Hevner); Research-through-Design.
Dokumentation: Five Design Sheets (FDS) für jeweils Karte/Netz/Timeline/Profil.

### A/B-Hypothesen (Beispiele)

* H1: Karten‑Tab als Default verkürzt TCT ggü. Timeline‑Default.
* H2: Prominente Normdaten‑Badges erhöhen Vertrauensurteil (Selbstauskunft).
* H3: Dual‑Layer‑Netz steigert Recall bei Relationsaufgaben.

---

## 11. Anforderungen (QFD-Auszug)

| Nutzeranforderung            | Relevanz  | Designmerkmal                                                              |
| ---------------------------- | --------- | -------------------------------------------------------------------------- |
| „Schnell Überblick gewinnen“ | hoch      | Explorer mit Karte/Timeline/Netz + Live‑Facets                             |
| „Belege einsehen“            | sehr hoch | Briefdetail mit Regest/TEI‑Link + GND/SNDB‑Badges                          |
| „Frauenprofile verstehen“    | sehr hoch | Personenprofil (6 Tabs) mit Normdaten‑Badges + Links (GND/SNDB/PROPYLÄEN)  |
| „Zitierfähig exportieren“    | mittel    | CSV/JSON Export + Permalinks                                               |
| „Skalierbar & schnell“       | hoch      | Serverseitige Aggregation, WebGL, Virtualization; TTI ≤ 2 s                |

---

## 12. Risiken & Umgang

* Datenlücken (TEI-Abdeckung): Fallback Regest/Metadaten; UI kennzeichnet Nicht‑Verfügbarkeit. 
* Ambige Identitäten (ohne GND): Fuzzy‑Match wird sichtbar markiert; Quellenlinks priorisieren. 
* Langfristige Änderungen (PROPYLÄEN bis 2039): Versionshinweise & Datenstand in Footer/„Über“. 