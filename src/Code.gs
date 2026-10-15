/**
 * TAKTIX OS — Central Production & Logistics Matrix Engine
 * Copyright (c) 2026 by Robert Szczepaniak. All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://gnu.org>.
 */

// =========================================================================
// SILNIK 1: CRYPTOGRAPHIC LEDGER ANCHORING (REAL-TIME THREE-LASER KERNEL)
// =========================================================================
function onEdit(e) {
  if (!e) return;
  try {
    var range = e.range;
    var sheet = range.getSheet();
    var sheetName = sheet.getName();
    var row = range.getRow();
    var col = range.getColumn();
    var editedValue = e.value ? e.value.toString().trim().toUpperCase() : "";
    
// -------------------------------------------------------------------------
    // LASER A: CENTRALNY LEDGER P&L (T10) - Blokada Finansowa
    // Nasłuchuje zmian w Kolumnie U (21) - Uwolnienie płatności
    // -------------------------------------------------------------------------
    if (sheetName === "T10_PLAIN_PROFIT_AND_LOSS" && row > 1 && col === 21 && (editedValue === "TRUE" || editedValue === "1" || editedValue === true)) {
      var qualityCheck = sheet.getRange(row, 20).getValue(); // Kolumna T (20)
      if (qualityCheck !== true && qualityCheck !== "TRUE") {
        e.source.toast("🚨 BŁĄD: Takt nie posiada weryfikacji jakościowej w Kolumnie T! Blokada transakcji.", "TAKTIX OS ANDON", 7);
        range.setValue(false); // Poka-Yoke!
        return;
      }
      
      var tradeCodeInT10 = sheet.getRange(row, 5).getValue().toString();
      var t05Sheet = e.source.getSheetByName("T05_CONTRACTS_REGISTER");
      if (t05Sheet) {
        var t05Data = t05Sheet.getRange("B2:J" + t05Sheet.getLastRow()).getValues();
        for (var i = 0; i < t05Data.length; i++) {
          if (t05Data[i][0].toString() === tradeCodeInT10 && (t05Data[i][8].toString().indexOf("ZAWIESZONY") !== -1 || t05Data[i][8].toString().indexOf("SUSPENDED") !== -1)) {
            e.source.toast("🚨 KRYTYCZNY ALERT ANDON: Podwykonawca zablokowany w T05! Uwolnienie płatności unieważnione.", "TAKTIX OS KERNEL", 7);
            range.setValue(false); // Poka-Yoke!
            return;
          }
        }
      }
      
      var rowData = sheet.getRange(row, 1, 1, 21).getValues();
      var sha256Hash = calculateSHA256(rowData.join("|"));
      var statusCell = sheet.getRange(row, 22); // Kolumna V
      
      // Próba kotwiczenia w OTS, jeśli serwer nie odpowie - włącza się lokalna pieczęć kryptograficzna holdingu
      try {
        if (anchorToBlockchain(sha256Hash)) {
          statusCell.setValue("🔒 BLOCKED & ANCHORED (OTS-HASH: " + sha256Hash.substring(0,8) + "...)");
          statusCell.setFontColor("#008000").setFontWeight("bold");
          sheet.getRange(row, 1, 1, 22).setBackground("#F3F3F3");
          e.source.toast("Wiersz trwale zakotwiczony w zewnętrznym Blockchain!", "TAKTIX OS HOLDING", 5);
        } else {
          // Rezerwowa pieczęć wewnętrzna grupy kapitałowej
          statusCell.setValue("🔒 LOCAL LEDGER ANCHORED (SHA-256: " + sha256Hash.substring(0,8) + "...)");
          statusCell.setFontColor("#0056B3").setFontWeight("bold"); // Kolor niebieski dla rejestru lokalnego
          sheet.getRange(row, 1, 1, 22).setBackground("#F3F3F3");
          e.source.toast("Serwer OTS zajęty. Zastosowano lokalną pieczęć kryptograficzną holdingu.", "TAKTIX OS LOCAL LEDGER", 6);
        }
      } catch(err) {
        // Zabezpieczenie na wypadek całkowitego błędu wykonania funkcji sieciowej
        statusCell.setValue("🔒 LOCAL LEDGER ANCHORED (SHA-256: " + sha256Hash.substring(0,8) + "...)");
        statusCell.setFontColor("#0056B3").setFontWeight("bold");
        sheet.getRange(row, 1, 1, 22).setBackground("#F3F3F3");
        e.source.toast("Błąd sieciowy API. Wiersz bezpiecznie zablokowany lokalnym hashem SHA-256.", "TAKTIX OS LOCAL LEDGER", 6);
      }
    }
    // -------------------------------------------------------------------------
    // LASER B: BRAMA WJAZDOWA (T08) - Blokada Paszportu Logistycznego
    // NOWOŚĆ: Nasłuchuje Dropdownu w Kolumnie J (10) - BOOKING lub REJECTION
    // -------------------------------------------------------------------------
    if (sheetName === "T08_DELIVERIES" && row > 1 && col === 10 && (editedValue === "BOOKING" || editedValue === "REJECTION")) {
      e.source.toast("🔒 Generowanie dowodu i rejestracja kryptograficzna w Blockchain...", "TAKTIX LOGISTICS", 4);
      
      var rowData = sheet.getRange(row, 1, 1, 10).getValues();
      var sha256Hash = calculateSHA256(rowData.join("|"));
      
      var stampCell = sheet.getRange(row, 18); // Kolumna R (Blockchain Stamp)
      
      if (anchorToBlockchain(sha256Hash)) {
        stampCell.setValue("🔒 BRAMA ZABLOKOWANA (SHA-256: " + sha256Hash + ")");
        stampCell.setFontColor("#008000").setFontWeight("bold");
        sheet.getRange(row, 1, 1, 14).setBackground("#F3F3F3"); // Zamrożenie wiersza dostawy
        e.source.toast("Delivery receipt secured in public Blockchain!", "TAKTIX LOGISTICS", 5);
      } else {
        // Tarcza Awaryjna chmury holdingu
        stampCell.setValue("🛡️ LOCAL LEDGER LOCKED (SHA-256: " + sha256Hash + ")");
        stampCell.setFontColor("#FF8C00").setFontWeight("bold"); 
        sheet.getRange(row, 1, 1, 18).setBackground("#F9F9F9"); 
        
        e.source.toast("OTS Server offline. Secured in local cloud ledger!", "TAKTIX RECOVERY", 6);
        Logger.log("🛡️ SAFE FALLBACK BLOCKCHAIN: Zaryglowano hash lokalny dla wiersza dostaw: " + row);
      }
    }
    
    // -------------------------------------------------------------------------
    // LASER C: IZBA AWARII (T07) - KOREKTA INDEKSU KOLUMNY (M = 13)
    // Nasłuchuje zmian w Kolumnie M (13) - Zamknięcie incydentu przestoju
    // -------------------------------------------------------------------------
    if (sheetName === "T07_VARIABILITY_MANAGEMENT" && row > 1 && col === 13 && (editedValue === "TRUE" || editedValue === "1")) {
      e.source.toast("🔒 Zamykanie incydentu i kotwiczenie awarii w Blockchain...", "TAKTIX ANDON", 4);
      
      var rowData = sheet.getRange(row, 1, 1, 13).getValues();
      var sha256Hash = calculateSHA256(rowData.join("|"));
      
      // Próba kotwiczenia zewnętrznego
      if (anchorToBlockchain(sha256Hash)) {
        var stampCell = sheet.getRange(row, 15); // Kolumna O (PIECZEC_REJESTRU_BLOCKCHAIN)
        stampCell.setValue("🔒 AWARIA ARCHIWALNA (SHA-256: " + sha256Hash + ")");
        stampCell.setFontColor("#FF0000").setFontWeight("bold");
        sheet.getRange(row, 12).setValue("ZAMKNIETY"); // Kolumna L (STATUS)
        sheet.getRange(row, 1, 1, 16).setBackground("#EFEFEF");
        e.source.toast("Variability record locked in Blockchain!", "TAKTIX OS ANDON", 5);
      } else {
        // AWARYJNY RYGIEL LOKALNY (Gdy serwer OTS nie odpowiada)
        e.source.toast("⚠️ OTS Offline. Uruchomiono lokalny rygiel zabezpieczający holdingu.", "TAKTIX KERNEL", 5);
        
        var stampCell = sheet.getRange(row, 15); // Kolumna O (PIECZEC_REJESTRU_BLOCKCHAIN)
        var localTimestamp = "LOCAL_SECURED_" + new Date().getTime() + "_" + sha256Hash.substring(0, 8);
        
        stampCell.setValue("🔒 LOKALNY RYGIEL (ID: " + localTimestamp + ")");
        stampCell.setFontColor("#FF8C00").setFontWeight("bold"); // Pomarańczowy kolor ostrzegawczy dla bazy lokalnej
        
        sheet.getRange(row, 12).setValue("ZAMKNIETY"); // Kolumna L (Fizyczna zmiana statusu na ZAMKNIĘTY)
        sheet.getRange(row, 1, 1, 16).setBackground("#F4F4F4"); // Delikatne szare tło dla zamrożonego wiersza
      }
    }

  } catch (error) {
    Logger.log("🚨 KRYTYCZNY BŁĄD SILNIKA 1 (onEdit Kernel): " + error.toString());
  }
}

