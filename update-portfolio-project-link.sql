-- Perbarui link Portfolio Website di Supabase
UPDATE projects
SET
    link_demo = 'https://github.com/jvshuaaa/my_port',
    link_github = 'https://github.com/jvshuaaa/my_port',
    deskripsi = 'Website portfolio pribadi dengan integrasi database Supabase untuk menampilkan profil, pengalaman, dan proyek secara dinamis.'
WHERE judul = 'Portfolio Website';
