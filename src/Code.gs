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
    
    // -------------------------------------------------------------------------
    // LASER A: CENTRALNY LEDGER P&L (T10) - Blokada Finansowa
    // Nasłuchuje zmian w Kolumnie U (21) - Uwolnienie płatności
    // -------------------------------------------------------------------------
    if (sheetName === "T10_PLAIN_PROFIT_AND_LOSS" && row > 1 && col === 21 && (e.value === "TRUE" || e.value === "1")) {
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
      
      if (anchorToBlockchain(sha256Hash)) {
        var statusCell = sheet.getRange(row, 22); // Kolumna V
        statusCell.setValue("🔒 BLOCKED & ANCHORED (SHA-256: " + sha256Hash + ")");
        statusCell.setFontColor("#008000").setFontWeight("bold");
        sheet.getRange(row, 1, 1, 22).setBackground("#F3F3F3");
        e.source.toast("Row permanently anchored in Blockchain!", "TAKTIX OS HOLDING", 5);
      } else {
        e.source.toast("🚨 BŁĄD TIMESTAMPS: Serwer OTS nie odpowiedział poprawnie.", "TAKTIX OS KERNEL", 5);
        range.setValue(false);
      }
    }
    
    // -------------------------------------------------------------------------
    // LASER B: BRAMA WJAZDOWA (T08) - Blokada Paszportu Logistycznego
    // Nasłuchuje zmian w Kolumnie J (10) - Weryfikacja inżyniera / portiera
    // -------------------------------------------------------------------------
    if (sheetName === "T08_DELIVERIES" && row > 1 && col === 10 && (e.value === "TRUE" || e.value === "1")) {
      e.source.toast("🔒 Generowanie dowodu wjazdu i kotwiczenie w Blockchain...", "TAKTIX LOGISTICS", 4);
      
      var rowData = sheet.getRange(row, 1, 1, 10).getValues();
      var sha256Hash = calculateSHA256(rowData.join("|"));
      
      var stampCell = sheet.getRange(row, 12); // Kolumna L (Blockchain Stamp)
      
      if (anchorToBlockchain(sha256Hash)) {
        // SCENARIUSZ 1: Serwer OTS działa idealnie
        stampCell.setValue("🔒 BRAMA ZABLOKOWANA (SHA-256: " + sha256Hash + ")");
        stampCell.setFontColor("#008000").setFontWeight("bold");
        sheet.getRange(row, 1, 1, 14).setBackground("#F3F3F3"); // Zamrożenie wiersza dostawy
        e.source.toast("Delivery receipt secured in public Blockchain!", "TAKTIX LOGISTICS", 5);
      } else {
        // SCENARIUSZ 2: Tarcza Awaryjna - Serwer OTS przeciążony. Zabezpieczamy lokalnie w chmurze!
        stampCell.setValue("🛡️ LOCAL LEDGER LOCKED (SHA-256: " + sha256Hash + ")");
        stampCell.setFontColor("#FF8C00").setFontWeight("bold"); // Pomarańczowy alert pancerza chmury
        sheet.getRange(row, 1, 1, 14).setBackground("#F9F9F9"); // Lekkie zamrożenie
        
        e.source.toast("OTS Server offline. Secured in local cloud ledger!", "TAKTIX RECOVERY", 6);
        Logger.log("🛡️ SAFE FALLBACK BLOCKCHAIN: Zachowano i zaryglowano hash lokalny dla wiersza: " + row);
      }
    }
    // -------------------------------------------------------------------------
    // LASER C: IZBA AWARII (T07) - Blokada Protokołu Przestoju (Andon)
    // Nasłuchuje zmian w Kolumnie L (12) - Zamknięcie incydentu przestoju
    // -------------------------------------------------------------------------
    if (sheetName === "T07_VARIABILITY_MANAGEMENT" && row > 1 && col === 12 && (e.value === "TRUE" || e.value === "1")) {
      e.source.toast("🔒 Zamykanie incydentu i kotwiczenie awarii w Blockchain...", "TAKTIX ANDON", 4);
      
      var rowData = sheet.getRange(row, 1, 1, 12).getValues();
      var sha256Hash = calculateSHA256(rowData.join("|"));
      
      if (anchorToBlockchain(sha256Hash)) {
        var stampCell = sheet.getRange(row, 13); // Kolumna M
        stampCell.setValue("🔒 AWARIA ARCHIWALNA (SHA-256: " + sha256Hash + ")");
        stampCell.setFontColor("#FF0000").setFontWeight("bold");
        sheet.getRange(row, 1, 1, 13).setBackground("#EFEFEF");
        e.source.toast("Variability record locked in Blockchain!", "TAKTIX OS ANDON", 5);
      } else {
        e.source.toast("🚨 BŁĄD ANDON: Serwer OTS nie odpowiedział.", "TAKTIX KERNEL", 5);
        range.setValue(false);
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
      var t08Data = t08Sheet.getRange(2, 1, lastRowT08 - 1, 13).getValues();
      
      for (var d = 0; d < t08Data.length; d++) {
        var tokenID = t08Data[d][0].toString();       
        var supplierEmail = t08Data[d][2].toString(); // Kolumna C (Indeks 2)
        var slotTime = t08Data[d][6].toString();      // Kolumna G (Indeks 6)
        var status = t08Data[d][8].toString();        // Kolumna I (Indeks 8)
        var mailSentFlag = t08Data[d][10].toString(); // Kolumna K (Indeks 10)
        var rejectReason = t08Data[d][12].toString(); // Kolumna M (Indeks 12)
        
        if (status === "STAT_BOOKED" && mailSentFlag !== "TRUE" && supplierEmail !== "") {
          var qrImageUrl = "https://googleapis.com" + encodeURIComponent(tokenID);
          var htmlBody = "<h3>TAKTIX OS — Paszport Logistyczny / Logistik-Pass</h3>" +
                         "<p>Twój slot dostawy został zatwierdzony. Przedstaw poniższy kod QR na bramie wjazdowej budowy.</p>" +
                         "<p>Ihr Liefer-Slot wurde bestätigt. Bitte zeigen Sie den QR-Code am Tor.</p><br>" +
                         "<img src='" + qrImageUrl + "'><br><br>" +
                         "<strong>TOKEN ID:</strong> " + tokenID;
                         
          MailApp.sendEmail({
            to: supplierEmail,
            subject: "TAKTIX OS — Potwierdzenie Slotu Dostawy / Liefer-Slot Bestätigung",
            htmlBody: htmlBody
          });
          t08Sheet.getRange(d + 2, 11).setValue(true); // Oznaczenie kolumny K jako wysłane
        }
        else if (status === "STAT_REJECTED" && mailSentFlag !== "TRUE" && supplierEmail !== "") {
          var humanReason = "";
          if (rejectReason === "ERR_HUB_OVERFLOW") {
            humanReason = "Przepełnienie Huba Magazynowego / Logistik-Hub überfüllt";
          } else if (rejectReason === "ERR_ZONE_NOT_READY") {
            humanReason = "Strefa montażowa niegotowa na przyjęcie towaru / Takt-Zone nicht bereit";
          } else {
            humanReason = rejectReason + " - Skontaktuj się z Inżynierem / Bitte Bauleiter kontaktieren";
          }
                               
          var htmlRejectBody = "<h3>TAKTIX OS — Status Rezerwacji Slotu / Liefer-Slot Status</h3>" +
                               "<p>Szanowni Państwo, Państwa wniosek o slot dostawy na godzinę <strong>" + slotTime + "</strong> został <strong>ODRZUCONY</strong> przez Inżyniera Kontraktu.</p>" +
                               "<p>Sehr geehrte Damen und Herren, Ihr Antrag auf den Liefer-Slot um " + slotTime + " wurde vom Bauleiter <strong>ABGELEHNT</strong>.</p><br>" +
                               "<strong>Przyczyna odrzucenia / Grund:</strong> <span style='color:red; font-weight:bold;'>" + humanReason + "</span><br><br>" +
                               "<p>Proszę o skorygowanie danych planistycznych i ponowną aplikację przez Forms 1A. / Bitte korrigieren Sie die Daten und senden Sie den Antrag erneut über Forms 1A.</p>";
                               
          MailApp.sendEmail({
            to: supplierEmail,
            subject: "TAKTIX OS — Odrzucenie Wniosku o Slot / Liefer-Slot Ablehnung",
            htmlBody: htmlRejectBody
          });
          t08Sheet.getRange(d + 2, 11).setValue(true); // Oznaczenie kolumny K jako wysłane
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
    var form1AId = "1mc9bAsRUKd1FHgNxdmT1laeNM4t0qkAf57w9yiFukSw"; 
    try {
      var form1A = FormApp.openById(form1AId);
      var form1AItems = form1A.getItems(FormApp.ItemType.LIST); 
      if (form1AItems.length >= 2) {
        form1AItems[0].asListItem().setChoiceValues(fullLogisticsNodes); // Pierwszy dropdown: Huby/Strefy
        form1AItems[1].asListItem().setChoiceValues(dynamicSlotsMenu);   // Drugi dropdown: Żywy Grafik Godzinowy!
        Logger.log("➔ Sukces: Forms 1A zaktualizowany o żywy grafik.");
      }
    } catch (e) {
      Logger.log("⚠️ Informacja: Pomijam wtrysk Forms 1A.");
    }

    // Wtrysk do Forms 1B (Portier na bramie ma podgląd pełnego grafiku dostaw)
    var form1BId = "1yixMtjnLvqCK1sDGZfjTQN4uSIqZbk70vkTXV8znE9o"; 
    try {
      var form1B = FormApp.openById(form1BId);
      var form1BItems = form1B.getItems(FormApp.ItemType.LIST); 
      if (form1BItems.length >= 2) {
        form1BItems[0].asListItem().setChoiceValues(fullLogisticsNodes);
        form1BItems[1].asListItem().setChoiceValues(dynamicSlotsMenu);
        Logger.log("➔ Sukces: Forms 1B pomyślnie zsynchronizowany z grafikiem.");
      }
    } catch (e) {
      Logger.log("🚨 Krytyczny błąd wtrysku Forms 1B: " + e.message);
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
      if (form2Items.length >= 1 && uniqueTradeLabels.length > 0) {
        form2Items[0].asListItem().setChoiceValues(uniqueTradeLabels);
        Logger.log("➔ Sukces: Forms 2 zaktualizowany.");
      }
    } catch (e) {
      Logger.log("⚠️ Informacja: Pomijam wtrysk Forms 2.");
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
  secureNewTaktixRegisters(e);
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
