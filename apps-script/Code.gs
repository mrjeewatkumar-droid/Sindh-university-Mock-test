/**
 * Sindh University Mock Test — Results Collector
 *
 * SETUP (one time, ~3 minutes):
 * 1. Create a blank Google Sheet (sheets.google.com) — this will be your results dashboard.
 * 2. In the sheet: Extensions -> Apps Script.
 * 3. Delete any code in the editor, paste this entire file, then Save (Ctrl/Cmd+S).
 *    (The SHEET_SECRET below is already set — do not change it unless you also
 *    change RESULTS_SECRET in the test app's data.js to the same value.)
 * 4. Deploy -> New deployment -> type "Web app":
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    -> Deploy -> authorize access when asked -> Copy the Web app URL.
 * 5. Send that URL to the test developer to plug into the app's RESULTS_URL.
 *
 * From then on, every test submission is appended as a row in this sheet.
 */

var SHEET_SECRET = "6768f152907c8988bb66b9522bb9afd1886fd097740fcef5";

var HEADERS = [
  "Timestamp", "Name", "Email", "Score", "Total", "Percentage",
  "English", "General Knowledge", "Mathematics", "IQ", "Everyday Science & Computer",
  "Tab Violations", "Auto Submitted", "Reason", "Answers"
];

function doGet() {
  return ContentService.createTextOutput("Results collector is running.");
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.secret !== SHEET_SECRET) {
      return jsonOut({ ok: false, error: "bad secret" });
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    var secs = {};
    (data.sections || []).forEach(function (s) { secs[s.title] = s.correct + "/" + s.total; });
    sheet.appendRow([
      new Date(data.submittedAt),
      data.name,
      data.email,
      data.score,
      data.total,
      data.pct + "%",
      secs["English"] || "",
      secs["General Knowledge & Current Affairs"] || "",
      secs["Mathematics"] || "",
      secs["IQ & Logical Reasoning"] || "",
      secs["Everyday Science & Computer"] || "",
      data.violations,
      data.auto ? "Yes" : "No",
      data.reason || "",
      data.answerString || ""
    ]);
    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
