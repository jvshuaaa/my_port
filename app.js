// app.js - Dynamic content loader from Supabase
import { 
    getProfile, 
    getExperience, 
    getEducation, 
    getCertifications, 
    getSkills, 
    getSkillsByCategory,
    getProjects, 
    getOrganization,
    checkConnection 
} from './api.js';

// Proyek unggulan (ditampilkan jika belum ada di Supabase)
const FEATURED_PROJECTS = [
    {
        judul: 'KLIP',
        deskripsi: 'Portal Integrity Hub untuk Direktorat Kepatuhan Internal, Direktorat Jenderal Pemasyarakatan — platform konsultasi dan pelaporan terkait tugas serta fungsi kepatuhan internal.',
        teknologi: ['Laravel', 'PHP', 'JavaScript', 'MySQL'],
        link_github: 'https://github.com/jvshuaaa/KLIP',
        link_demo: 'https://github.com/jvshuaaa/KLIP',
        urutan: 0
    },
    {
        judul: 'Portfolio Website',
        deskripsi: 'Website portfolio pribadi dengan integrasi database Supabase untuk menampilkan profil, pengalaman, dan proyek secara dinamis.',
        teknologi: ['HTML', 'Tailwind CSS', 'JavaScript', 'Supabase'],
        link_github: 'https://github.com/jvshuaaa/my_port',
        link_demo: 'https://github.com/jvshuaaa/my_port',
        urutan: 2
    }
];

// =============================================
// UTILITY FUNCTIONS
// =============================================
function formatDate(dateString) {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
}

function getColorClass(color) {
    const colors = {
        blue: 'bg-primary',
        green: 'bg-green-500',
        purple: 'bg-secondary',
        orange: 'bg-orange-500',
        red: 'bg-accent',
        yellow: 'bg-yellow-500',
        pink: 'bg-pink-500'
    };
    return colors[color] || 'bg-primary';
}

function getTextColorClass(color) {
    const colors = {
        blue: 'text-primary',
        green: 'text-green-600',
        purple: 'text-secondary',
        orange: 'text-orange-600',
        red: 'text-accent',
        yellow: 'text-yellow-600',
        pink: 'text-pink-600'
    };
    return colors[color] || 'text-primary';
}

// =============================================
// RENDER FUNCTIONS
// =============================================

// 1. RENDER PROFILE (Hero & About)
async function renderProfile() {
    const profile = await getProfile();
    if (!profile) {
        console.log('Using default profile data');
        return;
    }

    // Update Hero
    const heroName = document.querySelector('h1 span.text-gray-900');
    if (heroName) heroName.textContent = profile.nama || '[NAMA ANDA]';

    // Update title
    document.title = `Portfolio - ${profile.nama} | IT Specialist`;

    // Update About section
    const aboutSummary = document.querySelector('#about p.text-lg');
    if (aboutSummary && profile.summary) {
        aboutSummary.innerHTML = profile.summary;
    }

    // Update contact info
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink && profile.email) {
        emailLink.href = `mailto:${profile.email}`;
        emailLink.textContent = profile.email;
    }

    const waLink = document.querySelector('a[href^="https://wa.me"]');
    if (waLink && profile.whatsapp) {
        const waNumber = profile.whatsapp.replace(/\D/g, '');
        waLink.href = `https://wa.me/${waNumber}`;
        waLink.textContent = profile.whatsapp;
    }

    const linkedinLink = document.querySelector('a[href^="https://linkedin.com"]');
    if (linkedinLink && profile.linkedin_url) {
        linkedinLink.href = profile.linkedin_url;
        linkedinLink.textContent = profile.linkedin_url.replace('https://', '');
    }

    // Update foto if exists
    const profileImg = document.querySelector('#about img');
    if (profileImg && profile.foto_url) {
        profileImg.src = profile.foto_url;
        profileImg.alt = `Foto ${profile.nama}`;
    }

    // Update CV download link
    const cvLink = document.querySelector('a[href="#contact"] i.fa-file-download');
    if (cvLink && profile.cv_url) {
        const cvButton = cvLink.closest('a');
        cvButton.href = profile.cv_url;
        cvButton.target = '_blank';
        cvButton.download = true;
    }

    console.log('✅ Profile rendered');
}

