# taktix-os-cee
Core engine for PL/DE construction contracts
# 🎛️ TAKTIX OS — Central Production & Logistics Matrix Engine [CEE Region]

Prototyp bezobsługowego systemu klasy Enterprise dedykowany do zarządzania produkcją i logistyką w budownictwie kubaturowym na bazie metodyki **LPS (Last Planner System)** oraz **Takt Time Planning (Planowanie Taktowe)**. 

System realizuje ideę "Monolitu Informacyjnego", eliminując tradycyjne raporty Excela na rzecz automatycznych, kryptograficznie zabezpieczonych pętli relacyjnych w chmurze Google Apps Script & Looker Studio.

---

## 🏗️ Kompletna Architektura Systemu (13 Tabel Jądra)

System opiera się na nienaruszalnej strukturze powiązanych rejestrów (Single Source of Truth):
*   **T00_LOCALISATION** — Centralny słownik tokenów i automatyczny tłumacz całego interfejsu (PL/EN/DE). Tabelas ukryta.
*   **T01_README_AND_LICENSE** — Główny panel sterowania projektem, wybór języka, wybór waluty (PLN/EUR) i przelicznik kursowy FOREX.
*   **T02_TAKT_MATRIX** — Słownik stref rozładunkowych i Takt-Boxów z wbudowanym limitem wyporności kapitałowej [Max] wyrażonym w walucie bazowej.
*   **T03_PRODUCTION_INTERFACES** — Rejestr styków branżowych, koordynacji technicznej oraz nadrzędnych kryteriów wejścia na front robót.
*   **T04_MATERIAL_PASSPORTS** — Karty techniczne, paszporty materiałowe i deklaracje właściwości użytkowych weryfikowane przed wjazdem na plac budowy.
*   **T05_CONTRACTS_REGISTER** — Centralny rejestr umów, tożsamości cyfrowych generalnego wykonawcy (MAI), podwykonawców (SUB) oraz dostawców (SUP).
*   **T06_TAKT_MASTER_SCHEDULE** — Harmonogram główny inżyniera kontraktu generujący dynamiczne klucze planu (`SCHEDULE_KEY`) i czasy cykli.
*   **T07_VARIABILITY_MANAGEMENT** — Izba Awarii monitorująca marnotrawstwo finansowe, przestoje oraz statusy Andon (`🚨 W TOKU` / `ZAMKNIĘTY`).
*   **T08_DELIVERIES** — Rejestr dostaw bocznych z automatycznym radarem przepełnienia logistycznego hubów materiałowych (`HDR_HUB_STATUS`).
*   **T09_QUALITY_CONFORMANCE** — Protokół odbiorów jakościowych, kart usterek rygorystycznie sprawdzanych przed zamknięciem etapu.
*   **T10_PLAIN_PROFIT_AND_LOSS** — Główny ledger finansowy holdingu, podwójnie ryglowany i zamykany sumą kontrolną SHA-256.
*   **T11_WEEKLY_BOX_SCORE** — Automatyczny kalkulator wskaźnika stabilności procesów Lean (wyliczający rzeczywisty wynik **PPC %**).
*   **T12_GLOBAL_BOX_SCORE** — Globalne zestawienie zatorów, wskaźników WIP Congestion oraz finansowego zaangażowania budowy.

---

## ⚙️ Krwioobieg Danych (Relacje Formularze ➔ Tabele)

System eliminuje ręczne wprowadzanie danych poprzez precyzyjnie zaprojektowane pętle wymiany informacji, sterowane przez skrypt chmurowy `Code.gs`:

### 📥 1. Pętla Planowania (Forms 0 ➔ T06_TAKT_MASTER_SCHEDULE)
*   **Akcja:** Inżynier zapisuje sekwencję branżowych Takt-Boxów z cotygodniowych tabel Last Planner® System / Takt Time w biurze budowy.
*   **Powiązanie:** Skrypt przechwytuje dane i generuje w `T06` unikalny identyfikator `SCHEDULE_KEY` (`Tydzień|Strefa|Branża`). Od tej sekundy plan jest nienaruszalny.

