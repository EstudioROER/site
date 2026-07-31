/* ==========================================================================
   ESTUDIO ROER ARQUITECTURA - Interactive Logic & Application Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initCalculator();
  initPortfolioFilters();
  initBlogModal();
  initResourceDownloads();
  initFaqAccordion();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Scroll Progress Bar
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/* --------------------------------------------------------------------------
   2. Responsive Navbar & Smooth Scroll
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   3. Interactive Feasibility & Cost Estimator (Calculadora Ley del Mono)
   -------------------------------------------------------------------------- */
function initCalculator() {
  const calcForm = document.getElementById('calc-form');
  const calcResultBox = document.getElementById('calc-result');
  const calcResultPrice = document.getElementById('calc-price');
  const calcResultDesc = document.getElementById('calc-desc');
  const calcWhatsappBtn = document.getElementById('calc-whatsapp-btn');

  if (!calcForm) return;

  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const meters = parseFloat(document.getElementById('calc-meters').value) || 0;
    const floors = parseInt(document.getElementById('calc-floors').value) || 1;
    const commune = document.getElementById('calc-commune').value;
    const yearBuilt = document.getElementById('calc-year').value;

    if (meters <= 0) {
      showToast('Por favor ingresa una superficie válida en m²', 'warning');
      return;
    }

    // Calculation estimates based on Ley del Mono & OGUC fee standards
    let baseRatePerMeter = 6500; // CLP approx per m² fee estimate
    let baseFee = 350000; // Base professional fee

    if (floors > 1) {
      baseFee += 80000;
    }

    let estimatedTotal = baseFee + (meters * baseRatePerMeter);
    let maxEstimate = Math.round(estimatedTotal * 1.25);
    let minEstimate = Math.round(estimatedTotal * 0.95);

    // Format CLP currency
    const formatter = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    });

    let leyMonoEligible = (meters <= 140 && yearBuilt === 'before_2016') ? 'Aplica a Ley del Mono (Simplificado)' : 'Regularización General OGUC';

    calcResultPrice.textContent = `${formatter.format(minEstimate)} - ${formatter.format(maxEstimate)} CLP`;
    calcResultDesc.innerHTML = `
      <strong>Estado normativo:</strong> ${leyMonoEligible}<br>
      <strong>Ubicación:</strong> ${commune}<br>
      <strong>Superficie evaluada:</strong> ${meters} m² (${floors} ${floors > 1 ? 'pisos' : 'piso'})<br>
      <small style="color: #94a3b8;">*Incluye levantamiento, planos de arquitectura y armado de expediente municipal. Derechos municipales se cancelan directamente en la DOM.</small>
    `;

    calcResultBox.classList.add('active');

    // Configure WhatsApp direct message link
    const msg = encodeURIComponent(`Hola Estudio ROER, realicé una estimación en su sitio web:
- Superficie: ${meters} m²
- Pisos: ${floors}
- Comuna: ${commune}
- Requisito: ${leyMonoEligible}
Me gustaría agendar la evaluación técnica gratuita en terreno.`);

    calcWhatsappBtn.href = `https://wa.me/56950196861?text=${msg}`;
    calcWhatsappBtn.target = "_blank";

    showToast('Estimación calculada con éxito', 'success');
  });
}

/* --------------------------------------------------------------------------
   4. Portfolio Filters
   -------------------------------------------------------------------------- */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Blog Section & Modal Reader
   -------------------------------------------------------------------------- */