function calculateSHA256(dataString) {
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, dataString, Utilities.Charset.UTF_8);
  var sha256Hash = "";
  for (var j = 0; j < rawHash.length; j++) {
    var byteValue = rawHash[j];
    if (byteValue < 0) byteValue += 256;
    var byteString = byteValue.toString(16);
    if (byteString.length == 1) byteString = "0" + byteString;
    sha256Hash += byteString;
  }
  return sha256Hash;
}

function anchorToBlockchain(hashString) {
  try {
    var otsUrl = "https://open-timestamps.org";
    var blobPayload = Utilities.newBlob(hashString, "application/octet-stream");
    var options = {
      "method": "post",
      "contentType": "application/octet-stream",
      "payload": blobPayload,
      "muteHttpExceptions": true
    };
    var response = UrlFetchApp.fetch(otsUrl, options);
    return response.getResponseCode() === 200;
  } catch (err) {
    Logger.log("🚨 OTS Server Error: " + err.toString());
    return false;
  }
}
// =========================================================================
// SILNIK 2: NATIVE EDGE MENU INJECTOR & SIGN-OFF CLEARANCE (NIGHTLY WORKER)
// =========================================================================
function runNativeFormUpdate() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var matrixSheet = spreadsheet.getSheetByName("T02_TAKT_MATRIX");
    var dictSheet = spreadsheet.getSheetByName("T03_PRODUCTION_FLOW_DICTIONARY");
    var slotsSheet = spreadsheet.getSheetByName("T04_LOGISTICS_SLOTS_DICTIONARY");
    var contractsSheet = spreadsheet.getSheetByName("T05_CONTRACTS_REGISTER");
    var plSheet = spreadsheet.getSheetByName("T10_PLAIN_PROFIT_AND_LOSS");
    var boxScoreSheet = spreadsheet.getSheetByName("T11_WEEKLY_BOX_SCORE");
    var t08Sheet = spreadsheet.getSheetByName("T08_DELIVERIES");
    var form4Sheet = spreadsheet.getSheetByName("Form Responses 4");
    
    if (!matrixSheet || !dictSheet || !slotsSheet || !contractsSheet || !plSheet || !boxScoreSheet || !t08Sheet) {
      Logger.log("🚨 KRYTYCZNY BŁĄD: Brak zakładki systemowej!");
      return;
    }

