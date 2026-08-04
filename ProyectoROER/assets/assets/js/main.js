/* ==========================================================================
   ESTUDIO ROER ARQUITECTURA - Application Script with Actualidad Blog & Web3Forms
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTabs();
  initCalculator();
  initFaq();
  initModal();
  initWeb3ContactForm();
  initDraggableWidget();
});

/* Mobile Navbar */
function initNavbar() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = '#ffffff';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '2px solid #e1e5e8';
      }
    });
  }
}

/* Tab Navigation */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(target);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/* Interactive Calculator Logic (+ IVA & Web3Forms Form Submission) */
function initCalculator() {
  const form = document.getElementById('calc-form');
  const resultBox = document.getElementById('calc-result');
  const priceEl = document.getElementById('calc-price');
  const descEl = document.getElementById('calc-desc');
  const waBtn = document.getElementById('calc-wa-btn');
  const hiddenEst = document.getElementById('calc-hidden-estimate');
  const statusMsg = document.getElementById('calc-status-msg');
  const submitBtn = document.getElementById('calc-submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const category = document.getElementById('calc-category').value;
    const meters = parseFloat(document.getElementById('calc-meters').value) || 0;
    const floors = parseInt(document.getElementById('calc-floors').value) || 1;
    const commune = document.getElementById('calc-commune').value;
    const name = document.getElementById('calc-user-name').value;
    const phone = document.getElementById('calc-user-phone').value;

    if (meters <= 0) return;

    let baseFee = 330000;
    let ratePerMeter = 5500;

    if (category === 'particular_ampliacion') {
      baseFee = 430000;
      ratePerMeter = 6000;
    } else if (category === 'particular_obra_nueva') {
      baseFee = 680000;
      ratePerMeter = 8000;
    } else if (category === 'empresa_patente') {
      baseFee = 540000;
      ratePerMeter = 7000;
    } else if (category === 'empresa_galpon') {
      baseFee = 850000;
      ratePerMeter = 6500;
    } else if (category === 'empresa_informe') {
      baseFee = 160000;
      ratePerMeter = 0;
    }

    if (floors > 1) baseFee += 70000;

    let totalEst = baseFee + (meters * ratePerMeter);
    let minPrice = Math.round(totalEst * 0.95);
    let maxPrice = Math.round(totalEst * 1.25);

    const fmt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

    const estimateText = `${fmt.format(minPrice)} - ${fmt.format(maxPrice)} CLP + IVA`;
    priceEl.textContent = estimateText;
    hiddenEst.value = `${estimateText} (Superficie: ${meters}m², Pisos: ${floors}, Comuna: ${commune})`;

    let catLabel = document.getElementById('calc-category').options[document.getElementById('calc-category').selectedIndex].text;

    descEl.innerHTML = `
      Estimación para <strong>${catLabel}</strong> de <strong>${meters} m²</strong> en <strong>${commune}</strong> (${floors} ${floors > 1 ? 'pisos' : 'piso'}).<br>
      <small style="color:#d1d7de;">*Los valores son estimativos referenciales netos (+ IVA).</small>
    `;

    resultBox.classList.add('active');

    const msg = encodeURIComponent(`Hola Estudio ROER, solicité una cotización en la calculadora web:
- Proyecto: ${catLabel}
- Superficie: ${meters} m² (${floors} piso/s)
- Comuna: ${commune}
- Estimación preliminar: ${estimateText}
Mi nombre es ${name} (${phone}).`);
    waBtn.href = `https://wa.me/56950196861?text=${msg}`;

    // Send Form via Web3Forms API
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    object['estimación_resultado'] = estimateText;
    const json = JSON.stringify(object);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando Solicitud a tu Correo...';
    }

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      let resJson = await response.json();
      if (response.status === 200) {
        statusMsg.style.display = 'block';
        statusMsg.style.color = '#10b981';
        statusMsg.innerHTML = `✅ <strong>¡Cotización solicitada con éxito!</strong> Recibirás los detalles en tu correo y puedes iniciar la atención directa en WhatsApp.`;
      } else {
        statusMsg.style.display = 'block';
        statusMsg.style.color = '#ef4444';
        statusMsg.innerHTML = `⚠️ ${resJson.message || 'Error al enviar.'}`;
      }
    })
    .catch(error => {
      statusMsg.style.display = 'block';
      statusMsg.style.color = '#ef4444';
      statusMsg.innerHTML = '⚠️ Error de conexión. Puedes continuar la cotización por WhatsApp.';
    })
    .then(function() {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '🧮 Recalcular / Enviar Solicitud';
      }
    });
  });
}