const blogPostsData = {
  'ley-mono-2026': {
    title: 'Guía Completa Ley del Mono en Chile: Requisitos y Costos',
    category: 'Normativa Ley 20.898',
    author: 'Equipo Estudio ROER',
    date: 'Actualizado 2026',
    content: `
      <h3>¿Qué es la Ley del Mono y por qué debes regularizar hoy?</h3>
      <p>La Ley 20.898 (popularmente conocida como Ley del Mono) es un procedimiento de excepción otorgado por el Estado chileno para permitir a los propietarios regularizar viviendas construidas sin permiso previo o con ampliaciones no recepcionadas.</p>
      
      <h4>Requisitos Fundamentales:</h4>
      <ul>
        <li>Superficie máxima habitable de hasta 140 m².</li>
        <li>Avalúo fiscal de la propiedad no superior a 2.000 UF (en la mayoría de sus modalidades).</li>
        <li>La construcción debe haber sido edificada con anterioridad a febrero de 2016.</li>
        <li>No estar emplazada en zonas de riesgo, franjas de utilidad pública o terrenos no urbanizados.</li>
      </ul>

      <h4>¿Cuáles son las principales ventajas?</h4>
      <p>Al regularizar por Ley del Mono, se reducen los trámites municipales en más de un 60%, no se exige el permiso de edificación previo tradicional y los derechos municipales disminuyen considerablemente.</p>
      
      <h4>¿Qué documentación prepara Estudio ROER?</h4>
      <p>Nosotros nos encargamos del levantamiento arquitectónico exacto, elaboración de planos de arquitectura escala 1:50, memoria explicativa, informe de habitabilidad y firma profesional de arquitecto colegiado para la Recepción Final en la Dirección de Obras Municipales (DOM).</p>
    `
  },
  'oguc-calculo-exencion': {
    title: 'Exención de Cálculo Estructural en Viviendas de hasta 2 Pisos',
    category: 'OGUC Art. 5.6',
    author: 'Arq. Estudio ROER',
    date: 'Julio 2026',
    content: `
      <h3>¿Cuándo se puede omitir el cálculo estructural al regularizar?</h3>
      <p>Una de las mayores preocupaciones al proyectar una ampliación o regularizar un segundo piso es el costo de una memoria de cálculo estructural realizada por un ingeniero civil.</p>

      <p>Según el artículo 5.6 de la Ordenanza General de Urbanismo y Construcciones (OGUC), existen condiciones específicas bajo las cuales una edificación residencial de hasta 2 pisos puede quedar exenta de cálculo estructural, siempre que cumpla con:</p>
      
      <ul>
        <li>Losa de hormigón armado o estructura de entrepiso de madera/acero debidamente estructurada según tabla estandarizada.</li>
        <li>Luces no superiores a 5 metros entre apoyos principales.</li>
        <li>Construcciones en albañilería confinada o tabiquería de madera/acero galvanizado estandarizado.</li>
      </ul>

      <p>En <strong>Estudio ROER</strong> evaluamos técnicamente la estructura existente durante nuestra visita inicial para determinar si puedes eximirte de este gasto, ahorrándote costos significativos en la carpeta técnica.</p>
    `
  },
  'ampliacion-segundo-piso': {
    title: 'Claves para Diseñar y Regularizar una Ampliación de Segundo Piso',
    category: 'Diseño & Ampliaciones',
    author: 'Equipo ROER',
    date: 'Junio 2026',
    content: `
      <h3>Aspectos críticos antes de construir en el segundo nivel</h3>
      <p>Construir un segundo piso es la solución idónea para ganar metros cuadrados en terrenos pequeños en comunas como San Bernardo, El Bosque, Peñaflor o Santiago Centro. Sin embargo, construir sin permiso municipal puede generar multas de la DOM y problemas para vender o solicitar créditos hipotecarios.</p>

      <h4>Elementos clave en el expediente técnico:</h4>
      <ol>
        <li><strong>Distanciamiento al deslinde y adosamiento:</strong> Respetar la rasante arquitectónica según la zona del Plan Regulador Comunal.</li>
        <li><strong>Superficie de Ventanales:</strong> Garantizar la iluminación y ventilación natural directa hacia dormitorios y áreas comunes.</li>
        <li><strong>Aislación Térmica y Acústica:</strong> Cumplir con la exigencia de la Ficha PDA de acondicionamiento térmico según la zona geográfica.</li>
      </ol>

      <p>Consúltanos hoy para coordinar una revisión técnica preventiva antes de iniciar las obras o para regularizar lo ya edificado.</p>
    `
  }
};

