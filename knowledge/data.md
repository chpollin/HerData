# Data Model

## Datenarchitektur

Das System basiert auf zwei parallelen Datensträngen. CMIF-Briefdaten enthalten die Korrespondenzmetadaten, SNDB-Normdaten die biografischen Informationen. Die Verknüpfung erfolgt primär über GND-IDs als gemeinsamen Identifikator.

## CMIF Struktur

### XML Hierarchie

```
TEI xmlns="http://www.tei-c.org/ns/1.0"
└── teiHeader
    └── profileDesc
        └── correspDesc (15.312 Einträge)
            ├── @ref (Brief-ID)
            ├── @source (Bibliographie-Referenz)
            ├── correspAction type="sent"
            │   ├── persName @ref (GND oder lokal)
            │   ├── placeName @ref (GeoNames)
            │   └── date @when oder @notBefore/@notAfter
            ├── correspAction type="received"
            │   └── persName (konstant Goethe, GND 118540238)
            └── note (optional)
                ├── ref type="cmif:mentionsPerson" @target
                ├── ref type="cmif:mentionsBibl"
                ├── ref type="cmif:mentionsOrg" @target
                ├── ref type="cmif:hasTextBase" @target
                ├── ref type="cmif:isPublishedWith" @target
                ├── ref type="cmif:hasLanguage" @target
                └── ref type="cmif:isAvailableAsTEIfile" @target
```

### ID Schema

Brief-IDs folgen dem Pattern RA[Volume]_[Number]_[ID] wobei Volume die Bandnummer 01 bis 10 angibt, Number eine fortlaufende Nummer und ID eine eindeutige Identifikationsnummer darstellt. Das Schema verweist direkt auf https://goethe-biographica.de/id/ mit der entsprechenden ID.

### Datenfelder und Kardinalitäten

Brief zu Absender zeigt eine n zu 1 Relation mit 2.525 eindeutigen Absendern für 15.312 Briefe, durchschnittlich 5.9 Briefe pro Absender. Die Verteilung folgt einer Power-Law mit 58.9 Prozent (1.486 von 2.525) der Absender mit nur einem Brief und 0.75 Prozent (19 Absender) mit über 100 Briefen.

Brief zu Ort zeigt eine n zu 1 Relation mit 633 eindeutigen Orten, durchschnittlich 24.2 Briefe pro Ort. Die geografische Konzentration zeigt sich mit Weimar als Top-Hub mit 5.236 Briefen.

Brief zu erwähnten Personen bildet eine n zu m Relation mit 14.425 eindeutigen Personen in 67.665 Erwähnungen. Durchschnittlich werden 5.2 Personen pro Brief erwähnt wenn Erwähnungen vorhanden sind. 85.3 Prozent (13.066 von 15.312) der Briefe enthalten Personenerwähnungen.

### Kontrollierte Vokabulare

Die Textbasis wird über cmif:hasTextBase kategorisiert als Manuscript (97.0 Prozent), Print (1.3 Prozent), Copy (1.2 Prozent) oder Draft (0.4 Prozent).

Der Publikationsstatus über cmif:isPublishedWith unterscheidet Abstract (92.9 Prozent) und Transcription (17.3 Prozent), wobei Briefe beide Werte haben können.

Sprachen werden über ISO-Codes in cmif:hasLanguage erfasst mit de für Deutsch, fr für Französisch, en für Englisch, it für Italienisch, la für Lateinisch und vls für Westflämisch.

## SNDB Struktur

### Dateiorganisation

Die Personendaten gliedern sich in sechs Hauptdateien. Die Datei pers_koerp_main.xml mit 6.051 KB enthält 27.835 Einträge (23.571 eindeutige IDs) mit Kern-IDs und Namen. In pers_koerp_indiv.xml mit 2.191 KB findet sich das Geschlecht als SEXUS (m oder w), kritisch für die Frauenidentifikation. Von 23.571 Personen sind 3.617 Frauen (15.3 Prozent), 16.572 Männer (70.3 Prozent) und 3.382 ohne Geschlechtsangabe (14.3 Prozent). Beziehungen werden in pers_koerp_beziehungen.xml mit 1.028 KB erfasst und enthalten 6.580 Beziehungsdatensätze. Lebensdaten stehen in pers_koerp_datierungen.xml mit 6.071 KB. Berufsangaben finden sich in pers_koerp_berufe.xml mit 3.383 KB und umfassen 29.375 Berufseinträge (mehrere pro Person möglich). Wirkungsorte sind in pers_koerp_orte.xml mit 3.417 KB dokumentiert und enthalten 21.058 Orts-Zuordnungen.

