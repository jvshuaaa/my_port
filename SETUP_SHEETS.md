# Setup Google Sheets untuk Portfolio

## Langkah 1 — Buat Spreadsheet

1. Buka [sheets.new](https://sheets.new)
2. Buat 7 tab dengan nama persis (huruf kecil semua):
   - `profile`
   - `experience`
   - `education`
   - `certifications`
   - `skills`
   - `projects`
   - `organization`

---

## Langkah 2 — Isi Header + Data

### Tab: `profile`
| nama | email | phone | alamat | foto_url | cv_url | summary | linkedin_url | github_url | whatsapp |
|------|-------|-------|--------|----------|--------|---------|--------------|------------|----------|
| Joshua Setiawan Banjarnahor | joshua.setiawan123@gmail.com | +62 896 5519 5863 | Indonesia | (url foto) | (url cv) | Lulusan baru jurusan Teknik Informatika... | https://linkedin.com/in/joshuabanjarnahor | (github url) | +6289655195863 |

---

### Tab: `experience`
| posisi | perusahaan | lokasi | periode_mulai | periode_selesai | bullets | urutan |
|--------|------------|--------|---------------|-----------------|---------|--------|
| Information Technology (Kepatuhan Internal) | Kementerian Imigrasi dan Pemasyarakatan | Jakarta | 2025-11-01 | 2026-05-01 | ["Mengembangkan dan mengelola sistem komputer serta jaringan kantor","Menyediakan dukungan teknis pada aplikasi pelayanan","Menjaga keamanan data dan sistem informasi","Membantu transformasi digital dalam layanan publik"] | 1 |
| Mentee - AI & Cybersecurity | PT Hacktivate Teknologi Indonesia | Jakarta | 2024-01-01 | 2024-07-01 | ["Mengikuti program studi independen intensif 5 hari per minggu selama 6 bulan","Menyelesaikan tugas-tugas teknis dan tantangan coding","Mengembangkan project akhir: sistem deteksi emosi menggunakan model LSTM"] | 2 |
| Operator Produksi | PT Nippon Indosari Corpindo Tbk | Purwakarta | 2019-11-01 | 2020-12-01 | ["Bertanggung jawab dalam membuat roti tawar/manis","Mengatur loyang yang berjalan ke tempat palet","Mengawasi ruangan fermentasi agar roti mengembang dengan baik"] | 3 |

> ⚠️ Kolom `bullets` diisi sebagai JSON string (array dalam tanda kutip ganda, dibungkus tanda kutip pada cell)

---

### Tab: `education`
| gelar | institusi | jurusan | periode_mulai | periode_selesai | urutan |
|-------|-----------|---------|---------------|-----------------|--------|
| Sarjana Komputer (S.Kom) | Universitas Indraprasta PGRI | Teknik Informatika | 2021-08-01 | 2025-08-01 | 1 |

---

### Tab: `certifications`
| nama | lembaga | tahun | warna |
|------|---------|-------|-------|
| Instalasi Tenaga Listrik | Balai Latihan Kerja Purwakarta | 2019 | yellow |
| Data Analyst | PT. Revolusi Cita Edukasi | 2024 | blue |
| Software Engineer | PT. Revolusi Cita Edukasi | 2024 | purple |
| Data Science | DQLab.id | 2024 | green |
| Digital Marketing | PT. Revolusi Cita Edukasi | 2024 | pink |
| Front End | PT. Dibimbing Digital Indonesia | 2024 | orange |
| Cyber Security | PT. Cisco System Indonesia | 2024 | red |
| Cyber Security | IBM Skills-Build | 2024 | blue |
| Machine Learning for Data Science | IBM | 2024 | purple |
| MSIB Batch 6 AI & Cybersecurity | PT. Hacktivate Teknologi Indonesia | 2024 | green |
| TOEFL ITP | Global Operation Indonesia | 2024 | blue |

---

### Tab: `skills`
| kategori | nama | level | urutan |
|----------|------|-------|--------|
| hard | Microsoft Office (Excel, Word, PowerPoint) | advanced | 1 |
| hard | Google Workspace (Sheets, Slides, Docs) | advanced | 2 |
| hard | Design (Canva) | advanced | 3 |
| hard | Video Editing (CapCut) | advanced | 4 |
| hard | Java (Programmer) | advanced | 5 |
| hard | Python (AI & Data Science) | advanced | 6 |
| hard | MySQL (Database) | advanced | 7 |
| hard | AI & Machine Learning (LSTM) | advanced | 8 |
| soft | Pemecahan Masalah | | 1 |
| soft | Kerjasama Tim | | 2 |
| soft | Kemampuan Beradaptasi | | 3 |
| language | Indonesia | native | 1 |
| language | English | elementary | 2 |

---

### Tab: `projects`
| judul | deskripsi | teknologi | link_demo | link_github | urutan |
|-------|-----------|-----------|-----------|-------------|--------|
| KLIP | Portal Integrity Hub untuk Direktorat Kepatuhan Internal... | ["Laravel","PHP","JavaScript","MySQL"] | https://github.com/jvshuaaa/KLIP | https://github.com/jvshuaaa/KLIP | 0 |
| Sistem Deteksi Emosi | Sistem klasifikasi teks menggunakan model LSTM untuk mendeteksi emosi dari teks | ["Python","TensorFlow","LSTM","NLP"] | | | 1 |
| Portfolio Website | Website portfolio pribadi dengan integrasi Google Sheets | ["HTML","Tailwind CSS","JavaScript","Google Sheets"] | https://github.com/jvshuaaa/my_port | https://github.com/jvshuaaa/my_port | 2 |

---

### Tab: `organization`
| nama | institusi | jabatan | periode_mulai | periode_selesai | bullets | icon | urutan |
|------|-----------|---------|---------------|-----------------|---------|------|--------|
| Persekutuan Mahasiswa Kristen (PMK) | Universitas Indraprasta PGRI | Anggota | 2021-08-01 | 2025-08-01 | ["Menghadiri rapat PMK untuk membahas program kerja","Berpartisipasi dalam kegiatan persekutuan doa dan ibadah","Bekerjasama dengan anggota PMK untuk mencapai tujuan bersama"] | fa-church | 1 |
| Public Campus Ministry | Universitas Indraprasta PGRI | Wakil Kominfo | 2021-08-01 | 2025-08-01 | ["Mengatur dan membantu ketua dalam menjalani tugas","Membuat poster untuk kegiatan organisasi","Mengelola live streaming dan upload konten di sosial media"] | fa-users | 2 |

---

## Langkah 3 — Deploy Apps Script

1. Buka [script.google.com](https://script.google.com)
2. Cari project dengan Script ID: `1o7ec3GhaTy5_PdbXPgxQQcVc3uArA5wB2E_l4_yhDSc5FzatU7d_IKHEini`
3. Paste isi file `google-apps-script/Code.gs` (replace semua)
4. Ganti `GANTI_DENGAN_SPREADSHEET_ID_KAMU` dengan ID spreadsheet kamu
5. **Deploy → New Deployment → Web App**
   - Execute as: `Me`
   - Who has access: `Anyone`
6. Copy URL deployment

## Langkah 4 — Sambungkan ke Portfolio

Buka `api.js`, ganti baris ini:
```js
const PROXY_URL = 'GANTI_DENGAN_URL_DEPLOYMENT_APPS_SCRIPT';
```
Dengan URL dari langkah 3.

Selesai! 🎉
