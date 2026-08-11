/* ==========================================================================
   44AI — script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initActiveNav();
    initLightbox();
    initScanTerminal();
    initContactForm();
});

/* --------------------------------------------------------------------------
   Mobile hamburger menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
    const btn = document.getElementById('hamburgerBtn');
    const nav = document.getElementById('mobileNav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        });
    });
}

/* --------------------------------------------------------------------------
   Active nav link on scroll
   -------------------------------------------------------------------------- */
function initActiveNav() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('nav.main-nav a, nav.mobile-nav a');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   Lightbox for project / SentraAI screenshots
   -------------------------------------------------------------------------- */
function initLightbox() {
    const triggers = document.querySelectorAll('[data-lightbox-trigger]');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    if (!triggers.length || !lightbox) return;

    const openLightbox = (src, caption) => {
        lightboxImg.src = src;
        lightboxImg.alt = caption || '';
        lightboxCaption.textContent = caption || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    };

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            openLightbox(trigger.dataset.img, trigger.dataset.caption);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

/* --------------------------------------------------------------------------
   Hero scan terminal — typewriter simulation
   -------------------------------------------------------------------------- */
function initScanTerminal() {
    const body = document.getElementById('scanTerminalBody');
    if (!body) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lines = [
        { text: 'hedef-site.com taraniyor...', cls: '' },
        { text: 'SSL sertifikasi dogrulandi', cls: 'line-ok' },
        { text: 'Guvenlik basliklari kontrol ediliyor...', cls: '' },
        { text: '2 iyilestirme onerisi bulundu', cls: 'line-warn' },
        { text: 'Rapor PDF olarak olusturuluyor...', cls: '' },
        { text: 'Tarama tamamlandi', cls: 'line-ok' }
    ];

    if (prefersReducedMotion) {
        body.innerHTML = lines.map(l => `<div class="${l.cls}">${l.text}</div>`).join('');
        return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    let currentLineEl = null;

    function typeNextChar() {
        if (lineIndex >= lines.length) {
            setTimeout(() => {
                body.innerHTML = '';
                lineIndex = 0;
                charIndex = 0;
                typeNextChar();
            }, 2200);
            return;
        }

        const line = lines[lineIndex];

        if (charIndex === 0) {
            currentLineEl = document.createElement('div');
            if (line.cls) currentLineEl.className = line.cls;
            body.appendChild(currentLineEl);
        }

        if (charIndex < line.text.length) {
            currentLineEl.textContent = line.text.slice(0, charIndex + 1);
            currentLineEl.innerHTML += '<span class="cursor"></span>';
            charIndex++;
            setTimeout(typeNextChar, 28);
        } else {
            currentLineEl.innerHTML = line.text;
            lineIndex++;
            charIndex = 0;
            setTimeout(typeNextChar, 420);
        }
    }

    typeNextChar();
}

/* --------------------------------------------------------------------------
   Contact form submission (Formspree)
   -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    if (!form || !status) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const actionUrl = form.getAttribute('action') || '';
        if (actionUrl.includes('YOUR_FORM_ID')) {
            status.textContent = 'Form henuz aktif bir gonderim adresine baglanmadi. Lutfen README dosyasindaki kurulum adimini tamamlayin.';
            status.className = 'form-status show err';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        try {
            const response = await fetch(actionUrl, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                status.textContent = 'Mesajiniz basariyla gonderildi. En kisa surede size donus yapacagiz.';
                status.className = 'form-status show ok';
                form.reset();
            } else {
                status.textContent = 'Mesaj gonderilirken bir sorun olustu. Lutfen dogrudan info.44ai@gmail.com adresine yazin.';
                status.className = 'form-status show err';
            }
        } catch (err) {
            status.textContent = 'Baglanti hatasi olustu. Lutfen dogrudan info.44ai@gmail.com adresine yazin.';
            status.className = 'form-status show err';
        } finally {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    });
}
