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

// Timeout for API calls (10 seconds)
const API_TIMEOUT = 10000;

// Helper to wrap API calls with timeout
async function withTimeout(promise, fallbackMessage = 'Request timeout') {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(fallbackMessage)), API_TIMEOUT)
        )
    ]);
}

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
    try {
        const profile = await withTimeout(getProfile(), 'Timeout saat memuat profil');

        console.log('Profile data from DB:', profile);

        if (!profile) {
            console.log('❌ No profile data from Supabase');
            showErrorToast('Gagal memuat data profil dari database', 6000);
            return;
        }

        // Update Hero and sidebar name
        const heroName = document.getElementById('hero-name');
        const sidebarName = document.getElementById('sidebar-profile-name');
        const footerOwner = document.getElementById('footer-owner');
        const sidebarEmail = document.getElementById('sidebar-email-link');
        const sidebarWhatsapp = document.getElementById('sidebar-whatsapp-link');
        const sidebarLinkedin = document.getElementById('sidebar-linkedin-link');
        const sidebarGithub = document.getElementById('sidebar-github-link');
        const aboutPhoneLink = document.getElementById('about-phone-link');
        const aboutEmailLink = document.getElementById('about-email-link');
        const aboutLinkedinLink = document.getElementById('about-linkedin-link');
        const profileImg = document.getElementById('about-profile-img');

        const nameValue = profile.nama || 'Jojo';
        const waNumber = (profile.whatsapp || profile.phone || '').replace(/\D/g, '');
        const linkedinUrl = profile.linkedin_url || '';

        if (heroName) heroName.textContent = nameValue;
        if (sidebarName) sidebarName.textContent = nameValue;
        if (footerOwner) footerOwner.textContent = nameValue;

        // Update title and meta description
        document.title = `Portfolio - ${nameValue} | IT Specialist`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', `Portofolio digital ${nameValue} — IT Specialist dengan fokus AI, Cybersecurity, dan proyek nyata.`);
        }

        // Update sidebar top links
        if (sidebarEmail && profile.email) {
            sidebarEmail.href = `mailto:${profile.email}`;
        }
        if (sidebarWhatsapp && waNumber) {
            sidebarWhatsapp.href = `https://wa.me/${waNumber}`;
        }
        if (sidebarLinkedin && linkedinUrl) {
            sidebarLinkedin.href = linkedinUrl;
        }
        if (sidebarGithub && profile.github_url) {
            sidebarGithub.href = profile.github_url;
        }

        // Update About section
        const aboutSummary = document.querySelector('#about p.text-lg');
        if (aboutSummary && profile.summary) {
            aboutSummary.innerHTML = profile.summary;
        }

        // Update contact info
        const emailLink = document.getElementById('contact-email');
        if (emailLink && profile.email) {
            emailLink.href = `mailto:${profile.email}`;
            emailLink.textContent = profile.email;
        }

        const waLink = document.getElementById('contact-whatsapp');
        if (waLink && waNumber) {
            waLink.href = `https://wa.me/${waNumber}`;
            waLink.textContent = profile.whatsapp || profile.phone;
        }

        const linkedinLink = document.getElementById('contact-linkedin');
        if (linkedinLink && linkedinUrl) {
            linkedinLink.href = linkedinUrl;
            linkedinLink.textContent = linkedinUrl.replace('https://', '');
        }

        // Update About section contact links
        if (aboutPhoneLink && waNumber) {
            aboutPhoneLink.href = `https://wa.me/${waNumber}`;
            aboutPhoneLink.textContent = profile.whatsapp || profile.phone;
        }
        if (aboutEmailLink && profile.email) {
            aboutEmailLink.href = `mailto:${profile.email}`;
            aboutEmailLink.textContent = profile.email;
        }
        if (aboutLinkedinLink && linkedinUrl) {
            aboutLinkedinLink.href = linkedinUrl;
            aboutLinkedinLink.textContent = linkedinUrl.replace('https://', '');
        }

        // Update foto if exists (clean any accidental whitespaces/newlines)
        if (profile.foto_url) {
            const cleanFotoUrl = profile.foto_url.replace(/\s+/g, '');
            if (profileImg) {
                profileImg.src = cleanFotoUrl;
                profileImg.alt = `Foto ${nameValue}`;
            }
            const sidebarImg = document.querySelector('#header img');
            if (sidebarImg) {
                sidebarImg.src = cleanFotoUrl;
                sidebarImg.alt = `Foto ${nameValue}`;
            }
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
    } catch (error) {
        console.error('Error rendering profile:', error);
        showErrorToast('Gagal memuat profil', 5000);
    }
}

