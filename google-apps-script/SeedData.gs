/**
 * SeedData.gs - Isi semua data portfolio ke Google Sheets secara otomatis
 *
 * CARA PAKAI:
 * 1. Di Apps Script editor, klik dropdown fungsi (atas tengah)
 * 2. Pilih "seedAllData"
 * 3. Klik tombol ▶ Run
 * 4. Izinkan akses saat diminta (Allow)
 * 5. Cek spreadsheet — semua tab dan data sudah terisi
 *
 * Jalankan SEKALI saja. Kalau mau reset, jalankan clearAllData() dulu.
 */

const SS = SpreadsheetApp.openById('1uHqufvZzQfqi9VvRFRJfgMg6UltKlpGF2GsXT7xUcAw');

// =============================================
// MAIN — jalankan fungsi ini
// =============================================
function seedAllData() {
  seedProfile();
  seedExperience();
  seedEducation();
  seedCertifications();
  seedSkills();
  seedProjects();
  seedOrganization();
  SpreadsheetApp.flush();
  Logger.log('✅ Semua data berhasil diisi!');
}

// =============================================
// HELPER
// =============================================
function getOrCreateSheet(name) {
  var sheet = SS.getSheetByName(name);
  if (!sheet) {
    sheet = SS.insertSheet(name);
    Logger.log('📄 Tab dibuat: ' + name);
  } else {
    sheet.clearContents();
    Logger.log('🔄 Tab dikosongkan: ' + name);
  }
  return sheet;
}

function writeSheet(name, headers, rows) {
  var sheet = getOrCreateSheet(name);
  var allRows = [headers].concat(rows);
  sheet.getRange(1, 1, allRows.length, headers.length).setValues(allRows);
  // Bold header
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.autoResizeColumns(1, headers.length);
  Logger.log('✅ ' + name + ': ' + rows.length + ' baris');
}

// =============================================
// 1. PROFILE
// =============================================
function seedProfile() {
  var headers = ['nama','email','phone','alamat','foto_url','cv_url','summary','linkedin_url','github_url','whatsapp'];
  var rows = [[
    'Joshua Setiawan Banjarnahor',
    'joshua.setiawan123@gmail.com',
    '+62 896 5519 5863',
    'Indonesia',
    '',
    '',
    'Lulusan baru jurusan Teknik Informatika dari Universitas Indraprasta PGRI. Memiliki skill set teknis yang terasah melalui program MSIB batch 6 di Hacktiv8 dengan spesialisasi di bidang Artificial Intelligence dan Cybersecurity.',
    'https://linkedin.com/in/joshuabanjarnahor',
    'https://github.com/jvshuaaa',
    '+6289655195863'
  ]];
  writeSheet('profile', headers, rows);
}

// =============================================
// 2. EXPERIENCE
// =============================================
function seedExperience() {
  var headers = ['posisi','perusahaan','lokasi','periode_mulai','periode_selesai','bullets','urutan'];
  var rows = [
    [
      'Information Technology (Kepatuhan Internal)',
      'Kementerian Imigrasi dan Pemasyarakatan',
      'Jakarta',
      '2025-11-01',
      '2026-05-01',
      '["Mengembangkan dan mengelola sistem komputer serta jaringan kantor","Menyediakan dukungan teknis pada aplikasi pelayanan keimigrasian dan pemasyarakatan","Menjaga keamanan data dan sistem informasi","Membantu transformasi digital dalam layanan publik"]',
      1
    ],
    [
      'Mentee - AI & Cybersecurity',
      'PT Hacktivate Teknologi Indonesia',
      'Jakarta',
      '2024-01-01',
      '2024-07-01',
      '["Mengikuti program studi independen intensif 5 hari per minggu selama 6 bulan","Menyelesaikan tugas-tugas teknis dan tantangan coding yang diberikan oleh mentor","Mengembangkan project akhir: sistem deteksi emosi dalam klasifikasi teks menggunakan model LSTM"]',
      2
    ],
    [
      'Operator Produksi',
      'PT Nippon Indosari Corpindo Tbk',
      'Purwakarta',
      '2019-11-01',
      '2020-12-01',
      '["Bertanggung jawab dalam membuat roti tawar/manis","Mengatur loyang yang berjalan ke tempat palet","Mengawasi ruangan fermentasi agar roti mengembang dengan baik"]',
      3
    ]
  ];
  writeSheet('experience', headers, rows);
}

// =============================================
// 3. EDUCATION
// =============================================
function seedEducation() {
  var headers = ['gelar','institusi','jurusan','periode_mulai','periode_selesai','urutan'];
  var rows = [[
    'Sarjana Komputer (S.Kom)',
    'Universitas Indraprasta PGRI',
    'Teknik Informatika',
    '2021-08-01',
    '2025-08-01',
    1
  ]];
  writeSheet('education', headers, rows);
}

