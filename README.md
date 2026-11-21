# taktix-os-cee (v1.0.0)
Core engine for PL/DE construction investments
# 🎛️ TAKTIX OS CEE PL-DE (v1.0.0) — Central Production & Logistics Matrix Engine [CEE Region]

---
### 🌐 Language / Sprache
*   [🇵🇱 Przejdź do wersji polskiej](#-wersja-polska)
*   [🇦🇹/🇩🇪 Zur deutschen Version springen](#-deutsche-version)
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
*   **`T01_README_AND_LICENSE`** — Główny panel sterowania projektem, wybór języka, wybór waluty (PLN/EUR) i przelicznik kursowy FOREX oraz ustawienie maksymalnej ilości prac w toku (WIP - Work in Process) dla poszczególnych branż i całej inwestycji, jak również dzienny limit czasowy (od-do) dla potrzeb dostaw. Ponadto definiowane są tutaj marże Generalnego Wykonawcy i developera.
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

## 🚀 Szybki Start / Instrukcja Wdrożenia (Quick Start)

Aby uruchomić własną, w pełni autonomiczną instancję **TAKTIX OS CEE** w środowisku Google Workspace, wykonaj poniższe kroki:

### Krok 1: Pobranie szablonów (Folder Drive / Linki `/copy`)
System składa się z głównego Arkusza Google oraz **8 powiązanych formularzy terenowych** (`Forms 00`, `Forms 0`, `Forms 1A`, `Forms 1B`, `Forms 2`, `Forms 3`, `Forms 4`, `Forms 5`). Wszystkie pliki udostępnione są w trybie tylko do odczytu (*Viewer*), dzięki czemu każdy użytkownik tworzy własną, niezależną kopię na swoim Dysku Google:

1. **Pobranie przez główny Arkusz (Zalecane — najszybsza metoda):**
   * Otwórz udostępniony link do szablonu Arkusza Google (lub wejdź do publicznego folderu szablonów **TAKTIX_OS_CEE_TEMPLATE**).
   * Wybierz z górnego menu: **Plik ➔ Utwórz kopię** (*File ➔ Make a copy*).
   * Google Workspace **automatycznie skopiuje na Twój Dysk Google zarówno główny Arkusz, jak i wszystkie 8 podpiętych do niego formularzy**, zachowując ich powiązania z zakładkami `Form responses`.
2. **Kopiowanie pojedynczych formularzy (Linki `/copy`):**
   * Jeśli chcesz skopiować wybrany formularz osobno, kliknij jego dedykowany link z końcówką **`/copy`** (np. `.../forms/d/[ID]/copy`) i potwierdź przyciskiem **Utwórz kopię** (*Make a copy*).
   * Pamiętaj, aby po skopiowaniu pojedynczego formularza podpiąć go do odpowiedniej zakładki w Arkuszu (**Odpowiedzi ➔ Wybierz miejsce docelowe odpowiedzi ➔ Wybierz istniejący arkusz kalkulacyjny**).
3. > ⚠️ **Ważna zasada bezpieczeństwa:** Wszystkie silniki obliczeniowe (`ARRAYFORMULA`) są zaszyte w **wierszu #1 (nagłówki)** lub **wierszu #2**. Nigdy nie usuwaj tych wierszy – dane operacyjne wprowadzane są zawsze od wiersza #2 (lub #3 w zależności od tabeli) w dół.

| Moduł / Formularz | Rola w systemie | Link do skopiowania szablonu |
| :--- | :--- | :--- |
| **TAKTIX OS CEE (Master Sheet)** | Główny Monolit (15 tabel + `Code.gs`) | https://docs.google.com/spreadsheets/d/1qSq911sIXM64ZnRMQ1SAD7iG7ubDQjygXEGlmZIqgYc/copy |
| **Forms 00** | Konfiguracja przestrzenna i bramy wjazdowe | `[Wklej link z końcówką /copy]` |
| **Forms 0** | Planowanie tygodniowe (`T06`) | `[Wklej link z końcówką /copy]` |
| **Forms 1A** | Rezerwacja slotów dostaw przez dostawców | `[Wklej link z końcówką /copy]` |
| **Forms 1B** | Kontrola bram wjazdowych przez portiera | `[Wklej link z końcówką /copy]` |
| **Forms 2** | Zgłaszanie awarii i incydentów Andon (`T07`) | `[Wklej link z końcówką /copy]` |
| **Forms 3** | Dzienne raportowanie postępu robót (`T10`) | `[Wklej link z końcówką /copy]` |
| **Forms 4** | Cotygodniowy odbiór jakościowy (`T10`) | `[Wklej link z końcówką /copy]` |
| **Forms 5** | Rejestr kosztów transformacji Lean (`T09`) | `[Wklej link z końcówką /copy]` |

### 📱 Generowanie kodów QR i wdrożenie na placu budowy

Aby brygadziści, dostawcy i portierzy mogli błyskawicznie otwierać formularze na smartfonach bez wpisywania adresów URL:

1. **Pobierz link do wypełniania formularza (nie `/edit` ani `/copy`!):**
   * Otwórz swój skopiowany formularz Google, kliknij przycisk **Wyślij** (*Send*) w prawym górnym rogu, wybierz ikonę **linku (🔗)** i skopiuj adres kończący się na `/viewform`.
2. **Wygeneruj kod QR w 3 sekundy (wbudowana funkcja Google Chrome):**
   * Otwórz skopiowany link `/viewform` w przeglądarce **Google Chrome**, kliknij prawym przyciskiem myszy w dowolnym miejscu na stronie i wybierz **Utwórz kod QR dla tej strony** (*Create QR code for this page*), a następnie kliknij **Pobierz** (*Download*).
3. **Rozmieść kody QR w kluczowych punktach budowy:**
   * **Tablica Last Planner® / Biuro budowy:** `Forms 00`, `Forms 0`, `Forms 2`, `Forms 5`.
   * **Brama wjazdowa / Portiernia:** `Forms 1B` (oraz `Forms 1A` w regulaminie awizacji dla dostawców).
   * **Strefy robocze / Kondygnacje (Takt-Boxy):** `Forms 3` (raport dzienny) oraz `Forms 4` (odbiór jakościowy).

### Wdrożenie aktywacji formularzy przez kod QR na budowie:

•	**Android**: Działa od razu po zeskanowaniu systemowym aparatem (link otwiera się natywnie w Google Chrome z aktywną sesją konta Google).

•	**iPhone (iOS)**: Aby zweryfikowane logowanie Google działało płynnie po zeskanowaniu kodu QR z budowy, brygadzista powinien:
1.	Ustawić Google Chrome jako domyślną przeglądarkę na iPhonie (Ustawienia iPhone ➔ Chrome ➔ Domyślna aplikacja przeglądarki) lub
2.	W ustawieniach Safari (Ustawienia ➔ Safari) odznaczyć tymczasowo opcję „Zapobiegaj śledzeniu poza witryną” (Prevent Cross-Site Tracking), jeśli używa Safari, inaczej link z Safari trzeba wkleić do Chrome.

*(Dzięki ustawieniu Chrome jako domyślnej przeglądarki na służbowym iPhonie skanowanie kodów QR aparatem kieruje od razu do Chrome i wysyła meldunek jednym kliknięciem).*

### Krok 2: Konfiguracja parametrów projektu (`T01` – `T05`)
1. **`T01_README_AND_LICENSE`:** Wybierz język interfejsu (`PL` / `DE` / `EN`), walutę raportową holdingu (`PLN` / `EUR`), wskaźniki narzutów marżowych (`B14`, `B15`) oraz limity prac w toku (**WIP**).
2. **`T05_CONTRACTS_REGISTER`:** Zdefiniuj strukturę wykonawców (`MAI` – główny wykonawca pakietu, `SUB` – podwykonawcy, `SUP` – dostawcy), przypisz ich adresy e-mail (klucz autoryzacji w terenie!), kwoty kontraktowe oraz stawki narzutu logistycznego (`Kolumna K`).
3. **`T03` & `T04`:** Zweryfikuj kody prac oraz okna czasowe dostaw (sloty logistyczne).

### Krok 3: Podpięcie formularzy w skrypcie (`Code.gs`)
1. W skopiowanym Arkuszu Google otwórz górne menu: **Rozszerzenia ➔ Apps Script**.
2. W pliku `Code.gs` odszukaj zmienne z identyfikatorami formularzy (`form0Id`, `form1AId_Unique`, `form1BId`, `form2Id`, `form3Id`, `form4Id`).
3. Otwórz każdy ze swoich skopiowanych formularzy w trybie edycji i skopiuj jego unikalny identyfikator z paska adresu przeglądarki:
   `https://google.com`**`[TUTAJ_JEST_TWOJE_ID_FORMULARZA]`**`/edit`
4. Wklej swoje identyfikatory w miejsce placeholderów i zapisz projekt (`Ctrl + S`).

### Krok 4: Autoryzacja i konfiguracja wyzwalaczy (Triggers)
1. W edytorze Apps Script wybierz z górnego paska funkcję **`runNativeFormUpdate`** i kliknij **Uruchom** (*Run*).
2. **Autoryzacja Google:** Przy pierwszym uruchomieniu pojawi się komunikat *„Google nie zweryfikowało tej aplikacji”*. Kliknij **Zaawansowane ➔ Przejdź do projektu (niebezpieczne) ➔ Zezwól**, aby nadać skryptowi uprawnienia do aktualizacji formularzy i wysyłki paszportów logistycznych e-mailem.
3. W lewym menu edytora kliknij ikonę budzika (**Wyzwalacze** / *Triggers*) i dodaj **3 wyzwalacze** (`+ Dodaj wyzwalacz`):
   * **Blokady kryptograficzne i Andon:** Funkcja `onEdit` | Źródło: *Z arkusza kalkulacyjnego* | Typ zdarzenia: *Przy edycji* (`On edit`).
   * **Aktualizacja formularzy na żywo:** Funkcja `runNativeFormUpdate` | Źródło: *Z arkusza kalkulacyjnego* | Typ zdarzenia: *Przy przesłaniu formularza* (`On form submit`).
   * **Nocna synchronizacja kursów FX:** Funkcja `runNativeFormUpdate` | Źródło: *Oparty na czasie* (`Time-driven`) | *Licznik dni* (`Day timer`, np. `00:00–01:00`).

### Krok 5: Konfiguracja przestrzenna budowy (`Forms 00`)
Przed rozpoczęciem robót wypełnij formularz **Forms 00**, definiując strefy/takty na poszczególnych kondygnacjach, limity składowania kapitału oraz przypisane do nich **bramy wjazdowe**. System automatycznie zasili tabele `T00_SPATIAL_CONFIG` oraz `T02_TAKT_MATRIX`, odblokowując możliwość planowania tygodniowego w `Forms 0`.

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

## 🇦🇹/🇩🇪 Deutsche Version

TAKTIX OS CEE – ein Prototyp eines autonomen Betriebssystems der Enterprise-Klasse für das Produktions- und Logistikmanagement im Hoch- und Infrastrukturbau. Es basiert auf der Methodik des **`Last Planner® Systems (LPS®)`**, der **`Takt Time Planning`**-Methode (Taktplanung) sowie dem **`Project Production Management (PPM)`** gemäß den Standards des Project Production Institute.

Das System verfolgt den Ansatz eines **"Informationsmonolithen“** und ersetzt verstreute Tabellenkalkulationsberichte durch automatisierte, kryptografisch abgesicherte (SHA-256 / OpenTimestamps) relationale Datenkreisläufe innerhalb des Ökosystems **`Google Workspace (Sheets, Forms, Apps Script) & Looker Studio`**.

Die CEE-Version bietet native Unterstützung für mehrere Sprachen (PL / DE / EN) sowie Währungen (PLN / EUR).

*Als Alternative zur Google-Cloud-Umgebung ist eine Open-Source-Variante auf Basis von Nextcloud in Entwicklung.*

---

### 🏗️ Komplette Systemarchitektur (Die 15 Tabellen des Kerns)

*   **`T00_LOCALISATION`** — Zentrales Token-Wörterbuch und automatischer Interface-Übersetzer (PL/DE). Ausgeblendete Tabelle.
*   **`T00_SPATIAL_CONFIG`** – Zentrales Verzeichnis von Takten, Sektionen, Lager-Hubs und Investitionsebenen (Zwischen- bzw. Organisationstabelle). Ausgeblendete Tabelle.
*   **`T01_README_AND_LICENSE`** — Zentrale Projektsteuerung, Sprach- und Währungsauswahl (PLN/EUR), FOREX-Wechselkursumrechnung und Festlegung der maximalen Anzahl laufender Arbeiten (WIP – Work in Process) für die einzelnen Gewerke und das Gesamtprojekt sowie ein tägliches Zeitfenster (von–bis) für Lieferzwecke. Zudem werden hier die Margen des Generalunternehmers und des Developers festgelegt.
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

## 🚀 Schnellstart / Bereitstellungsanleitung (Quick Start)

Um Ihre eigene, vollständig autonome Instanz von **TAKTIX OS CEE** in der Google Workspace-Umgebung bereitzustellen, führen Sie bitte die folgenden Schritte aus:

### Schritt 1: Vorlagen herunterladen (Google Drive-Ordner / `/copy`-Links)
Das System besteht aus der Haupt-Google-Tabelle sowie **8 verknüpften Baustellen-Formularen** (`Forms 00`, `Forms 0`, `Forms 1A`, `Forms 1B`, `Forms 2`, `Forms 3`, `Forms 4`, `Forms 5`). Alle Dateien werden schreibgeschützt (*Betrachter* / *Viewer*) bereitgestellt, sodass jeder Nutzer eine eigene, unabhängige Kopie in seinem Google Drive erstellt:

1. **Herunterladen über die Haupttabelle (Empfohlen — schnellste Methode):**
   * Öffnen Sie den freigegebenen Link zur Google Sheets-Vorlage (oder wechseln Sie in den öffentlichen Vorlagenordner **TAKTIX_OS_CEE_TEMPLATE**).
   * Wählen Sie im oberen Menü: **Datei ➔ Kopie erstellen** (*File ➔ Make a copy*).
   * Google Workspace **kopiert automatisch sowohl die Haupttabelle als auch alle 8 verknüpften Formulare in Ihr Google Drive**, wobei die Verknüpfungen zu den `Form responses`-Tabs erhalten bleiben.
2. **Einzelne Formulare kopieren (`/copy`-Links):**
   * Wenn Sie ein bestimmtes Formular separat kopieren möchten, klicken Sie auf den entsprechenden Link mit der Endung **`/copy`** (z. B. `.../forms/d/[ID]/copy`) und bestätigen Sie mit **Kopie erstellen** (*Make a copy*).
   * Verknüpfen Sie das einzeln kopierte Formular anschließend mit dem entsprechenden Tab in Ihrer Tabelle (**Antworten ➔ Ziel für Antworten auswählen ➔ Vorhandene Tabelle auswählen**).
3. > ⚠️ **Wichtige Sicherheitsregel:** Alle Berechnungs-Engines (`ARRAYFORMULA`) sind in **Zeile #1 (Kopfzeilen)** oder **Zeile #2** verankert. Löschen Sie diese Zeilen niemals – operative Daten werden immer ab Zeile #2 (bzw. #3 je nach Tabelle) abwärts eingetragen.

| Modul / Formular | Rolle im System | Link zum Kopieren der Vorlage |
| :--- | :--- | :--- |
| **TAKTIX OS CEE (Master Sheet)** | Haupt-Monolith (15 Tabellen + `Code.gs`) | https://docs.google.com/spreadsheets/d/1qSq911sIXM64ZnRMQ1SAD7iG7ubDQjygXEGlmZIqgYc/copy |
| **Forms 00** | Räumliche Konfiguration & Zufahrtstore | `[Link mit Endung /copy einfügen]` |
| **Forms 0** | Wöchentliche Taktplanung (`T06`) | `[Link mit Endung /copy einfügen]` |
| **Forms 1A** | Liefer-Slot-Buchung durch Lieferanten | `[Link mit Endung /copy einfügen]` |
| **Forms 1B** | Torkontrolle durch den Pförtner | `[Link mit Endung /copy einfügen]` |
| **Forms 2** | Störungs- & Andon-Meldungen (`T07`) | `[Link mit Endung /copy einfügen]` |
| **Forms 3** | Tägliche Baufortschrittsmeldung (`T10`) | `[Link mit Endung /copy einfügen]` |
| **Forms 4** | Wöchentliche Qualitätsabnahme (`T10`) | `[Link mit Endung /copy einfügen]` |
| **Forms 5** | Kostenregister Lean-Transformation (`T09`) | `[Link mit Endung /copy einfügen]` |

### 📱 QR-Codes generieren & auf der Baustelle einsetzen

Damit Poliere, Lieferanten und Pförtner die Formulare ohne Eintippen von URLs direkt per Smartphone öffnen können:

1. **Formular-Link für Teilnehmer abrufen (nicht `/edit` oder `/copy`!):**
   * Öffnen Sie Ihr kopiertes Google-Formular, klicken Sie oben rechts auf **Senden** (*Send*), wählen Sie das **Link-Symbol (🔗)** und kopieren Sie die URL mit der Endung `/viewform`.
2. **QR-Code in 3 Sekunden erstellen (integrierte Funktion in Google Chrome):**
   * Öffnen Sie den kopierten `/viewform`-Link im Browser **Google Chrome**, machen Sie einen Rechtsklick auf eine freie Fläche der Seite, wählen Sie **QR-Code für diese Seite erstellen** (*Create QR code for this page*) und klicken Sie auf **Herunterladen** (*Download*).
3. **QR-Codes an den Schlüsselpunkten der Baustelle anbringen:**
   * **Last Planner®-Tafel / Baucontainer:** `Forms 00`, `Forms 0`, `Forms 2`, `Forms 5`.
   * **Zufahrtstor / Pförtnerloge:** `Forms 1B` (sowie `Forms 1A` in den Lieferanten-Richtlinien zur Slot-Buchung).
   * **Arbeitsbereiche / Geschosse (Takt-Boxen):** `Forms 3` (Tagesfortschritt) und `Forms 4` (Qualitätsabnahme).

### Aktivierung von Formularen per QR-Code auf der Baustelle:

•	**Android**: Funktioniert sofort nach dem Scannen mit der systemeigenen Kamera-App (der Link öffnet sich direkt in Google Chrome, wobei die Google-Konto-Sitzung aktiv bleibt).

•	**iPhone (iOS)**: Damit die verifizierte Google-Anmeldung nach dem Scannen eines QR-Codes auf der Baustelle reibungslos funktioniert, sollte der Vorarbeiter Folgendes tun:
1.	Google Chrome als Standardbrowser auf dem iPhone festlegen (iPhone-Einstellungen ➔ Chrome ➔ Standard-Browser-App) oder
2.	falls Safari verwendet wird: in den Safari-Einstellungen (Einstellungen ➔ Safari) die Option „Übergreifendes Tracking verhindern“ (Prevent Cross-Site Tracking) vorübergehend deaktivieren, andernfalls muss der Link aus Safari in Chrome eingefügt werden.

*(Wenn Chrome als Standardbrowser auf dem dienstlichen iPhone festgelegt ist, führt das Scannen von QR-Codes mit der Kamera direkt zu Chrome, sodass die Meldung mit nur einem Klick übermittelt werden kann).*

### Schritt 2: Projektparameter konfigurieren (`T01` – `T05`)
1. **`T01_README_AND_LICENSE`:** Wählen Sie die Oberflächensprache (`PL` / `DE` / `EN`), die Holding-Berichtswährung (`PLN` / `EUR`), die Margenaufschläge (`B14`, `B15`) sowie die Work-in-Process-Limits (**WIP**).
2. **`T05_CONTRACTS_REGISTER`:** Definieren Sie die Auftragsstruktur (`MAI` – Hauptauftragnehmer des Gewerkepakets, `SUB` – Nachunternehmer, `SUP` – Lieferanten), hinterlegen Sie deren E-Mail-Adressen (Autorisierungsschlüssel auf der Baustelle!), Vertragssummen sowie Logistik-Umlagesätze (`Spalte K`).
3. **`T03` & `T04`:** Überprüfen Sie die Gewerkecodes sowie die Lieferzeitfenster (Logistik-Slots).

### Schritt 3: Formulare im Skript verknüpfen (`Code.gs`)
1. Öffnen Sie in Ihrer kopierten Google-Tabelle das obere Menü: **Erweiterungen ➔ Apps Script**.
2. Suchen Sie in der Datei `Code.gs` nach den Variablen für die Formular-IDs (`form0Id`, `form1AId_Unique`, `form1BId`, `form2Id`, `form3Id`, `form4Id`).
3. Öffnen Sie jedes Ihrer kopierten Formulare im Bearbeitungsmodus und kopieren Sie die eindeutige ID aus der Adresszeile des Browsers:
   `https://google.com`**`[HIER_STEHT_IHRE_FORMULAR_ID]`**`/edit`
4. Fügen Sie Ihre IDs anstelle der Platzhalter ein und speichern Sie das Projekt (`Strg + S`).

### Schritt 4: Autorisierung und Trigger-Konfiguration
1. Wählen Sie im Apps Script-Editor in der oberen Leiste die Funktion **`runNativeFormUpdate`** aus und klicken Sie auf **Ausführen** (*Run*).
2. **Google-Autorisierung:** Beim ersten Start erscheint die Meldung *„Google hat diese App nicht überprüft“*. Klicken Sie auf **Erweitert ➔ Weiter zu [Projektname] (unsicher) ➔ Zulassen**, um dem Skript die Berechtigung zur Aktualisierung der Formulare und zum Versand der Logistik-Pässe per E-Mail zu erteilen.
3. Klicken Sie im linken Menü des Editors auf das Wecker-Symbol (**Trigger**) und fügen Sie **3 Trigger** hinzu (`+ Trigger hinzufügen`):
   * **Kryptografische Sperren & Andon:** Funktion `onEdit` | Ereignisquelle: *Aus Tabelle* | Ereignistyp: *Bei Bearbeitung* (`On edit`).
   * **Live-Aktualisierung der Formulare:** Funktion `runNativeFormUpdate` | Ereignisquelle: *Aus Tabelle* | Ereignistyp: *Beim Senden des Formulars* (`On form submit`).
   * **Nächtliche FX-Kurs-Synchronisation:** Funktion `runNativeFormUpdate` | Ereignisquelle: *Zeitgesteuert* (`Time-driven`) | *Tages-Timer* (z. B. `00:00–01:00 Uhr`).

### Schritt 5: Räumliche Baustellenkonfiguration (`Forms 00`)
Füllen Sie vor Baubeginn das Formular **Forms 00** aus, um Zonen/Takte auf den einzelnen Geschossen, Kapital-Lagerlimits sowie die zugehörigen **Zufahrtstore** zu definieren. Das System befüllt automatisch die Tabellen `T00_SPATIAL_CONFIG` und `T02_TAKT_MATRIX` und schaltet damit die wöchentliche Taktplanung in `Forms 0` frei.


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
* **`T01_README_AND_LICENSE`** — Main project control panel: language selection, reporting currency selection (PLN/EUR), FOREX exchange rate converter, margin parameters, and Work in Process (**WIP**) limits for individual trades and the entire project, as well as a daily time limit (from–to) for delivery purposes.
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

## 🚀 Quick Start / Deployment Guide

To deploy your own fully autonomous instance of **TAKTIX OS CEE** in Google Workspace, follow these steps:

### Step 1: Download Templates (Drive Folder / `/copy` Links)
The system consists of the master Google Sheet and **8 linked field forms** (`Forms 00`, `Forms 0`, `Forms 1A`, `Forms 1B`, `Forms 2`, `Forms 3`, `Forms 4`, `Forms 5`). All files are shared in read-only mode (*Viewer*), allowing every user to create an independent copy in their own Google Drive:

1. **Copy via the Master Sheet (Recommended — fastest method):**
   * Open the shared link to the Google Sheet template (or open the public template folder **TAKTIX_OS_CEE_TEMPLATE**).
   * Select from the top menu: **File ➔ Make a copy**.
   * Google Workspace will **automatically copy both the Master Sheet and all 8 linked forms to your Google Drive**, preserving their connections to the `Form responses` tabs.
2. **Copy Individual Forms (`/copy` Links):**
   * To copy a specific form separately, click its dedicated link ending with **`/copy`** (e.g., `.../forms/d/[ID]/copy`) and confirm by clicking **Make a copy**.
   * Remember to link any individually copied form to the corresponding tab in your Sheet (**Responses ➔ Select destination for responses ➔ Select existing spreadsheet**).
3. > ⚠️ **Important Safety Rule:** All calculation engines (`ARRAYFORMULA`) are embedded in **Row #1 (headers)** or **Row #2**. Never delete these rows—operational data is always entered from Row #2 (or #3 depending on the table) downward.

| Module / Form | Role in System | Template Copy Link |
| :--- | :--- | :--- |
| **TAKTIX OS CEE (Master Sheet)** | Core Monolith (15 tables + `Code.gs`) | https://docs.google.com/spreadsheets/d/1qSq911sIXM64ZnRMQ1SAD7iG7ubDQjygXEGlmZIqgYc/copy |
| **Forms 00** | Spatial configuration & delivery gates | `[Insert /copy link here]` |
| **Forms 0** | Weekly takt scheduling (`T06`) | `[Insert /copy link here]` |
| **Forms 1A** | Delivery slot booking by suppliers | `[Insert /copy link here]` |
| **Forms 1B** | Gate access control by security | `[Insert /copy link here]` |
| **Forms 2** | Breakdown & Andon incident reporting (`T07`) | `[Insert /copy link here]` |
| **Forms 3** | Daily field progress reporting (`T10`) | `[Insert /copy link here]` |
| **Forms 4** | Weekly quality sign-off (`T10`) | `[Insert /copy link here]` |
| **Forms 5** | Lean transformation cost register (`T09`) | `[Insert /copy link here]` |

### 📱 Generating QR Codes & On-Site Deployment

To allow foremen, suppliers, and gate security to launch field forms instantly on their smartphones without typing URLs:

1. **Get the Respondent Form Link (not `/edit` or `/copy`!):**
   * Open your copied Google Form, click **Send** in the top-right corner, select the **link icon (🔗)**, and copy the URL ending with `/viewform`.
2. **Generate a QR Code in 3 Seconds (Built-in Google Chrome Feature):**
   * Open the copied `/viewform` link in **Google Chrome**, right-click anywhere on the page, select **Create QR code for this page**, and click **Download**.
3. **Post QR Codes at Key Site Locations:**
   * **Last Planner® Board / Site Office:** `Forms 00`, `Forms 0`, `Forms 2`, `Forms 5`.
   * **Site Entrance / Security Gate:** `Forms 1B` (plus `Forms 1A` in supplier delivery booking instructions).
   * **Work Zones / Floors (Takt-Boxes):** `Forms 3` (daily progress) and `Forms 4` (quality sign-off).

### Implementing form activation via QR codes on the construction site:

•	**Android**: Works immediately upon scanning with the system camera (the link opens natively in Google Chrome, with the Google account session already active).

•	**iPhone (iOS)**: To ensure a seamless, verified Google login when scanning a QR code on the construction site, the foreman should:
1.	Set Google Chrome as the default browser on the iPhone (iPhone Settings ➔ Chrome ➔ Default Browser App), or
2.	If using Safari, temporarily disable the "Prevent Cross-Site Tracking" option in the Safari settings (Settings ➔ Safari), otherwise you need to paste the link from Safari into Chrome.

*(Setting Chrome as the default browser on a work-issued iPhone ensures that scanning a QR code with the camera takes you directly to Chrome, allowing you to submit a report with a single click).*

### Step 2: Configure Project Parameters (`T01` – `T05`)
1. **`T01_README_AND_LICENSE`:** Select the interface language (`PL` / `DE` / `EN`), holding reporting currency (`PLN` / `EUR`), margin markups (`B14`, `B15`), and Work in Process (**WIP**) limits.
2. **`T05_CONTRACTS_REGISTER`:** Define the contractor hierarchy (`MAI` – Main/Package Contractor, `SUB` – Subcontractors, `SUP` – Suppliers), assign their e-mail addresses (used as field authorization keys!), contract sums, and logistics overhead rates (`Column K`).
3. **`T03` & `T04`:** Verify trade codes and delivery time windows (logistics slots).

### Step 3: Link Forms in the Script (`Code.gs`)
1. In your copied Google Sheet, open the top menu: **Extensions ➔ Apps Script**.
2. In `Code.gs`, locate the form ID variables (`form0Id`, `form1AId_Unique`, `form1BId`, `form2Id`, `form3Id`, `form4Id`).
3. Open each of your copied forms in edit mode and copy its unique ID from the browser address bar:
   `https://google.com`**`[YOUR_FORM_ID_IS_HERE]`**`/edit`
4. Paste your IDs in place of the placeholders and save the project (`Ctrl + S`).

### Step 4: Authorization & Trigger Setup
1. In the Apps Script editor, select the **`runNativeFormUpdate`** function from the top toolbar and click **Run**.
2. **Google Authorization:** On first run, a warning screen *"Google hasn't verified this app"* will appear. Click **Advanced ➔ Go to [Project Name] (unsafe) ➔ Allow** to grant the script permission to update forms and send Logistics Passports via e-mail.
3. In the left sidebar of the editor, click the alarm clock icon (**Triggers**) and add **3 triggers** (`+ Add Trigger`):
   * **Cryptographic Locks & Andon:** Function `onEdit` | Event source: *From spreadsheet* | Event type: *On edit*.
   * **Live Form Synchronization:** Function `runNativeFormUpdate` | Event source: *From spreadsheet* | Event type: *On form submit*.
   * **Nightly FX Rate Sync:** Function `runNativeFormUpdate` | Event source: *Time-driven* | *Day timer* (e.g., `Midnight to 1am`).

### Step 5: Spatial Site Configuration (`Forms 00`)
Before construction begins, fill out **Forms 00** to define zones/takts across building levels, capital storage limits, and assigned **delivery gates**. The system will automatically populate `T00_SPATIAL_CONFIG` and `T02_TAKT_MATRIX`, unlocking weekly scheduling in `Forms 0`.


---

## ⚖️ License & Copyright

This software is distributed under the **GNU General Public License v3.0 (GPL-3.0)**.

* This guarantees that the system remains free and open for the engineering community.
* Any incorporation of **TAKTIX OS** source code (including the `Code.gs` script and formula architecture) into proprietary commercial systems requires the complete source code of the parent software to be released under the same license terms.
* The project should also include a `LICENSE` file containing the full text of the GNU GPL v3.0 license in the root directory of the GitHub repository.

*Copyright (c) 2026 by Robert Szczepaniak. All rights reserved.*
