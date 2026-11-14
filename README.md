# taktix-os-cee
Core engine for PL/DE construction investments
# 🎛️ TAKTIX OS — Central Production & Logistics Matrix Engine [CEE Region]

---
### 🌐 Language / Sprache
*   [🇵🇱 Przejdź do wersji polskiej](#-wersja-polska)
*   [🇦🇹 Zur deutschen Version springen](#-deutsche-version)
*   [🇬🇧 Jump to English Version](#-english-version)
---
---

## 🇵🇱 Wersja Polska

TAKTIX OS CEE — prototyp bezobsługowego systemu operacyjnego klasy Enterprise do zarządzania produkcją i logistyką w budownictwie kubaturowym oraz infrastrukturalnym. Oparty na metodyce **`Last Planner® System (LPS®)`**, **`Takt Time Planning`** (Planowanie Taktowe) oraz **`Project Production Management (PPM)`** według standardów Project Production Institute.

System realizuje ideę **"Monolitu Informacyjnego"**, eliminując rozproszone raporty arkuszowe na rzecz automatycznych, kryptograficznie zabezpieczonych (SHA-256 / OpenTimestamps) pętli relacyjnych w ekosystemie **`Google Workspace (Sheets, Forms, Apps Script) & Looker Studio`**. 

Wersja CEE zapewnia natywną obsługę wielojęzyczną (PL / DE / EN) oraz wielowalutową (PLN / EUR).

*Alternatywą dla środowiska chmurowego Google jest wariant Open Source oparty na Nextcloud (obecnie w fazie opracowania).*

---

## 🏗️ Kompletna Architektura Systemu (15 Tabel Rdzenia)

System opiera się na strukturze powiązanych rejestrów (Single Source of Truth):
*   **`T00_LOCALISATION`** — Centralny słownik tokenów i automatyczny tłumacz całego interfejsu (PL/DE). Tabela ukryta.
*   **`T00_SPATIAL_CONFIG`** - Centralny słownik taktów, sekcji, hubów magazynowych i poziomów inwestycji (tabela przejściowa, organizująca). Tabela ukryta.
*   **`T01_README_AND_LICENSE`** — Główny panel sterowania projektem, wybór języka, wybór waluty (PLN/EUR) i przelicznik kursowy FOREX oraz ustawienie maksymalnej ilości prac w toku (WIP - Work in Process) dla poszczególnych branż i całej inwestycji. Ponadto definiowane są tutaj marże Generalnego Wykonawcy i developera.
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

### 📥 0. Pętla Konfiguracji Przestrzennej (`Forms 00` ➔ `T00_SPATIAL_CONFIG` ➔ `T02_TAKT_MATRIX`)
* **Akcja:** Przed rozpoczęciem inwestycji odpowiedzialny inżynier definiuje w formularzu na smartfonie wszystkie takty na wszystkich poziomach obiektu, korzystając z przygotowanych list rozwijanych. Zadanie to wymaga starannego podziału inwestycji na sekcje w gronie kadry zarządzającej wszystkich stron uczestniczących z zastosowaniem myślenia systemowego. Dodatkowo określane są finansowe limity składowania materiałów i sprzętu w poszczególnych taktach/hubach oraz przypisane do nich **bramy wjazdowe (Delivery Gates)**.
* **Powiązanie:** Dane z formularza trafiają najpierw do ukrytej tabeli `T00_SPATIAL_CONFIG`, która sortuje i porządkuje je przestrzennie, a następnie zasila tabelę `T02_TAKT_MATRIX`, stanowiącą fundament planowania taktowego.

### 📥 1. Pętla Planowania Tygodniowego (`Forms 0` ➔ `T06_TAKT_MASTER_SCHEDULE`)
* **Akcja:** Odpowiedzialny inżynier zapisuje cotygodniową sekwencję branżowych Takt-Boxów (z tablic *Last Planner® System* / *Takt Time* w biurze budowy) za pomocą formularza na smartfonie.
* **Powiązanie:** Skrypt przechwytuje dane i generuje w `T06` unikalny identyfikator `SCHEDULE_KEY` (`Tydzień|Takt|Branża`). Od tego momentu plan tygodniowy jest zapisany elektronicznie i służy do automatycznego parowania raportów terenowych.

### 📥 2. Pętla Logistyczna i Kontroli Bram (`Forms 1A & 1B` ➔ `T08_DELIVERIES`)
* **Akcja:** Dostawca/logistyk zgłasza transport przez **Forms 1A** wraz z deklarowaną wartością ładunku (PLN/EUR), natomiast portier na bramie wjazdowej obsługuje weryfikację fizycznego wjazdu przez **Forms 1B**.
* **Powiązanie:** Dane trafiają do `T08`. Formuła `XLOOKUP` weryfikuje adres e-mail dostawcy w `T05` i pobiera jego nazwę, a `SUMIFS` sprawdza skumulowaną wartość towaru w strefie względem limitów z `T02`. Po zatwierdzeniu slotu (`STAT_BOOKED`) skrypt `Code.gs` automatycznie pobiera przypisaną bramę wjazdową z `T00_SPATIAL_CONFIG` i wysyła wielojęzyczny **Paszport Logistyczny (e-mail + Token ID)**, ryglowany sumą SHA-256 i znacznikiem czasu w chmurze OpenTimestamps.

### 📥 3. Pętla Meldowania Terenowego (`Forms 3` ➔ `T10_PLAIN_PROFIT_AND_LOSS`)
* **Akcja:** Brygadzista wykonawcy (zarówno `MAI`, jak i podwykonawcy `SUB`) melduje codzienny postęp procentowy robót na konkretnym Takt-Boxie za pomocą formularza na smartfonie (wybierając takt przyciskami *Multiple Choice* oraz kod branży z listy *Dropdown*).
* **Powiązanie:** Skrypt generuje rekord w głównym ledgerze `T10`, łącząc podwykonawcę z jego firmą-matką (`MAI`) w kolumnie `Z`. Na podstawie strefy i branży system odpytuje harmonogram `T06` i automatycznie wstrzykuje do klucza zadania (`TASK_KEY`) właściwy numer tygodnia operacyjnego (`W05|...`). Wskaźnik WIP w kolumnie `I` podnosi się do poziomu `1` (praca w toku), a wpis zostaje zabezpieczony kryptograficznie.

### 📥 4. Pętla Kryptograficznego Odbioru (`Forms 4` ➔ `T10_PLAIN_PROFIT_AND_LOSS`)
* **Akcja:** Brygadzista raportuje zakończenie swojego taktu przez formularz na smartfonie, a inżynier dokonuje technicznego odbioru jakościowego z akceptacją w tabeli `T10`.
* **Powiązanie:** Skrypt odnajduje pasujący `TASK_KEY` w `T10`, przestawia odbiór jakościowy (`Kolumna T`) na `TRUE`, zeruje wskaźnik WIP w kolumnie `I` (front zwolniony) i po odblokowaniu płatności (`Kolumna U`) uruchamia algorytm **SHA-256 / OpenTimestamps**, generując 64-znakowy hash pieczętujący marżę rzeczywistą. Jednocześnie aktualizowana jest tabela `T11`, przekazując wskaźnik PPC do dashboardów w Looker Studio.

### 📥 5. Pętla Zarządzania Zmiennością (`Forms 2` ➔ `T07_VARIABILITY_MANAGEMENT`)
* **Akcja:** Wystąpienie awarii, opóźnienia dostawy lub braku frontu robót jest zgłaszane bezpośrednio z placu budowy przez formularz na smartfonie.
* **Powiązanie:** Incydent zasila centralę awarii `T07`. Wielojęzyczny mechanizm statusów podnosi flagę Andon (`🚨 W TOKU` / `ZAMKNIĘTY` / `GESCHLOSSEN`), widoczną na wykresie Pareto w Looker Studio, dopóki odpowiedzialny inżynier nie zamknie usterki w kolumnie `M` tabeli `T07` (co uruchamia lokalną lub zewnętrzną pieczęć SHA-256).

### 📥 6. Pętla Ewaluacji i Transformacji Lean (`Forms 5` ➔ `T09_LEAN_TRANSFORMATION_COSTS`)
* **Akcja:** Odpowiedzialny inżynier rejestruje przez formularz na smartfonie koszty wdrożenia metodyki Lean na inwestycji (licencje, warsztaty, szkolenia, doradztwo).
* **Powiązanie:** Dane finansowe i statystyczne trafiają automatycznie do tabeli `T09`, skąd są wizualizowane w raportach zarządczych w Looker Studio. Każdy rekord kosztowy zostaje zabezpieczony sumą kontrolną SHA-256.
  
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
---

## 🇦🇹 Deutsche Version

TAKTIX OS CEE – ein Prototyp eines autonomen Betriebssystems der Enterprise-Klasse für das Produktions- und Logistikmanagement im Hoch- und Infrastrukturbau. Es basiert auf der Methodik des **`Last Planner® Systems (LPS®)`**, der **`Takt Time Planning`**-Methode (Taktplanung) sowie dem **`Project Production Management (PPM)`** gemäß den Standards des Project Production Institute.

Das System verfolgt den Ansatz eines **"Informationsmonolithen“** und ersetzt verstreute Tabellenkalkulationsberichte durch automatisierte, kryptografisch abgesicherte (SHA-256 / OpenTimestamps) relationale Datenkreisläufe innerhalb des Ökosystems **`Google Workspace (Sheets, Forms, Apps Script) & Looker Studio`**.

Die CEE-Version bietet native Unterstützung für mehrere Sprachen (PL / DE / EN) sowie Währungen (PLN / EUR).

*Als Alternative zur Google-Cloud-Umgebung ist eine Open-Source-Variante auf Basis von Nextcloud in Entwicklung.*

---

### 🏗️ Komplette Systemarchitektur (Die 15 Tabellen des Kerns)

*   **`T00_LOCALISATION`** — Zentrales Token-Wörterbuch und automatischer Interface-Übersetzer (PL/DE). Ausgeblendete Tabelle.
*   **`T00_SPATIAL_CONFIG`** – Zentrales Verzeichnis von Takten, Sektionen, Lager-Hubs und Investitionsebenen (Zwischen- bzw. Organisationstabelle). Ausgeblendete Tabelle.
*   **`T01_README_AND_LICENSE`** — Zentrale Projektsteuerung, Sprach- und Währungsauswahl (PLN/EUR) sowie FOREX-Wechselkursumrechnung und Festlegung der maximalen Anzahl laufender Arbeiten (WIP – Work in Process) für die einzelnen Gewerke und das Gesamtprojekt. Zudem werden hier die Margen des Generalunternehmers und des Developers festgelegt.
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

### 📥 0. Konfigurationsschleife für die räumliche Struktur (`Forms 00` ➔ `T00_SPATIAL_CONFIG` ➔ `T02_TAKT_MATRIX`)
* **Aktion:** Vor Beginn des Bauvorhabens definiert der verantwortliche Ingenieur über ein Formular auf seinem Smartphone sämtliche Takte auf allen Ebenen des Objekts, wobei er auf vordefinierte Dropdown-Listen zurückgreift. Diese Aufgabe erfordert eine sorgfältige Unterteilung des Bauvorhabens in Abschnitte, die unter Anwendung systemischen Denkens gemeinsam mit dem Management aller beteiligten Parteien erarbeitet wird. Zudem werden finanzielle Obergrenzen für die Lagerung von Materialien und Ausrüstung in den jeweiligen Takten bzw. Hubs festgelegt sowie die zugehörigen **Zufahrtstore (Delivery Gates)** zugewiesen.
* **Verknüpfung:** Die Daten aus dem Formular fliessen zunächst in eine ausgeblendete Tabelle (`T00_SPATIAL_CONFIG`), in der sie räumlich sortiert und strukturiert werden. Anschliessend dienen sie als Grundlage für die Tabelle `T02_TAKT_MATRIX`, die das Fundament der Taktplanung bildet.

### 📥 1. Schleife der Wochenplanung (`Forms 0` ➔ `T06_TAKT_MASTER_SCHEDULE`)
* **Aktion:** Der zuständige Ingenieur erfasst die wöchentliche Abfolge der gewerkespezifischen Takt-Boxen (basierend auf den *Last Planner® System*- / *Takt Time*-Tafeln im Baubüro) über ein Formular auf seinem Smartphone.
* **Verknüpfung:** Ein Skript erfasst die Daten und generiert in `T06` einen eindeutigen Identifikator, den `SCHEDULE_KEY` (bestehend aus `Woche|Takt|Gewerke`). Ab diesem Zeitpunkt ist der Wochenplan digital hinterlegt und dient der automatischen Zuordnung von Baustellenberichten.

### 📥 2. Logistik- und Tor-Kontrollschleife (`Forms 1A & 1B` ➔ `T08_DELIVERIES`)
* **Ablauf:** Der Lieferant bzw. Logistikdienstleister meldet den Transport über **Forms 1A** an und gibt dabei den deklarierten Wert der Ladung (in PLN/EUR) an; das Personal am Werktor verifiziert die tatsächliche Einfahrt mittels **Forms 1B**.
* **Verknüpfung:** Die Daten werden in `T08` übertragen. Eine `XLOOKUP`-Formel gleicht die E-Mail-Adresse des Lieferanten mit `T05` ab, um dessen Namen zu ermitteln; zudem prüft eine `SUMIFS`-Funktion den kumulierten Warenwert in der Zone im Hinblick auf die in `T02` festgelegten Grenzwerte. Nach der Bestätigung des Zeitfensters (`STAT_BOOKED`) ruft das Skript `Code.gs` automatisch das zugewiesene Einfahrtstor aus `T00_SPATIAL_CONFIG` ab und versendet einen mehrsprachigen **Logistik-Pass (E-Mail + Token-ID)**. Dieser ist durch eine SHA-256-Prüfsumme sowie einen Zeitstempel im OpenTimestamps-Cloud-Dienst abgesichert.

### 📥 3. Rückmeldeschleife für den Baustellenfortschritt (`Forms 3` ➔ `T10_PLAIN_PROFIT_AND_LOSS`)
* **Aktion:** Der Vorarbeiter des Ausführenden (sowohl des Hauptunternehmens `MAI` als auch eines Subunternehmers `SUB`) meldet den täglichen prozentualen Baufortschritt in einem bestimmten Taktbereich („Takt-Box“) über ein Formular auf seinem Smartphone (wobei der Takt mittels *Multiple-Choice*-Schaltflächen und der Gewerk-Code über ein *Dropdown*-Menü ausgewählt werden).
* **Verknüpfung:** Das Skript erstellt einen Datensatz im Haupt-Ledger `T10` und verknüpft den Subunternehmer in Spalte `Z` mit seinem übergeordneten Hauptunternehmen (`MAI`). Basierend auf dem Bereich und dem Gewerk greift das System auf den Terminplan `T06` zu und fügt automatisch die korrekte operative Kalenderwoche (z. B. `W05|...`) in den Aufgabenschlüssel (`TASK_KEY`) ein. Der WIP-Indikator (Work-in-Progress) in Spalte `I` wird auf `1` gesetzt, und der Eintrag wird kryptografisch abgesichert.

### 📥 4. Kryptografischer Abnahmeprozess (`Forms 4` ➔ `T10_PLAIN_PROFIT_AND_LOSS`)
* **Aktion:** Der Vorarbeiter meldet den Abschluss seines Arbeitstaktes über ein Formular auf seinem Smartphone; anschließend erfolgt durch einen Ingenieur die technische Qualitätsabnahme, die in der Tabelle `T10` dokumentiert wird.
* **Verknüpfung:** Ein Skript identifiziert den entsprechenden `TASK_KEY` in der Tabelle `T10`, setzt die Qualitätsabnahme (Spalte `T`) auf `TRUE` und setzt den WIP-Indikator in Spalte `I` zurück (Arbeitsbereich freigegeben). Nach der Freigabe der Zahlung (Spalte `U`) wird der Algorithmus **SHA-256 / OpenTimestamps** ausgeführt, wodurch ein 64-stelliger Hash-Wert generiert wird, der die tatsächliche Marge kryptografisch versiegelt. Parallel dazu wird die Tabelle `T11` aktualisiert, um den PPC-Indikator an die Dashboards in Looker Studio zu übertragen.

### 📥 5. Variabilitätsmanagement-Schleife (`Forms 2` ➔ `T07_VARIABILITY_MANAGEMENT`)
* **Aktion:** Das Auftreten einer Störung, einer Lieferverzögerung oder eines fehlenden Arbeitsbereichs wird direkt von der Baustelle aus über ein Formular auf dem Smartphone gemeldet.
* **Verknüpfung:** Der Vorfall fließt in die zentrale Störungsverwaltung `T07` ein. Ein mehrsprachiger Statusmechanismus aktiviert ein „Andon-Signal“ (`🚨 IN BEARBEITUNG` / `ABGESCHLOSSEN`), das im Pareto-Diagramm in Looker Studio sichtbar ist. Dies bleibt bestehen, bis der zuständige Ingenieur den Vorfall in Spalte `M` der Tabelle `T07` als abgeschlossen markiert (was wiederum einen lokalen oder externen SHA-256-Hash-Stempel auslöst).

### 📥 6. Lean-Evaluierungs- und Transformationsschleife (`Forms 5` ➔ `T09_LEAN_TRANSFORMATION_COSTS`)
* **Aktion:** Der verantwortliche Ingenieur erfasst über ein Formular auf seinem Smartphone die Kosten für die Implementierung der Lean-Methodik im Investitionsprojekt (Lizenzen, Workshops, Schulungen, Beratung).
* **Verknüpfung:** Finanz- und Statistikdaten fliessen automatisch in die Tabelle `T09` ein, von wo aus sie in Managementberichten in Looker Studio visualisiert werden. Jeder Kostendatensatz wird mittels einer SHA-256-Prüfsumme abgesichert.

---

## Schnellstart / Implementierungsanleitung (Quick Start)

Um Ihre eigene Instanz von **TAKTIX OS CEE** in der Google Workspace-Umgebung in Betrieb zu nehmen:

1. **Kopie der Vorlage:** Erstellen Sie eine Kopie der Haupt-Google-Tabelle in Ihrem Google Drive (einschliesslich der 8 zugehörigen Formulare: `Forms 00`, `Forms 0`, `Forms 1A`, `Forms 1B`, `Forms 2`, `Forms 3`, `Forms 4`, `Forms 5`).
2. **Grundkonfiguration (`T01_README_AND_LICENSE`):** Legen Sie die Benutzeroberflächensprache (`PL` / `DE` / `EN`), die Berichtswährung der Holding (`PLN` / `EUR`), die Margenkennzahlen sowie die WIP-Limits fest.
3. **Skriptkonfiguration (`Code.gs`):** Öffnen Sie den Editor über **Erweiterungen ➔ Apps Script**, fügen Sie den Inhalt der Datei `Code.gs` ein und ersetzen Sie die Platzhalter für die Formular-IDs (`form0Id`, `form1AId_Unique`, `form1BId`, `form2Id`, `form3Id`, `form4Id`) durch die tatsächlichen IDs Ihrer kopierten Google-Formulare.
4. **Synchronisierung und Trigger:** Führen Sie einmalig die Funktion `runNativeFormUpdate` aus (und erteilen Sie dabei die erforderlichen Berechtigungen für das Skript). Richten Sie anschliessend die entsprechenden Trigger ein (zeitgesteuert oder ereignisbasiert: `On edit` für `onEdit` sowie `On form submit` für `runNativeFormUpdate`).

---

## ⚖️ Lizenz & Urheberrecht

Die Software ist unter den Bedingungen der **GNU General Public License v3 (GPL v3)** verfügbar.

* Dies stellt sicher, dass das System für die Ingenieurs-Community frei und kostenlos bleibt.
* Die Einbindung des Quellcodes von **TAKTIX OS** (einschliesslich des Skripts `Code.gs` sowie der Formelarchitektur) in kommerzielle Systeme verpflichtet dazu, den Quellcode der übergeordneten Software unter denselben Lizenzbedingungen vollständig offenzulegen.
* Zudem muss im Hauptverzeichnis des GitHub-Repositorys eine Datei namens `LICENSE` hinzugefügt werden, die den vollständigen Text der GNU GPL v3.0-Lizenz enthält.

*Copyright (c) 2026 by Robert Szczepaniak. All rights reserved.*

---
---
---

## 🇬🇧 English Version

TAKTIX OS CEE – An enterprise-grade, zero-maintenance operating system prototype dedicated to production and logistics management in building and infrastructure construction. Built upon **`Last Planner® System (LPS®)`**, **`Takt Time Planning`**, and **`Project Production Management (PPM)`** methodologies according to the principles of the Project Production Institute.

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
* The project should also include a `LICENSE` file containing the full text of the GNU GPL v3.0 license in the root directory of the GitHub repository.

*Copyright (c) 2026 by Robert Szczepaniak. All rights reserved.*
