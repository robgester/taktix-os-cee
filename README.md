# taktix-os-cee
Core engine for PL/DE construction investments
# 🎛️ TAKTIX OS — Central Production & Logistics Matrix Engine [CEE Region]

---
### 🌐 Language / Sprache
*   [🇵🇱 Przejdź do wersji polskiej](#-wersja-polska)
*   [🇦🇹 Zur deutschen Version springen](#-deutsche-version)
*   [🇬🇧 Jump to English Version](#-english-version)
---

## 🇵🇱 Wersja Polska
Prototyp bezobsługowego systemu klasy Enterprise dedykowany do zarządzania produkcją i logistyką w budownictwie kubaturowym lub infrastrukturalnym na bazie metodyki **LP®S (Last Planner® System)**, **Takt Time Planning (Planowanie Taktowe)** oraz **Project Production (Produkcja Budowlana)** według zasad Project Production Institute. 

System realizuje ideę "Monolitu Informacyjnego", eliminując tradycyjne raporty Excela na rzecz automatycznych, kryptograficznie zabezpieczonych pętli relacyjnych w chmurze Google Apps Script & Looker Studio. 

Alternatywą dla środowiska Google jest Open Source NextCloud. TAKTIX OS w wersji NextCloud jest na razie w opracowaniu.

---

## 🏗️ Kompletna Architektura Systemu (15 Tabel Rdzenia)

System opiera się na strukturze powiązanych rejestrów (Single Source of Truth):
*   **`T00_LOCALISATION`** — Centralny słownik tokenów i automatyczny tłumacz całego interfejsu (PL/DE). Tabela ukryta.
*   **`T00_SPATIAL_CONFIG`** - Centralny słownik taktów, sekcji, hubów magazynowych i poziomów inwestycji (tabela przejściowa, organizująca). Tabela ukryta.
*   **`T01_README_AND_LICENSE`** — Główny panel sterowania projektem, wybór języka, wybór waluty (PLN/EUR) i przelicznik kursowy FOREX oraz ustawienie maksymalnej ilości prac w toku (WIP - Work in Process) dla poszczególnych branż i całej inwestycji.
*   **`T02_TAKT_MATRIX`** — Słownik stref rozładunkowych i Takt-Boxów z wbudowanym limitem składowania kapitału [Max] wyrażonym w walucie bazowej projektu oraz stanem aktualnej rezerwy limitów.
*   **`T03_PRODUCTION_FLOW_DICTIONARY`** — Rejestr kodów branżowych, dwujęzycznych opisów zakresu prac oraz kryteriów wejścia na front robót.
*   **`T04_LOGISTICS_SLOTS_DICTIONARY`** — Rejestr okien czasowych dla dostaw materiałowych do zdefiniowanych w `T02` taktów, ogólnych miejsc składowania na terenie budowy lub zewnętrznych hubów magazynowych.
*   **`T05_CONTRACTS_REGISTER`** — Centralny rejestr umów, tożsamości cyfrowych generalnego wykonawcy (`MAI`), podwykonawców (`SUB`), dostawców (`SUP`) oraz sum kontraktowych.
*   **`T06_TAKT_MASTER_SCHEDULE`** — Bieżący harmonogram inżyniera kontraktu generujący dynamiczne klucze planu (`SCHEDULE_KEY`) i czasy cykli na bazie tabel Last Planner® śystem i Takt Time. Digitalny centralny plan pracy.
*   **`T07_VARIABILITY_MANAGEMENT`** — Centrala awarii, monitorująca marnotrawstwo finansowe, przestoje oraz statusy usuwania usterek Andon (`🚨 W TOKU` / `ZAMKNIĘTY`).
*   **`T08_DELIVERIES`** — Rejestr dostaw z automatycznym radarem przepełnienia logistycznego hubów materiałowych (`HDR_HUB_STATUS`).
*   **`T09_LEAN_TRANSFORMATION_COSTS`** — Protokół działań, mających na celu wprowadzenie metodyki lean do inwestycji.
*   **`T10_PLAIN_PROFIT_AND_LOSS`** — Główny ledger finansowy holdingu, zapis codziennych i cotygodniowych raportów, podwójnie ryglowany i zamykany sumą kontrolną SHA-256.
*   **`T11_WEEKLY_BOX_SCORE`** — Automatyczny kalkulator wskaźnika stabilności procesów Lean (wyliczający rzeczywisty wynik **`PPC %`**).
*   **`T12_GLOBAL_BOX_SCORE`** — Globalne zestawienie zatorów, wskaźników WIP Congestion oraz finansowego zaangażowania budowy.
*   **`T13_WIP_DAILY_MONITOR`** - Dzienny monitor ilości prac w toku (**`WIP`**) dla całej inwestycji i każdej z branż na bazie dopuszczalnych ilości WIP, zapisanych w `T01`.

---

## ⚙️ Krwioobieg Danych (Relacje Formularze ➔ Tabele)

System eliminuje ręczne wprowadzanie danych poprzez pętle wymiany informacji, sterowane przez skrypt chmurowy `Code.gs`:

### 📥 0. Pętla Planowania (`Forms 00` ➔ `T00_SPATIAL_CONFIG` ➔ `T02_TAKT_MATRIX`)
*   **Akcja:** Odpowiedzialny inżynier wpisuje przed rozpoczęciem inwestycji wszystkie takty na wszystkich poziomach w przestrzeni obiektu inwestycyjnego w formularzu na smartfonie, korzystając z list rozwijanych, przygotowanych przed rozpoczęciem inwestycji i zapisanych w odpowiednich tabelach. Zadanie to wymaga starannego planowania podziału inwestycji na sekcje w gronie managementu wszystkich stron uczestniczących oraz przy zastosowaniu myślenia systemowego. Dodatkowo definiowane są finansowe limity składowania materiałów i ekwipunku w zapisanych taktach/hubach oraz bramy dla dojazdów dla dedykowanych dostaw. Dane te są następnie automatycznie przesyłane do tabeli `T02`, będącej podstawą planowania pracy w taktach (formularz `Forms 0`).
*   **Powiązanie:** Dane z formularza są przekazywane najpierw do tabeli `T00`, która sortuje i organizuje je przestrzennie, a potem są one przesyłane do `T02` w jednym ciągłym, automatycznym procesie.

### 📥 1. Pętla Planowania (`Forms 0` ➔ `T06_TAKT_MASTER_SCHEDULE`)
*   **Akcja:** Odpowiedzialny inżynier zapisuje sekwencję branżowych Takt-Boxów z cotygodniowych tabel Last Planner® System / Takt Time w biurze budowy w formularzu na smartfonie, korzystając z list rozwijanych, przygotowanych przed rozpoczęciem inwestycji i zapisanych w odpowiednich tabelach.
*   **Powiązanie:** Skrypt przechwytuje dane i generuje w `T06` unikalny identyfikator `SCHEDULE_KEY` (`Tydzień|Takt|Branża`). Od tej pory plan tygodniowy jest zapisany elektronicznie.

### 📥 2. Pętla Logistyczna (`Forms 1A` & `1B` ➔ `T08_DELIVERIES`)
*   **Akcja:** Logistyk/Dostawca zgłasza transport (Paszport Logistyczny) wraz z deklarowaną wartością finansową ładunku w PLN/EUR.
*   **Powiązanie:** Dane trafiają do `T08`. Formuła `XLOOKUP` weryfikuje adres e-mail dostawcy w `T05`, pobiera jego ludzką nazwę, a funkcja `SUMIFS` sprawdza skumulowaną wartość towaru w strefie i porównuje ją z limitami finansowymi z `T02`. W przypadku przekroczenia budżetu danego huba, w kolumnie P zapala się numeryczny alert przepełnienia. Akcje są kodowane w hash i timestamp w chmurze blockchain.

### 📥 3. Pętla Meldowania Terenowego (`Forms 3` ➔ `T10_PLAIN_PROFIT_AND_LOSS`)
*   **Akcja:** Brygadzista podwykonawcy melduje codzienny status robót na konkretnym Takt-Boxie przez formularz na smartfonie.
*   **Powiązanie:** Skrypt generuje rekord w głównym ledgerze `T10`. Za pomocą bezpiecznika Wildcard, system odpytuje plan `T06` na podstawie strefy i branży, automatycznie wstrzykując do klucza zadania (`TASK_KEY`) właściwy numer tygodnia operacyjnego (`W05|...`). Stan WIP w kolumnie I automatycznie podnosi się do poziomu `1` (praca w toku), a akcja jest kodowana w hash i timestamp w chmurze blockchain.

### 📥 4. Pętla Kryptograficznego Odbioru (`Forms 4` ➔ `T10_PLAIN_PROFIT_AND_LOSS`)
*   **Akcja:** Brygadzista podwykonawcy raportuje zakończenie swojego 'taktu' przez formularz na smartfonie. Inżynier dokonuje technicznego odbioru jakościowego wykonanego taktu z akceptacją w tabeli `T10`.
*   **Powiązanie:** Weryfikacja w chmurze odnajduje pasujący `TASK_KEY` w `T10`, przestawia kolumnę T (`ZADANIE_UKONCZONE`) na `TRUE`, zeruje wskaźnik WIP w kolumnie I (front zwolniony) i uruchamia algorytm SHA-256, generując 64-znakowy nienaruszalny hash pieczętujący marżę rzeczywistą. Ożywa tabela `T11`, przerzucając wskaźnik PPC do Looker Studio poprzez przygotowane odpowiednie diagramy.

### 📥 5. Pętla Zarządzania Zmiennością (`Forms 2` ➔ `T07_VARIABILITY_MANAGEMENT`)
*   **Akcja:** Wystąpienie awarii, opóźnienia dostawy lub braku frontu robót jest meldowane z placu budowy przez formularz na smartfonie.
*   **Powiązanie:** Incydent zasila centralę awarii `T07`. Kolumna L za pomocą dynamicznego, wielojęzycznego `XLOOKUP` podnosi flagę Andon (`🚨 W TOKU` / `🚨 ZAMKNIĘTY`), która świeci na czerwono na wykresie Pareto w Looker Studio, dopóki odpowiedzialny inżynier nie zamknie usterki w kolumnie M tabeli 'T07'. Akcja jest kodowana w hash i timestampo w chmurze blockchain.

### 📥 6. Pętla Ewaluacji i Transformacji Lean (`Forms 5` ➔ `T09_LEAN_TRANSFORMATION_COSTS`)
*   **Akcja:** Rejestr kosztów wprowadzania metodyki lean do inwestycji (licencje, warsztaty, szkolenia, doradztwo). Odpowiedzialny inżynier wprowadza dane faktury do formularza na smartfonie.
*   **Powiązanie:** Dane (finansowe i statystyczne) są automatycznie zasysane przez tabelę `T09`, a potem wprowadzane do Looker Studio w odpowiednich wizualnych diagramach dla zarządu holdingu. Działanie finansowe jest kodowane w hash i timestamp w chmurze blockchain.
  
---

## Szybki Start / Instrukcja Wdrożenia (Quick Start)

Aby uruchomić własną instancję **TAKTIX OS CEE** w środowisku Google Workspace:

1. **Kopia szablonu:** Utwórz kopię głównego Arkusza Google na swoim Dysku Google (wraz z powiązanymi 8 formularzami: `Forms 00`, `Forms 0`, `Forms 1A`, `Forms 1B`, `Forms 2`, `Forms 3`, `Forms 4`, `Forms 5`).
2. **Konfiguracja podstawowa (`T01_README_AND_LICENSE`):** Wybierz język interfejsu (`PL` / `DE` / `EN`), walutę raportową holdingu (`PLN` / `EUR`), wskaźniki marżowe oraz limity WIP.
3. **Konfiguracja skryptu (`Code.gs`):** Otwórz edytor **Rozszerzenia ➔ Apps Script**, wklej plik `Code.gs` i podmień placeholdery identyfikatorów formularzy (`form0Id`, `form1AId_Unique`, `form1BId`, `form2Id`, `form3Id`, `form4Id`) na własne ID skopiowanych formularzy Google.
4. **Synchronizacja i wyzwalacze (Triggers):** Uruchom jednorazowo funkcję `runNativeFormUpdate` (autoryzując dostęp skryptu), a następnie ustaw wyzwalacze czasowe/zdarzeniowe (`On edit` dla `onEdit` oraz `On form submit` dla `runNativeFormUpdate`).

---

## ⚖️ Licencja & Prawa Autorskie

Oprogramowanie jest udostępniane na zasadach licencji **GNU General Public License v3.0 (GPL-3.0)**.

* Gwarantuje to, że system pozostanie wolny i darmowy dla społeczności inżynierskiej.
* Jakiekolwiek wbudowanie kodu źródłowego **TAKTIX OS** (w tym skryptu `Code.gs` oraz architektury formuł) do systemów komercyjnych wymusza pełne otwarcie kodu źródłowego oprogramowania nadrzędnego na tych samych zasadach licencyjnych.
* W projekcie należy również dodać plik `LICENSE` zawierający pełny tekst licencji GNU GPL v3.0 w głównym katalogu repozytorium GitHub.

*Copyright (c) 2026 by Robert Szczepaniak. All rights reserved.*

---
---

## 🇦🇹 Deutsche Version

Prototyp eines wartungsfreien Systems der Enterprise-Klasse für das Produktions- und Logistikmanagement im Hochbau oder Infrabau, basierend auf den Methoden **LPS (Last Planner® System)**, **Takt Time Planning (Taktplanung)** und **Project Production (Bauproduktion)** nach den Grundsätzen des Project Production Institute.

Das System realisiert die Idee eines "Informationsmonolithen" und eliminiert traditionelle Excel-Berichte zugunsten von automatisierten, kryptografisch gesicherten relationalen Schleifen in der Google Apps Script- & Looker Studio-Cloud. 

Eine Alternative zur Google-Umgebung ist das Open-Source-System NextCloud. TAKTIX OS in der NextCloud-Version befindet sich derzeit in der Entwicklung.

---

### 🏗️ Komplette Systemarchitektur (Die 15 Tabellen des Kerns)
*   **`T00_LOCALISATION`** — Zentrales Token-Wörterbuch und automatischer Interface-Übersetzer (PL/DE). Ausgeblendete Tabelle.
*   **`T00_SPATIAL_CONFIG`** – Zentrales Verzeichnis von Takten, Sektionen, Lager-Hubs und Investitionsebenen (Zwischen- bzw. Organisationstabelle). Ausgeblendete Tabelle.
*   **`T01_README_AND_LICENSE`** — Zentrale Projektsteuerung, Sprach- und Währungsauswahl (PLN/EUR) sowie FOREX-Wechselkursumrechnung und Festlegung der maximalen Anzahl laufender Arbeiten (WIP – Work in Process) für die einzelnen Gewerke und das Gesamtprojekt.
*   **`T02_TAKT_MATRIX`** — Verzeichnis der Entladezonen und Takt-Boxen mit integriertem Limit für das gebundene Kapital [Max], angegeben in der Basiswährung des Projekts, mit der Anzeige der aktuellen Limitreserve.
*   **`T03_PRODUCTION_FLOW_DICTIONARY`** — Verzeichnis der Branchencodes, zweisprachigen Beschreibungen des Leistungsumfangs sowie der Kriterien für den Arbeitsbeginn.
*   **`T04_LOGISTICS_SLOTS_DICTIONARY`** — Verzeichnis der Zeitfenster für Materiallieferungen an die in `T02` definierten Takte, an allgemeine Lagerbereiche auf der Baustelle oder an externe Lager-Hubs.
*   **`T05_CONTRACTS_REGISTER`** — Zentrales Register für Verträge, digitale Identitäten von Generalunternehmern (`MAI`), Subunternehmern (`SUB`) und Lieferanten (`SUP`) sowie Vertragssummen.
*   **`T06_TAKT_MASTER_SCHEDULE`** — Aktueller Zeitplan des Vertragsingenieurs, der dynamische Planungsschlüssel (`SCHEDULE_KEY`) sowie Taktzeiten auf der Grundlage von Last-Planner®- und Taktzeit-Systemtabellen generiert. Digitaler zentraler Arbeitsplan.
*   **`T07_VARIABILITY_MANAGEMENT`** — Zentrale zur Überwachung von finanzieller Verschwendung, Stillständen sowie dem Status der Störungsbehebung (Andon: `🚨 IN BEARBEITUNG` / `ABGESCHLOSSEN`).
*   **`T08_DELIVERIES`** — Lieferregister mit automatischer Überwachung von Überlastungen an Material-Logistik-Hubs (`HDR_HUB_STATUS`).
*   **`T09_LEAN_TRANSFORMATION_COSTS`** — Protokoll der Maßnahmen zur Einführung der Lean-Methodik bei Investitionsvorhaben.
*   **`T10_PLAIN_PROFIT_AND_LOSS`** — Das Hauptfinanzbuch des Holdings – eine Aufzeichnung täglicher und wöchentlicher Berichte –, doppelt gesichert und mittels SHA-256-Prüfsumme versiegelt.
*   **`T11_WEEKLY_BOX_SCORE`** — Automatischer Rechner für den Stabilitätsindex von Lean-Prozessen (zur Ermittlung des tatsächlichen **`PPC-%-Werts`**).
*   **`T12_GLOBAL_BOX_SCORE`** — Globale Übersicht über Engpässe, WIP-Congestion-Kennzahlen und das finanzielle Bauvolumen.
*   **`T13_WIP_DAILY_MONITOR`** – Tägliche Überwachung der Menge der laufenden Arbeiten (**`WIP`**) für das Gesamtprojekt sowie für die einzelnen Gewerke, basierend auf den in `T01` festgelegten zulässigen WIP-Mengen.

---

### 🛡️ Datenkreislauf & Poka-Yoke (Beziehungen Formulare ➔ Tabellen)

Das System eliminiert die manuelle Dateneingabe durch Informationsaustauschschleifen, die von dem Cloud-Skript `Code.gs` gesteuert werden:

### 📥 0. Planungsschleife (`Forms 00` ➔ `T00_SPATIAL_CONFIG` ➔ `T02_TAKT_MATRIX`)
*   **Aktion:** Vor Beginn des Bauvorhabens erfasst der zuständige Ingenieur sämtliche Takte auf allen Ebenen innerhalb des Projektgeländes über ein Formular auf seinem Smartphone. Hierbei greift er auf Dropdown-Listen zurück, die im Vorfeld erstellt und in den entsprechenden Tabellen hinterlegt wurden. Diese Aufgabe erfordert eine sorgfältige Planung der Unterteilung des Bauvorhabens in Abschnitte – unter Einbeziehung des Managements aller beteiligten Parteien und unter Anwendung eines systemorientierten Denkansatzes. Zudem werden finanzielle Obergrenzen für die Lagerung von Materialien und Ausrüstung in den festgelegten Takten bzw. Hubs definiert sowie Zufahrtspunkte für spezifische Lieferungen festgelegt. Diese Daten werden anschließend automatisch in die Tabelle `T02` übertragen, welche als Grundlage für die Taktplanung dient (Formular `Forms 0`).
*   **Verknüpfung:** Die Daten aus dem Formular werden zunächst an die Tabelle `T00` übermittelt, in der sie räumlich sortiert und strukturiert werden. Von dort aus gelangen sie in einem durchgängigen, automatisierten Prozess in die Tabelle `T02`.

### 📥 1. Planungsschleife (`Forms 0` ➔ `T06_TAKT_MASTER_SCHEDULE`)
*   **Aktion:** Der verantwortliche Ingenieur erfasst die Abfolge der gewerkspezifischen Takt-Boxen aus den wöchentlichen Last-Planner®-System- bzw. Taktzeit-Tabellen im Baubüro über ein Smartphone-Formular; dabei nutzt er Dropdown-Listen, die vor Projektbeginn vorbereitet und in den entsprechenden Tabellen hinterlegt wurden.
*   **Verknüpfung:** Ein Skript erfasst die Daten und generiert in `T06` eine eindeutige Kennung `SCHEDULE_KEY` (`Woche|Takt|Gewerk`). Damit ist der Wochenplan elektronisch gespeichert.

### 📥 2. Logistik-Schleife (`Forms 1A` & `1B` ➔ `T08_DELIVERIES`)
*   **Aktion:** Logistiker/Lieferant meldet einen Transport (Logistik-Pass) unter Angabe des deklarierten Warenwerts in PLN/EUR an.
*   **Verknüpfung:** Die Daten werden an `T08` übermittelt. Die `XLOOKUP`-Formel validiert die E-Mail-Adresse des Lieferanten in `T05` und ruft dessen Namen ab; die Funktion `SUMIFS` ermittelt den kumulierten Warenwert in der Zone und vergleicht ihn mit den Finanzlimits aus `T02`. Bei Überschreitung des Budgets für den jeweiligen Hub erscheint in Spalte P ein numerischer Warnhinweis (Überlastungsalarm). Die Vorgänge werden mittels Hash und Zeitstempel in der Blockchain-Cloud kodiert.

### 📥 3. Rückmeldeschleife vor Ort (`Forms 3` ➔ `T10_PLAIN_PROFIT_AND_LOSS`)
*   **Aktion:** Der Vorarbeiter des Subunternehmers meldet den täglichen Arbeitsstatus für eine bestimmte Takt-Box über ein Smartphone-Formular.
*   **Verknüpfung:** Das Skript erzeugt einen Datensatz im Haupt-Ledger `T10`. Mittels einer Wildcard-Logik fragt das System den Plan `T06` basierend auf Zone und Gewerk ab und fügt automatisch die korrekte operative Kalenderwoche (`W05|...`) in den Aufgaben-Schlüssel (`TASK_KEY`) ein. Der WIP-Status in Spalte I wird automatisch auf `1` (Work in Process) gesetzt, und die Aktion wird als Hash sowie Zeitstempel in der Blockchain-Cloud kodiert.

### 📥 4. Kryptografischer Abnahmeschritt (`Forms 4` ➔ `T10_PLAIN_PROFIT_AND_LOSS`)
*   **Aktion:** Der Vorarbeiter des Subunternehmers meldet den Abschluss seines „Takts“ über ein Smartphone-Formular. Ein Ingenieur führt die technische Qualitätsabnahme des ausgeführten Takts durch und bestätigt diese in der Tabelle `T10`.
*   **Verknüpfung:** Die Cloud-Verifizierung identifiziert den passenden `TASK_KEY` in `T10`, setzt die Spalte T (`AUFGABE ABGESCHLOSSEN`) auf `TRUE`, setzt den WIP-Indikator in Spalte I (Arbeitsbereich freigegeben) auf Null und startet den SHA-256-Algorithmus; dabei wird ein unveränderlicher 64-Zeichen-Hash generiert, der die tatsächliche Marge besiegelt. Die Tabelle `T11` wird aktiviert und überträgt den PPC-Indikator über entsprechend vorbereitete Diagramme an Looker Studio.

### 📥 5. Variabilitätsmanagement-Schleife (`Forms 2` ➔ `T07_VARIABILITY_MANAGEMENT`)
*   **Aktion:** Das Auftreten einer Störung, einer Lieferverzögerung oder eines fehlenden Arbeitsbereichs wird von der Baustelle aus über ein Smartphone-Formular gemeldet.
*   **Verknüpfung:** Der Vorfall speist die Störungszentrale `T07`. Spalte L setzt mittels eines dynamischen, mehrsprachigen `XVERWEIS` (`XLOOKUP`) ein Andon-Signal (`🚨 IN ARBEIT` / `ABGESCHLOSSEN`), das im Pareto-Diagramm in Looker Studio rot leuchtet, bis der zuständige Ingenieur die Störung in Spalte M der Tabelle `T07` abschließt. Die Aktion wird als Hash und Zeitstempel in der Blockchain-Cloud kodiert.

### 📥 6. Lean-Evaluierungs- und Transformationsschleife (`Forms 5` ➔ `T09_LEAN_TRANSFORMATION_COSTS`)
*   **Aktion:** Erfassung der Kosten für die Einführung der Lean-Methodik im Investitionsprojekt (Lizenzen, Workshops, Schulungen, Beratung). Der verantwortliche Ingenieur gibt die Rechnungsdaten in das Formular auf dem Smartphone ein.
*   **Verknüpfung:** Die Daten (finanziell und statistisch) werden automatisch in die Tabelle `T09` übertragen und anschließend in Looker Studio in entsprechenden visuellen Diagrammen für die Holding-Geschäftsführung aufbereitet. Der Finanzvorgang wird mittels Hash und Zeitstempel in der Blockchain-Cloud verschlüsselt und dokumentiert.

---

## Schnellstart / Implementierungsanleitung (Quick Start)

Um Ihre eigene Instanz von **TAKTIX OS CEE** in der Google Workspace-Umgebung in Betrieb zu nehmen:

1. **Kopie der Vorlage:** Erstellen Sie eine Kopie der Haupt-Google-Tabelle in Ihrem Google Drive (einschliesslich der 8 zugehörigen Formulare: `Forms 00`, `Forms 0`, `Forms 1A`, `Forms 1B`, `Forms 2`, `Forms 3`, `Forms 4`, `Forms 5`).
2. **Grundkonfiguration (`T01_README_AND_LICENSE`):** Legen Sie die Benutzeroberflächensprache (`PL` / `DE` / `EN`), die Berichtswährung der Holding (`PLN` / `EUR`), die Margenkennzahlen sowie die WIP-Limits fest.
3. **Skriptkonfiguration (`Code.gs`):** Öffnen Sie den Editor über **Erweiterungen ➔ Apps Script**, fügen Sie den Inhalt der Datei `Code.gs` ein und ersetzen Sie die Platzhalter für die Formular-IDs (`form0Id`, `form1AId_Unique`, `form1BId`, `form2Id`, `form3Id`, `form4Id`) durch die tatsächlichen IDs Ihrer kopierten Google-Formulare.
4. **Synchronisierung und Trigger:** Führen Sie einmalig die Funktion `runNativeFormUpdate` aus (und erteilen Sie dabei die erforderlichen Berechtigungen für das Skript). Richten Sie anschliessend die entsprechenden Trigger ein (zeitgesteuert oder ereignisbasiert: `Bei Bearbeitung` für `onEdit` sowie `Bei Formularübermittlung` für `runNativeFormUpdate`).

---

## ⚖️ Lizenz & Urheberrecht

Die Software ist unter den Bedingungen der **GNU General Public License v3 (GPL v3)** verfügbar.

* Dies stellt sicher, dass das System für die Ingenieurs-Community frei und kostenlos bleibt.
* Die Einbindung des Quellcodes von **TAKTIX OS** (einschliesslich des Skripts `Code.gs` sowie der Formelarchitektur) in kommerzielle Systeme verpflichtet dazu, den Quellcode der übergeordneten Software unter denselben Lizenzbedingungen vollständig offenzulegen.
* Zudem muss im Hauptverzeichnis des GitHub-Repositorys eine Datei namens `LICENSE` hinzugefügt werden, die den vollständigen Text der GNU GPL v3.0-Lizenz enthält.

*Copyright (c) 2026 by Robert Szczepaniak. All rights reserved.*

---
---

## 🇬🇧 English Version

An enterprise-grade, zero-maintenance operating system prototype dedicated to production and logistics management in building and infrastructure construction. Built upon **Last Planner® System (LPS®)**, **Takt Time Planning**, and **Project Production Management (PPM)** methodologies according to the principles of the Project Production Institute.

The system implements the **"Information Monolith"** concept, eliminating traditional Excel spreadsheets in favor of automated, cryptographically secured relational loops within **Google Workspace (Sheets, Forms, Apps Script) & Looker Studio**.

*An Open Source alternative built on **Nextcloud** is currently under development.*

---

## Complete System Architecture (15 Core Tables)

The system is built upon interconnected registers (*Single Source of Truth*):

* **`T00_LOCALISATION`** — Central token dictionary and automatic translator for the entire interface (PL/DE/EN). *Hidden table.*
* **`T00_SPATIAL_CONFIG`** — Central dictionary of takts, sections, logistics hubs, project levels, and **assigned delivery gates** for site logistics. *Hidden table.*
* **`T01_README_AND_LICENSE`** — Main project control panel: language selection, reporting currency selection (PLN/EUR), FOREX exchange rate converter, margin parameters, and Work in Process (**WIP**) limits for individual trades and the entire project.
* **`T02_TAKT_MATRIX`** — Dictionary of unloading zones and Takt-Boxes with built-in capital storage limits `[Max]` expressed in the project's base currency, tracking current limit reserves.
* **`T03_PRODUCTION_FLOW_DICTIONARY`** — Register of trade codes, multilingual scope descriptions, and front-of-work readiness criteria (*Make-Ready*).
* **`T04_LOGISTICS_SLOTS_DICTIONARY`** — Register of delivery time slots for material deliveries to takts defined in `T02`, general on-site storage areas, or external off-site logistics hubs.
* **`T05_CONTRACTS_REGISTER`** — Central register of contracts, digital identities of the General / Main Contractor (`MAI`), Subcontractors (`SUB`), Suppliers (`SUP`), cost centers, and contract values.
* **`T06_TAKT_MASTER_SCHEDULE`** — Active schedule of the Site Engineer generating dynamic schedule keys (`SCHEDULE_KEY`) and cycle times based on *Last Planner® System* and *Takt Time* tables. The digital master production plan.
* **`T07_VARIABILITY_MANAGEMENT`** — Incident command center monitoring financial waste, downtime, and Andon resolution statuses (`🚨 IN PROGRESS` / `CLOSED`), secured with a SHA-256 checksum.
* **`T08_DELIVERIES`** — Delivery register featuring an automated material hub overflow radar (`HDR_HUB_STATUS`) and a cryptographically locked **Logistics Passport generator (e-mail + Token ID + assigned gate)**.
* **`T09_LEAN_TRANSFORMATION_COSTS`** — Protocol and cost register of activities aimed at implementing Lean methodology on the construction project (secured with a SHA-256 hash).
* **`T10_PLAIN_PROFIT_AND_LOSS`** — Main holding operational and financial ledger linking `MAI–SUB` hierarchies, daily and weekly progress reports, logistics costs, and variability costs; double-locked (quality sign-off + payment release) and anchored with a SHA-256 / OpenTimestamps checksum.
* **`T11_WEEKLY_BOX_SCORE`** — Automated Lean process stability calculator computing the actual **PPC %** (*Percent Plan Complete*) alongside weekly revenues, costs, and margins.
* **`T12_GLOBAL_BOX_SCORE`** — Global executive overview of bottlenecks, **WIP Congestion** indicators, and strategic financial commitment across contracts.
* **`T13_WIP_DAILY_MONITOR`** — Daily monitor of Work in Process (**WIP**) volume for the entire project and each trade based on permissible WIP limits defined in `T01`.

---

## Data Flow & Automation Loops (`Code.gs`)

The system eliminates manual data entry through **7 automated information exchange loops**, controlled by the cloud script `Code.gs`:

### 📥 0. Spatial Configuration Loop (`Forms 00` ➔ `T00_SPATIAL_CONFIG` ➔ `T02_TAKT_MATRIX`)
* **Action:** Prior to project kickoff, the responsible Site Engineer defines all takts across all building levels using a smartphone form with pre-configured dropdown lists. This step requires careful spatial zoning by the management teams of all participating stakeholders applying systems thinking. Additionally, financial storage limits for materials/equipment and **dedicated delivery gates** are assigned.
* **Connection:** Form entries are routed first to the hidden `T00_SPATIAL_CONFIG` table, which sorts and organizes them spatially, and then automatically populates `T02_TAKT_MATRIX` as the foundation for takt planning.

### 📥 1. Weekly Planning Loop (`Forms 0` ➔ `T06_TAKT_MASTER_SCHEDULE`)
* **Action:** The responsible engineer records the weekly sequence of trade Takt-Boxes (from *Last Planner® System* / *Takt Time* site boards) via smartphone form.
* **Connection:** The script captures the input and generates a unique `SCHEDULE_KEY` (`Week|Takt|Trade`) in `T06`. From this moment on, the weekly production plan is digitally locked and used to automatically match field reports.

### 📥 2. Logistics & Gate Control Loop (`Forms 1A & 1B` ➔ `T08_DELIVERIES`)
* **Action:** The supplier/logistics coordinator books a delivery slot via **Forms 1A** with the declared cargo value (PLN/EUR), while gate security manages physical arrival verification via **Forms 1B**.
* **Connection:** Data flows into `T08`. `XLOOKUP` verifies the supplier's e-mail in `T05` to retrieve their company name, while `SUMIFS` checks cumulative cargo value in the zone against limits from `T02`. Upon slot approval (`STAT_BOOKED`), `Code.gs` automatically fetches the assigned delivery gate from `T00_SPATIAL_CONFIG` and sends a multilingual **Logistics Passport (e-mail + Token ID)**, anchored with SHA-256 and OpenTimestamps.

### 📥 3. Field Reporting Loop (`Forms 3` ➔ `T10_PLAIN_PROFIT_AND_LOSS`)
* **Action:** The subcontractor's foreman reports daily percentage progress on a specific Takt-Box via smartphone form (selecting the takt via *Multiple Choice* buttons and the trade code via *Dropdown*).
* **Connection:** The script creates a record in the main ledger `T10`, linking subcontractors (`SUB`) to their parent contractor (`MAI`) in Column `Z`. Based on zone and trade, the system queries `T06` and automatically injects the active operational week number (`W05|...`) into the `TASK_KEY`. The WIP indicator in Column `I` rises to `1` (work in progress), and the entry is cryptographically secured.

### 📥 4. Cryptographic Sign-Off Loop (`Forms 4` ➔ `T10_PLAIN_PROFIT_AND_LOSS`)
* **Action:** The foreman reports takt completion via smartphone form, and the Site Engineer performs technical quality verification with acceptance in `T10`.
* **Connection:** Cloud verification locates the matching `TASK_KEY` in `T10`, sets Quality Acceptance (`Column T`) to `TRUE`, resets the WIP indicator in Column `I` to `0` (zone released), and upon payment release (`Column U`) triggers the **SHA-256 / OpenTimestamps** algorithm, generating a 64-character immutable hash sealing the actual margin. `T11` updates simultaneously, feeding PPC metrics into Looker Studio dashboards.

### 📥 5. Variability Management Loop (`Forms 2` ➔ `T07_VARIABILITY_MANAGEMENT`)
* **Action:** Breakdowns, delivery delays, or lack of work front readiness are reported directly from the construction site via smartphone form.
* **Connection:** The incident feeds the `T07` command center. A multilingual status mechanism raises an Andon flag (`🚨 IN PROGRESS` / `CLOSED`), highlighted in red on the Looker Studio Pareto chart until the responsible engineer closes the issue in Column `M` of `T07` (triggering a local or external SHA-256 seal).

### 📥 6. Lean Evaluation & Transformation Loop (`Forms 5` ➔ `T09_LEAN_TRANSFORMATION_COSTS`)
* **Action:** The responsible engineer logs Lean implementation costs (licenses, workshops, training, consulting) via smartphone form.
* **Connection:** Financial and statistical data are automatically ingested into `T09` and visualized in executive Looker Studio reports. Each cost record is secured with a SHA-256 checksum.

---

## Quick Start / Deployment Guide

To deploy your own instance of **TAKTIX OS CEE** in Google Workspace:

1. **Copy the Template:** Make a copy of the master Google Sheet in your Google Drive (along with the linked forms: `Forms 00`, `Forms 0`, `Forms 1A`, `Forms 1B`, `Forms 2`, `Forms 3`, `Forms 4`, `Forms 5`).
2. **Core Configuration (`T01_README_AND_LICENSE`):** Select your interface language (`PL` / `DE` / `EN`), holding reporting currency (`PLN` / `EUR`), margin parameters, and WIP limits.
3. **Script Setup (`Code.gs`):** Open **Extensions ➔ Apps Script**, paste `Code.gs`, and replace the form ID placeholders (`form0Id`, `form1AId_Unique`, `form1BId`, `form2Id`, `form3Id`, `form4Id`) with your own copied Google Form IDs.
4. **Sync & Triggers:** Run `runNativeFormUpdate` once to authorize script permissions, then configure event triggers (`On edit` for `onEdit` and `On form submit` for `runNativeFormUpdate`).

---

## ⚖️ License & Copyright

This software is distributed under the **GNU General Public License v3.0 (GPL-3.0)**.

* This guarantees that the system remains free and open for the engineering community.
* Any incorporation of **TAKTIX OS** source code (including the `Code.gs` script and formula architecture) into proprietary commercial systems requires the complete source code of the parent software to be released under the same license terms.

*Copyright (c) 2026 by Robert Szczepaniak. All rights reserved.*
