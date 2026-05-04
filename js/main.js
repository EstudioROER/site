document.addEventListener('DOMContentLoaded', () => {
    console.log("ROER Index: DOMContentLoaded disparado.");

    // --- Mobile Menu ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Optional: Animate hamburger to X
        mobileToggle.classList.toggle('open');
    });

    // --- Scroll Progress Bar ---
    const scrollProgress = document.querySelector('.scroll-progress-bar');
    if (scrollProgress) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const scrollPercent = (scrollTop / scrollHeight) * 100;
                    scrollProgress.style.width = `${scrollPercent}%`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .scale-in, .reveal-img');
    animatedElements.forEach(el => observer.observe(el));

    // --- 3D Tilt Effect for Services ---
    const cards = document.querySelectorAll('.card.neumorphic');

    cards.forEach(card => {
        card.classList.add('tilt-card');
        let tiltTicking = false;

        card.addEventListener('mousemove', (e) => {
            if (!tiltTicking) {
                window.requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    // Calculate rotation (-10 to 10 degrees)
                    const xRotation = -((y - rect.height / 2) / rect.height * 20);
                    const yRotation = ((x - rect.width / 2) / rect.width * 20);

                    card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
                    tiltTicking = false;
                });
                tiltTicking = true;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // --- Parallax Effect for Hero ---
    const heroSection = document.querySelector('.hero');
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');

    if (heroSection && window.innerWidth > 768) {
        let parallaxTicking = false;
        window.addEventListener('scroll', () => {
            if (!parallaxTicking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (scrollY < 800) {
                        heroText.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
                        heroImage.style.transform = `translate3d(0, ${scrollY * 0.2}px, 0)`;
                    }
                    parallaxTicking = false;
                });
                parallaxTicking = true;
            }
        });
    }

    // --- Project Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });

    // --- Form Validation & Submission ---
    const form = document.getElementById('evalForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;

            if (name && email && address) {
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Preparando correo...';
                submitBtn.disabled = true;

                const subject = `Evaluación Gratuita - ${name}`;
                const body = `Hola Equipo ROER...`; // Simplified for brevity

                window.location.href = `mailto:roer.arquitectura@gmail.com?subject=${subject}&body=${body}`;
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }, 1000);
            }
        });
    }

    // --- SPECTACULAR UPGRADES ---

    // 1. Optimized Custom Cursor
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    // Default hiding to avoid flash on mobile
    if (window.matchMedia("(pointer: fine)").matches) {
        document.body.appendChild(cursor);
        let cursorTicking = false;

        document.addEventListener('mousemove', (e) => {
            if (!cursorTicking) {
                window.requestAnimationFrame(() => {
                    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
                    cursorTicking = false;
                });
                cursorTicking = true;
            }
        });

        const hoverables = document.querySelectorAll('a, button, .card, input, select, textarea');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    // 2. Staggered Text Animation (Hero H1)
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const text = heroTitle.innerText;
        heroTitle.innerHTML = '';

        // Split by words
        const words = text.split(' ');
        words.forEach((word, index) => {
            const wrapper = document.createElement('span');
            wrapper.classList.add('word-wrap');
            wrapper.style.marginRight = '0.3em'; // Space between words

            const span = document.createElement('span');
            span.classList.add('word-span');
            span.innerText = word;
            span.style.animationDelay = `${index * 0.15}s`;

            wrapper.appendChild(span);
            heroTitle.appendChild(wrapper);
        });
    }

});
