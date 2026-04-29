-- =============================================
-- PORTFOLIO DATABASE SCHEMA FOR SUPABASE
-- =============================================

-- Enable RLS on all tables
ALTER TABLE IF EXISTS profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS education ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS organization ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 1. PROFILE TABLE (Data Pribadi)
-- =============================================
CREATE TABLE IF NOT EXISTS profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    alamat TEXT,
    foto_url TEXT,
    cv_url TEXT,
    summary TEXT,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    whatsapp VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. EXPERIENCE TABLE (Pengalaman Kerja)
-- =============================================
CREATE TABLE IF NOT EXISTS experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    posisi VARCHAR(100) NOT NULL,
    perusahaan VARCHAR(100) NOT NULL,
    lokasi VARCHAR(100),
    periode_mulai DATE,
    periode_selesai DATE,
    deskripsi TEXT,
    bullets TEXT[], -- Array untuk poin-poin
    logo_url TEXT,
    urutan INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. EDUCATION TABLE (Pendidikan)
-- =============================================
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gelar VARCHAR(100) NOT NULL,
    institusi VARCHAR(100) NOT NULL,
    jurusan VARCHAR(100),
    periode_mulai DATE,
    periode_selesai DATE,
    deskripsi TEXT,
    logo_url TEXT,
    urutan INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. CERTIFICATIONS TABLE (Sertifikasi)
-- =============================================
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama VARCHAR(200) NOT NULL,
    lembaga VARCHAR(100) NOT NULL,
    tahun INTEGER,
    icon VARCHAR(50) DEFAULT 'fa-certificate',
    warna VARCHAR(20) DEFAULT 'blue',
    url_sertifikat TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. SKILLS TABLE (Keahlian)
-- =============================================
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kategori VARCHAR(50) NOT NULL, -- 'hard', 'soft', 'language'
    nama VARCHAR(100) NOT NULL,
    level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced', 'expert'
    icon VARCHAR(50),
    urutan INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. PROJECTS TABLE (Proyek)
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    teknologi TEXT[], -- Array tech stack
    link_demo TEXT,
    link_github TEXT,
    gambar_url TEXT,
    urutan INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. ORGANIZATION TABLE (Organisasi)
-- =============================================
CREATE TABLE IF NOT EXISTS organization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama VARCHAR(100) NOT NULL,
    institusi VARCHAR(100),
    jabatan VARCHAR(100),
    periode_mulai DATE,
    periode_selesai DATE,
    deskripsi TEXT,
    bullets TEXT[], -- Array aktivitas
    icon VARCHAR(50) DEFAULT 'fa-users',
    urutan INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Profile: Public can read, only authenticated can write
DROP POLICY IF EXISTS "Public profiles are viewable" ON profile;
CREATE POLICY "Public profiles are viewable"
ON profile FOR SELECT
TO PUBLIC
USING (true);

-- Experience: Public read
DROP POLICY IF EXISTS "Public experience are viewable" ON experience;
CREATE POLICY "Public experience are viewable"
ON experience FOR SELECT
TO PUBLIC
USING (true);

-- Education: Public read
DROP POLICY IF EXISTS "Public education are viewable" ON education;
CREATE POLICY "Public education are viewable"
ON education FOR SELECT
TO PUBLIC
USING (true);

-- Certifications: Public read
DROP POLICY IF EXISTS "Public certifications are viewable" ON certifications;
CREATE POLICY "Public certifications are viewable"
ON certifications FOR SELECT
TO PUBLIC
USING (true);

-- Skills: Public read
DROP POLICY IF EXISTS "Public skills are viewable" ON skills;
CREATE POLICY "Public skills are viewable"
ON skills FOR SELECT
TO PUBLIC
USING (true);

-- Projects: Public read
DROP POLICY IF EXISTS "Public projects are viewable" ON projects;
CREATE POLICY "Public projects are viewable"
ON projects FOR SELECT
TO PUBLIC
USING (true);

-- Organization: Public read
DROP POLICY IF EXISTS "Public organization are viewable" ON organization;
CREATE POLICY "Public organization are viewable"
ON organization FOR SELECT
TO PUBLIC
USING (true);

-- =============================================
-- INSERT SAMPLE DATA (CV Anda)
-- =============================================

-- Profile
INSERT INTO profile (nama, email, phone, alamat, summary, linkedin_url, whatsapp) 
VALUES (
    '[NAMA ANDA]',
    'your.email@gmail.com',
    '+62 812 3456 7890',
    'Indonesia',
    'Lulusan baru jurusan Teknik Informatika dari Universitas Indraprasta PGRI. Memiliki skill set teknis yang terasah melalui program MSIB batch 6 di Hacktiv8 dengan spesialisasi di bidang Artificial Intelligence dan Cybersecurity.',
    'https://linkedin.com/in/yourprofile',
    '+6281234567890'
) ON CONFLICT DO NOTHING;

-- Experience
INSERT INTO experience (posisi, perusahaan, lokasi, periode_mulai, periode_selesai, deskripsi, bullets, urutan) VALUES
('Information Technology (Kepatuhan Internal)', 'Kementerian Imigrasi dan Pemasyarakatan', 'Jakarta', '2025-11-01', '2026-05-01', 
 'Magang di bidang IT Kepatuhan Internal',
 ARRAY['Mengembangkan dan mengelola sistem komputer serta jaringan kantor', 'Menyediakan dukungan teknis pada aplikasi pelayanan keimigrasian dan pemasyarakatan', 'Menjaga keamanan data dan sistem informasi', 'Membantu transformasi digital dalam layanan publik'],
 1),

