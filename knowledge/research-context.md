# Research Context

## PROPYLÄEN Gesamtprojekt

Langzeitedition der Briefe an Goethe mit Laufzeit bis 2039. Das Projekt zielt auf die digitale Bereitstellung von über 20.000 Briefen von etwa 3.800 Personen und Körperschaften. Die Edition bietet chronologische Darstellung und erschließt Zusammenhänge innerhalb der Korrespondenz.

Die Überlieferung umfasst mehr als 20.000 Briefe ohne amtliche Korrespondenz. Über 90 Prozent der Briefe befinden sich im Goethe- und Schiller-Archiv. Von diesen sind bislang nur etwa 8.000 Briefe verstreut in mehr als 600 Ausgaben ganz oder in Auszügen gedruckt worden.

## Bearbeitungsstand und Verfügbarkeit

Vollständig online verfügbar sind Regesten, Transkriptionen und Digitalisate der Briefe von 1762 bis August 1786. Für den Zeitraum September 1786 bis 1797 stehen zusätzlich XML/TEI-Dateien zur Verfügung, die als ZIP-Datei mit 10.8 MB heruntergeladen werden können.

Für Briefe von September 1786 bis 1824 sind Absender, Entstehungsorte und Datierungen online zugänglich. Die Regesten sind bis 1822 verfügbar. Transkriptionen der Briefe ab September 1786 werden sukzessive im Frontend sichtbar gemacht. Die Brieftexte bis 1822 sind bereits durchsuchbar.

Der zuletzt im Druck erschienene Band ist "Briefe an Goethe. Gesamtausgabe in Regestform. Band 10: 1823–1824" aus dem Jahr 2023, bearbeitet von Christian Hain, Ulrike Bischof, Claudia Häfner, Manfred Koltes und Sabine Schäfer, erschienen bei J. B. Metzler in Weimar.

## Thematische Vielfalt

Die Briefe begleiten Goethes Leben und Werk und spiegeln primär die Lebenswelt der Briefschreiber wider. Sie behandeln literarische, naturwissenschaftliche, philosophische, politische, historische und ästhetische Themen sowie Alltagsprobleme. Zu den wichtigsten Korrespondenten gehören Friedrich Schiller, Alexander und Wilhelm von Humboldt, Karl Friedrich Zelter, Charlotte von Stein, Karl Friedrich Reinhard und Marianne von Eybenberg.

Die Korrespondenz ist zu 96.9 Prozent deutschsprachig, 2.7 Prozent französisch, 0.3 Prozent englisch, 0.2 Prozent italienisch, 0.1 Prozent lateinisch und ein Brief in Westflämisch.

## Nutzungsrechte und Lizenzierung

Die Webseitentexte stehen unter CC BY-NC 4.0. Die XML/TEI-Daten sind unter CC BY 4.0 lizenziert. Die Digitalisate können nach den Bedingungen der jeweils bestandshaltenden Einrichtung genutzt werden, die im Viewer unterhalb der Abbildungen angegeben sind. Das CMIF-File ist über Zenodo 14998880 verfügbar.

## Digitale Geisteswissenschaften

Das Projekt nutzt etablierte Standards der digitalen Edition. Der TEI-Standard der Text Encoding Initiative dient für digitale Editionen. Das CMIF-Format ermöglicht den Austausch von Briefmetadaten. Die Vernetzung erfolgt über Linked Open Data mit Normdaten aus GND und GeoNames. Das XML-Schema folgt https://raw.githubusercontent.com/TEI-Correspondence-SIG/CMIF/master/schema/cmi-customization.rng mit dem Namespace http://www.tei-c.org/ns/1.0.

## Gender Studies Perspektive

Die systematische Erfassung von Frauen in der Goethe-Korrespondenz ermöglicht die Sichtbarmachung marginalisierter Akteurinnen der Goethezeit. Die Analyse von Geschlechterverhältnissen um 1800 wird durch strukturierte Datenerfassung möglich. Die Rekonstruktion weiblicher Netzwerke und Handlungsräume erfolgt über Beziehungsdaten und geografische Verortung.