// 2. RENDER EXPERIENCE
async function renderExperience() {
    try {
        const experiences = await withTimeout(getExperience(), 'Timeout saat memuat pengalaman');
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

        const html = uniqueExperiences.map((exp, index) => {
            const bullets = exp.bullets ? exp.bullets.map(bullet => `
                <li class="flex items-start gap-2 text-gray-600 text-sm">
                    <i class="fas fa-circle text-[6px] mt-2 text-[#149ddd] shrink-0"></i>
                    <span>${bullet}</span>
                </li>
            `).join('') : '';

            return `
                <div class="resume-item" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <h4 class="text-gray-900">${exp.posisi}</h4>
                    <h5>${formatDate(exp.periode_mulai)} - ${formatDate(exp.periode_selesai)}</h5>
                    <p class="font-bold text-[#149ddd] mb-2">${exp.perusahaan}</p>
                    <ul class="space-y-2 list-none pl-0">
                        ${bullets}
                    </ul>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
        console.log('✅ Experience rendered');
    } catch (error) {
        console.error('Error rendering experience:', error);
        showErrorToast('Gagal memuat pengalaman kerja', 5000);
    }
}

// 3. RENDER EDUCATION
async function renderEducation() {
    try {
        const education = await withTimeout(getEducation(), 'Timeout saat memuat pendidikan');
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
            <div class="resume-item" data-aos="fade-up" data-aos-delay="${index * 100}">
                <h4 class="text-gray-900">${edu.gelar}</h4>
                <h5>${formatDate(edu.periode_mulai)} - ${formatDate(edu.periode_selesai)}</h5>
                <p class="font-bold text-[#149ddd] mb-2">${edu.institusi}</p>
                ${edu.jurusan ? `<p class="text-gray-600 text-sm italic">Jurusan: ${edu.jurusan}</p>` : ''}
            </div>
        `).join('');

        container.innerHTML = html;
        console.log('✅ Education rendered');
    } catch (error) {
        console.error('Error rendering education:', error);
        showErrorToast('Gagal memuat pendidikan', 5000);
    }
}

// 4. RENDER CERTIFICATIONS
async function renderCertifications() {
    try {
        const certs = await withTimeout(getCertifications(), 'Timeout saat memuat sertifikasi');
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

        const html = `
            <div class="space-y-4 mt-4">
                ${uniqueCerts.map((cert, index) => {
                    return `
                        <div class="resume-item" data-aos="fade-up" data-aos-delay="${index * 50}">
                            <h4 class="text-gray-900 text-base font-bold">${cert.nama}</h4>
                            <p class="font-bold text-[#149ddd] text-xs uppercase tracking-wider">${cert.lembaga}</p>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.innerHTML = html;
        console.log('✅ Certifications rendered');
    } catch (error) {
        console.error('Error rendering certifications:', error);
        showErrorToast('Gagal memuat sertifikasi', 5000);
    }
}

// 5. RENDER SKILLS
async function renderSkills() {
    try {
        // Hard Skills
        let hardSkills = await withTimeout(getSkillsByCategory('hard'), 'Timeout saat memuat keahlian');
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
                            <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <span class="w-2 h-6 bg-[#149ddd] rounded-full"></span> Produktivitas
                            </h3>
                            <div class="flex flex-wrap gap-2.5">
                                ${officeSkills.map(skill => `
                                    <span class="skill-tag px-4 py-2 text-gray-700 rounded-lg text-xs font-bold transition-all cursor-default">
                                        ${skill.nama}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <span class="w-2 h-6 bg-[#0563bb] rounded-full"></span> Teknologi
                            </h3>
                            <div class="flex flex-wrap gap-2.5">
                                ${techSkills.map(skill => `
                                    <span class="skill-tag px-4 py-2 text-[#149ddd] rounded-lg text-xs font-bold transition-all cursor-default">
                                        ${skill.nama}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Soft Skills -->
                    <div class="mt-12 pt-8 border-t border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900 mb-6">Soft Skills & Bahasa</h3>
                        <div class="flex flex-wrap gap-2.5 mb-8" id="soft-skills-container"></div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="languages-container"></div>
                    </div>
                `;

                // Render Soft Skills into the placeholder
                let softSkills = await withTimeout(getSkillsByCategory('soft'), 'Timeout saat memuat soft skills');
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
                        <span class="skill-tag px-4 py-2 text-[#0563bb] rounded-lg text-xs font-bold transition-all">
                            <i class="fas fa-check-circle mr-2 text-[#149ddd]"></i> ${skill.nama}
                        </span>
                    `).join('');
                }

                // Render Languages into the placeholder
                let languages = await withTimeout(getSkillsByCategory('language'), 'Timeout saat memuat bahasa');
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
                        <div class="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-[#149ddd] transition-all">
                            <div class="w-8 h-8 rounded-lg ${index === 0 ? 'bg-sky-50 text-[#149ddd]' : 'bg-blue-50 text-[#0563bb]'} flex items-center justify-center font-bold text-sm shrink-0">
                                ${lang.nama.charAt(0)}
                            </div>
                            <div>
                                <p class="font-bold text-gray-900 leading-tight text-sm">${lang.nama}</p>
                                <p class="text-gray-400 text-[10px] font-bold uppercase tracking-wider">${lang.level}</p>
                            </div>
                        </div>
                    `).join('');
                }
            }
        }

        console.log('✅ Skills rendered');
    } catch (error) {
        console.error('Error rendering skills:', error);
        showErrorToast('Gagal memuat keahlian', 5000);
    }
}

// 6. RENDER ORGANIZATION
async function renderOrganization() {
    try {
        const orgs = await withTimeout(getOrganization(), 'Timeout saat memuat organisasi');
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
            const bullets = org.bullets || [];
            const half = Math.ceil(bullets.length / 2);
            const col1 = bullets.slice(0, half);
            const col2 = bullets.slice(half);

            return `
                <div class="project-card p-6 border border-gray-100 mb-6 bg-white" data-aos="zoom-in" data-aos-delay="${index * 100}">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 bg-blue-50 text-[#149ddd] flex items-center justify-center rounded-xl text-xl shrink-0">
                            <i class="fas ${org.icon || 'fa-users'}"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                <div>
                                    <h3 class="text-lg font-bold text-gray-900 truncate">${org.nama}</h3>
                                    <p class="text-[#149ddd] font-semibold text-sm">${org.institusi || ''}</p>
                                </div>
                                <span class="px-3 py-1 bg-slate-100 rounded text-xs font-semibold text-gray-500 w-fit shrink-0">
                                    ${formatDate(org.periode_mulai)} - ${formatDate(org.periode_selesai)}
                                </span>
                            </div>
                            <div class="grid md:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <div class="font-bold text-gray-900 mb-2 border-b pb-1">Tugas & Kontribusi</div>
                                    <ul class="space-y-2">
                                        ${col1.map(b => `
                                            <li class="flex items-start gap-2 text-gray-500">
                                                <i class="fas fa-check text-[#149ddd] text-[10px] mt-1 shrink-0"></i>
                                                <span>${b}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                                <div>
                                    <div class="font-bold text-gray-900 mb-2 border-b pb-1">${org.jabatan}</div>
                                    <ul class="space-y-2">
                                        ${col2.map(b => `
                                            <li class="flex items-start gap-2 text-gray-500">
                                                <i class="fas fa-star text-amber-500 text-[10px] mt-1 shrink-0"></i>
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
    } catch (error) {
        console.error('Error rendering organization:', error);
        showErrorToast('Gagal memuat organisasi', 5000);
    }
}

// 7. RENDER PROJECTS
function getProjectIcon(judul) {
    if (judul === 'KLIP') return 'fa-shield-halved';
    if (judul === 'Sistem Deteksi Emosi') return 'fa-brain';
    if (judul === 'Portfolio Website') return 'fa-id-card';
    return 'fa-laptop-code';
}

async function renderProjects() {
    try {
        const projects = await withTimeout(getProjects(), 'Timeout saat memuat proyek') || [];

        const merged = [...projects];

        // Merge featured projects without overwriting DB fields
        FEATURED_PROJECTS.forEach(featured => {
            const idx = merged.findIndex(p => p.judul === featured.judul);
            if (idx === -1) {
                merged.push(featured);
            } else {
                // Prefer database values over hardcoded defaults
                merged[idx] = { ...featured, ...merged[idx] };
            }
        });

        if (merged.length === 0) return;

        merged.sort((a, b) => (a.urutan ?? 99) - (b.urutan ?? 99));

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

        const html = uniqueProjects.map((proj, index) => {
            const projectLink = proj.link_demo || proj.link_github || '#';
            const isGithub = projectLink.includes('github.com');

            return `
                <div class="project-card p-4 group" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="relative h-48 overflow-hidden rounded-lg mb-4 bg-slate-50 flex items-center justify-center border border-gray-100">
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center gap-4">
                            <a href="${projectLink}" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-[#149ddd] text-white rounded-full flex items-center justify-center hover:bg-[#0563bb] transition-colors"><i class="fas fa-link"></i></a>
                            ${isGithub ? `<a href="${proj.link_github}" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"><i class="fab fa-github"></i></a>` : ''}
                        </div>
                        <i class="fas ${getProjectIcon(proj.judul)} text-5xl text-[#149ddd] opacity-60 group-hover:scale-110 transition-transform duration-500"></i>
                    </div>
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">${proj.judul}</h3>
                        <p class="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">${proj.deskripsi}</p>
                        <div class="flex flex-wrap gap-1.5 mb-4">
                            ${proj.teknologi ? proj.teknologi.map(tech => `
                                <span class="px-2.5 py-1 bg-slate-50 border border-gray-100 text-xs font-bold text-gray-600 rounded">${tech}</span>
                            `).join('') : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
        console.log('✅ Projects rendered');
    } catch (error) {
        console.error('Error rendering projects:', error);
        showErrorToast('Gagal memuat proyek', 5000);
    }
}

// =============================================
// INITIALIZATION
// =============================================
async function init() {
    console.log('🚀 Initializing Portfolio App...');

    // Show loading indicator
    const loadingSections = document.querySelectorAll('[class*="Loading"]');
    loadingSections.forEach(el => {
        el.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Memuat...';
    });

    // Check connection with timeout
    try {
        const connection = await withTimeout(checkConnection(), 'Timeout saat menghubungkan ke server');
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
            showSuccessToast('Data berhasil dimuat!', 3000);

            // Refresh AOS to detect new elements
            if (window.AOS) {
                AOS.refresh();
                console.log('✨ AOS Refreshed');
            }
        } else {
            console.warn('⚠️ Could not connect to Supabase, using default data');
            console.log('Error:', connection.message);
            showErrorToast('Gagal terhubung ke database. Menampilkan data default.', 8000);
        }
    } catch (error) {
        console.error('Initialization error:', error);
        showErrorToast('Gagal memuat halaman. Silakan refresh browser.', 10000);
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
