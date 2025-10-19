# TODO: Offene Dokumentationsaufgaben für HerData

**Stand:** 2025-10-19
**Status:** Noch nicht erledigt, aber priorisiert

---

## 🔴 HOHE PRIORITÄT

### 1. AGRELON-Ontologie vollständig dokumentieren

**Status:** Nur kurz erwähnt in data.md
**Ist-Zustand:** "Die Datei enthält 44 Beziehungstypen aus dem AGRELON-Vokabular"
**Was fehlt:**

- Vollständige Liste aller 44 Beziehungstypen aus `nsl_agrelon.xml`
- Struktur: IDENT, KATEGORIE, BEZIEHUNG, URI, CORRIDENT
- Kategorien mit allen zugehörigen Typen:
  - Verwandtschaft (z.B. 4010=hat Vater, 4030=hat Kind, 4020=hat Elternteil, 4040=hat Kind)
  - Vitaler/letaler Kontakt (z.B. 5030=hat Mordopfer, 5040=hat Mörder)
  - Gruppenbeteiligung (z.B. 2060=ist Besitzer von, 2050=hat Besitzer)
- Beispiele für jede Kategorie mit konkreten Personen-IDs aus SNDB
- Bidirektionale Beziehungen (CORRIDENT) erklären

**Begründung:** Essentiell für Netzwerkanalyse - ohne vollständiges Vokabular können Beziehungen nicht interpretiert werden

**Wo dokumentieren:** Neuer Abschnitt in [data.md](data.md) unter "SNDB Struktur" oder separate Datei `knowledge/agrelon-vocabulary.md`

**Geschätzter Aufwand:** 1-2 Stunden (XML parsen, kategorisieren, Beispiele finden)

---

### 2. LFDNR-Semantik klären und dokumentieren

**Status:** Völlig undokumentiert
**Problem:** LFDNR (Laufende Nummer) kommt in fast allen SNDB-Dateien vor, aber Bedeutung unklar

**Beobachtungen:**
- In `pers_koerp_main.xml`: ID 2475 (Goethe) hat LFDNR=0, aber ID 1492 hat auch LFDNR=705 mit anderem Namen "d'Arbes"
- Viele IDs haben LFDNR=0 (Haupteintrag?)
- Andere LFDNRs scheinen Varianten/Aliase derselben Person zu sein
- Auch in geo_main.xml: Gleiche ID mit verschiedenen LFDNR für verschiedene Ortsnamen

**Hypothese:** LFDNR=0 ist Haupteintrag, andere LFDNR sind Namens-Varianten/Aliase

**Was zu tun:**
1. Systematisch IDs mit mehreren LFDNR analysieren (z.B. alle mit ID 1492)
2. Pattern erkennen: Hauptname vs. Varianten
3. Dokumentieren: Wann LFDNR=0, wann nicht?
4. Join-Logik klären: Welche LFDNR bei Verknüpfungen nutzen?

**Begründung:** Kritisch für Datenintegration - falsche LFDNR-Interpretation führt zu falschen Verknüpfungen

**Wo dokumentieren:** [data.md](data.md) unter "Identifikationssystem"

**Geschätzter Aufwand:** 2-3 Stunden (Analyse, Pattern-Matching, Test-Queries)

---

### 3. DTD-Schemas aller 14 SNDB-Dateien dokumentieren

**Status:** Nur oberflächlich erwähnt
**Was fehlt:** Vollständige Feldlisten mit Datentypen und Beschreibungen

**14 Dateien zu dokumentieren:**

#### Personendaten (6 Dateien):

**a) pers_koerp_main.xml**
```
FELDER: ID, LFDNR, NACHNAME, VORNAMEN, RUFNAME, GEBURTSNAME, TITEL,
        NAMENSFORM, ZUSATZ, VON_DATUM_*, BIS_DATUM_*
```
- GEBURTSNAME: Noch nicht dokumentiert
- ZUSATZ: Noch nicht dokumentiert
- Datierungsfelder: Zweck unklar (Lebensdaten? Oder siehe datierungen.xml?)

