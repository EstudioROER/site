document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    mobileToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = '#f5f5f5';
            navLinks.style.padding = '1rem';
            navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }
    });

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
        card.classList.add('tilt-card'); // Ensure class is present

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation (-10 to 10 degrees)
            const xRotation = -((y - rect.height / 2) / rect.height * 20);
            const yRotation = ((x - rect.width / 2) / rect.width * 20);

            card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
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
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < 800) {
                // Parallax Logic
                heroText.style.transform = `translateY(${scrollY * 0.4}px)`; // Text moves slower
                heroImage.style.transform = `translateY(${scrollY * 0.2}px)`; // Image moves even slower
            }
        });
    }
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
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


    // --- Form Validation & Submission Mock ---
    const form = document.getElementById('evalForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation check
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            const floors = document.getElementById('floors').value;
            const wallType = document.getElementById('wall-type').value;
            const vanos = document.getElementById('vanos').value;
            const message = document.getElementById('message').value;

            if (name && email && address) {
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;

                submitBtn.innerText = 'Preparando correo...';
                submitBtn.disabled = true;

                // Construct Email Body
                const subject = `Evaluación Gratuita - ${name}`;
                const body = `Hola Equipo ROER,%0D%0A%0D%0ASolicito una evaluación gratuita para mi propiedad.%0D%0A%0D%0A` +
                    `Nombre: ${name}%0D%0A` +
                    `Correo: ${email}%0D%0A` +
                    `Teléfono: ${phone}%0D%0A` +
                    `Dirección: ${address}%0D%0A` +
                    `Pisos: ${floors}%0D%0A` +
                    `Tipo Muro: ${wallType}%0D%0A` +
                    `% Vanos: ${vanos}%0D%0A%0D%0A` +
                    `Mensaje Adicional:%0D%0A${message}%0D%0A%0D%0A` +
                    `(Adjuntar fotos manualmente en el correo)`;

                // Open Mail Client
                window.location.href = `mailto:roer.arquitectura@gmail.com?subject=${subject}&body=${body}`;

                // Reset UI
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    // Optional: alert('Si no se abrió tu correo, por favor escribe a roer.arquitectura@gmail.com');
                }, 1000);

            } else {
                alert('Por favor complete los campos obligatorios.');
            }
        });
    }

    // --- SPECTACULAR UPGRADES ---

    // 1. Custom Cursor
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const hoverables = document.querySelectorAll('a, button, .card, input, select, textarea');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

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