### 📥 2. Pętla Logistyczna (Forms 1A & 1B ➔ T08_DELIVERIES)
*   **Akcja:** Logistyk/Dostawca zgłasza transport (Paszport Logistyczny) wraz z deklarowaną wartością finansową ładunku w PLN/EUR.
*   **Powiązanie:** Dane trafiają do `T08`. Formuła `XLOOKUP` weryfikuje adres e-mail dostawcy w `T05`, pobiera jego ludzką nazwę, a funkcja `SUMIFS` sprawdza skumulowaną wartość towaru w strefie i porównuje ją z limitami z `T02`. W przypadku przekroczenia budżetu, w kolumnie P zapala się natychmiastowy numeryczny alert przepełnienia.

### 📥 3. Pętla Meldowania Terenowego (Forms 3 ➔ T10_PLAIN_PROFIT_AND_LOSS)
*   **Akcja:** Brygadzista podwykonawcy melduje rozpoczęcie robót na konkretnym Takt-Boxie przez telefon.
*   **Powiązanie:** Skrypt generuje rekord w głównym ledgerze `T10`. Za pomocą bezpiecznika Wildcard, system odpytuje plan `T06` na podstawie strefy i branży, automatycznie wstrzykując do klucza zadania (`TASK_KEY`) właściwy numer tygodnia technologicznego (`W05|...`). Stan WIP w kolumnie I automatycznie podnosi się do poziomu `1` (praca w toku).

### 📥 4. Pętla Kryptograficznego Odbioru (Forms 4 ➔ T10_PLAIN_PROFIT_AND_LOSS)
*   **Akcja:** Kierownik Budowy dokonuje technicznego odbioru jakościowego wykonanego taktu.
*   **Powiązanie:** Weryfikacja w chmurze odnajduje pasujący `TASK_KEY` w `T10`, przestawia kolumnę T (`ZADANIE_UKONCZONE`) na `TRUE`, zeruje wskaźnik WIP w kolumnie I (front zwolniony) i w locie uruchamia algorytm SHA-256, generując 64-znakowy nienaruszalny hash pieczętujący marżę rzeczywistą. Kaskadowo ożywa tabela `T11`, przerzucając wskaźnik PPC do Looker Studio.

### 📥 5. Pętla Zarządzania Zmiennością (Forms 2 ➔ T07_VARIABILITY_MANAGEMENT)
*   **Akcja:** Wystąpienie awarii, opóźnienia dostawy lub braku frontu robót jest meldowane natychmiast z placu budowy.
*   **Powiązanie:** Incydent zasila Izbę Awarii `T07`. Kolumna L za pomocą dynamicznego, wielojęzycznego `XLOOKUP` podnosi flagę Andon (`🚨 W TOKU` / `🚨 IN ARBEIT`), która świeci czerwonym światłem na wykresie Pareto w Looker Studio dopóki inżynier nie zamknie usterki w kolumnie M.

### 📥 6. Pętla Ewaluacji i Transformacji Lean (Forms 5 ➔ T09_LEAN_TRANSFORMATION_COSTS)
*   **Akcja:** Rejestr kosztów wprowadzania metodyki lean do inwestycji (licencje, warsztaty, szkolenia, doradztwo). Odpowiedzialny podmiot wprowadza dane do formularza.
*   **Powiązanie:** Dane (finansowe i statystyczne) są automatycznie zasysane przez tabelę 'T09', a potem wprowadzane do Looker Studio w odpowiednich wizualnych diagramach dla zarządu holdingu.
  
---

## ⚖️ Licencja & Prawa Autorskie

Oprogramowanie jest udostępniane na zasadach licencji **GNU General Public License v3 (GPL v3)**.
*   Gwarantuje to, że system pozostanie wolny i darmowy dla społeczności inżynierskiej.
*   Jakiekolwiek wbudowanie kodu źródłowego TAKTIX OS (w tym skryptu `Code.gs`) do systemów komercyjnych wymusza pełne otwarcie kodu źródłowego oprogramowania nadrzędnego.

*Copyright (c) 2026 by Robert Szczepaniak. All rights reserved.*