**b) pers_koerp_indiv.xml**
```
FELDER: ID, SEXUS, LITERATUR, GND
```
- LITERATUR: Zweck unklar (Literaturverweise? Welches Format?)

**c) pers_koerp_beziehungen.xml**
```
FELDER: ID1, ID2, AGRELON_ID1, AGRELON_ID2
```
- Erklärung der AGRELON_ID-Paare fehlt (siehe TODO #1)
- Beispiel: ID1=Person A, ID2=Person B, AGRELON_ID1=4020 (hat Elternteil), AGRELON_ID2=4040 (hat Kind)

**d) pers_koerp_datierungen.xml**
```
FELDER: Unbekannt - Datei nicht analysiert!
```
- 263.069 Zeilen (6 MB) - größte Personen-Datei
- Vermutlich: Geburts-/Sterbedaten, aber Struktur unklar

**e) pers_koerp_berufe.xml**
```
FELDER: ID, LFDNR, BERUF, BERUF2
```
- BERUF2: Zweck unklar (Alternative Berufsbezeichnung? Oder zweiter Beruf?)

**f) pers_koerp_orte.xml**
```
FELDER: ID, LFDNR, ORT, ART, SNDB_ID
```
- ART-Werte dokumentiert: Geburtsort, Sterbeort, Wirkungsort
- SNDB_ID: Verknüpfung zu geo_main.xml

#### Geografische Daten (3 Dateien):

**g) geo_main.xml**
```
FELDER: ID, LFDNR, BEZEICHNUNG, INDEXNAME, VON_DATUM_*, BIS_DATUM_*
```
- VON_DATUM/BIS_DATUM: Zweck unklar (Gültigkeit des Ortsnamens?)
- INDEXNAME: Normalisierte Schreibweise ohne Umlaute?

**h) geo_links.xml**
```
FELDER: Völlig undokumentiert!
```
- 63.766 Zeilen (1,9 MB) - zweitgrößte Geo-Datei
- Vermutlich: GeoNames-Verknüpfungen, aber Struktur unbekannt

**i) geo_indiv.xml**
```
FELDER: Nicht dokumentiert
```
- 22.571 Zeilen (936 KB)
- Vermutlich: Koordinaten, alternative Ortsnamen

#### Ontologie (1 Datei):

**j) nsl_agrelon.xml**
```
FELDER: IDENT, KATEGORIE, BEZIEHUNG, URI, CORRIDENT
```
- Siehe TODO #1 für Vollständigkeit

#### Projekt-spezifisch (4 Dateien):

**k) pers_koerp_projekt_goebriefe.xml**
```
FELDER: ID, REGISTEREINTRAG
```
- REGISTEREINTRAG: Biografische Volltexte mit Markup (#k#...#/k#, #r#...#/r#)
- Markup-Bedeutung unklar (Kursivsetzung? Hervorhebung?)

**l) pers_koerp_projekt_regestausgabe.xml**
```
FELDER: Nicht analysiert
```
- 80.541 Zeilen (4,8 MB) - größte Projekt-Datei!
- Zweck: Ausführliche Regest-Beschreibungen

**m) pers_koerp_projekt_bug.xml**
```
FELDER: Nicht analysiert
```
- "Biographica Universalis Goetheana"
- 9.023 Zeilen (289 KB)

**n) pers_koerp_projekt_tagebuch.xml**
```
FELDER: Nicht analysiert
```
- Tagebucherwähnungen
- 4.049 Zeilen (195 KB)

**Begründung:** Vollständige Feldlisten sind Grundvoraussetzung für Datenextraktion und -integration

**Wo dokumentieren:** [data.md](data.md) - neuer Abschnitt "SNDB Feldstrukturen (DTD-Schemas)"

**Geschätzter Aufwand:** 4-6 Stunden (DTDs extrahieren, Beispiele erstellen, Zweck recherchieren)

---

## 🟡 MITTLERE PRIORITÄT

### 4. Drei vollständige Beispiel-Personen mit allen Verknüpfungen erstellen