Geografische Normdaten umfassen drei Dateien. Das Ortsverzeichnis geo_main.xml mit 739 KB enthält 4.007 Orte mit Basisinformationen. GeoNames-Verknüpfungen stehen in geo_links.xml mit 1.880 KB. Zusätzliche Ortsinformationen und Koordinaten finden sich in geo_indiv.xml mit 936 KB.

Projektspezifische Biogramme verteilen sich auf vier Dateien. Kontextinformationen aus dem Briefprojekt stehen in pers_koerp_projekt_goebriefe.xml mit 1.507 KB und enthalten 6.790 Registereinträge. Ausführliche Regest-Beschreibungen enthält pers_koerp_projekt_regestausgabe.xml mit 4.875 KB und 20.128 Einträgen (größte Projekt-Datei). Tagebucherwähnungen finden sich in pers_koerp_projekt_tagebuch.xml mit 195 KB und 1.004 Einträgen. Zusätzliche Projektdaten aus "Biographica Universalis Goetheana" stehen in pers_koerp_projekt_bug.xml mit 289 KB und 2.254 Einträgen.

Die Beziehungstypen werden in nsl_agrelon.xml mit 11 KB spezifiziert und qualifiziert. Die Datei enthält 44 Beziehungstypen aus dem AGRELON-Vokabular (Agent Relationship Ontology), die in Kategorien wie Verwandtschaft, Vitaler/letaler Kontakt und Gruppenbeteiligung gegliedert sind.

### Identifikationssystem

Die SNDB-ID ist numerisch und mappt direkt auf die Online-Datenbank. Das URL-Pattern folgt https://ores.klassik-stiftung.de/ords/f?p=900:2:::::P2_ID:[ID]. Beispielsweise verweist ID 43779 auf Christiane Vulpius.

GND-IDs verknüpfen mit der Gemeinsamen Normdatei über https://d-nb.info/gnd/[ID]. Die Abdeckung in pers_koerp_indiv.xml beträgt 53.4 Prozent (12.596 von 23.571 Personen). Bei CMIF-Absendern liegt die GND-Abdeckung bei 93.8 Prozent, bei erwähnten Personen bei 82.5 Prozent.

## Datenverknüpfung

### Primäre Verknüpfungsebenen

Die Hauptverknüpfung erfolgt über GND-Match zwischen CMIF persName@ref und SNDB GND-Feldern. Dies ermöglicht die Identifikation von Frauen als Briefautorinnen und in Erwähnungen.

SNDB-interne Verknüpfungen nutzen die ID als gemeinsamen Schlüssel zwischen allen SNDB-XML-Dateien. Dies ermöglicht komplexe Abfragen über multiple Aspekte einer Person.

Geografische Verknüpfungen erfolgen über GeoNames-IDs zwischen CMIF placeName@ref und geo_links.xml. Dies ermöglicht räumliche Analysen und Kartierung.

### Verknüpfungsmatrix

```
CMIF Brief
    ├── persName@ref ←→ SNDB GND ←→ pers_koerp_main ID
    ├── placeName@ref ←→ GeoNames ←→ geo_links
    └── mentionsPerson@target ←→ SNDB GND oder ID

SNDB Person
    ├── ID ←→ pers_koerp_indiv (Geschlecht)
    ├── ID ←→ pers_koerp_beziehungen (Netzwerk)
    ├── ID ←→ pers_koerp_orte ←→ geo_main
    └── ID ←→ projekt_*.xml (Biografien)
```

## Kategorien für Frauenanalyse

### Personenkategorisierung

Geschlecht wird binär als m oder w in pers_koerp_indiv.xml erfasst und dient als Primärfilter. Die Rolle unterscheidet Briefabsenderinnen, erwähnte Frauen und indirekt über Beziehungen verbundene Frauen. Der Normierungsstatus differenziert zwischen Personen mit GND, nur SNDB-ID oder ohne Normdaten.

### Beziehungskategorien

