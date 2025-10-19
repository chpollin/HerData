# Datenmodell

Datenarchitektur, Strukturen und Verknüpfungen für HerData.

Stand: 2025-10-19

Siehe [INDEX.md](INDEX.md) für Navigation im Knowledge Vault.

## Kern-Statistiken

### Frauen
- 3.617 Frauen in SNDB identifiziert (15,3% von 23.571 Personen)
- 808 Frauen mit CMIF-Briefverbindung (22,3%)
- 1.042 Frauen mit Geodaten (28,8%)
- 979 Frauen mit Berufsangaben (27,1%)

### Briefe
- 15.312 Briefe in CMIF (1762-1824)
- 2.525 eindeutige Absender
- 633 eindeutige Orte
- 14.425 erwähnte Personen (67.665 Erwähnungen)

### Datenquellen
- CMIF: ra-cmif.xml (24 MB, Zenodo 14998880)
- SNDB: 14 XML-Dateien (32 MB, Stand Oktober 2025)

Vollständige Analyse siehe [../data/analysis-report.md](../data/analysis-report.md).

---

## Architektur

### Verknüpfungsprinzip

Zwei parallele Datenstränge:
- **CMIF:** Korrespondenzmetadaten (TEI-XML)
- **SNDB:** Biografische Normdaten (14 XML-Dateien)

Primäre Verknüpfung über GND-ID als gemeinsamer Identifikator.

### Verknüpfungsmatrix

```
CMIF Brief
  ├── persName@ref ←→ SNDB GND ←→ pers_koerp_main ID
  ├── placeName@ref ←→ GeoNames ←→ geo_links
  └── mentionsPerson@target ←→ SNDB GND oder ID

SNDB Person (ID als Schlüssel)
  ├── pers_koerp_indiv (SEXUS, GND)
  ├── pers_koerp_datierungen (Geburts-/Sterbedaten)
  ├── pers_koerp_berufe (Berufsangaben)
  ├── pers_koerp_orte (Wirkungsorte)
  ├── pers_koerp_beziehungen (AGRELON-Netzwerk)
  └── projekt_*.xml (Biografische Texte)
```

---

## CMIF-Struktur

### TEI-Hierarchie

```xml
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <profileDesc>
      <correspDesc @ref @source>  <!-- 15.312 Briefe -->
        <correspAction type="sent">
          <persName @ref/>        <!-- GND oder lokal -->
          <placeName @ref/>       <!-- GeoNames -->
          <date @when/>           <!-- ISO 8601 -->
        </correspAction>
        <correspAction type="received">
          <persName @ref="http://d-nb.info/gnd/118540238"/> <!-- Goethe -->
        </correspAction>
        <note>
          <ref type="cmif:mentionsPerson" @target/>
          <ref type="cmif:mentionsBibl" @target/>
          <ref type="cmif:hasLanguage" @target/>  <!-- ISO 639 -->
          <ref type="cmif:hasTextBase" @target/>  <!-- Manuscript/Print/... -->
        </note>
      </correspDesc>
    </profileDesc>
  </teiHeader>
</TEI>
```

### ID-Schema

Brief-IDs: `RA[Volume]_[Number]_[ID]`
- Volume: 01-10 (Bandnummer)
- Number: Fortlaufende Nummer
- ID: Eindeutiger Identifier

Beispiel: `RA01_0962_01000` → https://goethe-biographica.de/id/RA01_0962_01000

### Kardinalitäten

| Relation | Verhältnis | Unique | Durchschnitt | Verteilung |
|----------|-----------|--------|--------------|------------|
| Brief → Absender | n:1 | 2.525 | 5,9 Briefe/Absender | Power-Law (58,9% mit 1 Brief) |
| Brief → Ort | n:1 | 633 | 24,2 Briefe/Ort | Weimar 34,2% (5.236 Briefe) |
| Brief → Erwähnung | n:m | 14.425 | 5,2 Personen/Brief | 85,3% Briefe mit Erwähnungen |

### Kontrollierte Vokabulare

**Textbasis (cmif:hasTextBase):**
- Manuscript: 97,0%
- Print: 1,3%
- Copy: 1,2%
- Draft: 0,4%

**Publikationsstatus (cmif:isPublishedWith):**
- Abstract: 92,9%
- Transcription: 17,3%