**Status:** Abstrakte Beschreibungen, keine konkreten Beispiele
**Ziel:** Datenbankstruktur durch vollständige Personenprofile verständlich machen

**Vorschlag für 3 Beispielpersonen:**

**Beispiel 1: Christiane Vulpius (Frau, bekannt, viele Daten)**
- ID: 43779 (laut Dokumentation)
- Aus pers_koerp_main.xml: Name, Titel
- Aus pers_koerp_indiv.xml: SEXUS=w, GND-ID
- Aus pers_koerp_beziehungen.xml: Beziehung zu Goethe (welche AGRELON-ID?)
- Aus pers_koerp_orte.xml: Wirkungsorte (Weimar?)
- Aus pers_koerp_berufe.xml: Berufe (falls vorhanden)
- Aus pers_koerp_projekt_goebriefe.xml: Registereintrag
- Aus CMIF: Ist sie Absenderin? Wie oft erwähnt?

**Beispiel 2: Unbekannte Frau mit wenig Daten (typischer Fall)**
- Zufällige Frau mit SEXUS=w, aber ohne GND
- Zeigt Limitationen der Daten
- Matching-Problem demonstrieren

**Beispiel 3: Mann mit komplexem Netzwerk (Vergleich)**
- Z.B. Christian Gottlob Voigt (Top-Absender mit 760 Briefen)
- Zeigt vollständige Datenabdeckung
- Netzwerk aus pers_koerp_beziehungen.xml

**Format:**
```markdown
## Beispiel 1: Christiane Vulpius (ID 43779)

### Basisdaten (pers_koerp_main.xml)
- ID: 43779
- NACHNAME: Vulpius
- VORNAMEN: Johanna Christiana Sophia
- ...

### Geschlecht & Normdaten (pers_koerp_indiv.xml)
- SEXUS: w
- GND: 118627856

### Beziehungen (pers_koerp_beziehungen.xml)
- ID1: 43779, ID2: 2475 (Goethe), AGRELON: 4120 (Ehepartner)

### CMIF-Vorkommen
- Als Absenderin: 215 Briefe (Rang 12)
- Erwähnt: 659 Mal (Rang 6)
```

**Begründung:** Konkrete Beispiele machen abstrakte Strukturen greifbar

**Wo dokumentieren:** [data.md](data.md) - neuer Abschnitt "Beispiel-Datensätze" oder separate Datei `knowledge/beispiel-personen.md`

**Geschätzter Aufwand:** 2-3 Stunden (Daten extrahieren, formatieren, annotieren)

---

### 5. Projekt-XML-Dateien detailliert dokumentieren

**Status:** Nur Anzahl Einträge und Dateigröße bekannt
**Was fehlt:** Zweck, Struktur, Anwendungsfälle

**Für jede der 4 Dateien dokumentieren:**

**a) pers_koerp_projekt_goebriefe.xml (6.790 Einträge)**
- Zweck: Registereinträge für Goethe-Briefe-Edition
- Feldstruktur: ID, REGISTEREINTRAG
- REGISTEREINTRAG-Format: Biografische Texte mit Markup
- Markup-Typen: #k#...#/k# (Kursiv?), #r#...#/r# (Referenz?)
- Beispieleinträge: 3-5 vollständige Einträge zeigen
- Abdeckung: Wie viele der 23.571 Personen haben Einträge?
- Verwendung: Wann diese Datei nutzen vs. andere Projekt-Dateien?

**b) pers_koerp_projekt_regestausgabe.xml (20.128 Einträge - GRÖSSTE!)**
- Zweck: Ausführliche Beschreibungen für Regest-Ausgabe
- Warum so viele Einträge? (Fast alle Personen?)
- Unterschied zu goebriefe: Länge? Detail? Format?
- Beispieleinträge

**c) pers_koerp_projekt_bug.xml (2.254 Einträge)**
- BUG = "Biographica Universalis Goetheana"
- Was ist dieses Projekt?
- Welche Personen sind enthalten? (Subset? Kriterien?)
- Feldstruktur analysieren