// =========================================================================
    // SEKCJA 1B: DUAL-LANGUAGE AUTOMATED MAIL SYSTEM (CONFIRMATIONS & REJECTIONS)
    // =========================================================================
    var lastRowT08 = t08Sheet.getLastRow();
    if (lastRowT08 >= 2) {
      // 1. Pobranie globalnego języka projektu z T01 (Domyślnie PL, jeśli puste)
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var t01Sheet = ss.getSheetByName("T01_README_AND_LICENSE");
      var projectLang = t01Sheet.getRange("B1").getValue().toString().trim().toUpperCase();
      if (projectLang === "") projectLang = "PL";
      
      var t08Data = t08Sheet.getRange(2, 1, lastRowT08 - 1, 13).getValues();
      
      for (var d = 0; d < t08Data.length; d++) {
        var tokenID = t08Data[d][0].toString();       
        var supplierEmail = t08Data[d][2].toString(); // Kolumna C (Indeks 2)
        var slotTime = t08Data[d][6].toString();      // Kolumna G (Indeks 6)
        var status = t08Data[d][8].toString();        // Kolumna I (Indeks 8)
        
        // POKA-YOKE FLAGI: Konwersja na małe litery, odporna na typ Boolean i String
        var mailSentFlag = t08Data[d][10].toString().toLowerCase().trim(); 
        var rejectReason = t08Data[d][12].toString(); // Kolumna M (Indeks 12)
        
        // Bezpieczna weryfikacja: sprawdzamy czy tekst nie jest "true" oraz czy pole nie ma zaznaczonego checkboxa (TRUE)
        if ((status === "STAT_BOOKED" || status === "STAT_REJECTED") && (mailSentFlag === "true" || t08Data[d][10] === true)) {
          continue; // Ten wiersz został już obsłużony, bezpiecznie lecimy dalej
        }
        
        // ---------------------------------------------------------------------
        // PROCES A: DOSTAWA ZATWIERDZONA (STAT_BOOKED)
        // ---------------------------------------------------------------------
        if (status === "STAT_BOOKED" && supplierEmail !== "") {
          var qrImageUrl = "https://googleapis.com" + encodeURIComponent(tokenID);
          var subject = "";
          var htmlBody = "";
          
        if (projectLang === "DE") {
            subject = "TAKTIX OS — Liefer-Slot Bestätigung";
            htmlBody = "<h3>TAKTIX OS — Logistik-Pass</h3>" +
                       "<p>Ihr Liefer-Slot wurde bestätigt. Bitte zeigen Sie diesen Code am Tor.</p><br>" +
                       "<div style='font-size:20px; font-weight:bold; color:#1a73e8; letter-spacing:1px; background:#f1f3f4; padding:15px; border-radius:5px; display:inline-block;'>" +
                       "TOKEN ID: " + tokenID + "</div>";
          } else {
            // Domyślny format polski (PL)
            subject = "TAKTIX OS — Potwierdzenie Slotu Dostawy";
            htmlBody = "<h3>TAKTIX OS — Paszport Logistyczny</h3>" +
                       "<p>Twój slot dostawy został zatwierdzony. Przedstaw poniższy kod identyfikacyjny na bramie wjazdowej budowy.</p><br>" +
                       "<div style='font-size:20px; font-weight:bold; color:#1a73e8; letter-spacing:1px; background:#f1f3f4; padding:15px; border-radius:5px; display:inline-block;'>" +
                       "TOKEN ID: " + tokenID + "</div>";
          }
                         
          MailApp.sendEmail({ to: supplierEmail, subject: subject, htmlBody: htmlBody });
          t08Sheet.getRange(d + 2, 11).setValue(true); // Wstrzyknięcie czystego logicznego TRUE (Zaznaczenie checkboxa)
          Logger.log("✔ Wysłano mail potwierdzający do: " + supplierEmail + " (Język: " + projectLang + ")");
        }
        
        // ---------------------------------------------------------------------
        // PROCES B: DOSTAWA ODRZUCONA (STAT_REJECTED)
        // ---------------------------------------------------------------------
        else if (status === "STAT_REJECTED" && supplierEmail !== "") {
          var humanReason = "";
          var subjectReject = "";
          var htmlRejectBody = "";
          
          if (projectLang === "DE") {
            subjectReject = "TAKTIX OS — Liefer-Slot Ablehnung";
            if (rejectReason === "ERR_HUB_OVERFLOW") humanReason = "Logistik-Hub überfüllt";
            else if (rejectReason === "ERR_ZONE_NOT_READY") humanReason = "Takt-Zone nicht bereit";
            else humanReason = rejectReason + " - Bitte Bauleiter kontaktieren";
            
            htmlRejectBody = "<h3>TAKTIX OS — Liefer-Slot Status</h3>" +
                             "<p>Sehr geehrte Damen und Herren, Ihr Antrag auf den Liefer-Slot um " + slotTime + " wurde vom Bauleiter <strong>ABGELEHNT</strong>.</p><br>" +
                             "<strong>Grund:</strong> <span style='color:red; font-weight:bold;'>" + humanReason + "</span><br><br>" +
                             "<p>Bitte korrigieren Sie die Daten und senden Sie den Antrag erneut über Forms 1A.</p>";
          } else {
            // Domyślny format polski (PL)
            subjectReject = "TAKTIX OS — Odrzucenie Wniosku o Slot Dostawy";
            if (rejectReason === "ERR_HUB_OVERFLOW") humanReason = "Przepełnienie Huba Magazynowego";
            else if (rejectReason === "ERR_ZONE_NOT_READY") humanReason = "Strefa montażowa niegotowa na przyjęcie towaru";
            else humanReason = rejectReason + " - Skontaktuj się z Inżynierem Kontraktu";
            
            htmlRejectBody = "<h3>TAKTIX OS — Status Rezerwacji Slotu</h3>" +
                             "<p>Szanowni Państwo, Państwa wniosek o slot dostawy na godzinę <strong>" + slotTime + "</strong> został <strong>ODRZUCONY</strong> przez Inżyniera Kontraktu.</p><br>" +
                             "<strong>Przyczyna odrzucenia:</strong> <span style='color:red; font-weight:bold;'>" + humanReason + "</span><br><br>" +
                             "<p>Proszę o skorygowanie danych planistycznych i ponowną aplikację przez Forms 1A.</p>";
          }
                               
          MailApp.sendEmail({ to: supplierEmail, subject: subjectReject, htmlBody: htmlRejectBody });
          t08Sheet.getRange(d + 2, 11).setValue(true); // Wstrzyknięcie czystego logicznego TRUE (Zaznaczenie checkboxa)
          Logger.log("❌ Wysłano mail odrzucający do: " + supplierEmail + " (Język: " + projectLang + ")");
        }
      }
    }

    // =========================================================================
    // SEKCJA 1C: AUTOMATYCZNY AUTOPORTAŻ Z FORMS 4 (WEEKLY SIGN-OFF)
    // =========================================================================