Familiäre Beziehungen umfassen Verwandtschaftsgrade und Eheverhältnisse. Professionelle Verbindungen zeigen berufliche Netzwerke und Kooperationen. Soziale Beziehungen erfassen Freundschaften und Bekanntschaften. Literarische Verbindungen dokumentieren Autorschaft, Patronage und künstlerischen Austausch.

### Geografische Kategorien

Brieforte aus CMIF zeigen die geografische Verteilung der Korrespondenz. Wirkungsorte aus SNDB dokumentieren Lebensstationen der Personen. Die Kombination ermöglicht Bewegungsprofile und räumliche Netzwerkanalysen.

### Temporale Kategorien

Briefdatierungen ermöglichen chronologische Analysen der Korrespondenz. Lebensdaten aus SNDB kontextualisieren Personen historisch. Die Verschränkung zeigt Korrespondenz im Lebensverlauf.

## Datenfluss Frauenidentifikation

Der Prozess beginnt mit dem Laden aller Personen aus pers_koerp_main.xml (27.835 Einträge, 23.571 eindeutige IDs). Die Filterung nach SEXUS=w in pers_koerp_indiv.xml identifiziert 3.617 Frauen (15.3 Prozent aller Personen). Diese SNDB-IDs und zugehörigen GND-IDs (wenn vorhanden) bilden die Ausgangsbasis.

Das Matching gegen CMIF-Daten erfolgt auf zwei Ebenen. Absenderinnen werden über persName@ref identifiziert. Erwähnte Frauen werden über mentionsPerson@target gefunden. Beide Matching-Prozesse nutzen primär GND-IDs, sekundär Namensabgleich.

Die Datenanreicherung integriert geografische Daten aus pers_koerp_orte.xml und geo-Dateien, temporale Informationen aus pers_koerp_datierungen.xml, berufliche Kontexte aus pers_koerp_berufe.xml sowie Beziehungsnetzwerke aus pers_koerp_beziehungen.xml und nsl_agrelon.xml.

Die Narrativierung extrahiert biografische Texte aus den vier projekt XML-Dateien und erstellt reichhaltige Personenprofile für die Visualisierung.

## API Zugriffe

### CMIF Brief-Volltext API

Die REST-API unter https://api.goethe-biographica.de/exist/apps/api/v1.0/tei/get-records.xql ermöglicht den Zugriff auf TEI-Volltexte. Parameter sind edition=ra für die Regestausgabe, record-id für die spezifische Brief-ID im Format RA[Volume]_[Number]_[ID] und optional metadata für erweiterte Metadaten.

### SNDB Online-Datenbank

Das URL-Pattern https://ores.klassik-stiftung.de/ords/f?p=900:2:::::P2_ID:[ID] ermöglicht den direkten Zugriff auf Personendatensätze. Die ID entspricht der numerischen SNDB-ID aus den XML-Dateien.

## Aggregationsmöglichkeiten

### Netzwerkprojektionen

Person-zu-Person Netzwerke entstehen durch Ko-Erwähnung in Briefen. Ort-zu-Ort Verbindungen zeigen Korrespondenzwege. Zeit-Thema Cluster identifizieren temporale thematische Schwerpunkte.

### Multidimensionale Analysen

Die Verschränkung von Person, Zeit, Ort und Thema ermöglicht komplexe Analysen. Bewegungsprofile zeigen räumliche Mobilität über Zeit. Themenverläufe dokumentieren inhaltliche Entwicklungen. Soziale Dynamiken werden durch Beziehungsnetzwerke im Zeitverlauf sichtbar.

## Datenqualität und Vollständigkeit

Die CMIF-Daten zeigen hohe Qualität mit 93.8 Prozent GND-Abdeckung bei Absendern, 91.6 Prozent GeoNames-Verknüpfung bei Orten und 87.6 Prozent exakten Datierungen. Die TEI-Volltext-Verfügbarkeit liegt bei 15.7 Prozent via API.

Die SNDB-Daten mit Stand Oktober 2025 sind etwa zwei Jahre alt aber strukturell stabil. Die GND-Abdeckung in pers_koerp_indiv.xml beträgt 53.4 Prozent (12.596 von 23.571 Personen). Bei den 3.617 identifizierten Frauen ist die GND-Abdeckung anteilig ähnlich.

## Verweise

Siehe [[project]] für die Projektübersicht und [[research-context]] für den wissenschaftlichen Kontext.