**Sprachen (cmif:hasLanguage, ISO 639):**
- de (Deutsch): 96,9%
- fr (Französisch): 2,7%
- en (Englisch): 0,3%
- Andere: <0,2%

---

## SNDB-Struktur

### Dateiübersicht (14 Dateien)

| Kategorie | Datei | Größe | Einträge | Zweck |
|-----------|-------|-------|----------|-------|
| **Personen (6)** |
| Basis | pers_koerp_main.xml | 6.051 KB | 27.835 (23.571 unique IDs) | Namen, IDs |
| Geschlecht | pers_koerp_indiv.xml | 2.191 KB | 23.571 | SEXUS (m/w), GND |
| Beziehungen | pers_koerp_beziehungen.xml | 1.028 KB | 6.580 | AGRELON-Netzwerk |
| Daten | pers_koerp_datierungen.xml | 6.071 KB | 263.069 | Geburts-/Sterbedaten |
| Berufe | pers_koerp_berufe.xml | 3.383 KB | 29.375 | Berufsangaben |
| Orte | pers_koerp_orte.xml | 3.417 KB | 21.058 | Wirkungsorte |
| **Geografie (3)** |
| Basis | geo_main.xml | 739 KB | 4.007 | Ortsnamen |
| Links | geo_links.xml | 1.880 KB | 63.766 | GeoNames-Verknüpfungen |
| Details | geo_indiv.xml | 936 KB | 22.571 | Koordinaten, Varianten |
| **Ontologie (1)** |
| AGRELON | nsl_agrelon.xml | 11 KB | 44 | Beziehungstypen |
| **Projekt (4)** |
| Briefe | projekt_goebriefe.xml | 1.507 KB | 6.790 | Brief-Edition Register |
| Regest | projekt_regestausgabe.xml | 4.875 KB | 20.128 | Ausführliche Beschreibungen |
| Tagebuch | projekt_tagebuch.xml | 195 KB | 1.004 | Tagebucherwähnungen |
| BUG | projekt_bug.xml | 289 KB | 2.254 | Biographica Universalis Goetheana |

### Identifikationssystem

**SNDB-ID (numerisch):**
- URL: `https://ores.klassik-stiftung.de/ords/f?p=900:2:::::P2_ID:[ID]`
- Beispiel: ID 43779 → Christiane Vulpius

**GND-ID:**
- URL: `https://d-nb.info/gnd/[ID]`
- Abdeckung SNDB gesamt: 53,4% (12.596 von 23.571)
- Abdeckung CMIF-Absender: 93,8%
- Abdeckung erwähnte Personen: 82,5%
- Abdeckung Frauen: ~34% (ähnlich Gesamtschnitt)

**LFDNR (Laufende Nummer):**
- LFDNR=0: Haupteintrag (Hauptname)
- LFDNR>0: Namens-Varianten, Aliase
- Gleiche ID kann mehrere LFDNR haben (z.B. ID 1492: LFDNR=0 "Hauptname", LFDNR=705 "d'Arbes")
- Bei Joins: LFDNR=0 bevorzugen für konsistente Hauptnamen

### Geschlechterverteilung

| Geschlecht | Anzahl | Prozent |
|------------|--------|---------|
| Männer (m) | 16.572 | 70,3% |
| Frauen (w) | 3.617 | 15,3% |
| Unbekannt | 3.382 | 14,3% |
| **Gesamt** | **23.571** | **100%** |

---

## DTD-Schemas (Feldstrukturen)

### Personendateien

**pers_koerp_main.xml**
```xml
<row>
  <ID>...</ID>              <!-- Numerische SNDB-ID -->
  <LFDNR>...</LFDNR>        <!-- 0=Haupteintrag, >0=Variante -->
  <NACHNAME>...</NACHNAME>
  <VORNAMEN>...</VORNAMEN>
  <RUFNAME>...</RUFNAME>    <!-- Gebräuchlicher Name -->
  <GEBURTSNAME>...</GEBURTSNAME>  <!-- Name vor Heirat -->
  <TITEL>...</TITEL>        <!-- Akademische/adlige Titel -->
  <NAMENSFORM>...</NAMENSFORM>    <!-- Standardisierte Form -->
  <ZUSATZ>...</ZUSATZ>      <!-- Weitere Namenszusätze -->
  <VON_DATUM_*>...</VON_DATUM_*>  <!-- Datierungsfelder (unklar) -->
  <BIS_DATUM_*>...</BIS_DATUM_*>  <!-- Siehe datierungen.xml -->
</row>
```