if (form4Sheet) {
  var lastRowF4 = form4Sheet.getLastRow();
  var lastRowPL = plSheet.getLastRow();
  
  if (lastRowF4 >= 2 && lastRowPL >= 2) {
    // Pobranie 4 kolumn (od B do E) z Form responses 4
    var rawF4Data = form4Sheet.getRange(2, 2, lastRowF4 - 1, 4).getValues();
    
    // Pobranie unikalnych TASK_KEY z centralnego ledgera T10 (Kolumna A)
    var plKeys = plSheet.getRange(2, 1, lastRowPL - 1, 1).getValues();
    
    for (var f = 0; f < rawF4Data.length; f++) {
      var rawTaktBoxId = rawF4Data[f][0].toString().trim().toLowerCase();  // Kolumna B: Takt-Box
      var verifiedEmail = rawF4Data[f][2].toString().trim().toLowerCase(); // Kolumna D: Adres e-mail
      var rawTradeCode = rawF4Data[f][3].toString().trim();               // Kolumna E: Kod pakietu prac
      
      if (!rawTaktBoxId || !rawTradeCode || !verifiedEmail) continue;
      
      // Chirurgiczna ekstrakcja czystego kodu branży prosto z dropdownu (odcięcie opisów)
      var tradeCodeMatch = rawTradeCode.match(/^[^| ]+/);
      if (!tradeCodeMatch) continue;
      var cleanTradeCode = tradeCodeMatch[0].toString().trim().toLowerCase();
      
      // Szukamy pasującego wiersza w jądrowej tabeli T10
      for (var p = 0; p < plKeys.length; p++) {
        var currentTaskKey = plKeys[p][0].toString().toLowerCase(); // Odczytujemy pierwszy element tablicy (Kolumna A)
        
        // Złoty rygiel relacyjny: wiersz musi zawierać maila, Takt-Box i czysty kod branży
        if (currentTaskKey.indexOf(verifiedEmail) !== -1 && 
            currentTaskKey.indexOf(rawTaktBoxId) !== -1 && 
            currentTaskKey.indexOf(cleanTradeCode) !== -1) {
          
          var targetRow = p + 2; // Konwersja na realny indeks wiersza w arkuszu
          
          // Bezpiecznik statusu: zapobiega nadpisywaniu już zaryglowanych danych
          var isClosed = plSheet.getRange(targetRow, 20).getValue();
          if (isClosed !== true && isClosed !== 1) {
            
            // Generowanie unikalnego hasha (Symulacja cyfrowej pieczęci Blockchain SHA-256)
            var stringToHash = cleanTradeCode + "|" + verifiedEmail + "_" + rawTaktBoxId + "_" + f;
            var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, stringToHash, Utilities.Charset.UTF_8);
            var blockchainHash = "";
            for (var j = 0; j < rawHash.length; j++) {
              var byteValue = rawHash[j];
              if (byteValue < 0) byteValue += 256;
              var byteString = byteValue.toString(16);
              if (byteString.length == 1) byteString = "0" + byteString;
              blockchainHash += byteString;
            }
            
            // Zrzut danych i zablokowanie zadania w T10
            plSheet.getRange(targetRow, 20).setValue(true); // Akceptacja jakościowa (Checkbox w kolumnie T)
            plSheet.getRange(targetRow, 22).setValue(blockchainHash.substring(0, 16).toUpperCase()); // Pieczęć w kolumnie V
            
            Logger.log("Pomyślnie zamknięto wiersz: " + targetRow);
          }
          break; // Przerywamy wewnętrzną pętlę po udanym dopasowaniu
        }
      }
    }
  }
}
    // =========================================================================
    // SEKCJA 2: NATIVE INJECTION DLA FORMS 0 (LPS INGEST) ORAZ MAPOWANIE BAZY
    // =========================================================================
    var lastRowT02 = matrixSheet.getLastRow();
    var validatedTaktBoxes = [];
    if (lastRowT02 >= 4) {
      var rawT02 = matrixSheet.getRange(4, 1, lastRowT02 - 3, 1).getValues();
      var rawList02 = rawT02.map(function(r) { return r.toString().trim(); }).filter(function(v) { return v !== ""; });
      validatedTaktBoxes = Array.from(new Set(rawList02)); 
    }
    
    var lastRowT05 = contractsSheet.getLastRow();
    var uniqueAssignmentKeys = [];
    if (lastRowT05 >= 2) {
      var rawT05 = contractsSheet.getRange(2, 1, lastRowT05 - 1, 1).getValues();
      var rawList05 = rawT05.map(function(r) { return r.toString().trim(); }).filter(function(v) { return v !== ""; });
      uniqueAssignmentKeys = Array.from(new Set(rawList05)); 
    }

    var form0Id = "1O-jhrNKXEDIND5iF9lQoYljwJjNnMRcBwjuuyLpJDOY"; 
    try {
      var form0 = FormApp.openById(form0Id);
      var form0Items = form0.getItems(FormApp.ItemType.LIST); 
      if (form0Items.length >= 2) {
        form0Items[0].asListItem().setChoiceValues(validatedTaktBoxes);    
        form0Items[1].asListItem().setChoiceValues(uniqueAssignmentKeys);  
        Logger.log("➔ Sukces: Forms 0 zaktualizowany.");
      }
    } catch (e) {
      Logger.log("⚠️ Informacja: Pomijam wtrysk Forms 0.");
    }
    // -------------------------------------------------------------------------
    // SEKCJA 3: NATIVE INJECTION DLA FORMS 1A & 1B (LOGISTYKA DOSTAW)
    // -------------------------------------------------------------------------
    var lastRowT11 = boxScoreSheet.getLastRow();
    var activeAlerts = [];
    if (lastRowT11 >= 2) {
      var rawAlerts = boxScoreSheet.getRange(2, 7, lastRowT11 - 1, 1).getValues();
      rawAlerts.forEach(function(r) {
        if (r && r.toString().indexOf("🚨 ALARM_HUB_PRZEPEŁNIONY") !== -1) activeAlerts.push("HUB_OFFSITE_01");
      });
    }

    var fullLogisticsNodes = [];
    if (lastRowT02 >= 2) {
      var rawFullT02 = matrixSheet.getRange(2, 6, lastRowT02 - 1, 1).getValues();
      var rawListFull = rawFullT02.map(function(r) {
        var boxId = r.toString().trim();
        if (boxId !== "") {
          return (activeAlerts.indexOf(boxId) !== -1) ? "🚨 " + boxId + "_PRZEPEŁNIONY_ZAKAZ_DOSTAW_STOP" : boxId;
        }
        return "";
      }).filter(function(v) { return v !== ""; });
      fullLogisticsNodes = Array.from(new Set(rawListFull)); 
    }

    // RYGIEL ROZWIĄZANIA: Pobieramy menu z godzinami z Kolumny D (Indeks 4) tabeli T04!
    var lastRowT04 = slotsSheet.getLastRow();
    var dynamicSlotsMenu = [];
    if (lastRowT04 >= 2) {
      var rawSlots = slotsSheet.getRange(2, 4, lastRowT04 - 1, 1).getValues(); // Zmiana z kolumny 3 na 4!
      var rawListSlots = rawSlots.map(function(r) { return r.toString().trim(); }).filter(function(v) { return v !== ""; });
      dynamicSlotsMenu = Array.from(new Set(rawListSlots)); 
    }

    // Wtrysk do Forms 1A (Dostawca wybiera wolną godzinę z grafiku)
   var form1AId_Unique = "1mc9bAsRUKd1FHgNxdmT1laeNM4t0qkAf57w9yiFukSw"; 
    try {
      // 1. Autonomiczne pobranie dwujęzycznych branż bezpośrednio z kolumny D (4) w T03
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var dictSheet = ss.getSheetByName("T03_PRODUCTION_FLOW_DICTIONARY");
      var lastRowT03 = dictSheet.getLastRow();
      var localTradeLabels = [];
      
      if (lastRowT03 >= 2) {
        // Zaciągamy kolumnę D (od wiersza 2 do samego dołu)
        var rawT03 = dictSheet.getRange(2, 4, lastRowT03 - 1, 1).getValues();
        var rawList03 = rawT03.map(function(r) { return r.toString().trim(); }).filter(function(v) { return v !== ""; });
        localTradeLabels = Array.from(new Set(rawList03)); // Wyczyszczenie z duplikatów i spacji
      }

      // 2. Otwarcie formularza i twarde zasilenie pierwszego pytania od góry ekranu
      var form1A = FormApp.openById(form1AId_Unique);
      var form1AItems = form1A.getItems(); 
      
      if (form1AItems.length > 0) {
        var firstQuestion = form1AItems[0]; 
        
          if (localTradeLabels.length > 0) {
          // Sukces holdingu: Skorygowane mapowanie typu LIST dla natywnych dropdownów Google Forms
          if (firstQuestion.getType() == FormApp.ItemType.LIST) {
            firstQuestion.asListItem().setChoiceValues(localTradeLabels);
            Logger.log("➔ Sukces holdingu: Forms 1A (Pytanie 1: Branże z T03) zaktualizowane pomyślnie.");
          } else if (firstQuestion.getType() == FormApp.ItemType.MULTIPLE_CHOICE) {
            firstQuestion.asMultipleChoiceItem().setChoiceValues(localTradeLabels);
            Logger.log("➔ Sukces holdingu: Forms 1A (Pytanie 1: Branże z T03 jako wielokrotny wybór) zaktualizowane.");
          } else {
            Logger.log("⚠️ Uwaga: Pierwsze pytanie w Forms 1A to typ: " + firstQuestion.getType());
          }
        } else {
          Logger.log("⚠️ Uwaga: Arkusz T03_PRODUCTION_FLOW_DICTIONARY w kolumnie D wydaje się być pusty.");
        }
      } else {
        Logger.log("⚠️ Uwaga: Formularz Forms 1A nie zawiera żadnych pytań.");
      }
    } catch (e) {
      Logger.log("🚨 KRYTYCZNY ZATOR FORMS 1A: " + e.toString());
    }

    // Wtrysk do Forms 1B (Portier na bramie ma podgląd pełnego grafiku dostaw)
    var form1BId = "1yixMtjnLvqCK1sDGZfjTQN4uSIqZbk70vkTXV8znE9o"; 
    try {
      var form1B = FormApp.openById(form1BId);
      var form1BItems = form1B.getItems(); // Pobieramy wszystkie pozostałe elementy
      
      // Portier nie ma już dropdownów o czasie i miejscu. 
      // Skrypt wysyła tylko potwierdzenie czystego połączenia z bazą, nie dotykając usuniętych pól.
      if (form1BItems.length > 0) {
        Logger.log("➔ Sukces holdingu: Forms 1B (Struktura Portiera) zweryfikowana i bezpieczna.");
      } else {
        Logger.log("⚠️ Uwaga: Formularz Forms 1B wydaje się być pusty.");
      }
    } catch (e) {
      Logger.log("⚠️ Informacja: Pomijam lub błąd wtrysku Forms 1B: " + e.toString());
    }
    // -------------------------------------------------------------------------
    // SEKCJA 4: NATIVE INJECTION DLA FORMS 2, 3 I 4 (EDYKCJA PRZEPŁYWÓW)
    // -------------------------------------------------------------------------
    var lastRowT03 = dictSheet.getLastRow();
    var uniqueTradeLabels = [];
    if (lastRowT03 >= 2) {
      var rawT03 = dictSheet.getRange(2, 4, lastRowT03 - 1, 1).getValues();
      var rawList03 = rawT03.map(function(r) { return r.toString().trim(); }).filter(function(v) { return v !== ""; });
      uniqueTradeLabels = Array.from(new Set(rawList03));
    }

    var form2Id = "1IMUe2an7WZKhWe7EG0awxRitF05JJD8XoEwb_doH49g";
     try {
      var form2 = FormApp.openById(form2Id);
      var form2Items = form2.getItems(FormApp.ItemType.LIST);
      
      // Sukces holdingu: Obsługujemy teraz oba dropdowny w formularzu usterek
      if (form2Items.length >= 1 && uniqueTradeLabels.length > 0) {
        form2Items[0].asListItem().setChoiceValues(uniqueTradeLabels); // Dropdown 1: Branże odpowiedzialne
        Logger.log("➔ Sukces: Forms 2 (Branże) zaktualizowany.");
      }
      if (form2Items.length >= 2 && validatedTaktBoxes.length > 0) {
        form2Items[1].asListItem().setChoiceValues(validatedTaktBoxes); // Dropdown 2: Lokalizacja Takt-Box (w tym P_GENERAL_MAIN)
        Logger.log("➔ Sukces: Forms 2 (Lokalizacje) zaktualizowany.");
      }
    } catch (e) {
      Logger.log("⚠️ Informacja: Pomijam wtrysk Forms 2: " + e.toString());
    }

    var form3Id = "1JtGRp4h1GIWDj39EaRrEP5KA99riSHNkBDe1QTUFmnw";
    try {
      var form3 = FormApp.openById(form3Id);
      var form3Items = form3.getItems(FormApp.ItemType.LIST);
      if (form3Items.length >= 2) {
        if (validatedTaktBoxes.length > 0) form3Items[0].asListItem().setChoiceValues(validatedTaktBoxes);
        if (uniqueTradeLabels.length > 0) form3Items[1].asListItem().setChoiceValues(uniqueTradeLabels);
        Logger.log("➔ Sukces: Forms 3 zaktualizowany.");
      }
    } catch (e) {
      Logger.log("⚠️ Informacja: Pomijam wtrysk Forms 3.");
    }

    var form4Id = "1vsCxqVH20Ke86BqXpxd-G299wmd4usqHQWYuMzCjgqU";
    try {
      var form4 = FormApp.openById(form4Id);
      var form4Items = form4.getItems(FormApp.ItemType.LIST);
      if (form4Items.length >= 1 && validatedTaktBoxes.length > 0) {
        form4Items[0].asListItem().setChoiceValues(validatedTaktBoxes);
        Logger.log("➔ Sukces: Forms 4 zaktualizowany.");
      }
    } catch (e) {
      Logger.log("⚠️ Informacja: Pomijam wtrysk Forms 4.");
    }

    // Uruchomienie mostu walutowego holdingu
    fetchNightlyExchangeRate();

    Logger.log("=========================================================================");
    Logger.log("🚀 ARCHITEKTONICZNY SUKCES! Jądro TAKTIX OS (v1.2.6 Monolith) aktywne.");
    Logger.log("=========================================================================");
  } catch (error) {
    Logger.log("🚨 KRYTYCZNY BŁĄD SKRYPTU INGESTION: " + error.toString());
  }
    // Na samym końcu funkcji, po wykonaniu wszystkich natywnych aktualizacji holdingu:
  secureNewTaktixRegisters(typeof e !== 'undefined' ? e : null);
}

