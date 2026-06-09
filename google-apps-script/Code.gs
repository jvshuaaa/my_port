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

// =============================================
// POST — Simpan pesan kontak dari form
// =============================================
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var nama     = body.nama     || '';
    var email    = body.email    || '';
    var subjek   = body.subjek   || '';
    var pesan    = body.pesan    || '';
    var waktu    = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    if (!nama || !email || !pesan) {
      return respond({ success: false, error: 'Nama, email, dan pesan wajib diisi.' });
    }

    var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName('messages');

    // Buat tab messages jika belum ada
    if (!sheet) {
      sheet = ss.insertSheet('messages');
      sheet.getRange(1, 1, 1, 5).setValues([['waktu', 'nama', 'email', 'subjek', 'pesan']]);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }

    sheet.appendRow([waktu, nama, email, subjek, pesan]);
    return respond({ success: true, message: 'Pesan berhasil dikirim!' });

  } catch (err) {
    return respond({ success: false, error: err.message });
  }
}

function respond(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