/* FAQ Accordion */
function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* Modal Reader Data (Incluye artículos de actualidad normativa 2026 - 2029) */
const modalData = {
  'post-gift': {
    title: '🎁 Regalo Especial: Guía Práctica de Regularización & Checklist DOM 2026',
    content: `
      <div style="padding:0.25rem 0;">
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1.25rem;">
          Completa tus datos para recibir la <strong>Guía Educativa Oficial de Ley del Mono & Checklist de Requisitos DOM</strong> directamente en tu correo y WhatsApp:
        </p>

        <form id="gift-form" action="https://api.web3forms.com/submit" method="POST">
          <input type="hidden" name="access_key" value="74adcccc-d748-4d84-8eac-e027310cb0af">
          <input type="hidden" name="subject" value="🎁 Nuevo Lead de Regalo - Estudio ROER Web">
          <input type="hidden" name="from_name" value="Embudo Regalo ROER">

          <div class="form-group">
            <label style="font-size:0.8rem; font-weight:600; color:var(--steel-dark);">Nombre Completo *</label>
            <input type="text" name="name" id="gift-name" class="form-control" placeholder="Ej: María González" required style="background:var(--concrete-bg); color:var(--steel-dark); border-color:var(--concrete-border);">
          </div>

          <div class="form-group">
            <label style="font-size:0.8rem; font-weight:600; color:var(--steel-dark);">Correo Electrónico *</label>
            <input type="email" name="email" id="gift-email" class="form-control" placeholder="ejemplo@correo.com" required style="background:var(--concrete-bg); color:var(--steel-dark); border-color:var(--concrete-border);">
          </div>

          <div class="form-group">
            <label style="font-size:0.8rem; font-weight:600; color:var(--steel-dark);">Teléfono / WhatsApp *</label>
            <input type="tel" name="phone" id="gift-phone" class="form-control" placeholder="+56 9 1234 5678" required style="background:var(--concrete-bg); color:var(--steel-dark); border-color:var(--concrete-border);">
          </div>

          <div class="form-group">
            <label style="font-size:0.8rem; font-weight:600; color:var(--steel-dark);">Comuna de la Propiedad</label>
            <input type="text" name="commune" id="gift-commune" class="form-control" placeholder="Ej: San Bernardo" style="background:var(--concrete-bg); color:var(--steel-dark); border-color:var(--concrete-border);">
          </div>

          <div id="gift-form-status" style="margin-bottom:1rem; font-size:0.85rem; display:none;"></div>

          <button type="submit" id="gift-submit-btn" class="btn-micro-filled" style="width:100%; padding:0.6rem; font-size:0.85rem;">
            🎁 Reclamar Mi Regalo Gratis
          </button>
        </form>
      </div>
    `
  },
  'post-ley-2029': {
    title: '📜 Ley 20.898 (Ley del Mono): Prórroga 2027 y Proyecto de Extensión a 2029',
    content: `
      <div style="font-size:0.92rem; color:var(--text-main); line-height:1.6;">
        <p style="margin-bottom:1rem;">La <strong>Ley 20.898 (Ley del Mono)</strong> es la herramienta normativa más utilizada en Chile para regularizar construcciones habitacionales sin recepción final. A continuación te presentamos el estado actual y los cambios legislativos en discusión:</p>

        <h4 style="color:var(--wood-warm); margin:1.25rem 0 0.5rem;">1. Vigencia Actual Confirmada (Hasta 31 Diciembre 2027)</h4>
        <p style="margin-bottom:1rem;">Tras la aprobación de la Ley 21.725, las Direcciones de Obras Municipales (DOM) están facultadas para recibir carpetas de regularización bajo procedimiento simplificado hasta el <strong>31 de diciembre de 2027</strong> para viviendas de hasta 140 m² y avalúo fiscal bajo 2.000 UF.</p>

        <h4 style="color:var(--wood-warm); margin:1.25rem 0 0.5rem;">2. Proyecto de Ley en Trámite: Extensión del Plazo hasta 2029</h4>
        <p style="margin-bottom:1rem;">En la Comisión de Vivienda del Congreso se discute un nuevo proyecto de ley enfocado en:</p>
        <ul style="margin-left:1.25rem; margin-bottom:1rem; color:var(--text-muted);">
          <li>Extender la vigencia oficial de ingreso hasta el <strong>31 de diciembre de 2029</strong>.</li>
          <li>Permitir regularizar viviendas edificadas con fecha corte actualizada al <strong>28 de noviembre de 2025</strong>.</li>
          <li>Ampliar la cobertura para sectores de clase media con mayores metros cuadrados útiles.</li>
        </ul>

        <h4 style="color:var(--wood-warm); margin:1.25rem 0 0.5rem;">Recomendación Técnica de Estudio ROER</h4>
        <p style="margin-bottom:1.5rem;">Aunque existe la prórroga y discusión parlamentaria, iniciar el trámite de regularización temprano evita cobros de partes municipales o multas de la DOM en el avalúo. Realiza un diagnóstico de factibilidad previo con nuestro equipo.</p>

        <a href="https://wa.me/56950196861?text=Hola%20Estudio%20ROER,%20deseo%20evaluar%20mi%20caso%20bajo%20la%20Ley%20del%20Mono" target="_blank" class="btn-micro-filled" style="width:100%; padding:0.6rem; text-align:center;">
          💬 Consultar Mi Caso por WhatsApp
        </a>
      </div>
    `
  },
  'post-decreto-10': {
    title: '⚡ Decreto N° 10 MINVU: Nueva Agilización de Permisos y Técnicas Habilitantes',
    content: `
      <div style="font-size:0.92rem; color:var(--text-main); line-height:1.6;">
        <p style="margin-bottom:1rem;">El <strong>Decreto N° 10 del Ministerio de Vivienda y Urbanismo (MINVU)</strong>, publicado e implementado plenamente en 2026, representa una de las mayores modernizaciones a la Ordenanza General de Urbanismo y Construcciones (OGUC).</p>

        <h4 style="color:var(--steel-dark); margin:1.25rem 0 0.5rem;">¿Qué cambia en la forma de pedir permisos en la DOM?</h4>

        <h5 style="margin:0.75rem 0 0.35rem; color:var(--wood-warm);">• Técnicas Habilitantes Alternativas:</h5>
        <p style="margin-bottom:0.75rem;">Permite iniciar obras menores, alteraciones interiores, ampliaciones de baja complejidad y reparaciones mediante una <strong>Declaración Jurada y expediente suscrito por un Arquitecto</strong>, sin quedar paralizados esperando meses la aprobación previa de la DOM.</p>

        <h5 style="margin:0.75rem 0 0.35rem; color:var(--wood-warm);">• Fiscalización Posterior:</h5>
        <p style="margin-bottom:0.75rem;">La municipalidad pasa de una revisión previa lenta a un modelo de <strong>control y fiscalización posterior</strong>, agilizando el inicio de construcción y regularización comercial o residencial.</p>

        <h5 style="margin:0.75rem 0 0.35rem; color:var(--wood-warm);">• Firma Electrónica & Expediente Digital (DOM Digital):</h5>
        <p style="margin-bottom:1.25rem;">Obliga la presentación de carpetas digitales estandarizadas con planos en PDF normados y firma electrónica de los profesionales responsables.</p>

        <a href="https://wa.me/56950196861?text=Hola%20Estudio%20ROER,%20deseo%20saber%20si%20mi%20proyecto%20aplica%20al%20Decreto%2010" target="_blank" class="btn-micro-filled" style="width:100%; padding:0.6rem; text-align:center;">
          💬 Evaluar Factibilidad Decreto 10
        </a>
      </div>
    `
  },
  'post-oguc': {
    title: '📐 Exención de Cálculo Estructural (OGUC Art. 5.6)',
    content: `
      <div style="font-size:0.92rem; color:var(--text-main); line-height:1.6;">
        <p style="margin-bottom:1rem;">Según el artículo 5.6 de la OGUC, las ampliaciones o edificaciones residenciales de hasta 2 pisos estructuradas en albañilería, madera o acero convencional pueden eximirse del cálculo realizado por un ingeniero, ahorrando tiempo y dinero en tu proyecto.</p>
        <h4 style="color:var(--wood-warm); margin:1rem 0 0.5rem;">Condiciones principales:</h4>
        <ul style="margin-left:1.25rem; margin-bottom:1.5rem; color:var(--text-muted);">
          <li>Máximo 2 pisos de altura total.</li>
          <li>Estructuras tipificadas con luz libre inferior a 6 metros.</li>
          <li>Patrocinio firmado por Arquitecto responsable.</li>
        </ul>
        <a href="https://wa.me/56950196861?text=Hola%20Estudio%20ROER,%20deseo%20evaluar%20si%20mi%20casa%20califica%20a%20exenci%C3%B3n%20OGUC" target="_blank" class="btn-micro-filled" style="width:100%; padding:0.6rem; text-align:center;">
          💬 Consultar Caso OGUC 5.6
        </a>
      </div>
    `
  },
  'post-termico': {
    title: '🌡️ Exigencias Acondicionamiento Térmico & Eficiencia Energética 2026',
    content: `
      <div style="font-size:0.92rem; color:var(--text-main); line-height:1.6;">
        <p style="margin-bottom:1rem;">En la Región Metropolitana y la Región de Valparaíso, la Ordenanza de Urbanismo y el Plan de Descontaminación Ambiental (PDA) exigen cumplir con altos estándares de transmitancia térmica (Complejo Techumbre, Muros Perimetrales y Ventanas).</p>
        <h4 style="color:var(--steel-dark); margin:1rem 0 0.5rem;">Aspectos exigidos en la Carpeta DOM:</h4>
        <ul style="margin-left:1.25rem; margin-bottom:1.5rem; color:var(--text-muted);">
          <li>Aislación mínima en cielos (Lana de vidrio / Aislanpol normado).</li>
          <li>Barreras de humedad y sello de ventilación.</li>
          <li>Ficha técnica de certificación energética suscrita por el Arquitecto.</li>
        </ul>
        <a href="https://wa.me/56950196861?text=Hola%20Estudio%20ROER,%20deseo%20consultar%20sobre%20la%20ficha%20t%C3%A9rmica" target="_blank" class="btn-micro-filled" style="width:100%; padding:0.6rem; text-align:center;">
          💬 Consultar Especificaciones Térmicas
        </a>
      </div>
    `
  },
  'doc-checklist': {
    title: '📋 Checklist Oficial de Documentación DOM',
    content: `
      <div style="font-size:0.92rem; color:var(--text-main); line-height:1.6;">
        <h4 style="color:var(--wood-warm); margin-bottom:0.75rem;">Documentos Requeridos para regularizar en DOM:</h4>
        <ol style="margin-left:1.25rem; margin-bottom:1.5rem; color:var(--text-muted);">
          <li>Fotocopia Cédula de Identidad del propietario titular.</li>
          <li>Certificado de Informaciones Previas (CIP) actualizado.</li>
          <li>Certificado de Avalúo Fiscal Detallado (SII).</li>
          <li>Planos de Arquitectura (Planta, Cortes, Elevaciones y Emplazamiento).</li>
          <li>Informe Técnico de Habitabilidad suscrito por Arquitecto.</li>
        </ol>
        <a href="https://wa.me/56950196861?text=Hola%20Estudio%20ROER,%20deseo%20revisar%20mi%20documentaci%C3%B3n" target="_blank" class="btn-micro-filled" style="width:100%; padding:0.6rem; text-align:center;">
          💬 Solicitar Apoyo de Arquitecto
        </a>
      </div>
    `
  }
};