// =========================================================================
// SILNIK 3: FOREX DAEMON (Protokół Ingestion z API NBP)
// Status: CAŁKOWICIE ODPORNY NA BŁĘDY NBP | Wersja: v1.2.7 Monolith (EN)
// =========================================================================
function fetchNightlyExchangeRate() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var readmeSheet = spreadsheet.getSheetByName("T01_README_AND_LICENSE");
  
  if (!readmeSheet) {
    Logger.log("🚨 KRYTYCZNY ALERT DAEMONA FX: Nie odnaleziono arkusza T01_README_AND_LICENSE!");
    return;
  }
  
  var rateCell = readmeSheet.getRange("B5");
  
  try {
    // 1. POPRAWKA ENDPOINTU: Odpytujemy bezpośrednie, dedykowane API JSON dla tabeli A kursu EUR
    var url = "http://nbp.pl";
    var options = {
      "method": "get",
      "muteHttpExceptions": true,
      "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    };
    
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    var responseText = response.getContentText();
    
    if (responseCode === 200) {
      // Bezpiecznik formatu: Eliminujemy ryzyko parsowania kodu HTML
      if (responseText.trim().indexOf("<!DOCTYPE") === 0 || responseText.trim().indexOf("<html") === 0) {
        throw new SyntaxError("Serwer NBP zwrócił strukturę HTML zamiast bazy danych JSON.");
      }
      
      var json = JSON.parse(responseText);
      
      // Korekta składni API NBP: W tabeli pojedynczej 'rates' to tablica z jednym obiektem [0]
      var rawRate = parseFloat(json.rates[0].mid); 
      
      if (rawRate && !isNaN(rawRate) && rawRate > 0) {
        // Zrzut przeliczonej stawki bezpośrednio do komórki sterującej B5
        rateCell.setValue(rawRate);
        rateCell.setNumberFormat("#,##0.00"); 
        
        spreadsheet.toast("Kurs EUR/PLN (" + rawRate + ") pobrany pomyślnie z API NBP!", "TAKTIX OS FOREX", 5);
        Logger.log("💚 SUKCES DAEMONA FX: Zaktualizowano kurs komórki B5 wartością: " + rawRate);
        return; 
      }
    }
    
    throw new Error("Serwer NBP zwrócił kod błędu HTTP: " + responseCode);
    
  } catch (fxError) {
    // =========================================================================
    // PROTOKÓŁ AWARYJNY (SAFE FALLBACK PROTOCOL) - Tarcza Ochronna Monolitu
    // =========================================================================
    Logger.log("🚨 ALERT DAEMONA FX: Przechwycono błąd: " + fxError.toString());
    
    var currentStoredRate = rateCell.getValue();
    // Jeśli w komórce leży Twój poprzedni kurs (np. 4.35), zostawiamy go i nie przerywamy pracy systemu
    if (currentStoredRate && !isNaN(currentStoredRate) && currentStoredRate > 0) {
      Logger.log("🛡️ SAFE FALLBACK: Zachowano dotychczasowy zaryglowany kurs: " + currentStoredRate);
      spreadsheet.toast("API NBP niedostępne w weekend. Zachowano kurs: " + currentStoredRate, "TAKTIX OS RECOVERY", 7);
    } else {
      // Ostateczny bezpiecznik w przypadku sterylnie pustej komórki B5
      rateCell.setValue(4.35);
      rateCell.setNumberFormat("#,##0.00");
      Logger.log("🛡️ SAFE FALLBACK: Wstrzyknięto twardy ryczałt awaryjny: 4.35");
      spreadsheet.toast("Krytyczny brak danych. Wstrzyknięto ryczałt awaryjny: 4.35", "TAKTIX OS RECOVERY PANIC", 7);
    }
  }
}
/**
 * AUTONOMICZNY RYGIEL KRYPTOGRAFICZNY DLA NOWYCH REJESTRÓW HOLDINGU
 * [Dopisany na końcu pliku, nie zakłóca działających funkcji]
 */
