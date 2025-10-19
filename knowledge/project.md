# HerData Project

## Projektziel

Semantische Aufbereitung und Visualisierung von Frauen aus Goethes Briefkorrespondenz für literatur- und kulturinteressierte Laien. Integration zweier komplementärer Datenquellen zur mehrdimensionalen Analyse historischer Frauenbiografien. XML zu RDF Transformation mit interaktiver Visualisierung.

## Datenquellen

### CMIF Briefdaten

Briefe an Goethe im TEI-XML/CMIF-Standard von 1760 bis 1824. Die Datei ra-cmif.xml umfasst 23.4 MB mit 333.557 Zeilen und enthält 15.312 Briefe von 2.525 Absendern aus 633 Orten. Datenstand März 2025 aus dem PROPYLÄEN Projekt der Klassik Stiftung Weimar. Verfügbar über Zenodo 14998880 unter CC BY 4.0 Lizenz.

Der Korpus enthält 67.665 Personenerwähnungen mit 14.425 eindeutigen Personen, 3.914 bibliographische Erwähnungen mit 2.147 eindeutigen Werken sowie 380 Organisationserwähnungen mit 120 eindeutigen Organisationen. Die Authority-Abdeckung erreicht 93.8 Prozent bei Personen-GND und 91.6 Prozent bei Orte-GeoNames.

### SNDB Normdaten

Strukturierte Personendaten der Klassik Stiftung Weimar mit Stand Oktober 2025. Umfasst 27.835 Einträge mit 23.571 eindeutigen Personen-IDs, darunter 3.617 Frauen (15.3 Prozent), 16.572 Männer (70.3 Prozent) und 3.382 ohne Geschlechtsangabe (14.3 Prozent). Die Daten sind in 14 XML-Dateien organisiert.

Die Dateien stammen aus einer relationalen Datenbank und sind etwa zwei Jahre alt, strukturell jedoch unverändert. Die GND-Abdeckung beträgt 53.4 Prozent in pers_koerp_indiv.xml (12.596 von 23.571 Personen). Zusätzlich enthält die Datenbank 4.007 Orte, 6.580 Beziehungen, 29.375 Berufseinträge und 21.058 Orts-Zuordnungen.

## Technische Umsetzung

### Analyse-Tool

Das Python-Script analyze_goethe_letters.py im Verzeichnis preprocessing parst die CMIF-Datei mittels xml.etree.ElementTree in 3 bis 5 Sekunden. Es extrahiert Absender mit Normdaten, Datierungen, erwähnte Entitäten, Sprachen und Publikationsstatus. Das Script generiert drei Ausgabedateien:

1. ra-cmif-documentation.md mit technischer XML-Struktur und API-Zugriff
2. analysis-report.md mit 12 statistischen Auswertungsabschnitten
3. CMIF_Goethe_Letters_Dataset_Pre-Processing_Dokumentation.md als Zusammenfassung

### MVP Implementierung

Erfolgreiche Visualisierung von 373 Frauen mit Geodaten und Goethe-Bezug auf einer Leaflet.js-Karte. Die Implementierung erreicht eine Dateigröße von 342 KB bei einer Ladezeit unter 2 Sekunden. Skalierung auf den vollständigen Datensatz mit 3.617 identifizierten Frauen technisch validiert.

## Datenintegration

Die Verknüpfung der beiden Datenquellen erfolgt über drei Identifier-Systeme. GND-IDs dienen als primärer Verknüpfungspunkt zwischen CMIF persName Referenzen und SNDB GND-Feldern. SNDB-IDs ermöglichen die interne Verlinkung und API-Zugriff durch direktes URL-Mapping, wobei die ID direkt auf die SNDB-URL mappt. Bei fehlenden Normdaten erfolgt ein Namensabgleich als Fallback-Lösung.

## Verarbeitungspipeline

Die Pipeline gliedert sich in vier Phasen:

Phase 1 identifiziert Frauen durch Laden aller IDs und Namen aus pers_koerp_main.xml (27.835 Einträge, 23.571 eindeutige IDs) und Filterung nach SEXUS=w in pers_koerp_indiv.xml. Dies liefert 3.617 Frauen (15.3 Prozent) mit SNDB-IDs.

Phase 2 führt das Brief-Matching durch. CMIF-Absender mit GND werden gegen Frauen-GNDs gematcht, CMIF-Erwähnungen gegen Frauen-Namen und GNDs. Das Ergebnis zeigt Frauen als Autorinnen und Erwähnte.

Phase 3 reichert die Daten an. Geodaten aus pers_koerp_orte.xml und geo Dateien ermöglichen die Visualisierung. Temporale Einordnung erfolgt über pers_koerp_datierungen.xml, soziale Kontextualisierung über pers_koerp_berufe.xml. Das Netzwerk wird aus pers_koerp_beziehungen.xml und nsl_agrelon.xml aufgebaut.

Phase 4 fokussiert auf Narrativierung. Biografische Texte werden aus den projekt XML-Dateien extrahiert, weniger strukturierte Projektdaten integriert und reichhaltige Personenprofile generiert.

## Projektstruktur

Das Repository enthält vier Hauptverzeichnisse. Der Ordner .claude enthält Claude Code Permissions. Das Verzeichnis data beinhaltet die ra-cmif.xml Datei mit 15.312 Briefen. Der knowledge Ordner umfasst die vollständige Dokumentation des Datenmodells und Projektstrategien. Das preprocessing Verzeichnis enthält das Python-Analysetool.

Die Wissensdokumentation besteht aus mehreren Komponenten. DATA.md mit 12.5 KB dokumentiert das vollständige Datenmodell mit Entity-Relationship-Diagrammen und REST-API-Zugriffsmuster. Die Pre-Processing Dokumentation mit 2.7 KB fasst Analysebasis und technische Umsetzung zusammen. Das Dokument propylaeen-projekt.md mit 4 KB kontextualisiert das PROPYLÄEN Langzeitprojekt. Die HerData-Projektdokumentation mit 9.3 KB definiert die Projektziele und Implementierungsstrategie.

## Analysemöglichkeiten

Die Integration ermöglicht drei Hauptanalyseebenen. Direkte Verbindungen zeigen Frauen als Briefautorinnen via GND-Match und erwähnte Frauen in Briefen via Personenerwähnungen. Indirekte Verbindungen erschließen Frauen mit Goethe-Bezug via SNDB-Beziehungsnetzwerk. Die mehrdimensionale Analyse kombiniert biografische Daten wie Lebensdaten und Berufe, geografische Aspekte wie Wirkungsorte und Brieforte, temporale Dimensionen wie Korrespondenzverläufe sowie soziale Strukturen wie Beziehungsnetzwerke.

## Status und Ausblick

Das PROPYLÄEN Gesamtprojekt läuft bis 2039 und umfasst perspektivisch über 20.000 Briefe von etwa 3.800 Personen. Die Daten können sich kontinuierlich ändern. Aktuell sind 15.7 Prozent der Briefe als TEI-Volltext via API verfügbar. Die Integration in die PROPYLÄEN-Plattform ist geplant.

## Verweise

Siehe [[research-context]] für den wissenschaftlichen Kontext und [[data]] für das detaillierte Datenmodell.