# taktix-os-cee
Core engine for PL/DE construction investments
# 🎛️ TAKTIX OS — Central Production & Logistics Matrix Engine [CEE Region]

---
### 🌐 Language / Sprache
*   [🇵🇱 Przejdź do wersji polskiej](#-wersja-polska)
*   [🇦🇹 Zur deutschen Version springen](#-deutsche-version)
---

## 🇵🇱 Wersja Polska
Prototyp bezobsługowego systemu klasy Enterprise dedykowany do zarządzania produkcją i logistyką w budownictwie kubaturowym lub infrastrukturalnym na bazie metodyki **LP®S (Last Planner® System)**, **Takt Time Planning (Planowanie Taktowe)** oraz **Project Production (Produkcja Budowlana)** według zasad Project Production Institute. 

System realizuje ideę "Monolitu Informacyjnego", eliminując tradycyjne raporty Excela na rzecz automatycznych, kryptograficznie zabezpieczonych pętli relacyjnych w chmurze Google Apps Script & Looker Studio. 

Alternatywą dla środowiska Google jest Open Source NextCloud. TAKTIX OS w wersji NextCloud jest na razie w opracowaniu.

---

## 🏗️ Kompletna Architektura Systemu (13 Tabel Jądra)

System opiera się na strukturze powiązanych rejestrów (Single Source of Truth):
*   **T00_LOCALISATION** — Centralny słownik tokenów i automatyczny tłumacz całego interfejsu (PL/DE). Tabela ukryta.
*   **T00_SPATIAL_CONFIG** - Centralny słownik taktów, sekcji, hubów magazynowych i poziomów inwestycji (tabela przejściowa, organizująca). Tabela ukryta.
*   **T01_README_AND_LICENSE** — Główny panel sterowania projektem, wybór języka, wybór waluty (PLN/EUR) i przelicznik kursowy FOREX oraz ustawienie maksymalnej ilości prac w toku (WIP - Work in Process) dla poszczególnych branż i całej inwestycji.
*   **T02_TAKT_MATRIX** — Słownik stref rozładunkowych i Takt-Boxów z wbudowanym limitem składowania kapitału [Max] wyrażonym w walucie bazowej projektu.
*   **T03_PRODUCTION_FLOW_DICTIONARY** — Rejestr kodów branżowych, dwujęzycznych opisów zakresu prac oraz kryteriów wejścia na front robót.
*   **T04_LOGISTICS_SLOTS_DICTIONARY** — Rejestr okien czasowych dla dostaw materiałowych do zdefiniowanych w 'T02' taktów, ogólnych miejsc składowania na terenie budowy lub zewnętrznych hubów magazynowych.
*   **T05_CONTRACTS_REGISTER** — Centralny rejestr umów, tożsamości cyfrowych generalnego wykonawcy (MAI), podwykonawców (SUB), dostawców (SUP) oraz sum kontraktowych.
*   **T06_TAKT_MASTER_SCHEDULE** — Bieżący harmonogram inżyniera kontraktu generujący dynamiczne klucze planu (`SCHEDULE_KEY`) i czasy cykli na bazie tabel Last Planner® śystem i Takt Time. Digitalny centralny plan pracy.
*   **T07_VARIABILITY_MANAGEMENT** — Centrala awarii, monitorująca marnotrawstwo finansowe, przestoje oraz statusy usuwania usterek Andon (`🚨 W TOKU` / `ZAMKNIĘTY`).
*   **T08_DELIVERIES** — Rejestr dostaw z automatycznym radarem przepełnienia logistycznego hubów materiałowych (`HDR_HUB_STATUS`).
*   **T09_LEAN_TRANSFORMATION_COSTS** — Protokół działań, mających na celu wprowadzenie metodyki lean do inwestycji.
*   **T10_PLAIN_PROFIT_AND_LOSS** — Główny ledger finansowy holdingu, zapis codziennych i cotygodniowych raportów, podwójnie ryglowany i zamykany sumą kontrolną SHA-256.
*   **T11_WEEKLY_BOX_SCORE** — Automatyczny kalkulator wskaźnika stabilności procesów Lean (wyliczający rzeczywisty wynik **PPC %**).
*   **T12_GLOBAL_BOX_SCORE** — Globalne zestawienie zatorów, wskaźników WIP Congestion oraz finansowego zaangażowania budowy.
*   **T13_WIP_DAILY_MONITOR** - Dzienny monitor ilości prac w toku **WIP** dla całej inwestycji i każdej z branż na bazie dopuszczalnych ilości WIP, zapisanych w 'T01'.

---

## ⚙️ Krwioobieg Danych (Relacje Formularze ➔ Tabele)

System eliminuje ręczne wprowadzanie danych poprzez pętle wymiany informacji, sterowane przez skrypt chmurowy `Code.gs`:

### 📥 1. Pętla Planowania (Forms 0 ➔ T06_TAKT_MASTER_SCHEDULE)
*   **Akcja:** Odpowiedzialny inżynier zapisuje sekwencję branżowych Takt-Boxów z cotygodniowych tabel Last Planner® System / Takt Time w biurze budowy w formularzu na smartfonie, korzystając z list rozwijanych, przygotowanych przed rozpoczęciem inwestycji i zapisanych w odpowiednich tabelach.
*   **Powiązanie:** Skrypt przechwytuje dane i generuje w `T06` unikalny identyfikator `SCHEDULE_KEY` (`Tydzień|Takt|Branża`). Od tej pory plan tygodniowy jest zapisany elektronicznie.

### 📥 1. Pętla Planowania (Forms 00 ➔ T00_SPATIAL_CONFIG ➔ T02_TAKT_MATRIX)
*   **Akcja:** Odpowiedzialny inżynier wpisuje przed rozpoczęciem inwestycji wszystkie takty na wszystkich poziomach w przestrzeni obiektu inwestycyjnego w formularzu na smartfonie, korzystając z list rozwijanych, przygotowanych przed rozpoczęciem inwestycji i zapisanych w odpowiednich tabelach. Zadanie to wymaga starannego planowania podziału inwestycji na sekcje w gronie managementu wszystkich stron uczestniczących oraz przy zastosowaniu myślenia systemowego. Dodatkowo definiowane są finansowe limity składowania materiałów i ekwipunku w zapisanych taktach/hubach oraz bramy dla dojazdów dla dedykowanych dostaw. Dane te są następnie automatycznie przesyłane do tabeli 'T02', będącej podstawą planowania pracy w taktach (formularz Forms 0).
*   **Powiązanie:** Dane z formularza są przekazywane najpierw do tabeli 'T00', która sortuje i organizuje je przestrzennie, a potem są one przesyłane do 'T02' w jednym ciągłym, automatycznym procesie.

### 📥 2. Pętla Logistyczna (Forms 1A & 1B ➔ T08_DELIVERIES)
*   **Akcja:** Logistyk/Dostawca zgłasza transport (Paszport Logistyczny) wraz z deklarowaną wartością finansową ładunku w PLN/EUR.
*   **Powiązanie:** Dane trafiają do `T08`. Formuła `XLOOKUP` weryfikuje adres e-mail dostawcy w `T05`, pobiera jego ludzką nazwę, a funkcja `SUMIFS` sprawdza skumulowaną wartość towaru w strefie i porównuje ją z limitami finansowymi z `T02`. W przypadku przekroczenia budżetu danego huba, w kolumnie P zapala się numeryczny alert przepełnienia. Akcje są kodowane w hash i timestamp w chmurze blockchain.

### 📥 3. Pętla Meldowania Terenowego (Forms 3 ➔ T10_PLAIN_PROFIT_AND_LOSS)
*   **Akcja:** Brygadzista podwykonawcy melduje codzienny status robót na konkretnym Takt-Boxie przez formularz na smartfonie.
*   **Powiązanie:** Skrypt generuje rekord w głównym ledgerze `T10`. Za pomocą bezpiecznika Wildcard, system odpytuje plan `T06` na podstawie strefy i branży, automatycznie wstrzykując do klucza zadania (`TASK_KEY`) właściwy numer tygodnia operacyjnego (`W05|...`). Stan WIP w kolumnie I automatycznie podnosi się do poziomu `1` (praca w toku), a akcja jest kodowana w hash i timestamp w chmurze blockchain.

### 📥 4. Pętla Kryptograficznego Odbioru (Forms 4 ➔ T10_PLAIN_PROFIT_AND_LOSS)
*   **Akcja:** Brygadzista podwykonawcy raportuje zakończenie swojego 'taktu' przez formularz na smartfonie. Inżynier dokonuje technicznego odbioru jakościowego wykonanego taktu z akceptacją w tabeli 'T10'.
*   **Powiązanie:** Weryfikacja w chmurze odnajduje pasujący `TASK_KEY` w `T10`, przestawia kolumnę T (`ZADANIE_UKONCZONE`) na `TRUE`, zeruje wskaźnik WIP w kolumnie I (front zwolniony) i uruchamia algorytm SHA-256, generując 64-znakowy nienaruszalny hash pieczętujący marżę rzeczywistą. Ożywa tabela `T11`, przerzucając wskaźnik PPC do Looker Studio poprzez przygotowane odpowiednie diagramy.

### 📥 5. Pętla Zarządzania Zmiennością (Forms 2 ➔ T07_VARIABILITY_MANAGEMENT)
*   **Akcja:** Wystąpienie awarii, opóźnienia dostawy lub braku frontu robót jest meldowane z placu budowy przez formularz na smartfonie.
*   **Powiązanie:** Incydent zasila centralę awarii `T07`. Kolumna L za pomocą dynamicznego, wielojęzycznego `XLOOKUP` podnosi flagę Andon (`🚨 W TOKU` / `🚨 ZAMKNIĘTY`), która świeci na czerwono na wykresie Pareto w Looker Studio, dopóki odpowiedzialny inżynier nie zamknie usterki w kolumnie M tabeli 'T07'. Akcja jest kodowana w hash i timestampo w chmurze blockchain.

### 📥 6. Pętla Ewaluacji i Transformacji Lean (Forms 5 ➔ T09_LEAN_TRANSFORMATION_COSTS)
*   **Akcja:** Rejestr kosztów wprowadzania metodyki lean do inwestycji (licencje, warsztaty, szkolenia, doradztwo). Odpowiedzialny inżynier wprowadza dane faktury do formularza na smartfonie.
*   **Powiązanie:** Dane (finansowe i statystyczne) są automatycznie zasysane przez tabelę 'T09', a potem wprowadzane do Looker Studio w odpowiednich wizualnych diagramach dla zarządu holdingu. Działanie finansowe jest kodowane w hash i timestamp w chmurze blockchain.
  
---

## ⚖️ Licencja & Prawa Autorskie

Oprogramowanie jest udostępniane na zasadach licencji **GNU General Public License v3 (GPL v3)**.
*   Gwarantuje to, że system pozostanie wolny i darmowy dla społeczności inżynierskiej.
*   Jakiekolwiek wbudowanie kodu źródłowego TAKTIX OS (w tym skryptu `Code.gs`) do systemów komercyjnych wymusza pełne otwarcie kodu źródłowego oprogramowania nadrzędnego.

*Copyright (c) 2026 by Robert Szczepaniak. All rights reserved.*

---
---

## 🇦🇹 Deutsche Version

Prototyp eines wartungsfreien Systems der Enterprise-Klasse für das Produktions- und Logistikmanagement im Hochbau oder Infrabau, basierend auf den Methoden **LPS (Last Planner® System)**, **Takt Time Planning (Taktplanung)** und **Project Production (Bauproduktion)** nach den Grundsätzen des Project Production Institute.

Das System realisiert die Idee eines "Informationsmonolithen" und eliminiert traditionelle Excel-Berichte zugunsten von automatisierten, kryptografisch gesicherten relationalen Schleifen in der Google Apps Script- & Looker Studio-Cloud. 

Eine Alternative zur Google-Umgebung ist das Open-Source-System NextCloud. TAKTIX OS in der NextCloud-Version befindet sich derzeit in der Entwicklung.

---

### 🏗️ Komplette Systemarchitektur (Die 13 Tabellen des Kerns)
*   **T00_LOCALISATION** — Zentrales Token-Wörterbuch und automatischer Interface-Übersetzer (PL/DE). Ausgeblendete Tabelle.
*   **T00_SPATIAL_CONFIG** – Zentrales Verzeichnis von Takten, Sektionen, Lager-Hubs und Investitionsebenen (Zwischen- bzw. Organisationstabelle). Ausgeblendete Tabelle.
*   **T01_README_AND_LICENSE** — Zentrale Projektsteuerung, Sprach- und Währungsauswahl (PLN/EUR) sowie FOREX-Wechselkursumrechnung und Festlegung der maximalen Anzahl laufender Arbeiten (WIP – Work in Process) für die einzelnen Gewerke und das Gesamtprojekt.
*   **T02_TAKT_MATRIX** — Verzeichnis der Entladezonen und Takt-Boxen mit integriertem Limit für das gebundene Kapital [Max], angegeben in der Basiswährung des Projekts.
*   **T03_PRODUCTION_FLOW_DICTIONARY** — Verzeichnis der Branchencodes, zweisprachigen Beschreibungen des Leistungsumfangs sowie der Kriterien für den Arbeitsbeginn.
*   **T04_LOGISTICS_SLOTS_DICTIONARY** — Verzeichnis der Zeitfenster für Materiallieferungen an die in „T02“ definierten Takte, an allgemeine Lagerbereiche auf der Baustelle oder an externe Lager-Hubs.
*   **T05_CONTRACTS_REGISTER** — Zentrales Register für Verträge, digitale Identitäten von Generalunternehmern (MAI), Subunternehmern (SUB) und Lieferanten (SUP) sowie Vertragssummen.
*   **T06_TAKT_MASTER_SCHEDULE** — Aktueller Zeitplan des Vertragsingenieurs, der dynamische Planungsschlüssel (`SCHEDULE_KEY`) sowie Taktzeiten auf der Grundlage von Last-Planner®- und Taktzeit-Systemtabellen generiert. Digitaler zentraler Arbeitsplan.
*   **T07_VARIABILITY_MANAGEMENT** — Zentrale zur Überwachung von finanzieller Verschwendung, Stillständen sowie dem Status der Störungsbehebung (Andon: `🚨 IN BEARBEITUNG` / `ABGESCHLOSSEN`).
*   **T08_DELIVERIES** — Lieferregister mit automatischer Überwachung von Überlastungen an Material-Logistik-Hubs (`HDR_HUB_STATUS`).
*   **T09_LEAN_TRANSFORMATION_COSTS** — Protokoll der Maßnahmen zur Einführung der Lean-Methodik bei Investitionsvorhaben.
*   **T10_PLAIN_PROFIT_AND_LOSS** — Das Hauptfinanzbuch des Holdings – eine Aufzeichnung täglicher und wöchentlicher Berichte –, doppelt gesichert und mittels SHA-256-Prüfsumme versiegelt.
*   **T11_WEEKLY_BOX_SCORE** — Automatischer Rechner für den Stabilitätsindex von Lean-Prozessen (zur Ermittlung des tatsächlichen **PPC-%-Werts**).
*   **T12_GLOBAL_BOX_SCORE** — Globale Übersicht über Engpässe, WIP-Congestion-Kennzahlen und das finanzielle Bauvolumen.
*   **T13_WIP_DAILY_MONITOR** – Tägliche Überwachung der Menge der laufenden Arbeiten (**WIP**) für das Gesamtprojekt sowie für die einzelnen Gewerke, basierend auf den in ‚T01‘ festgelegten zulässigen WIP-Mengen.

---

### 🛡️ Datenkreislauf & Poka-Yoke (Beziehungen Formulare ➔ Tabellen)

Das System eliminiert die manuelle Dateneingabe durch Informationsaustauschschleifen, die von dem Cloud-Skript `Code.gs` gesteuert werden:

### 📥 1. Planungsschleife (Forms 0 ➔ T06_TAKT_MASTER_SCHEDULE)
*   **Aktion:** Der verantwortliche Ingenieur erfasst die Abfolge der gewerkspezifischen Takt-Boxen aus den wöchentlichen Last-Planner®-System- bzw. Taktzeit-Tabellen im Baubüro über ein Smartphone-Formular; dabei nutzt er Dropdown-Listen, die vor Projektbeginn vorbereitet und in den entsprechenden Tabellen hinterlegt wurden.
*   **Verknüpfung:** Ein Skript erfasst die Daten und generiert in `T06` eine eindeutige Kennung `SCHEDULE_KEY` (`Woche|Takt|Gewerk`). Damit ist der Wochenplan elektronisch gespeichert.

### 📥 1. Planungsschleife (Forms 00 ➔ T00_SPATIAL_CONFIG ➔ T02_TAKT_MATRIX)
*   **Aktion:** Vor Beginn des Bauvorhabens erfasst der zuständige Ingenieur sämtliche Takte auf allen Ebenen innerhalb des Projektgeländes über ein Formular auf seinem Smartphone. Hierbei greift er auf Dropdown-Listen zurück, die im Vorfeld erstellt und in den entsprechenden Tabellen hinterlegt wurden. Diese Aufgabe erfordert eine sorgfältige Planung der Unterteilung des Bauvorhabens in Abschnitte – unter Einbeziehung des Managements aller beteiligten Parteien und unter Anwendung eines systemorientierten Denkansatzes. Zudem werden finanzielle Obergrenzen für die Lagerung von Materialien und Ausrüstung in den festgelegten Takten bzw. Hubs definiert sowie Zufahrtspunkte für spezifische Lieferungen festgelegt. Diese Daten werden anschließend automatisch in die Tabelle „T02“ übertragen, welche als Grundlage für die Taktplanung dient (Formular „Forms 0“).
*   **Verknüpfung:** Die Daten aus dem Formular werden zunächst an die Tabelle „T00“ übermittelt, in der sie räumlich sortiert und strukturiert werden. Von dort aus gelangen sie in einem durchgängigen, automatisierten Prozess in die Tabelle „T02“.

### 📥 2. Logistik-Schleife (Formulare 1A & 1B ➔ T08_DELIVERIES)
*   **Aktion:** Logistiker/Lieferant meldet einen Transport (Logistik-Pass) unter Angabe des deklarierten Warenwerts in PLN/EUR an.
*   **Verknüpfung:** Die Daten werden an `T08` übermittelt. Die `XLOOKUP`-Formel validiert die E-Mail-Adresse des Lieferanten in `T05` und ruft dessen Namen ab; die Funktion `SUMIFS` ermittelt den kumulierten Warenwert in der Zone und vergleicht ihn mit den Finanzlimits aus `T02`. Bei Überschreitung des Budgets für den jeweiligen Hub erscheint in Spalte P ein numerischer Warnhinweis (Überlastungsalarm). Die Vorgänge werden mittels Hash und Zeitstempel in der Blockchain-Cloud kodiert.

### 📥 3. Rückmeldeschleife vor Ort (Forms 3 ➔ T10_PLAIN_PROFIT_AND_LOSS)
*   **Aktion:** Der Vorarbeiter des Subunternehmers meldet den täglichen Arbeitsstatus für eine bestimmte Takt-Box über ein Smartphone-Formular.
*   **Verknüpfung:** Das Skript erzeugt einen Datensatz im Haupt-Ledger `T10`. Mittels einer Wildcard-Logik fragt das System den Plan `T06` basierend auf Zone und Gewerk ab und fügt automatisch die korrekte operative Kalenderwoche (`W05|...`) in den Aufgaben-Schlüssel (`TASK_KEY`) ein. Der WIP-Status in Spalte I wird automatisch auf `1` (Work in Process) gesetzt, und die Aktion wird als Hash sowie Zeitstempel in der Blockchain-Cloud kodiert.

### 📥 4. Kryptografischer Abnahmeschritt (Forms 4 ➔ T10_PLAIN_PROFIT_AND_LOSS)
*   **Aktion:** Der Vorarbeiter des Subunternehmers meldet den Abschluss seines „Takts“ über ein Smartphone-Formular. Ein Ingenieur führt die technische Qualitätsabnahme des ausgeführten Takts durch und bestätigt diese in der Tabelle „T10“.
*   **Verknüpfung:** Die Cloud-Verifizierung identifiziert den passenden `TASK_KEY` in „T10“, setzt die Spalte T (`AUFGABE ABGESCHLOSSEN`) auf `TRUE`, setzt den WIP-Indikator in Spalte I (Arbeitsbereich freigegeben) auf Null und startet den SHA-256-Algorithmus; dabei wird ein unveränderlicher 64-Zeichen-Hash generiert, der die tatsächliche Marge besiegelt. Die Tabelle „T11“ wird aktiviert und überträgt den PPC-Indikator über entsprechend vorbereitete Diagramme an Looker Studio.

### 📥 5. Variabilitätsmanagement-Schleife (Forms 2 ➔ T07_VARIABILITY_MANAGEMENT)
*   **Aktion:** Das Auftreten einer Störung, einer Lieferverzögerung oder eines fehlenden Arbeitsbereichs wird von der Baustelle aus über ein Smartphone-Formular gemeldet.
*   **Verknüpfung:** Der Vorfall speist die Störungszentrale `T07`. Spalte L setzt mittels eines dynamischen, mehrsprachigen `XVERWEIS` (`XLOOKUP`) ein Andon-Signal (`🚨 IN ARBEIT` / `ABGESCHLOSSEN`), das im Pareto-Diagramm in Looker Studio rot leuchtet, bis der zuständige Ingenieur die Störung in Spalte M der Tabelle 'T07' abschließt. Die Aktion wird als Hash und Zeitstempel in der Blockchain-Cloud kodiert.

### 📥 6. Lean-Evaluierungs- und Transformationsschleife (Forms 5 ➔ T09_LEAN_TRANSFORMATION_COSTS)
*   **Aktion:** Erfassung der Kosten für die Einführung der Lean-Methodik im Investitionsprojekt (Lizenzen, Workshops, Schulungen, Beratung). Der verantwortliche Ingenieur gibt die Rechnungsdaten in das Formular auf dem Smartphone ein.
*   **Verknüpfung:** Die Daten (finanziell und statistisch) werden automatisch in die Tabelle „T09“ übertragen und anschließend in Looker Studio in entsprechenden visuellen Diagrammen für die Holding-Geschäftsführung aufbereitet. Der Finanzvorgang wird mittels Hash und Zeitstempel in der Blockchain-Cloud verschlüsselt und dokumentiert.

---

## ⚖️ Lizenz & Urheberrecht

Die Software ist unter den Bedingungen der **GNU General Public License v3 (GPL v3)** verfügbar.
*   Dadurch wird sichergestellt, dass das System für die Ingenieursgemeinschaft frei und offen bleibt.
*   Jede Integration des TAKTIX OS-Quellcodes (einschliesslich des Code.gs-Skripts) in komerzielle Systeme erfordert den vollständigen Open-Source-Zugriff auf die übergeordnete Software.

*Copyright (c) 2026 by Robert Szczepaniak. All rights reserved.*
