const SHEET_NAME = "Reviews";

const HEADERS = [
  "id",
  "timestamp",
  "country",
  "status",
  "category",
  "subcategory",
  "score",
  "displayName",
  "title",
  "comment"
];

function doGet(e) {
  const action = e.parameter.action || "list";

  if (action === "list") {
    return jsonResponse({
      ok: true,
      reviews: getReviews_(),
      updatedAt: new Date().toISOString()
    });
  }

  return jsonResponse({ ok: false, error: "Unknown action" });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();

    const row = HEADERS.map(header => {
      if (header === "id") return data.id || Utilities.getUuid();
      if (header === "timestamp") return data.timestamp || new Date().toISOString();
      return data[header] || "";
    });

    sheet.appendRow(row);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function getReviews_() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();

  if (values.length < 2) return [];

  const headers = values[0].map(String);
  return values.slice(1)
    .filter(row => row.some(cell => cell !== ""))
    .map(row => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index];
      });
      return item;
    });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  } else {
    const currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getValues()[0];
    if (String(currentHeaders[0]) !== "id") {
      sheet.clear();
      sheet.appendRow(HEADERS);
    }
  }

  return sheet;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
