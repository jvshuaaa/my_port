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
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        purple: 'bg-purple-600',
        orange: 'bg-orange-600',
        red: 'bg-red-600',
        yellow: 'bg-yellow-500',
        pink: 'bg-pink-500'
    };
    return colors[color] || 'bg-blue-600';
}

function getTextColorClass(color) {
    const colors = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        purple: 'text-purple-600',
        orange: 'text-orange-600',
        red: 'text-red-600',
        yellow: 'text-yellow-500',
        pink: 'text-pink-500'
    };
    return colors[color] || 'text-blue-600';
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

    const container = document.querySelector('#experience .max-w-4xl');
    if (!container) return;

    const colors = ['blue', 'purple', 'orange'];
    
    const html = experiences.map((exp, index) => {
        const color = colors[index % colors.length];
        const bullets = exp.bullets ? exp.bullets.map(bullet => `
            <li class="flex items-start gap-4 text-gray-600">
                <div class="w-3 h-3 ${getColorClass(color)} rounded-full mt-2 flex-shrink-0"></div>
                ${bullet}
            </li>
        `).join('') : '';

        return `
            <div class="glass p-10 rounded-3xl">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div>
                        <h3 class="text-2xl font-black text-gray-900 mb-3">${exp.posisi}</h3>
                        <div class="flex items-center gap-4">
                            <span class="${getTextColorClass(color)} font-bold text-lg">${exp.perusahaan}</span>
                            <span class="text-gray-500 font-medium">• ${formatDate(exp.periode_mulai)} - ${formatDate(exp.periode_selesai)}</span>
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

    const container = document.querySelector('#education .grid > div:first-child .space-y-6');
    if (!container) return;

    const html = education.map(edu => `
        <div class="glass p-6">
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 ${edu.institusi.includes('Universitas') ? 'bg-blue-100' : 'bg-green-100'} flex items-center justify-center">
                    <i class="fas ${edu.institusi.includes('Universitas') ? 'fa-university' : 'fa-school'} ${edu.institusi.includes('Universitas') ? 'text-blue-600' : 'text-green-600'} text-xl"></i>
                </div>
                <div>
                    <h3 class="font-bold text-gray-900">${edu.gelar}</h3>
                    <p class="${edu.institusi.includes('Universitas') ? 'text-blue-600' : 'text-green-600'} font-medium">${edu.institusi}</p>
                    <p class="text-gray-500 text-sm">${formatDate(edu.periode_mulai)} - ${formatDate(edu.periode_selesai)}</p>
                    ${edu.jurusan ? `<p class="text-gray-600 text-sm mt-1">Jurusan ${edu.jurusan}</p>` : ''}
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
        <ul class="space-y-3">
            ${certs.map(cert => {
                const icon = Object.entries(iconMap).find(([key, _]) => cert.nama.includes(key))?.[1] || 'fa-certificate';
                return `
                    <li class="flex items-start gap-3">
                        <i class="fas ${icon} ${getTextColorClass(cert.warna)} mt-1"></i>
                        <div>
                            <p class="font-medium text-gray-900">${cert.nama}</p>
                            <p class="text-gray-500 text-sm">${cert.lembaga}</p>
                        </div>
                    </li>
                `;
            }).join('')}
        </ul>
    `;

    container.innerHTML = html;
    console.log('✅ Certifications rendered');
}

// 5. RENDER SKILLS
async function renderSkills() {
    // Hard Skills
    const hardSkills = await getSkillsByCategory('hard');
    if (hardSkills && hardSkills.length > 0) {
        const container = document.querySelector('#skills .glass > div:first-child .grid');
        if (container) {
            const techSkills = hardSkills.filter(s => 
                s.nama.includes('Java') || s.nama.includes('Python') || 
                s.nama.includes('MySQL') || s.nama.includes('AI')
            );
            const officeSkills = hardSkills.filter(s => 
                !techSkills.includes(s)
            );

            container.innerHTML = `
                <ul class="space-y-2">
                    ${officeSkills.map(skill => `
                        <li class="flex items-center gap-2 text-gray-700">
                            <span class="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            ${skill.nama}
                        </li>
                    `).join('')}
                </ul>
                <ul class="space-y-2">
                    ${techSkills.map(skill => `
                        <li class="flex items-center gap-2 text-gray-700">
                            <span class="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                            ${skill.nama}
                        </li>
                    `).join('')}
                </ul>
            `;
        }
    }

    // Soft Skills
    const softSkills = await getSkillsByCategory('soft');
    if (softSkills && softSkills.length > 0) {
        const container = document.querySelector('#skills .glass > div:nth-child(2) .flex');
        if (container) {
            container.innerHTML = softSkills.map(skill => `
                <span class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">${skill.nama}</span>
            `).join('');
        }
    }

    // Languages
    const languages = await getSkillsByCategory('language');
    if (languages && languages.length > 0) {
        const container = document.querySelector('#skills .glass > div:last-child .flex');
        if (container) {
            container.innerHTML = languages.map((lang, index) => `
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 ${index === 0 ? 'bg-green-600' : 'bg-yellow-500'} rounded-full"></span>
                    <span class="text-gray-700">${lang.nama} (${lang.level})</span>
                </div>
            `).join('');
        }
    }

    console.log('✅ Skills rendered');
}

// 6. RENDER ORGANIZATION
async function renderOrganization() {
    const orgs = await getOrganization();
    if (!orgs || orgs.length === 0) return;

    const container = document.querySelector('#organization .max-w-4xl');
    if (!container) return;

    const org = orgs[0]; // Ambil yang pertama
    const bullets = org.bullets ? org.bullets.map(bullet => `<li>${bullet}</li>`).join('') : '';
    
    // Split bullets untuk anggota dan wakil kominfo
    const half = Math.ceil(org.bullets.length / 2);
    const anggotaBullets = org.bullets.slice(0, half);
    const kominfoBullets = org.bullets.slice(half);

    container.innerHTML = `
        <div class="glass p-8">
            <div class="flex items-start gap-4 mb-6">
                <div class="w-14 h-14 bg-blue-100 flex items-center justify-center">
                    <i class="fas ${org.icon || 'fa-users'} text-blue-600 text-2xl"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-900">${org.nama}</h3>
                    <p class="text-blue-600 font-medium">${org.institusi}</p>
                    <p class="text-gray-500 text-sm mb-4">${formatDate(org.periode_mulai)} - ${formatDate(org.periode_selesai)}</p>

                    <div class="space-y-4">
                        <div class="border-l-4 border-blue-500 pl-4">
                            <h4 class="font-semibold text-gray-900">Anggota</h4>
                            <ul class="mt-2 space-y-1 text-gray-600 text-sm">
                                ${anggotaBullets.map(b => `<li>• ${b}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="border-l-4 border-purple-500 pl-4">
                            <h4 class="font-semibold text-gray-900">${org.jabatan}</h4>
                            <ul class="mt-2 space-y-1 text-gray-600 text-sm">
                                ${kominfoBullets.map(b => `<li>• ${b}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    console.log('✅ Organization rendered');
}

// 7. RENDER PROJECTS
async function renderProjects() {
    const projects = await getProjects();
    if (!projects || projects.length === 0) return;

    const container = document.querySelector('#projects .grid');
    if (!container) return;

    const colors = ['blue', 'green', 'purple'];

    const html = projects.map((proj, index) => {
        const color = colors[index % colors.length];
        const techs = proj.teknologi ? proj.teknologi.map(tech => `
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-700">${tech}</span>
        `).join('') : '';

        return `
            <div class="glass p-8 rounded-3xl">
                <div class="h-48 bg-${color}-100 rounded-2xl mb-6 flex items-center justify-center">
                    <i class="fas fa-code text-5xl text-${color}-600"></i>
                </div>
                <h3 class="text-2xl font-black text-gray-900 mb-4">${proj.judul}</h3>
                <p class="text-gray-600 mb-6">${proj.deskripsi}</p>
                <div class="flex flex-wrap gap-2 mb-6">
                    ${techs}
                </div>
                ${proj.link_demo ? `<a href="${proj.link_demo}" target="_blank" class="text-${color}-600 font-semibold">Lihat Demo →</a>` : ''}
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
