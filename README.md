# taktix-os-cee
Core engine for PL/DE construction investments
# 🎛️ TAKTIX OS — Central Production & Logistics Matrix Engine [CEE Region]

---
### 🌐 Language / Sprache
*   [🇵🇱 Przejdź do wersji polskiej](#-wersja-polska)
*   [🇦🇹 Zur deutschen Version springen](#-deutsche-version)
---

## 🇵🇱 Wersja Polska
Prototyp bezobsługowego systemu klasy Enterprise dedykowany do zarządzania produkcją i logistyką w budownictwie kubaturowym lub infrastrukturalnym na bazie metodyki **LPS (Last Planner® System)**, **Takt Time Planning (Planowanie Taktowe)** oraz **Project Production (Produkcja Budowlana)** według zasad Projekt Production Institute. 

System realizuje ideę "Monolitu Informacyjnego", eliminując tradycyjne raporty Excela na rzecz automatycznych, kryptograficznie zabezpieczonych pętli relacyjnych w chmurze Google Apps Script & Looker Studio.

---

## 🏗️ Kompletna Architektura Systemu (13 Tabel Jądra)

System opiera się na strukturze powiązanych rejestrów (Single Source of Truth):
*   **T00_LOCALISATION** — Centralny słownik tokenów i automatyczny tłumacz całego interfejsu (PL/EN/DE). Tabela ukryta.
*   **T01_README_AND_LICENSE** — Główny panel sterowania projektem, wybór języka, wybór waluty (PLN/EUR) i przelicznik kursowy FOREX oraz ustawienie maksymalnej ilości prac w toku (WIP - Work in Process) dla poszczególnych branż i całej inwestycji.
*   **T02_TAKT_MATRIX** — Słownik stref rozładunkowych i Takt-Boxów z wbudowanym limitem składowania kapitału [Max] wyrażonym w walucie bazowej projektu.
*   **T03_PRODUCTION_INTERFACES** — Rejestr kodów branżowych, dwujęzycznych opisów zakresu prac oraz kryteriów wejścia na front robót.
*   **T04_LOGISTICS_SLOTS_DICTIONARY** — Rejestr okien czasowych dla dostaw materiałowych do zdefiniowanych w 'T02' taktów, ogólnych miejsc składowania na terenie budowy lub zewnętrznych hubów magazynowych.
*   **T05_CONTRACTS_REGISTER** — Centralny rejestr umów, tożsamości cyfrowych generalnego wykonawcy (MAI), podwykonawców (SUB), dostawców (SUP) oraz sum kontraktowych.
*   **T06_TAKT_MASTER_SCHEDULE** — Harmonogram główny inżyniera kontraktu generujący dynamiczne klucze planu (`SCHEDULE_KEY`) i czasy cykli. Digitalny centralny plan pracy.
*   **T07_VARIABILITY_MANAGEMENT** — Centrala awarii, monitorująca marnotrawstwo finansowe, przestoje oraz statusy Andon (`🚨 W TOKU` / `ZAMKNIĘTY`).
*   **T08_DELIVERIES** — Rejestr dostaw z automatycznym radarem przepełnienia logistycznego hubów materiałowych (`HDR_HUB_STATUS`).
*   **T09_LEAN_TRANSFORMATION_COSTS** — Protokół działań, mających na celu wprowadzenie metodyki lean do inwestycji.
*   **T10_PLAIN_PROFIT_AND_LOSS** — Główny ledger finansowy holdingu, zapis codziennych i cotygodniowych raportów, podwójnie ryglowany i zamykany sumą kontrolną SHA-256.
*   **T11_WEEKLY_BOX_SCORE** — Automatyczny kalkulator wskaźnika stabilności procesów Lean (wyliczający rzeczywisty wynik **PPC %**).
*   **T12_GLOBAL_BOX_SCORE** — Globalne zestawienie zatorów, wskaźników WIP Congestion oraz finansowego zaangażowania budowy.

---

## ⚙️ Krwioobieg Danych (Relacje Formularze ➔ Tabele)

System eliminuje ręczne wprowadzanie danych poprzez pętle wymiany informacji, sterowane przez skrypt chmurowy `Code.gs`:

### 📥 1. Pętla Planowania (Forms 0 ➔ T06_TAKT_MASTER_SCHEDULE)
*   **Akcja:** Odpowiedzialny inżynier zapisuje sekwencję branżowych Takt-Boxów z cotygodniowych tabel Last Planner® System / Takt Time w biurze budowy w formularzu na smartfonie.
*   **Powiązanie:** Skrypt przechwytuje dane i generuje w `T06` unikalny identyfikator `SCHEDULE_KEY` (`Tydzień|Takt|Branża`). Od tej pory plan tygodniowy jest zapisany elektronicznie.

### 📥 2. Pętla Logistyczna (Forms 1A & 1B ➔ T08_DELIVERIES)
*   **Akcja:** Logistyk/Dostawca zgłasza transport (Paszport Logistyczny) wraz z deklarowaną wartością finansową ładunku w PLN/EUR.
*   **Powiązanie:** Dane trafiają do `T08`. Formuła `XLOOKUP` weryfikuje adres e-mail dostawcy w `T05`, pobiera jego ludzką nazwę, a funkcja `SUMIFS` sprawdza skumulowaną wartość towaru w strefie i porównuje ją z limitami finansowymi z `T02`. W przypadku przekroczenia budżetu, w kolumnie P zapala się numeryczny alert przepełnienia. Akcje są kodowane w hash i timestamp w chmurze blockchain.

### 📥 3. Pętla Meldowania Terenowego (Forms 3 ➔ T10_PLAIN_PROFIT_AND_LOSS)
*   **Akcja:** Brygadzista podwykonawcy melduje codzienny status robót na konkretnym Takt-Boxie przez formularz na smartfonie.
*   **Powiązanie:** Skrypt generuje rekord w głównym ledgerze `T10`. Za pomocą bezpiecznika Wildcard, system odpytuje plan `T06` na podstawie strefy i branży, automatycznie wstrzykując do klucza zadania (`TASK_KEY`) właściwy numer tygodnia operacyjnego (`W05|...`). Stan WIP w kolumnie I automatycznie podnosi się do poziomu `1` (praca w toku), a akcja jest kodowana w hash i timestamp w chmurze blockchain.

### 📥 4. Pętla Kryptograficznego Odbioru (Forms 4 ➔ T10_PLAIN_PROFIT_AND_LOSS)
*   **Akcja:** Brygadzista podwykonawcy raportuje zakończenie swojego 'taktu'. Inżynier dokonuje technicznego odbioru jakościowego wykonanego taktu z akceptacją w tabeli 'T10'.
*   **Powiązanie:** Weryfikacja w chmurze odnajduje pasujący `TASK_KEY` w `T10`, przestawia kolumnę T (`ZADANIE_UKONCZONE`) na `TRUE`, zeruje wskaźnik WIP w kolumnie I (front zwolniony) i uruchamia algorytm SHA-256, generując 64-znakowy nienaruszalny hash pieczętujący marżę rzeczywistą. Ożywa tabela `T11`, przerzucając wskaźnik PPC do Looker Studio.

### 📥 5. Pętla Zarządzania Zmiennością (Forms 2 ➔ T07_VARIABILITY_MANAGEMENT)
*   **Akcja:** Wystąpienie awarii, opóźnienia dostawy lub braku frontu robót jest meldowane z placu budowy przez formularz na smartfonie.
*   **Powiązanie:** Incydent zasila centralę awarii `T07`. Kolumna L za pomocą dynamicznego, wielojęzycznego `XLOOKUP` podnosi flagę Andon (`🚨 W TOKU` / `🚨 IN ARBEIT`), która świeci na czerwono na wykresie Pareto w Looker Studio, dopóki inżynier nie zamknie usterki w kolumnie M tabeli 'T07'. Akcja jest kodowana w hash i timestampo w chmurze blockchain.

### 📥 6. Pętla Ewaluacji i Transformacji Lean (Forms 5 ➔ T09_LEAN_TRANSFORMATION_COSTS)
*   **Akcja:** Rejestr kosztów wprowadzania metodyki lean do inwestycji (licencje, warsztaty, szkolenia, doradztwo). Odpowiedzialny podmiot wprowadza dane do formularza.
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

---

### 🏗️ Komplette Systemarchitektur (Die 13 Tabellen des Kerns)
*   **T00_LOCALISATION** — Zentrales Token-Wörterbuch und automatischer Interface-Übersetzer (PL/EN/DE).
*   **T01_README_AND_LICENSE** — Haupt-Dashboard, Währungsauswahl (PLN/EUR) und FOREX-Wechselkurs-Sicherung.
*   **T02_TAKT_MATRIX** — Verzeichnis von Entladezonen und Takt-Boxes mit integrierter finanzieller Kapazitätsgrenze.
*   **T03_TAKT_MATRIX** — Verzeichnis von Entladezonen und Takt-Boxes mit integrierter finanzieller Kapazitätsgrenze.
*   **T04_TAKT_MATRIX** — Verzeichnis von Entladezonen und Takt-Boxes mit integrierter finanzieller Kapazitätsgrenze.
*   **T05_TAKT_MATRIX** — Verzeichnis von Entladezonen und Takt-Boxes mit integrierter finanzieller Kapazitätsgrenze.
*   **T06_TAKT_MATRIX** — Verzeichnis von Entladezonen und Takt-Boxes mit integrierter finanzieller Kapazitätsgrenze.
*   **T07_VARIABILITY_MANAGEMENT** — Störungsregister zur Überwachung von finanziellem Waste und Andon-Status (`🚨 IN ARBEIT` / `GESCHLOSSEN`).
*   **T08_DELIVERIES** — Logistikregister mit automatischem Überlastungsradar für Material-Hubs (`HDR_HUB_STATUS`).
*   **T10_PLAIN_PROFIT_AND_LOSS** — Haupt-Finanzledger der Holding, doppelt verriegelt durch SHA-256-Integritätshashes.
*   **T11_PLAIN_PROFIT_AND_LOSS** — Haupt-Finanzledger der Holding, doppelt verriegelt durch SHA-256-Integritätshashes.
*   **T12_PLAIN_PROFIT_AND_LOSS** — Haupt-Finanzledger der Holding, doppelt verriegelt durch SHA-256-Integritätshashes.

### 🛡️ Datenkreislauf & Poka-Yoke
*   **Forms 2 ➔ T07:** Baustellenmeldungen aktivieren sofort die Andon-Flage `🚨 IN ARBEIT` im Looker Studio Pareto-Chart, bis der Ingenieur den Vorfall in Spalte M schließt.
*   **Forms 4 ➔ T10:** Die Qualitätsabnahme schließt den Takt-Box ab, setzt den WIP-Status auf `0` und generiert den unmanipulierbaren 64-stelligen SHA-256 Krypto-Hash.

---

## ⚖️ Lizenz & Urheberrecht

Die Software ist unter den Bedingungen der **GNU General Public License v3 (GPL v3)** verfügbar.
*   Dadurch wird sichergestellt, dass das System für die Ingenieursgemeinschaft frei und offen bleibt.
*   Jede Integration des TAKTIX OS-Quellcodes (einschliesslich des Code.gs-Skripts) in komerzielle Systeme erfordert den vollständigen Open-Source-Zugriff auf die übergeordnete Software.

*Copyright (c) 2026 by Robert Szczepaniak. All rights reserved.*
