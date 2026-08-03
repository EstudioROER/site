/* ==========================================================================
   ESTUDIO ROER ARQUITECTURA - Application Script with Web3Forms & Draggable Floating Stack
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

/* Calculator Logic */
function initCalculator() {
  const form = document.getElementById('calc-form');
  const resultBox = document.getElementById('calc-result');
  const priceEl = document.getElementById('calc-price');
  const descEl = document.getElementById('calc-desc');
  const waBtn = document.getElementById('calc-wa-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const meters = parseFloat(document.getElementById('calc-meters').value) || 0;
    const floors = parseInt(document.getElementById('calc-floors').value) || 1;
    const commune = document.getElementById('calc-commune').value;

    if (meters <= 0) return;

    let baseFee = 320000;
    let ratePerMeter = 6000;
    if (floors > 1) baseFee += 70000;

    let totalEst = baseFee + (meters * ratePerMeter);
    let minPrice = Math.round(totalEst * 0.95);
    let maxPrice = Math.round(totalEst * 1.25);

    const fmt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

    priceEl.textContent = `${fmt.format(minPrice)} - ${fmt.format(maxPrice)} CLP`;
    descEl.innerHTML = `
      Estimación preliminar para <strong>${meters} m²</strong> en <strong>${commune}</strong> (${floors} ${floors > 1 ? 'pisos' : 'piso'}).<br>
      <small style="color:#d1d7de;">*La factibilidad y valor definitivo se confirman tras la revisión de antecedentes o asesoría técnica.</small>
    `;

    resultBox.classList.add('active');

    const msg = encodeURIComponent(`Hola Estudio ROER, solicité una estimación en su web para ${meters}m² (${floors} piso/s) en ${commune}. Deseo consultar por la factibilidad y cotización.`);
    waBtn.href = `https://wa.me/56950196861?text=${msg}`;
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

/* Modal Reader Data */
const modalData = {
  'post-gift': {
    title: '🎁 Regalo Especial: Guía Práctica de Regularización & Checklist DOM 2026',
    content: `
      <div style="text-align:center; padding:0.5rem 0;">
        <p style="font-size:1.05rem; font-weight:600; color:var(--steel-dark); margin-bottom:1rem;">
          ¡Gracias por tu interés en Estudio ROER!
        </p>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1.5rem; line-height:1.6;">
          Descarga nuestra guía educativa gratuita con el paso a paso normativo para regularizar por Ley del Mono y la lista de chequeo de la DOM.
        </p>
        <div style="display:flex; flex-direction:column; gap:0.75rem; max-width:380px; margin:0 auto;">
          <a href="https://wa.me/56950196861?text=Hola%20Estudio%20ROER,%20deseo%20recibir%20el%20Regalo%20Especial%20de%20la%20Gu%C3%ADa%20y%20Checklist%20DOM." target="_blank" class="btn-micro-filled" style="padding:0.6rem; font-size:0.88rem;">
            📲 Solicitar Guía & Checklist por WhatsApp
          </a>
          <a href="#contacto" onclick="document.getElementById('modal-overlay').classList.remove('active');" class="btn-micro" style="padding:0.6rem; font-size:0.85rem;">
            ✉️ Consultar con un Arquitecto
          </a>
        </div>
      </div>
    `
  },
  'post-ley-mono': {
    title: 'Guía Completa Ley del Mono (Ley 20.898)',
    content: `
      <p style="margin-bottom:1rem;">La Ley 20.898 otorga facilidades únicas para regularizar viviendas construidas antes de febrero de 2016 con un trámite simplificado y costos reducidos en la municipalidad.</p>
      <h4>Requisitos clave:</h4>
      <ul style="margin-left:1.25rem; margin-bottom:1.5rem; color:#566370;">
        <li>Superficie útil máxima de hasta 140 m².</li>
        <li>Avalúo fiscal de la edificación inferior a 2.000 UF.</li>
        <li>Informe de habitabilidad suscrito por un Arquitecto.</li>
      </ul>
      <a href="https://wa.me/56950196861?text=Hola%20Estudio%20ROER,%20quiero%20consultar%20sobre%20Ley%20del%20Mono" target="_blank" class="btn-micro-filled" style="width:100%; padding:0.55rem;">Consultar Caso por WhatsApp</a>
    `
  },
  'post-oguc': {
    title: 'Exención de Cálculo Estructural (OGUC Art. 5.6)',
    content: `
      <p style="margin-bottom:1rem;">Según el artículo 5.6 de la OGUC, las ampliaciones o edificaciones residenciales de hasta 2 pisos estructuradas en albañilería, madera o acero convencional pueden eximirse del cálculo realizado por un ingeniero, ahorrando tiempo y dinero en tu proyecto.</p>
      <a href="https://wa.me/56950196861?text=Hola%20Estudio%20ROER,%20deseo%20evaluar%20si%20mi%20casa%20califica%20a%20exenci%C3%B3n%20OGUC" target="_blank" class="btn-micro-filled" style="width:100%; padding:0.55rem;">Consultar Caso</a>
    `
  },
  'doc-checklist': {
    title: 'Checklist Oficial de Documentación DOM',
    content: `
      <h4>Documentos Requeridos:</h4>
      <ol style="margin-left:1.25rem; margin-bottom:1.5rem; color:#566370;">
        <li>Fotocopia Cédula de Identidad del propietario.</li>
        <li>Certificado de Informaciones Previas (CIP).</li>
        <li>Planos de Arquitectura (Planta, Cortes y Elevaciones).</li>
        <li>Informe Técnico de Habitabilidad.</li>
      </ol>
      <a href="https://wa.me/56950196861?text=Hola%20Estudio%20ROER,%20deseo%20revisar%20mi%20documentaci%C3%B3n" target="_blank" class="btn-micro-filled" style="width:100%; padding:0.55rem;">Solicitar Apoyo de Arquitecto</a>
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