**pers_koerp_indiv.xml**
```xml
<row>
  <ID>...</ID>
  <SEXUS>...</SEXUS>        <!-- m/w -->
  <GND>...</GND>            <!-- GND-Nummer -->
  <LITERATUR>...</LITERATUR> <!-- Literaturverweise (Format unklar) -->
</row>
```

**pers_koerp_beziehungen.xml**
```xml
<row>
  <ID1>...</ID1>            <!-- Person A -->
  <ID2>...</ID2>            <!-- Person B -->
  <AGRELON_ID1>...</AGRELON_ID1>  <!-- Beziehungstyp A→B (siehe AGRELON) -->
  <AGRELON_ID2>...</AGRELON_ID2>  <!-- Gegenrichtung B→A -->
</row>
```
Beispiel: ID1=Vulpius, ID2=Goethe, AGRELON_ID1=4120 (hat Ehepartner), AGRELON_ID2=4110 (ist verheiratet mit)

**pers_koerp_datierungen.xml**
```xml
<!-- Struktur unvollständig dokumentiert -->
<!-- Größte Personendatei: 263.069 Zeilen (6 MB) -->
<!-- Vermutlich: ID, ART (Geburtsdatum/Sterbedatum), JAHR, MONAT, TAG -->
<!-- TODO: DTD analysieren -->
```

**pers_koerp_berufe.xml**
```xml
<row>
  <ID>...</ID>
  <LFDNR>...</LFDNR>        <!-- Nummerierung bei mehreren Berufen -->
  <BERUF>...</BERUF>        <!-- Berufsbezeichnung -->
  <BERUF2>...</BERUF2>      <!-- Alternative Bezeichnung oder zweiter Beruf -->
</row>
```

**pers_koerp_orte.xml**
```xml
<row>
  <ID>...</ID>
  <LFDNR>...</LFDNR>
  <ORT>...</ORT>            <!-- Ortsname -->
  <ART>...</ART>            <!-- Geburtsort, Sterbeort, Wirkungsort -->
  <SNDB_ID>...</SNDB_ID>    <!-- Verknüpfung zu geo_main.xml -->
</row>
```

### Geografische Dateien

**geo_main.xml**
```xml
<row>
  <ID>...</ID>
  <LFDNR>...</LFDNR>        <!-- 0=Hauptname, >0=Variante -->
  <BEZEICHNUNG>...</BEZEICHNUNG>  <!-- Ortsname -->
  <INDEXNAME>...</INDEXNAME>      <!-- Normalisiert ohne Umlaute -->
  <VON_DATUM_*>...</VON_DATUM_*>  <!-- Gültigkeit? -->
  <BIS_DATUM_*>...</BIS_DATUM_*>  <!-- Namensänderungen? -->
</row>
```

**geo_links.xml**
```xml
<!-- Struktur unvollständig dokumentiert -->
<!-- 63.766 Zeilen (1,9 MB) -->
<!-- Vermutlich: ID, GEONAMES_ID, TYPE -->
<!-- TODO: DTD analysieren -->
```

**geo_indiv.xml**
```xml
<!-- Struktur unvollständig dokumentiert -->
<!-- 22.571 Zeilen (936 KB) -->
<!-- Vermutlich: ID, LATITUDE, LONGITUDE, ALT_NAMES -->
<!-- TODO: DTD analysieren -->
```

### Projekt-spezifische Biogramme