function initBlogModal() {
  const modalOverlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  if (!modalOverlay) return;

  document.querySelectorAll('.read-blog-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const postId = btn.getAttribute('data-post');
      const post = blogPostsData[postId];

      if (post) {
        modalTitle.textContent = post.title;
        modalBody.innerHTML = `
          <div style="margin-bottom: 1rem; color: var(--primary-terracotta); font-weight: 600; font-size: 0.85rem;">
            ${post.category} • ${post.author} • ${post.date}
          </div>
          ${post.content}
          <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--light-border); text-align: center;">
            <a href="https://wa.me/56950196861?text=Hola,%20leí%20su%20artículo%20'${encodeURIComponent(post.title)}'%20y%20tengo%20consultas%20para%20mi%20propiedad." target="_blank" class="btn btn-whatsapp">
              Consultar sobre este tema por WhatsApp
            </a>
          </div>
        `;
        modalOverlay.classList.add('active');
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   6. Material Didáctico & Printable Resources (Recursos Descargables)
   -------------------------------------------------------------------------- */
const resourceTemplates = {
  'checklist-ley-mono': {
    title: 'Checklist Oficial de Requisitos Ley del Mono (Ley 20.898)',
    filename: 'Checklist_Ley_del_Mono_Estudio_ROER.pdf',
    type: 'Checklist de Verificación',
    items: [
      'Fotocopia Cédula de Identidad del Propietario.',
      'Certificado de Avalúo Fiscal Detallado (Servicio de Impuestos Internos).',
      'Certificado de Informaciones Previas (CIP) emitido por la DOM.',
      'Planos de Arquitectura (Planta, Elevaciones, Cortes, Emplazamiento).',
      'Informe Técnico de Habitabilidad suscrito por Arquitecto.',
      'Comprobante de antigüedad previa a febrero de 2016 (Cuentas de luz/agua, contribuciones o foto satelital).'
    ]
  },
  'guia-regularizacion-paso-a-paso': {
    title: 'Guía Educativa: Paso a Paso para Regularizar tu Vivienda',
    filename: 'Guia_Paso_a_Paso_Regularizacion_ROER.pdf',
    type: 'Guía Didáctica',
    items: [
      'Paso 1: Visita técnica en terreno y levantamiento métrico.',
      'Paso 2: Revisión de cumplimiento normativo (CIP y OGUC).',
      'Paso 3: Elaboración de planos digitales e expediente técnico.',
      'Paso 4: Ingreso oficial en la Dirección de Obras Municipales (DOM).',
      'Paso 5: Revisión de observaciones municipales y correcciones.',
      'Paso 6: Emisión del Certificado de Recepción Definitiva.'
    ]
  },
  'infografia-oguc': {
    title: 'Infografía Explicativa: Requisitos de Ventilación e Iluminación OGUC',
    filename: 'Infografia_Normativa_Ventilacion_OGUC.pdf',
    type: 'Infografía Didáctica',
    items: [
      'Habitaciones y Dormitorios: Ventana libre de al menos 10% de la superficie útil del recinto.',
      'Baños y Cocinas: Ductos de ventilación forzada o ventana al exterior mínima de 0.30 m².',
      'Alturas Mínimas: 2.30 m de piso a cielo acabado en recintos habitables (2.10 m bajo vigas).'
    ]
  }
};

function initResourceDownloads() {
  const modalOverlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  document.querySelectorAll('.download-resource-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const resId = btn.getAttribute('data-resource');
      const res = resourceTemplates[resId];

      if (res) {
        modalTitle.textContent = res.title;
        let itemsHtml = res.items.map(item => `
          <li style="padding: 0.6rem 0; border-bottom: 1px dashed var(--light-border); display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: var(--success-green); font-weight: bold;">✓</span> ${item}
          </li>
        `).join('');

        modalBody.innerHTML = `
          <div style="background: var(--light-bg); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary-terracotta); text-transform: uppercase;">
                ${res.type}
              </span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Estudio ROER Arquitectura</span>
            </div>
            <ul style="list-style: none;">
              ${itemsHtml}
            </ul>
          </div>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button onclick="triggerSimulatedDownload('${res.filename}')" class="btn btn-primary">
              📥 Descargar Documento (${res.filename})
            </button>
            <a href="https://wa.me/56950196861?text=Hola%20Estudio%20ROER,%20descargué%20el%20recurso%20'${encodeURIComponent(res.title)}'%20y%20deseo%20asesoría." target="_blank" class="btn btn-whatsapp">
              💬 Consultar con un Arquitecto
            </a>
          </div>
        `;

        modalOverlay.classList.add('active');
      }
    });
  });
}

window.triggerSimulatedDownload = function(filename) {
  showToast(`Descargando archivo: ${filename}`, 'info');
  setTimeout(() => {
    showToast(`¡Descarga completada! Guarda tu copia de ${filename}`, 'success');
  }, 1200);
};

/* --------------------------------------------------------------------------
   7. FAQ Accordion & Search Filter
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearchInput = document.getElementById('faq-search');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-body').style.maxHeight = 0;
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();

      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   8. Contact Form Handling & WhatsApp Formatter
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const commune = document.getElementById('contact-commune').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !phone || !message) {
      showToast('Por favor completa todos los campos requeridos (*)', 'warning');
      return;
    }

    // Direct format to WhatsApp
    const waText = encodeURIComponent(`Hola Estudio ROER, mi nombre es ${name}.
- Teléfono: ${phone}
- Correo: ${email || 'No especificado'}
- Comuna: ${commune}
- Consulta: ${message}`);

    showToast('¡Gracias por tu mensaje! Redirigiendo a atención directa por WhatsApp...', 'success');

    setTimeout(() => {
      window.open(`https://wa.me/56950196861?text=${waText}`, '_blank');
      contactForm.reset();
    }, 1000);
  });
}

/* --------------------------------------------------------------------------
   9. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