// =============================================
// 4. CERTIFICATIONS
// =============================================
function seedCertifications() {
  var headers = ['nama','lembaga','tahun','warna'];
  var rows = [
    ['Instalasi Tenaga Listrik',          'Balai Latihan Kerja Purwakarta',       2019, 'yellow'],
    ['Data Analyst',                       'PT. Revolusi Cita Edukasi',            2024, 'blue'],
    ['Software Engineer',                  'PT. Revolusi Cita Edukasi',            2024, 'purple'],
    ['Data Science',                       'DQLab.id',                             2024, 'green'],
    ['Digital Marketing',                  'PT. Revolusi Cita Edukasi',            2024, 'pink'],
    ['Front End',                          'PT. Dibimbing Digital Indonesia',      2024, 'orange'],
    ['Cyber Security',                     'PT. Cisco System Indonesia',           2024, 'red'],
    ['Cyber Security',                     'IBM Skills-Build',                     2024, 'blue'],
    ['Machine Learning for Data Science',  'IBM',                                  2024, 'purple'],
    ['MSIB Batch 6 AI & Cybersecurity',    'PT. Hacktivate Teknologi Indonesia',   2024, 'green'],
    ['TOEFL ITP',                          'Global Operation Indonesia',           2024, 'blue']
  ];
  writeSheet('certifications', headers, rows);
}

// =============================================
// 5. SKILLS
// =============================================
function seedSkills() {
  var headers = ['kategori','nama','level','urutan'];
  var rows = [
    ['hard', 'Microsoft Office (Excel, Word, PowerPoint)', 'advanced', 1],
    ['hard', 'Google Workspace (Sheets, Slides, Docs)',    'advanced', 2],
    ['hard', 'Design (Canva)',                             'advanced', 3],
    ['hard', 'Video Editing (CapCut)',                     'advanced', 4],
    ['hard', 'Java (Programmer)',                          'advanced', 5],
    ['hard', 'Python (AI & Data Science)',                 'advanced', 6],
    ['hard', 'MySQL (Database)',                           'advanced', 7],
    ['hard', 'AI & Machine Learning (LSTM)',               'advanced', 8],
    ['soft', 'Pemecahan Masalah',                          '',         1],
    ['soft', 'Kerjasama Tim',                              '',         2],
    ['soft', 'Kemampuan Beradaptasi',                      '',         3],
    ['language', 'Indonesia',                              'native',   1],
    ['language', 'English',                                'elementary', 2]
  ];
  writeSheet('skills', headers, rows);
}

// =============================================
// 6. PROJECTS
// =============================================
function seedProjects() {
  var headers = ['judul','deskripsi','teknologi','link_demo','link_github','gambar_url','urutan'];
  var rows = [
    [
      'KLIP',
      'Portal Integrity Hub untuk Direktorat Kepatuhan Internal, Direktorat Jenderal Pemasyarakatan — platform konsultasi dan pelaporan terkait tugas serta fungsi kepatuhan internal.',
      '["Laravel","PHP","JavaScript","MySQL"]',
      'https://github.com/jvshuaaa/KLIP',
      'https://github.com/jvshuaaa/KLIP',
      '',
      0
    ],
    [
      'Sistem Deteksi Emosi',
      'Sistem klasifikasi teks menggunakan model LSTM untuk mendeteksi emosi dari teks.',
      '["Python","TensorFlow","LSTM","NLP"]',
      '',
      '',
      '',
      1
    ],
    [
      'Portfolio Website',
      'Website portfolio pribadi dengan integrasi Google Sheets sebagai database untuk menampilkan profil, pengalaman, dan proyek secara dinamis.',
      '["HTML","Tailwind CSS","JavaScript","Google Sheets"]',
      'https://github.com/jvshuaaa/my_port',
      'https://github.com/jvshuaaa/my_port',
      '',
      2
    ]
  ];
  writeSheet('projects', headers, rows);
}

// =============================================
// 7. ORGANIZATION
// =============================================
function seedOrganization() {
  var headers = ['nama','institusi','jabatan','periode_mulai','periode_selesai','bullets','icon','urutan'];
  var rows = [
    [
      'Persekutuan Mahasiswa Kristen (PMK)',
      'Universitas Indraprasta PGRI',
      'Anggota',
      '2021-08-01',
      '2025-08-01',
      '["Menghadiri rapat PMK untuk membahas program kerja dan kegiatan organisasi","Berpartisipasi dalam kegiatan persekutuan doa dan ibadah bersama","Bekerjasama dengan baik dengan anggota PMK lainnya untuk mencapai tujuan bersama"]',
      'fa-church',
      1
    ],
    [
      'Public Campus Ministry',
      'Universitas Indraprasta PGRI',
      'Wakil Kominfo',
      '2021-08-01',
      '2025-08-01',
      '["Mengatur dan membantu ketua dalam menjalani tugas","Membuat poster untuk kegiatan organisasi","Mengelola live streaming dan upload konten di sosial media"]',
      'fa-users',
      2
    ]
  ];
  writeSheet('organization', headers, rows);
}

// =============================================
// RESET — hapus semua isi (opsional)
// =============================================
function clearAllData() {
  ['profile','experience','education','certifications','skills','projects','organization'].forEach(function(name) {
    var sheet = SS.getSheetByName(name);
    if (sheet) { sheet.clearContents(); Logger.log('🗑️ Cleared: ' + name); }
  });
}