**projekt_goebriefe.xml**
```xml
<row>
  <ID>...</ID>
  <REGISTEREINTRAG>...</REGISTEREINTRAG>
</row>
```
- Zweck: Biografische Kurzinfos für Brief-Edition
- Format: Text mit Markup (#k#...#/k# = Kursiv?, #r#...#/r# = Referenz?)
- Abdeckung: 6.790 von 23.571 Personen (28,8%)

**projekt_regestausgabe.xml**
```xml
<!-- Struktur ähnlich goebriefe, aber ausführlicher -->
<!-- Größte Projekt-Datei: 20.128 Einträge (85,3% Abdeckung) -->
<!-- TODO: Markup-Format und Unterschiede zu goebriefe analysieren -->
```

**projekt_bug.xml**
```xml
<!-- Struktur undokumentiert -->
<!-- BUG = "Biographica Universalis Goetheana" -->
<!-- 2.254 Einträge (9,6% Abdeckung) -->
<!-- TODO: Projektkontext und Feldstruktur klären -->
```

**projekt_tagebuch.xml**
```xml
<!-- Struktur undokumentiert -->
<!-- Vermutlich: ID, DATUM, ERWÄHNUNG -->
<!-- 1.004 Einträge (4,3% Abdeckung) -->
<!-- TODO: Verknüpfung zu Tagebuch-Edition analysieren -->
```

---

## AGRELON-Ontologie

Agent Relationship Ontology (44 Beziehungstypen aus nsl_agrelon.xml)

### Struktur

```xml
<row>
  <IDENT>...</IDENT>        <!-- Numerische ID (z.B. 4120) -->
  <KATEGORIE>...</KATEGORIE>  <!-- Beziehungskategorie -->
  <BEZIEHUNG>...</BEZIEHUNG>  <!-- Textbeschreibung (deutsch) -->
  <URI>...</URI>            <!-- AGRELON-URI -->
  <CORRIDENT>...</CORRIDENT>  <!-- ID der Gegenrichtung -->
</row>
```

### Kategorien (Auswahl)

**Verwandtschaft:**
- 4010: hat Vater / 4011: ist Vater von
- 4020: hat Elternteil / 4021: ist Elternteil von
- 4030: hat Kind / 4040: hat Kind (Variante?)
- 4110: ist verheiratet mit / 4120: hat Ehepartner
- 4130: hat Geschwister

**Vitaler/letaler Kontakt:**
- 5010: hat getötet
- 5020: wurde getötet von
- 5030: hat Mordopfer
- 5040: hat Mörder

**Gruppenbeteiligung:**
- 2010: ist Mitglied von
- 2020: hat Mitglied
- 2050: hat Besitzer
- 2060: ist Besitzer von

**Weitere Kategorien:**
- Professionell: Lehrer/Schüler, Patron/Klient
- Literarisch: Autor/Werk, Widmung
- Geografisch: geboren in, gestorben in

Vollständige Liste siehe nsl_agrelon.xml (44 Typen).

---

## Datenfluss (Frauenidentifikation)

### Pipeline (4 Phasen)

**Phase 1: Identifizierung**
1. Lade pers_koerp_main.xml (27.835 Einträge, 23.571 unique IDs)
2. Filtere pers_koerp_indiv.xml nach SEXUS=w
3. Ergebnis: 3.617 Frauen (15,3%)

**Phase 2: CMIF-Matching**
1. Absenderinnen: persName@ref ←→ SNDB GND (primär) oder Name (sekundär)
2. Erwähnungen: mentionsPerson@target ←→ SNDB GND oder ID
3. Ergebnis: 808 Frauen mit Briefverbindung (36 Absenderinnen, 616 erwähnt, 156 beides)

**Phase 3: Anreicherung**
1. Geodaten: pers_koerp_orte.xml + geo_main.xml + geo_indiv.xml
2. Temporale Daten: pers_koerp_datierungen.xml
3. Berufe: pers_koerp_berufe.xml
4. Beziehungen: pers_koerp_beziehungen.xml + nsl_agrelon.xml
5. Ergebnis: 1.042 Frauen mit Geodaten, 979 mit Berufen

**Phase 4: Narrativierung**
1. Biografische Texte: projekt_goebriefe.xml (6.790), projekt_regestausgabe.xml (20.128)
2. Tagebucherwähnungen: projekt_tagebuch.xml (1.004)
3. Ausgabe: docs/data/persons.json (1,49 MB)

Details siehe [../preprocessing/README.md](../preprocessing/README.md).

---

## API-Zugriffe

### CMIF Brief-Volltext API

**Endpunkt:**
```
https://api.goethe-biographica.de/exist/apps/api/v1.0/tei/get-records.xql
```

**Parameter:**
- `edition=ra` (Regestausgabe)
- `record-id=RA01_0962_01000` (Brief-ID)
- `metadata` (optional, erweiterte Metadaten)

**Status:** Nicht live getestet
**TODO:** Authentifizierung?, Rate Limits?, Response-Format (TEI-XML? JSON?), Error-Handling

### SNDB Online-Datenbank

**URL-Pattern:**
```
https://ores.klassik-stiftung.de/ords/f?p=900:2:::::P2_ID:[ID]
```

**Beispiel:** ID 43779 → https://ores.klassik-stiftung.de/ords/f?p=900:2:::::P2_ID:43779

**Status:** Funktioniert
**TODO:** Programmatischer Zugriff möglich? API oder Scraping?

---

## Datenherkunft und Wartung

### Export-Prozess

**Unbekannt:**
- Ursprungsdatenbank (Oracle? MySQL? FileMaker?)
- Export-Tool/Script
- Transformation: DB → XML

**TODO:**
- Zugang zur Original-Datenbank klären
- Export-Automatisierung dokumentieren
- Validierung nach Export

### Update-Strategie

**Aktueller Stand:**
- SNDB: Oktober 2025 (~2 Jahre alt)
- CMIF: Zenodo 14998880 (März 2025)

**TODO:**
- Update-Frequenz definieren
- Änderungsverfolgung (Git? Change-Log?)
- Breaking Changes in XML-Struktur?

---

## Aggregationsmöglichkeiten

### Netzwerkprojektionen

- **Person-zu-Person:** Ko-Erwähnung in Briefen
- **Ort-zu-Ort:** Korrespondenzwege
- **Zeit-Thema:** Temporale thematische Cluster

### Multidimensionale Analysen

- **Bewegungsprofile:** Räumliche Mobilität über Zeit
- **Themenverläufe:** Inhaltliche Entwicklungen
- **Soziale Dynamiken:** Beziehungsnetzwerke im Zeitverlauf

Details siehe [requirements.md](requirements.md) und [design.md](design.md).

---

## Datenqualität

### CMIF
- GND-Abdeckung Absender: 93,8%
- GeoNames-Verknüpfung Orte: 91,6%
- Exakte Datierungen: 87,6%
- TEI-Volltext-Verfügbarkeit: 15,7%
- Stand: Zenodo 14998880 (März 2025)

### SNDB
- Stand: Oktober 2025 (~2 Jahre alt)
- GND-Abdeckung gesamt: 53,4% (12.596 von 23.571)
- GND-Abdeckung Frauen: ~34% (1.235 von 3.617)
- Struktur: Stabil

### Deduplizierung
- 27.835 Einträge für 23.571 IDs
- Ursache: LFDNR-Varianten (Mehrfacheinträge für Namensformen)
- Lösung: LFDNR=0 für Haupteintrag bevorzugen

### Offene Punkte
- GND-Nachpflege-Strategie für fehlende IDs
- Update-Frequenz definieren
- Änderungsverfolgung etablieren

---

## Beispiel-Datensätze

### Christiane Vulpius (ID 43779)

**pers_koerp_main.xml:**
- ID: 43779
- NACHNAME: Vulpius
- VORNAMEN: Johanna Christiana Sophia
- LFDNR: 0 (Haupteintrag)

**pers_koerp_indiv.xml:**
- SEXUS: w
- GND: 118627856

**pers_koerp_beziehungen.xml:**
- ID1: 43779, ID2: 2475 (Goethe)
- AGRELON_ID1: 4120 (hat Ehepartner)
- AGRELON_ID2: 4110 (ist verheiratet mit)

**CMIF-Vorkommen:**
- Als Absenderin: 215 Briefe (Rang 12 von 2.525)
- Erwähnt: 659 Mal (Rang 6 von 14.425)

**pers_koerp_orte.xml:**
- Wirkungsort: Weimar (SNDB_ID verknüpft mit geo_main.xml)

**projekt_goebriefe.xml:**
- REGISTEREINTRAG: "Christiane Vulpius, geb. 1765 in Weimar, gest. 1816 ebd. Goethes Lebensgefährtin und spätere Ehefrau..."

### Weitere Beispiele

**TODO:** 2 weitere Beispielpersonen dokumentieren:
1. Unbekannte Frau mit wenig Daten (typischer Fall ohne GND)
2. Mann mit komplexem Netzwerk (z.B. Christian Gottlob Voigt, 760 Briefe)

---

## Verweise

- [project.md](project.md) - Projektübersicht
- [research-context.md](research-context.md) - Wissenschaftlicher Kontext
- [design.md](design.md) - Visualisierungsstrategie
- [../data/analysis-report.md](../data/analysis-report.md) - Vollständige Statistiken
- [../preprocessing/README.md](../preprocessing/README.md) - Pipeline-Dokumentation
