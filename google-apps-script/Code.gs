/**
 * Google Apps Script - Portfolio Data Proxy
 * Script ID: 1o7ec3GhaTy5_PdbXPgxQQcVc3uArA5wB2E_l4_yhDSc5FzatU7d_IKHEini
 *
 * CARA PAKAI:
 * 1. Buka script.google.com → buka project dengan Script ID di atas
 * 2. Paste seluruh isi file ini (replace semua)
 * 3. Ganti SPREADSHEET_ID di bawah dengan ID Google Sheets kamu
 * 4. Klik Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy URL deployment → paste ke api.js (variabel PROXY_URL)
 */

const SPREADSHEET_ID = '1uHqufvZzQfqi9VvRFRJfgMg6UltKlpGF2GsXT7xUcAw';

const ALLOWED_SHEETS = [
  'profile',
  'experience',
  'education',
  'certifications',
  'skills',
  'projects',
  'organization'
];

function doGet(e) {
  const sheet = e.parameter.sheet;

  if (!sheet || !ALLOWED_SHEETS.includes(sheet)) {
    return respond({ success: false, error: 'Sheet tidak valid: ' + sheet, data: [] });
  }

  try {
    const data = readSheet(sheet);
    return respond({ success: true, data: data });
  } catch (err) {
    return respond({ success: false, error: err.message, data: [] });
  }
}

function readSheet(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Tab "' + sheetName + '" tidak ditemukan di spreadsheet.');

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(function(h) { return String(h).trim(); });

  return values.slice(1)
    .filter(function(row) { return row.some(function(c) { return c !== ''; }); })
    .map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) {
        var val = row[i];
        if (val instanceof Date) {
          val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        }
        obj[h] = (val === '' || val === null || val === undefined) ? null : val;
      });
      return obj;
    });
}

function respond(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