**d) pers_koerp_projekt_tagebuch.xml (1.004 Einträge)**
- Zweck: Erwähnungen in Goethes Tagebuch?
- Feldstruktur: ID + was?
- Datumsangaben enthalten?
- Verknüpfung zu Tagebuch-Edition?

**Vergleichstabelle erstellen:**
```markdown
| Datei | Einträge | Zweck | Typische Verwendung |
|-------|----------|-------|---------------------|
| goebriefe | 6.790 | Brief-Edition Register | Biografische Kurzinfos für Briefkontext |
| regestausgabe | 20.128 | Regest-Edition | Ausführliche Beschreibungen |
| bug | 2.254 | BUG-Projekt | ? |
| tagebuch | 1.004 | Tagebuch-Edition | Tagebucherwähnungen |
```

**Begründung:** Diese Dateien enthalten die narrativen Inhalte - essentiell für "Storytelling" im HerData-Projekt

**Wo dokumentieren:** [data.md](data.md) - Abschnitt "Projektspezifische Biogramme" erweitern

**Geschätzter Aufwand:** 3-4 Stunden (Dateien durchforsten, Struktur verstehen, Beispiele dokumentieren)

---

## 🟢 NIEDRIGE PRIORITÄT

### 6. Datenexport-Prozess und Update-Strategie dokumentieren

**Status:** Nicht dokumentiert
**Offene Fragen:**

1. **Herkunft der SNDB-Dateien:**
   - Aus welcher Datenbank exportiert? (Oracle? MySQL? Filemaker?)
   - Export-Tool/Script vorhanden?
   - Wer hat Zugang zur Original-Datenbank?

2. **Export-Prozess:**
   - Manuelle Abfragen oder automatisierter Export?
   - Transformation: Datenbank → XML (welches Tool?)
   - Validierung nach Export?

3. **Update-Strategie:**
   - Aktueller Stand: Oktober 2025 ("etwa zwei Jahre alt")
   - Wie oft werden Updates geplant?
   - Wie Änderungen nachverfolgen? (Git? Change-Log?)
   - Breaking Changes in Struktur möglich?

