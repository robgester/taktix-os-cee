function findHardcodedRanges() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var report = [];
  
  // Szukany ciąg znaków w formułach (sztywne odniesienia do wiersza 26)
  // Wyłapuje: 26, $26, :26, $26: itp.
  var regex = /(?:\$?[A-Z]+\$?26\b|:26\b)/i;
  
  Logger.log("🏁 ROZPOCZĘCIE AUDYTU SYSTEMOWEGO TAKTIX OS...");
  
  sheets.forEach(function(sheet) {
    var sheetName = sheet.getName();
    
    // Pomijamy surowe logi z Forms, tam nie ma naszych formuł wyszukujących
    if (sheetName.indexOf("Form responses") !== -1) return;
    
    var dataRange = sheet.getDataRange();
    var formulas = dataRange.getFormulas();
    
    for (var r = 0; r < formulas.length; r++) {
      for (var c = 0; c < formulas[r].length; c++) {
        var formula = formulas[r][c];
        
        if (formula && regex.test(formula)) {
          var cellA1 = sheet.getRange(r + 1, c + 1).getA1Notation();
          report.push({
            sheet: sheetName,
            cell: cellA1,
            formula: formula
          });
        }
      }
    }
  });
  
  // Weryfikacja wyniku audytu
  Logger.log("🏁 AUDYT UKOŃCZONY.");
  if (report.length === 0) {
    Logger.log("✅ SUKCES: Brak sztywnych odwołań do wiersza 26! System jest w 100% czysty i elastyczny.");
    SpreadsheetApp.getUi().alert("✅ AUDYT TAKTIX: Brak sztywnych odwołań do wiersza 26! System jest sterylny.");
  } else {
    Logger.log("🚨 WYKRYTO ZATORY (Liczba komórek do poprawy: " + report.length + "):");
    var alertText = "🚨 WYKRYTO ZATORY DO KOREKTY:\n\n";
    
    report.forEach(function(item) {
      Logger.log("📌 Arkusz: " + item.sheet + " | Komórka: " + item.cell + " | Formuła: " + item.formula);
      alertText += "• [" + item.sheet + "] " + item.cell + " -> " + item.formula + "\n";
    });
    
    // Wyświetlamy raport bezpośrednio na ekranie arkusza dla wygody inżyniera
    SpreadsheetApp.getUi().alert(alertText);
  }
}
