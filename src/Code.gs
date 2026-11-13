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
  // =========================================================================
  // OSTATECZNY, MULTI-LANG RYGIEL PROCESOWY DLA CHECK #2 (POLSKI + NIEMIECKI DLA WIEDNIA)
  // =========================================================================
  var range = e.range;
  var sheet = range.getSheet();
  
  // Bezpiecznik: Reagujemy tylko, gdy edytowana jest tabela T10 i kolumna U (21) czyli check #2
  if (sheet.getName() === "T10_PLAIN_PROFIT_AND_LOSS" && range.getColumn() === 21) {
    var targetRow = range.getRow();
    
    // Jeśli inżynier chciał zatwierdzić płatność (zaznaczyć checkbox na TRUE)
    if (range.getValue() === true) {
      
      // Pobranie danych do zbudowania klucza z nienaruszalnych kolumn wiersza
      var rowValues = sheet.getRange(targetRow, 1, 1, 5).getValues()[0];
      var weekNum = rowValues[0].toString().substring(0, 3); // Wyciąga np. W43
      var locationTakt = rowValues[3].toString().trim();     // Kolumna D: LOKALIZACJA_TAKTU
      var tradeCode = rowValues[4].toString().trim();         // Kolumna E: KOD_BRANZY
      
      // Budujemy czysty, systemowy klucz dla TEJ SAMEJ branży w formacie Formsa 4
      var currentSearchKey = weekNum + "_" + locationTakt + "_" + tradeCode;
      
      // Otwarcie bazy Forms 4 i pobranie wszystkich kluczy SCHEDULE_KEY_CLOSE (Kolumna G)
      var f4Sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form responses 4");
      var f4Keys = [];
      if (f4Sheet && f4Sheet.getLastRow() >= 2) {
        f4Keys = f4Sheet.getRange(2, 7, f4Sheet.getLastRow() - 1, 1).getValues().flat().map(function(k) {
          return k.toString().trim();
        });
      }
      
      // Jeśli brak deklaracji zamknięcia taktu w Forms 4 przez TĘ SAMĄ branżę — uruchom dwujęzyczny alert blokujący
      if (!f4Keys.includes(currentSearchKey)) {
        
        // Pobranie aktywnego języka holdingu z T01 (Obsługa PL / DE dla Wiednia)
        var sheetT01 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("T01_README_AND_LICENSE");
        var lang = (sheetT01) ? sheetT01.getRange("B1").getValue().toString().toUpperCase() : "PL";
        
        var alertTitle = "";
        var alertBody = "";
        var statusMsg = "";
        
        if (lang === "DE") {
          alertTitle = "🚨 PROZESSFEHLER:";
          alertBody = "Sie können die Zahlung nicht freigeben (check #2)!\n\nDer Auftragnehmer für dieses Gewerk (" + tradeCode + ") hat die Takt-Box-Abschlussmeldung in Forms 4 für die Zone " + locationTakt + " noch nicht eingereicht.";
          statusMsg = "⚠️ WARTET AUF FORMS 4";
        } else {
          alertTitle = "🚨 BŁĄD PROCESU:";
          alertBody = "Nie możesz uwolnić płatności (check #2)!\n\nWykonawca tej branży (" + tradeCode + ") nie złożył jeszcze deklaracji zamknięcia taktu w Forms 4 dla strefy " + locationTakt + ".";
          statusMsg = "⚠️ OCZEKUJE NA FORMS 4";
        }
        
        // Blokada: Skrypt cofa zaznaczenie check #2 i wstrzykuje komunikat do kolumny V
        sheet.getRange(targetRow, 22).setValue(statusMsg); // Kolumna V: PIECZEC_REJESTRU_BLOCKCHAIN
        range.setValue(false);                            // Kasowanie checkboxa U (21)
        
        SpreadsheetApp.getUi().alert(alertTitle + "\n\n" + alertBody);
        return; // Odcięcie zasilania finansowego Smart Contractu!
      } else {
        // Jeśli Forms 4 istnieje, czyścimy status tekstowy, dając wolną drogę dla Blockchain Stamp
        sheet.getRange(targetRow, 22).setValue("");
      }
    }
  }
  // =========================================================================
  // KONIEC RYGLES: DALSZA ORYGINALNA CZĘŚĆ FUNKCJI ONEDIT(E) MOŻE SIĘ WYKONAĆ...
  // =========================================================================
  if (!e) return;
  try {
    var range = e.range;
    var sheet = range.getSheet();
    var sheetName = sheet.getName();
    var row = range.getRow();
    var col = range.getColumn();
    var editedValue = e.value ? e.value.toString().trim().toUpperCase() : "";
    
// -------------------------------------------------------------------------
    // LASER A: CENTRALNY LEDGER P&L (T10) - Blokada Finansowa (PL / DE / EN)
    // Nasłuchuje zmian w Kolumnie U (21) - Uwolnienie płatności
    // -------------------------------------------------------------------------
    if (sheetName === "T10_PLAIN_PROFIT_AND_LOSS" && row > 1 && col === 21 && (editedValue === "TRUE" || editedValue === "1" || editedValue === true)) {
      var langSheet = e.source.getSheetByName("T01_README_AND_LICENSE");
      var lang = langSheet ? langSheet.getRange("B1").getValue().toString().trim().toUpperCase() : "PL";
      if (lang !== "PL" && lang !== "DE" && lang !== "EN") lang = "PL";

      var i18nLaserA = {
        PL: {
          noQuality: "🚨 BŁĄD: Takt nie posiada weryfikacji jakościowej w Kolumnie T! Blokada transakcji.",
          suspended: "🚨 KRYTYCZNY ALERT ANDON: Podwykonawca zablokowany w T05! Uwolnienie płatności unieważnione.",
          otsSuccess: "Wiersz trwale zakotwiczony w zewnętrznym Blockchain!",
          otsBusy: "Serwer OTS zajęty. Zastosowano lokalną pieczęć kryptograficzną holdingu.",
          otsError: "Błąd sieciowy API. Wiersz bezpiecznie zablokowany lokalnym hashem SHA-256."
        },
        DE: {
          noQuality: "🚨 FEHLER: Keine Qualitätsprüfung in Spalte T vorhanden! Transaktion gesperrt.",
          suspended: "🚨 KRITISCHER ANDON-ALARM: Nachunternehmer in T05 gesperrt! Zahlungsfreigabe annulliert.",
          otsSuccess: "Zeile dauerhaft in der externen Blockchain verankert!",
          otsBusy: "OTS-Server ausgelastet. Lokales kryptografisches Holding-Siegel angewendet.",
          otsError: "API-Netzwerkfehler. Zeile sicher mit lokalem SHA-256-Hash gesperrt."
        },
        EN: {
          noQuality: "🚨 ERROR: Missing quality verification in Column T! Transaction blocked.",
          suspended: "🚨 CRITICAL ANDON ALERT: Subcontractor suspended in T05! Payment release cancelled.",
          otsSuccess: "Row permanently anchored in external Blockchain!",
          otsBusy: "OTS server busy. Applied local holding cryptographic seal.",
          otsError: "API network error. Row safely locked with local SHA-256 hash."
        }
      };

      var qualityCheck = sheet.getRange(row, 20).getValue(); // Kolumna T (20)
      if (qualityCheck !== true && qualityCheck !== "TRUE") {
        e.source.toast(i18nLaserA[lang].noQuality, "TAKTIX OS ANDON", 7);
        range.setValue(false); // Poka-Yoke!
        return;
      }
      
      var tradeCodeInT10 = sheet.getRange(row, 5).getValue().toString();
      var t05Sheet = e.source.getSheetByName("T05_CONTRACTS_REGISTER");
      if (t05Sheet) {
        var t05Data = t05Sheet.getRange("B2:J" + t05Sheet.getLastRow()).getValues();
        for (var i = 0; i < t05Data.length; i++) {
          var statusStr = t05Data[i][8].toString().toUpperCase();
          if (t05Data[i][0].toString() === tradeCodeInT10 && (statusStr.indexOf("ZAWIESZONY") !== -1 || statusStr.indexOf("SUSPENDED") !== -1 || statusStr.indexOf("GESPERRT") !== -1)) {
            e.source.toast(i18nLaserA[lang].suspended, "TAKTIX OS KERNEL", 7);
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
          e.source.toast(i18nLaserA[lang].otsSuccess, "TAKTIX OS HOLDING", 5);
        } else {
          // Rezerwowa pieczęć wewnętrzna grupy kapitałowej
          statusCell.setValue("🔒 LOCAL LEDGER ANCHORED (SHA-256: " + sha256Hash.substring(0,8) + "...)");
          statusCell.setFontColor("#0056B3").setFontWeight("bold"); // Kolor niebieski dla rejestru lokalnego
          sheet.getRange(row, 1, 1, 22).setBackground("#F3F3F3");
          e.source.toast(i18nLaserA[lang].otsBusy, "TAKTIX OS LOCAL LEDGER", 6);
        }
      } catch(err) {
        // Zabezpieczenie na wypadek całkowitego błędu wykonania funkcji sieciowej
        statusCell.setValue("🔒 LOCAL LEDGER ANCHORED (SHA-256: " + sha256Hash.substring(0,8) + "...)");
        statusCell.setFontColor("#0056B3").setFontWeight("bold");
        sheet.getRange(row, 1, 1, 22).setBackground("#F3F3F3");
        e.source.toast(i18nLaserA[lang].otsError, "TAKTIX OS LOCAL LEDGER", 6);
      }
    }
// -------------------------------------------------------------------------
    // LASER B: BRAMA WJAZDOWA (T08) - Blokada Paszportu Logistycznego (PL / DE / EN)
    // Nasłuchuje Dropdownu w Kolumnie J (10) - BOOKING lub REJECTION
    // -------------------------------------------------------------------------
    if (sheetName === "T08_DELIVERIES" && row > 1 && col === 10 && (editedValue === "BOOKING" || editedValue === "REJECTION")) {
      var langSheetB = e.source.getSheetByName("T01_README_AND_LICENSE");
      var langB = langSheetB ? langSheetB.getRange("B1").getValue().toString().trim().toUpperCase() : "PL";
      if (langB !== "PL" && langB !== "DE" && langB !== "EN") langB = "PL";

      var i18nLaserB = {
        PL: {
          generating: "🔒 Generowanie dowodu i rejestracja kryptograficzna w Blockchain...",
          stampLocked: "🔒 BRAMA ZABLOKOWANA (SHA-256: ",
          toastSuccess: "Dowód dostawy zabezpieczony w publicznym Blockchain!",
          stampFallback: "🛡️ LOKALNY REJESTR ZABLOKOWANY (SHA-256: ",
          toastOffline: "Serwer OTS niedostępny. Zabezpieczono w lokalnym rejestrze chmury!"
        },
        DE: {
          generating: "🔒 Nachweis wird generiert und kryptografisch in der Blockchain registriert...",
          stampLocked: "🔒 TOR GESPERRT (SHA-256: ",
          toastSuccess: "Liefernachweis in der öffentlichen Blockchain gesichert!",
          stampFallback: "🛡️ LOKALES LEDGER GESPERRT (SHA-256: ",
          toastOffline: "OTS-Server offline. Im lokalen Cloud-Ledger gesichert!"
        },
        EN: {
          generating: "🔒 Generating proof and cryptographic registration in Blockchain...",
          stampLocked: "🔒 GATE LOCKED (SHA-256: ",
          toastSuccess: "Delivery receipt secured in public Blockchain!",
          stampFallback: "🛡️ LOCAL LEDGER LOCKED (SHA-256: ",
          toastOffline: "OTS Server offline. Secured in local cloud ledger!"
        }
      };

      e.source.toast(i18nLaserB[langB].generating, "TAKTIX LOGISTICS", 4);
      
      var rowData = sheet.getRange(row, 1, 1, 10).getValues();
      var sha256Hash = calculateSHA256(rowData.join("|"));
      
      var stampCell = sheet.getRange(row, 18); // Kolumna R (Blockchain Stamp)
      
      if (anchorToBlockchain(sha256Hash)) {
        stampCell.setValue(i18nLaserB[langB].stampLocked + sha256Hash + ")");
        stampCell.setFontColor("#008000").setFontWeight("bold");
        sheet.getRange(row, 1, 1, 14).setBackground("#F3F3F3"); // Zamrożenie wiersza dostawy
        e.source.toast(i18nLaserB[langB].toastSuccess, "TAKTIX LOGISTICS", 5);
      } else {
        // Tarcza Awaryjna chmury holdingu
        stampCell.setValue(i18nLaserB[langB].stampFallback + sha256Hash + ")");
        stampCell.setFontColor("#FF8C00").setFontWeight("bold"); 
        sheet.getRange(row, 1, 1, 18).setBackground("#F9F9F9"); 
        
        e.source.toast(i18nLaserB[langB].toastOffline, "TAKTIX RECOVERY", 6);
        Logger.log("🛡️ SAFE FALLBACK BLOCKCHAIN: Zaryglowano hash lokalny dla wiersza dostaw: " + row);
      }
    }
    // -------------------------------------------------------------------------
    // LASER C: IZBA AWARII (T07) - KOREKTA INDEKSU KOLUMNY (M = 13) (PL / DE / EN)
    // Nasłuchuje zmian w Kolumnie M (13) - Zamknięcie incydentu przestoju
    // -------------------------------------------------------------------------
    if (sheetName === "T07_VARIABILITY_MANAGEMENT" && row > 1 && col === 13 && (editedValue === "TRUE" || editedValue === "1" || editedValue === true)) {
      var langSheetC = e.source.getSheetByName("T01_README_AND_LICENSE");
      var langC = langSheetC ? langSheetC.getRange("B1").getValue().toString().trim().toUpperCase() : "PL";
      if (langC !== "PL" && langC !== "DE" && langC !== "EN") langC = "PL";

      var i18nLaserC = {
        PL: {
          closing: "🔒 Zamykanie incydentu i kotwiczenie awarii w Blockchain...",
          stampArchived: "🔒 AWARIA ARCHIWALNA (SHA-256: ",
          statusClosed: "ZAMKNIETY",
          toastSuccess: "Rekord zmienności zablokowany w Blockchain!",
          toastOffline: "⚠️ OTS Offline. Uruchomiono lokalny rygiel zabezpieczający holdingu.",
          stampLocal: "🔒 LOKALNY RYGIEL (ID: "
        },
        DE: {
          closing: "🔒 Störung wird geschlossen und in der Blockchain verankert...",
          stampArchived: "🔒 ARCHIVIERTE STÖRUNG (SHA-256: ",
          statusClosed: "GESCHLOSSEN",
          toastSuccess: "Variabilitätsdatensatz in der Blockchain gesperrt!",
          toastOffline: "⚠️ OTS Offline. Lokale Holding-Sicherungssperre aktiviert.",
          stampLocal: "🔒 LOKALE SPERRE (ID: "
        },
        EN: {
          closing: "🔒 Closing incident and anchoring variability in Blockchain...",
          stampArchived: "🔒 ARCHIVED INCIDENT (SHA-256: ",
          statusClosed: "CLOSED",
          toastSuccess: "Variability record locked in Blockchain!",
          toastOffline: "⚠️ OTS Offline. Local holding security lock activated.",
          stampLocal: "🔒 LOCAL LOCK (ID: "
        }
      };

      e.source.toast(i18nLaserC[langC].closing, "TAKTIX ANDON", 4);
      
      var rowData = sheet.getRange(row, 1, 1, 13).getValues();
      var sha256Hash = calculateSHA256(rowData.join("|"));
      var stampCell = sheet.getRange(row, 15); // Kolumna O (PIECZEC_REJESTRU_BLOCKCHAIN)
      
      // Próba kotwiczenia zewnętrznego
      if (anchorToBlockchain(sha256Hash)) {
        stampCell.setValue(i18nLaserC[langC].stampArchived + sha256Hash + ")");
        stampCell.setFontColor("#FF0000").setFontWeight("bold");
        sheet.getRange(row, 12).setValue(i18nLaserC[langC].statusClosed); // Kolumna L (STATUS)
        sheet.getRange(row, 1, 1, 16).setBackground("#EFEFEF");
        e.source.toast(i18nLaserC[langC].toastSuccess, "TAKTIX OS ANDON", 5);
      } else {
        // AWARYJNY RYGIEL LOKALNY (Gdy serwer OTS nie odpowiada)
        e.source.toast(i18nLaserC[langC].toastOffline, "TAKTIX KERNEL", 5);
        
        var localTimestamp = "LOCAL_SECURED_" + new Date().getTime() + "_" + sha256Hash.substring(0, 8);
        
        stampCell.setValue(i18nLaserC[langC].stampLocal + localTimestamp + ")");
        stampCell.setFontColor("#FF8C00").setFontWeight("bold"); // Pomarańczowy kolor ostrzegawczy dla bazy lokalnej
        
        sheet.getRange(row, 12).setValue(i18nLaserC[langC].statusClosed); // Kolumna L (Fizyczna zmiana statusu)
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
    // SEKCJA 1B: TRILINGUAL AUTOMATED MAIL SYSTEM (CONFIRMATIONS & REJECTIONS)
    // =========================================================================
    var lastRowT08 = t08Sheet.getLastRow();
    if (lastRowT08 >= 2) {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var t01Sheet = ss.getSheetByName("T01_README_AND_LICENSE");
      var projectLang = t01Sheet ? t01Sheet.getRange("B1").getValue().toString().trim().toUpperCase() : "PL";
      if (projectLang !== "PL" && projectLang !== "DE" && projectLang !== "EN") projectLang = "PL";

      // Wczytanie mapy bram wjazdowych z T00_SPATIAL_CONFIG (Kolumna A [indeks 0] -> Kolumna F [indeks 5])
      var gateMap = {};
      var t00SpatialSheet = ss.getSheetByName("T00_SPATIAL_CONFIG");
      if (t00SpatialSheet && t00SpatialSheet.getLastRow() >= 2) {
        var spatialData = t00SpatialSheet.getRange(2, 1, t00SpatialSheet.getLastRow() - 1, 6).getValues();
        for (var s = 0; s < spatialData.length; s++) {
          var zoneKey = spatialData[s][0].toString().trim(); // Kolumna A
          var gateVal = spatialData[s][5].toString().trim(); // Kolumna F
          if (zoneKey !== "" && gateVal !== "") {
            gateMap[zoneKey] = gateVal;
          }
        }
      }
      
      var t08Data = t08Sheet.getRange(2, 1, lastRowT08 - 1, 13).getValues();
      
      for (var d = 0; d < t08Data.length; d++) {
        var tokenID = t08Data[d][0].toString();            // Kolumna A (Indeks 0)
        var supplierEmail = t08Data[d][2].toString();      // Kolumna C (Indeks 2)
        var deliveryZone = t08Data[d][3].toString().trim();// Kolumna D (Indeks 3 - Miejsce dostawy)
        var slotTime = t08Data[d][6].toString();           // Kolumna G (Indeks 6)
        var status = t08Data[d][8].toString();             // Kolumna I (Indeks 8)
        
        // Dopasowanie bramy z Kolumny F w T00 (jeśli brak przypisania, wyświetla sam kod strefy)
        var assignedGate = gateMap[deliveryZone] ? gateMap[deliveryZone] : deliveryZone;
        
        // POKA-YOKE FLAGI: Konwersja na małe litery, odporna na typ Boolean i String
        var mailSentFlag = t08Data[d][10].toString().toLowerCase().trim(); // Kolumna K (Indeks 10)
        var rejectReason = t08Data[d][12].toString();                      // Kolumna M (Indeks 12)
        
        if ((status === "STAT_BOOKED" || status === "STAT_REJECTED") && (mailSentFlag === "true" || t08Data[d][10] === true)) {
          continue; // Ten wiersz został już obsłużony
        }
        
        // ---------------------------------------------------------------------
        // PROCES A: DOSTAWA ZATWIERDZONA (STAT_BOOKED)
        // ---------------------------------------------------------------------
        if (status === "STAT_BOOKED" && supplierEmail !== "") {
          var subject = "";
          var htmlBody = "";
          
          if (projectLang === "DE") {
            subject = "TAKTIX OS — Liefer-Slot Bestätigung";
            htmlBody = "<h3>TAKTIX OS — Logistik-Pass</h3>" +
                       "<p>Ihr Liefer-Slot wurde bestätigt. Bitte zeigen Sie diesen Code am Tor.</p>" +
                       "<p><strong>Zeitfenster:</strong> " + slotTime + "<br>" +
                       "<strong>Zufahrtstor / Zielzone:</strong> " + assignedGate + "</p><br>" +
                       "<div style='font-size:20px; font-weight:bold; color:#1a73e8; letter-spacing:1px; background:#f1f3f4; padding:15px; border-radius:5px; display:inline-block;'>" +
                       "TOKEN ID: " + tokenID + "</div>";
          } else if (projectLang === "EN") {
            subject = "TAKTIX OS — Delivery Slot Confirmation";
            htmlBody = "<h3>TAKTIX OS — Logistics Passport</h3>" +
                       "<p>Your delivery slot has been approved. Please present this code at the construction site gate.</p>" +
                       "<p><strong>Time Slot:</strong> " + slotTime + "<br>" +
                       "<strong>Entry Gate / Zone:</strong> " + assignedGate + "</p><br>" +
                       "<div style='font-size:20px; font-weight:bold; color:#1a73e8; letter-spacing:1px; background:#f1f3f4; padding:15px; border-radius:5px; display:inline-block;'>" +
                       "TOKEN ID: " + tokenID + "</div>";
          } else {
            // Domyślny format polski (PL)
            subject = "TAKTIX OS — Potwierdzenie Slotu Dostawy";
            htmlBody = "<h3>TAKTIX OS — Paszport Logistyczny</h3>" +
                       "<p>Twój slot dostawy został zatwierdzony. Przedstaw poniższy kod identyfikacyjny na bramie wjazdowej budowy.</p>" +
                       "<p><strong>Okno czasowe:</strong> " + slotTime + "<br>" +
                       "<strong>Brama wjazdowa / Strefa:</strong> " + assignedGate + "</p><br>" +
                       "<div style='font-size:20px; font-weight:bold; color:#1a73e8; letter-spacing:1px; background:#f1f3f4; padding:15px; border-radius:5px; display:inline-block;'>" +
                       "TOKEN ID: " + tokenID + "</div>";
          }
                         
          MailApp.sendEmail({ to: supplierEmail, subject: subject, htmlBody: htmlBody });
          t08Sheet.getRange(d + 2, 11).setValue(true); // Wstrzyknięcie czystego logicznego TRUE
          Logger.log("✔ Wysłano mail potwierdzający do: " + supplierEmail + " (Język: " + projectLang + ", Brama: " + assignedGate + ")");
        }
// ---------------------------------------------------------------------
        // PROCES B: DOSTAWA ODRZUCONA (STAT_REJECTED) (PL / DE / EN)
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
                             "<p>Sehr geehrte Damen und Herren, Ihr Antrag auf den Liefer-Slot um <strong>" + slotTime + "</strong> (Zielzone / Tor: <strong>" + assignedGate + "</strong>) wurde vom Bauleiter <strong>ABGELEHNT</strong>.</p><br>" +
                             "<strong>Grund:</strong> <span style='color:red; font-weight:bold;'>" + humanReason + "</span><br><br>" +
                             "<p>Bitte korrigieren Sie die Daten und senden Sie den Antrag erneut über Forms 1A.</p>";
          } else if (projectLang === "EN") {
            subjectReject = "TAKTIX OS — Delivery Slot Rejection";
            if (rejectReason === "ERR_HUB_OVERFLOW") humanReason = "Logistics Hub Overflow";
            else if (rejectReason === "ERR_ZONE_NOT_READY") humanReason = "Takt Zone Not Ready for Delivery";
            else humanReason = rejectReason + " - Please contact the Site Engineer";
            
            htmlRejectBody = "<h3>TAKTIX OS — Delivery Slot Status</h3>" +
                             "<p>Dear Supplier, your delivery slot request for <strong>" + slotTime + "</strong> (Zone / Gate: <strong>" + assignedGate + "</strong>) has been <strong>REJECTED</strong> by the Site Engineer.</p><br>" +
                             "<strong>Rejection Reason:</strong> <span style='color:red; font-weight:bold;'>" + humanReason + "</span><br><br>" +
                             "<p>Please adjust your planning data and resubmit your request via Forms 1A.</p>";
          } else {
            // Domyślny format polski (PL)
            subjectReject = "TAKTIX OS — Odrzucenie Wniosku o Slot Dostawy";
            if (rejectReason === "ERR_HUB_OVERFLOW") humanReason = "Przepełnienie Huba Magazynowego";
            else if (rejectReason === "ERR_ZONE_NOT_READY") humanReason = "Strefa montażowa niegotowa na przyjęcie towaru";
            else humanReason = rejectReason + " - Skontaktuj się z Inżynierem Kontraktu";
            
            htmlRejectBody = "<h3>TAKTIX OS — Status Rezerwacji Slotu</h3>" +
                             "<p>Szanowni Państwo, Państwa wniosek o slot dostawy na godzinę <strong>" + slotTime + "</strong> (Brama / Strefa: <strong>" + assignedGate + "</strong>) został <strong>ODRZUCONY</strong> przez Inżyniera Kontraktu.</p><br>" +
                             "<strong>Przyczyna odrzucenia:</strong> <span style='color:red; font-weight:bold;'>" + humanReason + "</span><br><br>" +
                             "<p>Proszę o skorygowanie danych planistycznych i ponowną aplikację przez Forms 1A.</p>";
          }
                               
          MailApp.sendEmail({ to: supplierEmail, subject: subjectReject, htmlBody: htmlRejectBody });
          t08Sheet.getRange(d + 2, 11).setValue(true); // Wstrzyknięcie czystego logicznego TRUE
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
    // SEKCJA 3: NATIVE INJECTION DLA FORMS 1A & 1B (LOGISTYKA DOSTAW - PL/DE/EN)
    // -------------------------------------------------------------------------
    var ss3 = SpreadsheetApp.getActiveSpreadsheet();
    var t01Sheet3 = ss3.getSheetByName("T01_README_AND_LICENSE");
    var lang3 = t01Sheet3 ? t01Sheet3.getRange("B1").getValue().toString().trim().toUpperCase() : "PL";
    if (lang3 !== "PL" && lang3 !== "DE" && lang3 !== "EN") lang3 = "PL";

    var stopSuffixMap = {
      PL: "_PRZEPEŁNIONY_ZAKAZ_DOSTAW_STOP",
      DE: "_ÜBERFÜLLT_LIEFERSTOPP",
      EN: "_OVERFLOW_DELIVERY_STOP"
    };

    var lastRowT11 = boxScoreSheet.getLastRow();
    var activeAlerts = [];
    if (lastRowT11 >= 2) {
      var rawAlerts = boxScoreSheet.getRange(2, 7, lastRowT11 - 1, 1).getValues();
      rawAlerts.forEach(function(r) {
        var alertTxt = r[0] ? r[0].toString().toUpperCase() : "";
        if (alertTxt.indexOf("PRZEPEŁNIONY") !== -1 || alertTxt.indexOf("ÜBERFÜLLT") !== -1 || alertTxt.indexOf("OVERFLOW") !== -1) {
          activeAlerts.push("HUB_OFFSITE_01");
        }
      });
    }

    var fullLogisticsNodes = [];
    if (lastRowT02 >= 2) {
      var rawFullT02 = matrixSheet.getRange(2, 6, lastRowT02 - 1, 1).getValues();
      var rawListFull = rawFullT02.map(function(r) {
        var boxId = r[0] ? r[0].toString().trim() : "";
        if (boxId !== "") {
          return (activeAlerts.indexOf(boxId) !== -1) ? "🚨 " + boxId + stopSuffixMap[lang3] : boxId;
        }
        return "";
      }).filter(function(v) { return v !== ""; });
      fullLogisticsNodes = Array.from(new Set(rawListFull)); 
    }

    // RYGIEL ROZWIĄZANIA: Pobieramy menu z godzinami z Kolumny D (Indeks 4) tabeli T04!
    var lastRowT04 = slotsSheet.getLastRow();
    var dynamicSlotsMenu = [];
    if (lastRowT04 >= 2) {
      var rawSlots = slotsSheet.getRange(2, 4, lastRowT04 - 1, 1).getValues();
      var rawListSlots = rawSlots.map(function(r) { return r[0] ? r[0].toString().trim() : ""; }).filter(function(v) { return v !== ""; });
      dynamicSlotsMenu = Array.from(new Set(rawListSlots)); 
    }

    // Wtrysk do Forms 1A (Dostawca wybiera wolną godzinę z grafiku)
    var form1AId_Unique = "1mc9bAsRUKd1FHgNxdmT1laeNM4t0qkAf57w9yiFukSw"; 
    try {
      // 1. Autonomiczne pobranie dwujęzycznych branż bezpośrednio z kolumny D (4) w T03
      var dictSheet = ss3.getSheetByName("T03_PRODUCTION_FLOW_DICTIONARY");
      var lastRowT03 = dictSheet.getLastRow();
      var localTradeLabels = [];
      
      if (lastRowT03 >= 2) {
        var rawT03 = dictSheet.getRange(2, 4, lastRowT03 - 1, 1).getValues();
        var rawList03 = rawT03.map(function(r) { return r[0] ? r[0].toString().trim() : ""; }).filter(function(v) { return v !== ""; });
        localTradeLabels = Array.from(new Set(rawList03));
      }

      // 2. Otwarcie formularza i twarde zasilenie pierwszego pytania od góry ekranu
      var form1A = FormApp.openById(form1AId_Unique);
      var form1AItems = form1A.getItems(); 
      
      if (form1AItems.length > 0) {
        var firstQuestion = form1AItems[0]; 
        
        if (localTradeLabels.length > 0) {
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
      var form1BItems = form1B.getItems();
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
      
      // 1. Aktualizacja pytania typu MULTIPLE_CHOICE (Takty)
      var form3RadioItems = form3.getItems(FormApp.ItemType.MULTIPLE_CHOICE);
      if (form3RadioItems.length >= 1 && validatedTaktBoxes.length > 0) {
        form3RadioItems[0].asMultipleChoiceItem().setChoiceValues(validatedTaktBoxes);
      }

      // 2. Aktualizacja pytania typu LIST / Dropdown (Kody branż)
      var form3ListItems = form3.getItems(FormApp.ItemType.LIST);
      if (form3ListItems.length >= 1 && uniqueTradeLabels.length > 0) {
        form3ListItems[0].asListItem().setChoiceValues(uniqueTradeLabels);
      }

      Logger.log("➔ Sukces: Forms 3 (Takty [Radio] + Branże [Dropdown]) zaktualizowany.");
    } catch (e) {
      Logger.log("⚠️ Informacja: Pomijam wtrysk Forms 3: " + e.toString());
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
// SILNIK 3: FOREX DAEMON (Protokół Ingestion z API NBP - PL / DE / EN)
// Status: ZABEZPIECZONY PRZED NADPISANIEM FORMUŁY GOOGLEFINANCE
// =========================================================================
function fetchNightlyExchangeRate() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var readmeSheet = spreadsheet.getSheetByName("T01_README_AND_LICENSE");
  
  if (!readmeSheet) {
    Logger.log("🚨 KRYTYCZNY ALERT DAEMONA FX: Nie odnaleziono arkusza T01_README_AND_LICENSE!");
    return;
  }

  var langFX = readmeSheet.getRange("B1").getValue().toString().trim().toUpperCase();
  if (langFX !== "PL" && langFX !== "DE" && langFX !== "EN") langFX = "PL";

  var projectCurrency = readmeSheet.getRange("B4").getValue().toString().trim().toUpperCase();
  var rateCell = readmeSheet.getRange("B5");

  // BEZPIECZNIK ARCHITEKTONICZNY: Nie nadpisujemy aktywnej formuły GOOGLEFINANCE w komórce B5
  if (rateCell.getFormula() !== "") {
    Logger.log("ℹ️ DAEMON FX: Komórka B5 posiada aktywną formułę GOOGLEFINANCE. Pomijam nadpisanie z NBP.");
    return;
  }

  var i18nFX = {
    PL: {
      successPrefix: "Kurs EUR/PLN (",
      successSuffix: ") pobrany pomyślnie z API NBP!",
      offlineFallback: "API NBP niedostępne. Zachowano kurs: ",
      panicFallback: "Krytyczny brak danych. Wstrzyknięto ryczałt awaryjny: 4.35"
    },
    DE: {
      successPrefix: "EUR/PLN-Wechselkurs (",
      successSuffix: ") erfolgreich von der NBP-API abgerufen!",
      offlineFallback: "NBP-API nicht erreichbar. Gespeicherter Kurs beibehalten: ",
      panicFallback: "Kritischer Datenmangel. Notfall-Pauschalkurs gesetzt: 4.35"
    },
    EN: {
      successPrefix: "EUR/PLN exchange rate (",
      successSuffix: ") fetched successfully from NBP API!",
      offlineFallback: "NBP API unavailable. Kept stored rate: ",
      panicFallback: "Critical missing data. Applied emergency fallback rate: 4.35"
    }
  };
  
  try {
    // Pełny, poprawny endpoint JSON dla tabeli A kursu EUR w NBP
    var url = "https://nbp.pl";
    var options = {
      "method": "get",
      "muteHttpExceptions": true,
      "headers": {
        "Accept": "application/json"
      }
    };
    
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    var responseText = response.getContentText();
    
    if (responseCode === 200) {
      if (responseText.trim().indexOf("<!DOCTYPE") === 0 || responseText.trim().indexOf("<html") === 0) {
        throw new SyntaxError("Serwer NBP zwrócił strukturę HTML zamiast JSON.");
      }
      
      var json = JSON.parse(responseText);
      var rawRate = parseFloat(json.rates.mid); 
      
      if (rawRate && !isNaN(rawRate) && rawRate > 0) {
        rateCell.setValue(rawRate);
        rateCell.setNumberFormat("#,##0.00"); 
        
        spreadsheet.toast(i18nFX[langFX].successPrefix + rawRate + i18nFX[langFX].successSuffix, "TAKTIX OS FOREX", 5);
        Logger.log("💚 SUKCES DAEMONA FX: Zaktualizowano kurs komórki B5 wartością: " + rawRate);
        return; 
      }
    }
    
    throw new Error("Serwer NBP zwrócił kod błędu HTTP: " + responseCode);
    
  } catch (fxError) {
    Logger.log("🚨 ALERT DAEMONA FX: Przechwycono błąd: " + fxError.toString());
    
    var currentStoredRate = rateCell.getValue();
    if (currentStoredRate && !isNaN(currentStoredRate) && currentStoredRate > 0) {
      Logger.log("🛡️ SAFE FALLBACK: Zachowano dotychczasowy kurs: " + currentStoredRate);
      spreadsheet.toast(i18nFX[langFX].offlineFallback + currentStoredRate, "TAKTIX OS RECOVERY", 7);
    } else {
      rateCell.setValue(4.35);
      rateCell.setNumberFormat("#,##0.00");
      Logger.log("🛡️ SAFE FALLBACK: Wstrzyknięto ryczałt awaryjny: 4.35");
      spreadsheet.toast(i18nFX[langFX].panicFallback, "TAKTIX OS RECOVERY PANIC", 7);
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
