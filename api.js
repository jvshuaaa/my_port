// api.js - Functions to fetch data from Supabase
import { supabase } from './supabase.js';

// =============================================
// PROFILE API
// =============================================
export async function getProfile() {
    const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();
    
    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
    return data;
}

export async function updateProfile(profileData) {
    const { data, error } = await supabase
        .from('profile')
        .update(profileData)
        .eq('id', profileData.id)
        .select();
    
    if (error) {
        console.error('Error updating profile:', error);
        return null;
    }
    return data;
}

// =============================================
// EXPERIENCE API
// =============================================
export async function getExperience() {
    const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('urutan', { ascending: true });
    
    if (error) {
        console.error('Error fetching experience:', error);
        return [];
    }
    return data;
}

// =============================================
// EDUCATION API
// =============================================
export async function getEducation() {
    const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('urutan', { ascending: true });
    
    if (error) {
        console.error('Error fetching education:', error);
        return [];
    }
    return data;
}

// =============================================
// CERTIFICATIONS API
// =============================================
export async function getCertifications() {
    const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('tahun', { ascending: false });
    
    if (error) {
        console.error('Error fetching certifications:', error);
        return [];
    }
    return data;
}

// =============================================
// SKILLS API
// =============================================
export async function getSkills() {
    const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('urutan', { ascending: true });
    
    if (error) {
        console.error('Error fetching skills:', error);
        return [];
    }
    return data;
}

export async function getSkillsByCategory(kategori) {
    const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('kategori', kategori)
        .order('urutan', { ascending: true });
    
    if (error) {
        console.error('Error fetching skills:', error);
        return [];
    }
    return data;
}

// =============================================
// PROJECTS API
// =============================================
export async function getProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('urutan', { ascending: true });
    
    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
    return data;
}

// =============================================
// ORGANIZATION API
// =============================================
export async function getOrganization() {
    const { data, error } = await supabase
        .from('organization')
        .select('*')
        .order('urutan', { ascending: true });
    
    if (error) {
        console.error('Error fetching organization:', error);
        return [];
    }
    return data;
}

// =============================================
// UPLOAD FILE (Foto/Project Images)
// =============================================
export async function uploadFile(file, bucket, path) {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: true
        });
    
    if (error) {
        console.error('Error uploading file:', error);
        return null;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(data.path);
    
    return publicUrl;
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
