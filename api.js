// api.js - Fetch data dari Google Sheets via Apps Script proxy
// Ganti PROXY_URL setelah deploy Apps Script (lihat google-apps-script/Code.gs)

const PROXY_URL = 'https://script.google.com/macros/s/AKfycbxJ7WeZSA41rQJ9Mo0i3k02R5ddXK8f-AYaVQdZQ1bsVPFoqsAiBeV_97aEmc9iIMJ6pA/exec';

// URL yang sama dipakai untuk POST (kirim pesan kontak)
export const CONTACT_PROXY_URL = PROXY_URL;

// =============================================
// CACHE (localStorage, TTL 5 menit)
// =============================================
const CACHE_TTL = 5 * 60 * 1000;

function cacheGet(key) {
    try {
        const raw = localStorage.getItem('port_' + key);
        if (!raw) return null;
        const { data, exp } = JSON.parse(raw);
        if (Date.now() > exp) { localStorage.removeItem('port_' + key); return null; }
        return data;
    } catch { return null; }
}

function cacheSet(key, data) {
    try {
        localStorage.setItem('port_' + key, JSON.stringify({ data, exp: Date.now() + CACHE_TTL }));
    } catch { /* localStorage penuh, skip */ }
}

// =============================================
// CORE FETCHER
// =============================================
async function fetchSheet(sheet) {
    const cached = cacheGet(sheet);
    if (cached) { console.log('📦 cache hit:', sheet); return cached; }

    const res = await fetch(PROXY_URL + '?sheet=' + sheet);
    if (!res.ok) throw new Error('HTTP ' + res.status + ' saat fetch ' + sheet);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal fetch ' + sheet);

    // Parse kolom array (bullets, teknologi) yang disimpan sebagai JSON string
    const rows = json.data.map(row => {
        ['bullets', 'teknologi'].forEach(col => {
            if (typeof row[col] === 'string' && row[col].startsWith('[')) {
                try { row[col] = JSON.parse(row[col]); } catch { /* biarkan */ }
            }
        });
        return row;
    });

    cacheSet(sheet, rows);
    return rows;
}

// =============================================
// PUBLIC API
// =============================================
export async function getProfile() {
    const data = await fetchSheet('profile');
    return data[0] ?? null;
}

export async function getExperience() {
    const data = await fetchSheet('experience');
    return data.sort((a, b) => (Number(a.urutan) || 0) - (Number(b.urutan) || 0));
}

export async function getEducation() {
    const data = await fetchSheet('education');
    return data.sort((a, b) => (Number(a.urutan) || 0) - (Number(b.urutan) || 0));
}

export async function getCertifications() {
    const data = await fetchSheet('certifications');
    return data.sort((a, b) => (Number(b.tahun) || 0) - (Number(a.tahun) || 0));
}

export async function getSkills() {
    const data = await fetchSheet('skills');
    return data.sort((a, b) => (Number(a.urutan) || 0) - (Number(b.urutan) || 0));
}

export async function getSkillsByCategory(kategori) {
    const data = await fetchSheet('skills');
    return data
        .filter(s => s.kategori === kategori)
        .sort((a, b) => (Number(a.urutan) || 0) - (Number(b.urutan) || 0));
}

export async function getProjects() {
    const data = await fetchSheet('projects');
    return data.sort((a, b) => (Number(a.urutan) || 0) - (Number(b.urutan) || 0));
}

export async function getOrganization() {
    const data = await fetchSheet('organization');
    return data.sort((a, b) => (Number(a.urutan) || 0) - (Number(b.urutan) || 0));
}

export async function checkConnection() {
    try {
        await fetchSheet('profile');
        return { status: 'connected', message: 'Terhubung ke Google Sheets!' };
    } catch (e) {
        return { status: 'error', message: e.message };
    }
}

// Stub — tidak relevan di Google Sheets
export async function updateProfile() { return null; }
export async function uploadFile() { return null; }
export function subscribeToTable() { return null; }