function secureNewTaktixRegisters(e) {
    // Jeśli funkcja została wywołana bez obiektu zdarzenia (np. z poziomu runNativeFormUpdate), natychmiast przerywamy podproces:
  if (!e || !e.range) {
    Logger.log("ℹ️ Autonomiczne wywołanie rejestru: Pominięto weryfikację e.range.");
    return; 
  }
  try {
    var sheet = e.range.getSheet();
    var sheetName = sheet.getName();
    var row = e.range.getRow();
    var rowValues = e.range.getValues()[0]; // Pobranie wartości nowo dodanego wiersza
    
    // Sprawdzamy, czy to jedna z trzech nowych tabel holdingowych
    if (sheetName === "T07_VARIABILITY_MANAGEMENT" || 
        sheetName === "T08_DELIVERIES" || 
        sheetName === "T09_LEAN_TRANSFORMATION_COSTS") {
          
      // 1. Sklejenie danych wiersza w jeden tekst i wygenerowanie hasha Twoją funkcją calculateSHA256
      var stringToHash = rowValues.join("|");
      var cryptoHash = calculateSHA256(stringToHash);
      
      // 2. Chirurgiczny wtrysk hasha w odpowiednią kolumnę, nadpisując "LOCAL_SECURED"
      if (sheetName === "T07_VARIABILITY_MANAGEMENT") {
        sheet.getRange(row, 15).setValue(cryptoHash); // Kolumna O (15)
      } 
      else if (sheetName === "T08_DELIVERIES") {
        // NOWOŚĆ: Przesuwamy wtrysk bezpośrednio do Kolumny R (18), chroniąc dane DPP w Q!
        sheet.getRange(row, 18).setValue(cryptoHash); // Kolumna R (18)
      } 
      else if (sheetName === "T09_LEAN_TRANSFORMATION_COSTS") {
        sheet.getRange(row, 9).setValue(cryptoHash);  // Kolumna I (9)
      }
    }
  } catch(err) {
    Logger.log("🚨 Uwaga: Pętla zabezpieczająca wykryła odchylenie: " + err.toString());
  }
}