// 2. RENDER EXPERIENCE
async function renderExperience() {
    const experiences = await getExperience();
    if (!experiences || experiences.length === 0) {
        console.log('No experience data from Supabase');
        return;
    }

    // Deduplicate to prevent double rendering if data is duplicated in DB
    const uniqueExperiences = [];
    const seen = new Set();
    experiences.forEach(exp => {
        const key = `${exp.posisi}-${exp.perusahaan}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueExperiences.push(exp);
        }
    });

    const container = document.querySelector('#experience .max-w-4xl');
    if (!container) return;

    const colors = ['blue', 'purple', 'orange'];
    
    const html = uniqueExperiences.map((exp, index) => {
        const color = colors[index % colors.length];
        const bullets = exp.bullets ? exp.bullets.map(bullet => `
            <li class="flex items-start gap-4 text-gray-600">
                <div class="w-3 h-3 ${getColorClass(color)} rounded-full mt-2 flex-shrink-0"></div>
                ${bullet}
            </li>
        `).join('') : '';

        return `
            <div class="glass-card p-10 rounded-[2.5rem]" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-3">${exp.posisi}</h3>
                        <div class="flex items-center gap-4">
                            <span class="${getTextColorClass(color)} font-extrabold text-lg">${exp.perusahaan}</span>
                            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-500">
                                ${formatDate(exp.periode_mulai)} - ${formatDate(exp.periode_selesai)}
                            </span>
                        </div>
                    </div>
                </div>
                <ul class="space-y-4 text-lg">
                    ${bullets}
                </ul>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
    console.log('✅ Experience rendered');
}

// 3. RENDER EDUCATION
async function renderEducation() {
    const education = await getEducation();
    if (!education || education.length === 0) return;

    // Deduplicate
    const uniqueEducation = [];
    const seen = new Set();
    education.forEach(edu => {
        const key = `${edu.gelar}-${edu.institusi}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueEducation.push(edu);
        }
    });

    const container = document.querySelector('#education .grid > div:first-child .space-y-6');
    if (!container) return;

    const html = uniqueEducation.map((edu, index) => `
        <div class="glass-card p-8 rounded-3xl" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="flex items-start gap-6">
                <div class="w-16 h-16 ${edu.institusi.includes('Universitas') ? 'bg-primary/10' : 'bg-green-100'} flex items-center justify-center rounded-2xl shrink-0">
                    <i class="fas ${edu.institusi.includes('Universitas') ? 'fa-university' : 'fa-school'} ${edu.institusi.includes('Universitas') ? 'text-primary' : 'text-green-600'} text-2xl"></i>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900 mb-1">${edu.gelar}</h3>
                    <p class="${edu.institusi.includes('Universitas') ? 'text-primary' : 'text-green-600'} font-bold mb-2">${edu.institusi}</p>
                    <div class="flex items-center gap-3">
                        <span class="text-gray-400 text-sm font-medium"><i class="far fa-calendar-alt mr-1"></i> ${formatDate(edu.periode_mulai)} - ${formatDate(edu.periode_selesai)}</span>
                        ${edu.jurusan ? `<span class="w-1 h-1 bg-gray-300 rounded-full"></span><span class="text-gray-500 text-sm font-medium">Jurusan ${edu.jurusan}</span>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
    console.log('✅ Education rendered');
}

// 4. RENDER CERTIFICATIONS
async function renderCertifications() {
    const certs = await getCertifications();
    if (!certs || certs.length === 0) return;

    // Deduplicate
    const uniqueCerts = [];
    const seenCerts = new Set();
    certs.forEach(cert => {
        if (!seenCerts.has(cert.nama)) {
            seenCerts.add(cert.nama);
            uniqueCerts.push(cert);
        }
    });

    const container = document.querySelector('#education .grid > div:last-child .glass');
    if (!container) return;

    const iconMap = {
        'Data Analyst': 'fa-certificate',
        'Software Engineer': 'fa-certificate',
        'Data Science': 'fa-certificate',
        'Cyber Security': 'fa-shield-alt',
        'Machine Learning': 'fa-brain',
        'Front End': 'fa-certificate',
        'MSIB': 'fa-award',
        'TOEFL': 'fa-language',
        'Digital Marketing': 'fa-certificate',
        'Instalasi': 'fa-certificate'
    };

    const html = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${uniqueCerts.map((cert, index) => {
                const icon = Object.entries(iconMap).find(([key, _]) => cert.nama.includes(key))?.[1] || 'fa-certificate';
                return `
                    <div class="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/50 transition-all group" data-aos="fade-up" data-aos-delay="${index * 50}">
                        <div class="w-10 h-10 ${getColorClass(cert.warna)}/10 flex items-center justify-center rounded-xl ${getTextColorClass(cert.warna)} group-hover:scale-110 transition-transform">
                            <i class="fas ${icon} text-lg"></i>
                        </div>
                        <div>
                            <p class="font-bold text-gray-900 leading-tight">${cert.nama}</p>
                            <p class="text-gray-400 text-xs font-medium uppercase tracking-wider">${cert.lembaga}</p>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    container.innerHTML = html;
    console.log('✅ Certifications rendered');
}

// 5. RENDER SKILLS
async function renderSkills() {
    // Hard Skills
    let hardSkills = await getSkillsByCategory('hard');
    if (hardSkills && hardSkills.length > 0) {
        // Deduplicate
        const seenHard = new Set();
        hardSkills = hardSkills.filter(s => {
            if (seenHard.has(s.nama)) return false;
            seenHard.add(s.nama);
            return true;
        });

        const container = document.querySelector('#skills .glass-card');
        if (container) {
            const techSkills = hardSkills.filter(s => 
                s.nama.includes('Java') || s.nama.includes('Python') || 
                s.nama.includes('MySQL') || s.nama.includes('AI')
            );
            const officeSkills = hardSkills.filter(s => 
                !techSkills.includes(s)
            );

            container.innerHTML = `
                <div class="grid md:grid-cols-2 gap-12">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span class="w-2 h-8 bg-primary rounded-full"></span> Produktivitas
                        </h3>
                        <div class="flex flex-wrap gap-3">
                            ${officeSkills.map(skill => `
                                <span class="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-2xl font-bold text-sm border border-gray-100 hover:border-primary/30 transition-all cursor-default">
                                    ${skill.nama}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span class="w-2 h-8 bg-secondary rounded-full"></span> Teknologi
                        </h3>
                        <div class="flex flex-wrap gap-3">
                            ${techSkills.map(skill => `
                                <span class="px-5 py-2.5 bg-primary/5 text-primary rounded-2xl font-bold text-sm border border-primary/10 hover:border-primary/30 transition-all cursor-default">
                                    ${skill.nama}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Soft Skills -->
                <div class="mt-16 pt-12 border-t border-gray-100">
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Soft Skills & Bahasa</h3>
                    <div class="flex flex-wrap gap-3 mb-8" id="soft-skills-container"></div>
                    <div class="flex flex-wrap gap-8" id="languages-container"></div>
                </div>
            `;
            
            // Render Soft Skills into the placeholder
            let softSkills = await getSkillsByCategory('soft');
            const softContainer = document.getElementById('soft-skills-container');
            if (softSkills && softContainer) {
                // Deduplicate
                const seenSoft = new Set();
                softSkills = softSkills.filter(s => {
                    if (seenSoft.has(s.nama)) return false;
                    seenSoft.add(s.nama);
                    return true;
                });

                softContainer.innerHTML = softSkills.map(skill => `
                    <span class="px-6 py-3 bg-secondary/10 text-secondary rounded-full font-bold text-sm">
                        <i class="fas fa-check-circle mr-2"></i> ${skill.nama}
                    </span>
                `).join('');
            }

            // Render Languages into the placeholder
            let languages = await getSkillsByCategory('language');
            const langContainer = document.getElementById('languages-container');
            if (languages && langContainer) {
                // Deduplicate
                const seenLang = new Set();
                languages = languages.filter(s => {
                    if (seenLang.has(s.nama)) return false;
                    seenLang.add(s.nama);
                    return true;
                });

                langContainer.innerHTML = languages.map((lang, index) => `
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl ${index === 0 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'} flex items-center justify-center font-bold">
                            ${lang.nama.charAt(0)}
                        </div>
                        <div>
                            <p class="font-bold text-gray-900 leading-tight">${lang.nama}</p>
                            <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">${lang.level}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    console.log('✅ Skills rendered');
}

// 6. RENDER ORGANIZATION
async function renderOrganization() {
    const orgs = await getOrganization();
    if (!orgs || orgs.length === 0) return;

    // Deduplicate
    const uniqueOrgs = [];
    const seenOrgs = new Set();
    orgs.forEach(org => {
        const key = `${org.nama}-${org.jabatan}`;
        if (!seenOrgs.has(key)) {
            seenOrgs.add(key);
            uniqueOrgs.push(org);
        }
    });

    const container = document.querySelector('#organization .max-w-4xl');
    if (!container) return;

    const html = uniqueOrgs.map((org, index) => {
        // Split bullets untuk dua kolom jika jumlahnya banyak
        const bullets = org.bullets || [];
        const half = Math.ceil(bullets.length / 2);
        const col1 = bullets.slice(0, half);
        const col2 = bullets.slice(half);

        return `
            <div class="glass-card p-10 rounded-[3rem] mb-10" data-aos="zoom-in" data-aos-delay="${index * 100}">
                <div class="flex flex-col md:flex-row items-start gap-8">
                    <div class="w-20 h-20 bg-primary/10 flex items-center justify-center rounded-[2rem] text-primary shrink-0">
                        <i class="fas ${org.icon || 'fa-users'} text-3xl"></i>
                    </div>
                    <div class="flex-1 w-full">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h3 class="text-2xl font-bold text-gray-900 mb-1">${org.nama}</h3>
                                <p class="text-primary font-bold text-lg">${org.institusi || ''}</p>
                            </div>
                            <span class="px-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-gray-500 w-fit">
                                ${formatDate(org.periode_mulai)} - ${formatDate(org.periode_selesai)}
                            </span>
                        </div>

                        <div class="grid md:grid-cols-2 gap-10">
                            <div class="space-y-4">
                                <div class="flex items-center gap-3 text-gray-900 font-bold mb-4">
                                    <span class="w-8 h-1 bg-primary rounded-full"></span> Tugas & Kontribusi
                                </div>
                                <ul class="space-y-3">
                                    ${col1.map(b => `
                                        <li class="flex items-start gap-3 text-gray-500">
                                            <i class="fas fa-check text-primary text-xs mt-1.5"></i>
                                            <span>${b}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>

                            <div class="space-y-4">
                                <div class="flex items-center gap-3 text-gray-900 font-bold mb-4">
                                    <span class="w-8 h-1 bg-secondary rounded-full"></span> ${org.jabatan}
                                </div>
                                <ul class="space-y-3">
                                    ${col2.map(b => `
                                        <li class="flex items-start gap-3 text-gray-500">
                                            <i class="fas fa-star text-secondary text-xs mt-1.5"></i>
                                            <span>${b}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
    console.log('✅ Organizations rendered');
}

// 7. RENDER PROJECTS
function getProjectIcon(judul) {
    if (judul === 'KLIP') return 'fa-shield-halved';
    if (judul === 'Sistem Deteksi Emosi') return 'fa-brain';
    if (judul === 'Portfolio Website') return 'fa-id-card';
    return 'fa-laptop-code';
}

async function renderProjects() {
    const projects = await getProjects() || [];

    // Gabungkan / perbarui proyek unggulan (link, deskripsi, dll.)
    const merged = [...projects];
    FEATURED_PROJECTS.forEach(featured => {
        const idx = merged.findIndex(p => p.judul === featured.judul);
        if (idx === -1) {
            merged.push(featured);
        } else {
            merged[idx] = { ...merged[idx], ...featured };
        }
    });

    if (merged.length === 0) return;

    merged.sort((a, b) => (a.urutan ?? 99) - (b.urutan ?? 99));

    // Deduplicate
    const uniqueProjects = [];
    const seen = new Set();
    merged.forEach(proj => {
        if (!seen.has(proj.judul)) {
            seen.add(proj.judul);
            uniqueProjects.push(proj);
        }
    });

    const container = document.querySelector('#projects .grid');
    if (!container) return;

    const colors = ['blue', 'green', 'purple'];

    const html = uniqueProjects.map((proj, index) => {
        const color = colors[index % colors.length];
        const projectLink = proj.link_demo || proj.link_github || '#';
        const isGithub = projectLink.includes('github.com');
        const techs = proj.teknologi ? proj.teknologi.map(tech => `
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-700">${tech}</span>
        `).join('') : '';

        return `
            <div class="glass-card p-4 rounded-[2.5rem] group" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="relative h-64 overflow-hidden rounded-[2rem] mb-8">
                    <div class="absolute inset-0 bg-gradient-to-br from-${color === 'blue' ? 'primary' : color === 'green' ? 'green-500' : 'secondary'}/20 to-transparent z-10"></div>
                    <div class="absolute inset-0 flex items-center justify-center bg-gray-100 group-hover:scale-110 transition-transform duration-700">
                        <i class="fas ${getProjectIcon(proj.judul)} text-7xl text-${color === 'blue' ? 'primary' : color === 'green' ? 'green-600' : 'secondary'} opacity-40"></i>
                    </div>
                    ${isGithub ? `
                    <a href="${projectLink}" target="_blank" rel="noopener noreferrer" class="absolute top-6 right-6 z-20">
                        <div class="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-900 hover:bg-white/90 transition-colors">
                            <i class="fab fa-github text-xl"></i>
                        </div>
                    </a>` : `
                    <div class="absolute top-6 right-6 z-20">
                        <div class="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-900">
                            <i class="fas fa-code text-xl"></i>
                        </div>
                    </div>`}
                </div>
                <div class="px-4 pb-4">
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${techs}
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-3">${proj.judul}</h3>
                    <p class="text-gray-500 mb-8 line-clamp-3">${proj.deskripsi}</p>
                    <a href="${projectLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center font-bold text-primary hover:gap-3 transition-all">
                        ${isGithub ? 'Lihat di GitHub' : 'Lihat Selengkapnya'} <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
    console.log('✅ Projects rendered');
}

// =============================================
// INITIALIZATION
// =============================================
async function init() {
    console.log('🚀 Initializing Portfolio App...');
    
    // Check connection
    const connection = await checkConnection();
    console.log('Connection status:', connection);
    
    if (connection.status === 'connected') {
        console.log('📡 Connected to Supabase! Loading data...');
        
        // Load all data
        await Promise.all([
            renderProfile(),
            renderExperience(),
            renderEducation(),
            renderCertifications(),
            renderSkills(),
            renderOrganization(),
            renderProjects()
        ]);
        
        console.log('✅ All data loaded from Supabase!');

        // Refresh AOS to detect new elements
        if (window.AOS) {
            AOS.refresh();
            console.log('✨ AOS Refreshed');
        }
    } else {
        console.warn('⚠️ Could not connect to Supabase, using default data');
        console.log('Error:', connection.message);
    }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for debugging
window.portfolioApp = { init, renderProfile, renderExperience, renderEducation, renderCertifications, renderSkills, renderOrganization, renderProjects };