## Datenvernetzung und Authority Files

Die Gemeinsame Normdatei GND dient zur Personenidentifikation mit 93.8 Prozent Abdeckung bei Briefabsendern und 82.5 Prozent bei erwähnten Personen. GeoNames ermöglicht die geografische Verortung mit 91.6 Prozent Abdeckung. Die SNDB als Sammlung Normdaten Biographica bildet die lokalen Normdaten der Klassik Stiftung mit direktem URL-Mapping zur Online-Datenbank. Die Struktur folgt dem Pattern https://ores.klassik-stiftung.de/ords/f?p=900:2:::::P2_ID:[ID], beispielsweise ID 43779 für Christiane Vulpius.

## Forschungsfragen HerData

Die primären Fragen betreffen die Identifikation von Frauen, die mit Goethe korrespondierten, sowie Frauen, die in den Briefen erwähnt werden. Die Vernetzung dieser Frauen untereinander bildet einen weiteren Schwerpunkt.

Sekundäre Forschungsaspekte umfassen die geografische Verteilung weiblicher Korrespondenz, temporale Muster in der Kommunikation, thematische Schwerpunkte in Frauenbriefen sowie soziale Rollen und Berufsfelder.

## Methodische Ansätze

Die Datenextraktion erfolgt durch XML-Parsing der strukturierten Daten mittels Python und xml.etree.ElementTree. Pattern-Matching identifiziert Geschlechtszuweisungen in pers_koerp_indiv.xml. Die ID-Verknüpfung nutzt multiple Normdatensysteme parallel.

Für die Visualisierung wird geografische Kartierung mit Leaflet.js eingesetzt. Netzwerkvisualisierung zeigt Beziehungen zwischen Personen. Timeline-Darstellungen bilden die temporale Dimension ab. Die Narrativierung extrahiert biografische Texte aus Projekt-XMLs, kontextualisiert durch Briefinhalte und integriert Regest-Beschreibungen.

## Quellenkritik und Limitationen

Die Datenqualität zeigt hohe Normdaten-Abdeckung über 90 Prozent bei Absendern. Der Projektstatus als Work in Progress bedeutet kontinuierliche Datenänderungen. Die Digitalisierung ist mit 15.7 Prozent TEI-Volltext via API noch unvollständig.

Strukturelle Limitationen zeigen sich in der geografischen Konzentration auf Zentraldeutschland mit Weimar als Zentrum mit 34.2 Prozent (5.236 Briefe), Jena mit 15.3 Prozent (2.338) und Berlin mit 6.7 Prozent (1.019 Briefe). Die sprachliche Dominanz des Deutschen (96.9 Prozent, 14.835 Briefe) prägt den Korpus, gefolgt von Französisch (2.7 Prozent, 408 Briefe). Eine soziale Verzerrung zeigt sich durch das bildungsbürgerliche Milieu der Korrespondenten. Der Gender-Bias historischer Quellen beeinflusst die Überlieferung. Die Namenskonventionen folgen deutschen historischen Schreibweisen mit Titeln ohne Normalisierung, was manuelle Deduplizierung erfordert.

Die zeitliche Verteilung zeigt einen Schwerpunkt in der Spätphase. 47 Prozent aller Briefe (7.196 von 15.312) stammen aus 1810 bis 1824. Die 1810er Jahre bilden mit 4.592 Briefen (30.0 Prozent) den Peak. Das Höchstjahr ist 1817 mit 730 Briefen. Die frühe Phase vor 1790 macht nur 2.7 Prozent (421 Briefe) aus. 87.6 Prozent der Briefe (13.414) haben exakte Datierungen, 10.1 Prozent (1.543) nur Datumsbereiche.

## Verweise

Siehe [[project]] für die Projektübersicht und [[data]] für das detaillierte Datenmodell. Die PROPYLÄEN Platform ist unter https://goethe-biographica.de erreichbar. Der Zenodo Dataset findet sich unter https://zenodo.org/records/14998880.