// api.js - Functions to fetch data from Supabase
import { supabase } from './supabase.js';

// Helper to show toast notifications
function showApiError(context, error) {
    const message = typeof error === 'string' ? error : error?.message || 'Unknown error';
    console.error(`[API Error] ${context}:`, message);
    if (window.showErrorToast) {
        window.showErrorToast(`Gagal memuat ${context}. Coba lagi nanti.`);
    }
}

// =============================================
// PROFILE API
// =============================================
export async function getProfile() {
    try {
        const { data, error } = await supabase
            .from('profile')
            .select('*');

        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    } catch (error) {
        showApiError('profil', error);
        return null;
    }
}

export async function updateProfile(profileData) {
    try {
        const { data, error } = await supabase
            .from('profile')
            .update(profileData)
            .eq('id', profileData.id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        showApiError('profil', error);
        return null;
    }
}

// =============================================
// EXPERIENCE API
// =============================================
export async function getExperience() {
    try {
        const { data, error } = await supabase
            .from('experience')
            .select('*')
            .order('urutan', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        showApiError('pengalaman', error);
        return [];
    }
}

// =============================================
// EDUCATION API
// =============================================
export async function getEducation() {
    try {
        const { data, error } = await supabase
            .from('education')
            .select('*')
            .order('urutan', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        showApiError('pendidikan', error);
        return [];
    }
}

// =============================================
// CERTIFICATIONS API
// =============================================
export async function getCertifications() {
    try {
        const { data, error } = await supabase
            .from('certifications')
            .select('*')
            .order('tahun', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        showApiError('sertifikasi', error);
        return [];
    }
}

// =============================================
// SKILLS API
// =============================================
export async function getSkills() {
    try {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .order('urutan', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        showApiError('keahlian', error);
        return [];
    }
}

export async function getSkillsByCategory(kategori) {
    try {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .eq('kategori', kategori)
            .order('urutan', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        showApiError('keahlian', error);
        return [];
    }
}

// =============================================
// PROJECTS API
// =============================================
export async function getProjects() {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('urutan', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        showApiError('proyek', error);
        return [];
    }
}

// =============================================
// ORGANIZATION API
// =============================================
export async function getOrganization() {
    try {
        const { data, error } = await supabase
            .from('organization')
            .select('*')
            .order('urutan', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        showApiError('organisasi', error);
        return [];
    }
}

// =============================================
// UPLOAD FILE (Foto/Project Images)
// =============================================
export async function uploadFile(file, bucket, path) {
    try {
        const { data, error } = await supabase
            .storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from(bucket)
            .getPublicUrl(data.path);

        return publicUrl;
    } catch (error) {
        showApiError('upload file', error);
        return null;
    }
}

// =============================================
// REALTIME SUBSCRIPTION (Auto-update saat data berubah)
// =============================================
export function subscribeToTable(tableName, callback) {
    return supabase
        .channel(`${tableName}_changes`)
        .on('postgres_changes',
            { event: '*', schema: 'public', table: tableName },
            callback
        )
        .subscribe();
}

// =============================================
// CHECK CONNECTION
// =============================================
export async function checkConnection() {
    try {
        const { data, error } = await supabase.from('profile').select('count');
        if (error) throw error;
        return { status: 'connected', message: 'Berhasil terhubung ke Supabase!' };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

console.log('✅ API module loaded. Functions available: getProfile, getExperience, getEducation, getCertifications, getSkills, getProjects, getOrganization, uploadFile, checkConnection');