function initModal() {
  const overlay = document.getElementById('modal-overlay');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close');

  if (!overlay) return;

  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const key = trigger.getAttribute('data-modal');
      const item = modalData[key];
      if (item) {
        title.textContent = item.title;
        body.innerHTML = item.content;
        overlay.classList.add('active');

        if (key === 'post-gift') {
          initGiftLeadForm();
        }
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
}

/* Gift Lead Magnet Form Submission Handler */
function initGiftLeadForm() {
  const giftForm = document.getElementById('gift-form');
  const statusDiv = document.getElementById('gift-form-status');
  const submitBtn = document.getElementById('gift-submit-btn');

  if (!giftForm) return;

  giftForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('gift-name').value;
    const phone = document.getElementById('gift-phone').value;
    const commune = document.getElementById('gift-commune').value || 'No especificada';

    const formData = new FormData(giftForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando datos...';
    }

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      let resJson = await response.json();
      if (response.status === 200) {
        const waMsg = encodeURIComponent(`Hola Estudio ROER, mi nombre es ${name} de ${commune}. Acabo de solicitar mi regalo (Guía Ley del Mono & Checklist DOM) en su sitio web.`);
        
        statusDiv.style.display = 'block';
        statusDiv.style.color = '#10b981';
        statusDiv.innerHTML = `
          <div style="background:rgba(16,185,129,0.1); border:1px solid #10b981; padding:1rem; border-radius:6px; margin-top:0.5rem; text-align:center;">
            <strong>✅ ¡Felicitaciones ${name}!</strong><br>
            Tus datos han sido registrados con éxito.<br><br>
            <a href="https://wa.me/56950196861?text=${waMsg}" target="_blank" class="btn-whatsapp btn" style="width:100%; font-size:0.85rem; padding:0.55rem; text-align:center; display:inline-block; margin-top:0.25rem;">
              📲 Recibir Guía & Contactar por WhatsApp
            </a>
          </div>
        `;
        giftForm.reset();
      } else {
        statusDiv.style.display = 'block';
        statusDiv.style.color = '#ef4444';
        statusDiv.innerHTML = `⚠️ ${resJson.message || 'Error al procesar la solicitud.'}`;
      }
    })
    .catch(error => {
      statusDiv.style.display = 'block';
      statusDiv.style.color = '#ef4444';
      statusDiv.innerHTML = '⚠️ Error de conexión. Intenta nuevamente.';
    })
    .then(function() {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '🎁 Reclamar Mi Regalo Gratis';
      }
    });
  });
}