('Mentee - AI & Cybersecurity', 'PT Hacktivate Teknologi Indonesia', 'Jakarta', '2024-01-01', '2024-07-01',
 'Program Studi Independen MSIB Batch 6',
 ARRAY['Mengikuti program studi independen intensif 5 hari per minggu selama 6 bulan', 'Menyelesaikan tugas-tugas teknis dan tantangan coding yang diberikan oleh mentor', 'Mengembangkan project akhir: sistem deteksi emosi dalam klasifikasi teks menggunakan model LSTM'],
 2),

('Operator Produksi', 'PT Nippon Indosari Corpindo Tbk', 'Purwakarta', '2019-11-01', '2020-12-01',
 'Bekerja di pabrik roti Sari Roti',
 ARRAY['Bertanggung jawab dalam membuat roti tawar/manis', 'Mengatur loyang yang berjalan ke tempat palet', 'Mengawasi ruangan fermentasi agar roti mengembang dengan baik'],
 3);

-- Education
INSERT INTO education (gelar, institusi, jurusan, periode_mulai, periode_selesai, urutan) VALUES
('Sarjana Komputer (S.Kom)', 'Universitas Indraprasta PGRI', 'Teknik Informatika', '2021-08-01', '2025-08-01', 1),
('SMA', 'SMAN 1 Bungursari', 'IPS', '2016-07-01', '2019-06-01', 2);

-- Certifications
INSERT INTO certifications (nama, lembaga, tahun, warna) VALUES
('Instalasi Tenaga Listrik', 'Balai Latihan Kerja Purwakarta', 2019, 'yellow'),
('Data Analyst', 'PT. Revolusi Cita Edukasi', 2024, 'blue'),
('Software Engineer', 'PT. Revolusi Cita Edukasi', 2024, 'purple'),
('Data Science', 'DQLab.id', 2024, 'green'),
('Digital Marketing', 'PT. Revolusi Cita Edukasi', 2024, 'pink'),
('Front End', 'PT. Dibimbing Digital Indonesia', 2024, 'orange'),
('Cyber Security', 'PT. Cisco System Indonesia', 2024, 'red'),
('Cyber Security', 'IBM Skills-Build', 2024, 'blue'),
('Machine Learning for Data Science', 'IBM', 2024, 'purple'),
('MSIB Batch 6 AI & Cybersecurity', 'PT. Hacktivate Teknologi Indonesia', 2024, 'green'),
('TOEFL ITP', 'Global Operation Indonesia', 2024, 'blue');

-- Skills - Hard Skills
INSERT INTO skills (kategori, nama, level, urutan) VALUES
('hard', 'Microsoft Office (Excel, Word, PowerPoint)', 'advanced', 1),
('hard', 'Google Workspace (Sheets, Slides, Docs)', 'advanced', 2),
('hard', 'Design (Canva)', 'advanced', 3),
('hard', 'Video Editing (CapCut)', 'advanced', 4),
('hard', 'Java (Programmer)', 'advanced', 5),
('hard', 'Python (AI & Data Science)', 'advanced', 6),
('hard', 'MySQL (Database)', 'advanced', 7),
('hard', 'AI & Machine Learning (LSTM)', 'advanced', 8);

-- Skills - Soft Skills
INSERT INTO skills (kategori, nama, urutan) VALUES
('soft', 'Pemecahan Masalah', 1),
('soft', 'Kerjasama Tim', 2),
('soft', 'Kemampuan Beradaptasi', 3);

-- Skills - Languages
INSERT INTO skills (kategori, nama, level, urutan) VALUES
('language', 'Indonesia', 'native', 1),
('language', 'English', 'elementary', 2);

-- Organization
INSERT INTO organization (nama, institusi, jabatan, periode_mulai, periode_selesai, deskripsi, bullets, icon, urutan) VALUES
('Persekutuan Mahasiswa Kristen (PMK)', 'Universitas Indraprasta PGRI', 'Wakil Kominfo', '2021-08-01', '2025-08-01',
 'Organisasi keagamaan kampus',
 ARRAY['Menghadiri rapat PMK untuk membahas program kerja dan kegiatan organisasi', 'Berpartisipasi dalam kegiatan persekutuan doa dan ibadah bersama', 'Bekerjasama dengan baik dengan anggota PMK lainnya untuk mencapai tujuan bersama', 'Mengatur dan membantu ketua dalam menjalani tugas', 'Membuat poster untuk kegiatan organisasi', 'Mengelola live streaming dan upload konten di sosial media'],
 'fa-church', 1);

-- Projects
INSERT INTO projects (judul, deskripsi, teknologi, urutan) VALUES
('Sistem Deteksi Emosi', 'Sistem klasifikasi teks menggunakan model LSTM untuk mendeteksi emosi dari teks', ARRAY['Python', 'TensorFlow', 'LSTM', 'NLP'], 1),
('Portfolio Website', 'Website portfolio pribadi dengan integrasi database Supabase', ARRAY['HTML', 'Tailwind CSS', 'JavaScript', 'Supabase'], 2);

-- Success message
SELECT 'Database schema and sample data created successfully!' as status;