4. **Datenqualität:**
   - Deduplizierung: Wie entstehen 27.835 Einträge für 23.571 IDs?
   - LFDNR-Logik (siehe TODO #2)
   - Fehlende GND-IDs: Nachpflege geplant?

**Begründung:** Wichtig für Wartbarkeit, aber nicht unmittelbar für MVP nötig

**Wo dokumentieren:** [data.md](data.md) - neuer Abschnitt "Datenherkunft und Wartung" oder [project.md](project.md)

**Geschätzter Aufwand:** 1-2 Stunden (Recherche, Kontakt mit Datenlieferant?)

---

### 7. API-Endpunkte testen und Beispiel-Responses dokumentieren

**Status:** APIs dokumentiert, aber nicht getestet
**Zu testen:**

**CMIF Brief-Volltext API:**
```
URL: https://api.goethe-biographica.de/exist/apps/api/v1.0/tei/get-records.xql
Parameter: edition=ra, record-id=RA01_0962_01000, metadata (optional)
```

**Tests durchführen:**
1. Funktioniert die API? (Live-Test)
2. Authentifizierung erforderlich?
3. Rate Limits?
4. Response-Format? (TEI-XML? JSON?)
5. Beispiel-Response dokumentieren (anonymisiert)
6. Error-Handling (404, 500)?

**SNDB Online-Datenbank:**
```
URL: https://ores.klassik-stiftung.de/ords/f?p=900:2:::::P2_ID:43779
```

**Tests durchführen:**
1. Link funktioniert?
2. Welche Daten werden angezeigt? (Screenshot)
3. Zugriffsbeschränkungen?
4. Programmatischer Zugriff möglich? (API? Scraping?)

**Begründung:** Wichtig für Integration, aber MVP nutzt lokale XML-Dateien

**Wo dokumentieren:** [data.md](data.md) - Abschnitt "API Zugriffe" erweitern

**Geschätzter Aufwand:** 1-2 Stunden (Testing, Screenshots, Dokumentation)

---

### 8. geo_links.xml und geo_indiv.xml Struktur analysieren

**Status:** Völlig undokumentiert trotz 2,8 MB Daten
**Problem:** Geografische Verknüpfungen unklar

**geo_links.xml (63.766 Zeilen, 1,9 MB):**
- DTD analysieren
- Vermutung: GeoNames-IDs zu SNDB-IDs mappen
- Feldstruktur: ID, GEONAMES_ID, ?
- Beispieleinträge extrahieren

**geo_indiv.xml (22.571 Zeilen, 936 KB):**
- DTD analysieren
- Vermutung: Koordinaten, alternative Ortsnamen
- Feldstruktur: ID, LAT, LON, ?
- Beispieleinträge extrahieren

**Integration mit CMIF:**
- CMIF hat `placeName@ref` mit GeoNames-URLs
- Wie über geo_links.xml zu SNDB-Orten?
- Mapping-Beispiel dokumentieren

**Begründung:** Notwendig für geografische Visualisierungen, aber GeoNames-IDs aus CMIF reichen für MVP

**Wo dokumentieren:** [data.md](data.md) - Abschnitt "Geografische Normdaten" erweitern

**Geschätzter Aufwand:** 2-3 Stunden (Strukturanalyse, Mapping-Logik verstehen)

---

## 📊 Priorisierungsmatrix

| TODO | Priorität | Aufwand | Nutzen für MVP | Dringlichkeit |
|------|-----------|---------|----------------|---------------|
| #1 AGRELON | 🔴 Hoch | 1-2h | Hoch (Netzwerk) | Mittel |
| #2 LFDNR | 🔴 Hoch | 2-3h | Kritisch (Joins) | Hoch |
| #3 DTD-Schemas | 🔴 Hoch | 4-6h | Hoch (Datenextraktion) | Hoch |
| #4 Beispiele | 🟡 Mittel | 2-3h | Mittel (Verständnis) | Mittel |
| #5 Projekt-XMLs | 🟡 Mittel | 3-4h | Hoch (Narrativ) | Mittel |
| #6 Datenexport | 🟢 Niedrig | 1-2h | Niedrig (Wartung) | Niedrig |
| #7 API-Tests | 🟢 Niedrig | 1-2h | Niedrig (MVP nutzt lokal) | Niedrig |
| #8 Geo-Dateien | 🟢 Niedrig | 2-3h | Niedrig (CMIF reicht) | Niedrig |

**Gesamtaufwand:** 16-26 Stunden

---

## 🎯 Empfohlene Reihenfolge

**Wenn Zeit für 1 TODO:**
→ **#2 LFDNR-Semantik** (kritisch für Datenqualität)

**Wenn Zeit für 3 TODOs:**
→ **#2 LFDNR** → **#3 DTD-Schemas** → **#1 AGRELON**

**Wenn Zeit für alles (Vollständigkeit):**
→ Hohe Priorität (1-3) → Mittlere (4-5) → Niedrige (6-8)

---

## 📝 Notizen

**Bereits erledigt und NICHT mehr in dieser Liste:**
- ✅ Python-Script ausführen und Statistiken verifizieren
- ✅ SNDB-Entitäten zählen (Personen, Orte, Beziehungen)
- ✅ Briefanzahl in data.md, project.md, research-context.md korrigieren
- ✅ Geschätzte Zahlen durch verifizierte Zahlen ersetzen
- ✅ SEXUS vs. GESCHLECHT Korrektur
- ✅ 3.617 Frauen (nicht 4.300) dokumentiert

**Dokument erstellt:** 2025-10-19
**Letzte Aktualisierung:** 2025-10-19
**Verantwortlich:** Zu klären

---

Siehe auch:
- [[data|Data Model]] - Aktualisierte Datenmodell-Dokumentation
- [[project|HerData Project]] - Projektübersicht
- [[research-context|Research Context]] - Wissenschaftlicher Kontext