/* Web3Forms Contact Form Integration */
function initWeb3ContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      let resJson = await response.json();
      if (response.status === 200) {
        statusDiv.style.display = 'block';
        statusDiv.style.color = '#10b981';
        statusDiv.innerHTML = '✅ <strong>¡Mensaje enviado con éxito!</strong> Nos pondremos en contacto contigo a la brevedad.';
        form.reset();
      } else {
        statusDiv.style.display = 'block';
        statusDiv.style.color = '#ef4444';
        statusDiv.innerHTML = `⚠️ ${resJson.message || 'Error al enviar el formulario.'}`;
      }
    })
    .catch(error => {
      statusDiv.style.display = 'block';
      statusDiv.style.color = '#ef4444';
      statusDiv.innerHTML = '⚠️ Ocurrió un problema de conexión. Intenta nuevamente o contáctanos por WhatsApp.';
    })
    .then(function() {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '📩 Enviar Formulario';
      }
    });
  });
}

/* Draggable Floating Stacked Widget (PC Mouse + Mobile Touch) */
function initDraggableWidget() {
  const stack = document.getElementById('floating-widget-stack');
  if (!stack) return;

  let isDragging = false;
  let hasMoved = false;
  let startX, startY, initialLeft, initialTop;

  function onStart(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    isDragging = true;
    hasMoved = false;
    startX = clientX;
    startY = clientY;

    const rect = stack.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    stack.style.right = 'auto';
    stack.style.bottom = 'auto';
    stack.style.left = `${initialLeft}px`;
    stack.style.top = `${initialTop}px`;
  }

  function onMove(e) {
    if (!isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
      hasMoved = true;
    }

    let newLeft = initialLeft + deltaX;
    let newTop = initialTop + deltaY;

    const maxLeft = window.innerWidth - stack.offsetWidth - 10;
    const maxTop = window.innerHeight - stack.offsetHeight - 10;

    newLeft = Math.max(10, Math.min(newLeft, maxLeft));
    newTop = Math.max(10, Math.min(newTop, maxTop));

    stack.style.left = `${newLeft}px`;
    stack.style.top = `${newTop}px`;
  }

  function onEnd() {
    isDragging = false;
  }

  // Mouse PC listeners
  stack.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  // Touch Mobile listeners
  stack.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onEnd);

  // Prevent link click trigger if user was dragging
  document.querySelectorAll('#floating-widget-stack a, #floating-widget-stack button').forEach(el => {
    el.addEventListener('click', (e) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });
}
