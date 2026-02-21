/**
 * VIP Logic Shared - Estudio ROER
 */

const MASTER_CODES = ["ROER-MASTER-ADMIN-2026"]; // New secure admin bypass
const SEED = [3, 7, 1, 5, 9, 2, 8, 4];
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// One-day Fair Configuration
const FAIR_CONFIG = {
    KEY: "FERIA2026",
    DATE: "2026-02-21" // Today
};

/**
 * Gets or generates a stable Client ID (Device ID)
 */
function getClientID() {
    let id = localStorage.getItem('roer_client_id');
    if (!id) {
        const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        id = 'U-' + suffix;
        localStorage.setItem('roer_client_id', id);
    }
    return id.toUpperCase().trim();
}

/**
 * Day ID calculation (Daily rollover)
 */
function getDayID() {
    const now = new Date();
    return Math.floor((now - new Date(2026, 0, 1)) / (1000 * 60 * 60 * 24));
}

/**
 * Core validation matching admin-vip.html exactly
 */
function verifyChecksum(clean, dayID, clientID = "") {
    if (!clean || clean.length !== 8) return false;
    const raw = clean[0] + clean[1] + clean[2] + clean[4] + clean[5] + clean[6];
    const c1 = clean[3];
    const c2 = clean[7];

    let sum = dayID * 7;
    if (clientID) {
        for (let i = 0; i < clientID.length; i++) {
            sum += clientID.charCodeAt(i) * (i + 1);
        }
    }
    for (let i = 0; i < raw.length; i++) {
        sum += raw.charCodeAt(i) * SEED[i % SEED.length];
    }

    const expectedC1 = CHARS[sum % CHARS.length];
    const expectedC2 = CHARS[(sum * 13 + 5) % CHARS.length];
    return c1 === expectedC1 && c2 === expectedC2;
}

/**
 * Validates any given VIP code
 */
function validateVIPCode(code) {
    if (!code) return false;
    code = code.toUpperCase().trim();

    // 1. Check Master Admin Key
    if (MASTER_CODES.includes(code)) {
        localStorage.setItem('roer_vip_type', 'admin');
        localStorage.setItem('roer_vip_date', 'permanent');
        return true;
    }

    // 2. Check Fair Key (One-day limit)
    const todayStr = new Date().toISOString().split('T')[0];
    if (code === FAIR_CONFIG.KEY) {
        if (todayStr === FAIR_CONFIG.DATE) {
            localStorage.setItem('roer_vip_type', 'fair');
            localStorage.setItem('roer_vip_date', todayStr);
            return true;
        }
        return false;
    }

    // 3. Check Professional Algorithmic Keys (Unique Device Only)
    let clean = code;
    if (clean.startsWith('ROER-')) clean = clean.slice(5);
    else if (clean.startsWith('ROER')) clean = clean.slice(4);
    clean = clean.replace(/-/g, '');

    if (clean.length !== 8) return false;

    const today = getDayID();
    const myID = getClientID();

    // Must match the specific clientID for "dispositivo único"
    // Allow today and yesterday for timezone/rollover flexibility
    if (verifyChecksum(clean, today, myID) || verifyChecksum(clean, today - 1, myID)) {
        localStorage.setItem('roer_vip_type', 'pro');
        localStorage.setItem('roer_vip_date', 'active');
        return true;
    }

    return false;
}

// UI HANDLERS
function showFairBanner() {
    const todayStr = new Date().toISOString().split('T')[0];
    if (todayStr !== FAIR_CONFIG.DATE) return;

    if (document.getElementById('fair-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'fair-banner';
    banner.style.cursor = 'pointer';

    // Banner click logic (excluding close button)
    banner.onclick = (e) => {
        if (!e.target.classList.contains('close-btn')) {
            window.location.href = 'vip-feria.html';
        }
    };

    banner.innerHTML = `
        <style>
            #fair-banner {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(63, 184, 175, 0.15);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                border: 1px solid rgba(63, 184, 175, 0.3);
                border-radius: 16px;
                padding: 20px;
                color: white;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 15px rgba(63, 184, 175, 0.2);
                z-index: 10000;
                width: 320px;
                animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                font-family: 'Inter', sans-serif;
                transition: transform 0.3s;
            }
            #fair-banner:hover {
                transform: translateY(-5px);
                background: rgba(63, 184, 175, 0.25);
            }
            #fair-banner .badge {
                background: #3FB8AF;
                color: #121212;
                font-size: 0.7rem;
                font-weight: 800;
                padding: 4px 8px;
                border-radius: 50px;
                margin-bottom: 10px;
                display: inline-block;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            #fair-banner h4 {
                margin: 0 0 8px 0;
                font-family: 'Merriweather', serif;
                font-size: 1.1rem;
                color: #3FB8AF;
            }
            #fair-banner p {
                margin: 0;
                font-size: 0.9rem;
                line-height: 1.4;
                opacity: 0.9;
            }
            #fair-banner .close-btn {
                position: absolute;
                top: 10px;
                right: 12px;
                cursor: pointer;
                opacity: 0.5;
                transition: 0.3s;
                font-size: 1.2rem;
            }
            #fair-banner .close-btn:hover {
                opacity: 1;
            }
            @keyframes slideUp {
                from { transform: translateY(100px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @media (max-width: 480px) {
                #fair-banner {
                    left: 20px;
                    right: 20px;
                    width: auto;
                }
            }
        </style>
        <div class="close-btn" onclick="event.stopPropagation(); this.parentElement.remove()">×</div>
        <div class="badge">Demo Activa</div>
        <h4>Feria de Emprendedores Cerro Tacna Maitencillo 2026</h4>
        <p>¡Solo por hoy acceso gratuito! Haz clic aquí para entrar a la demo del Estudio de Cabida con el código especial.</p>
    `;
    document.body.appendChild(banner);
}

function checkVIPAccess() {
    const access = localStorage.getItem('roer_vip_access');
    const type = localStorage.getItem('roer_vip_type');
    const date = localStorage.getItem('roer_vip_date');
    const todayStr = new Date().toISOString().split('T')[0];

    if (access === 'granted') {
        // Expiration check for fair access
        if (type === 'fair' && date !== todayStr) {
            revokeVIPAccess();
            return false;
        }

        // Logic for hiding the gate
        const isDemoPage = window.location.pathname.endsWith('vip-feria.html') || window.location.pathname.endsWith('cabida.html');
        const gate = document.getElementById('gate');

        if (gate) {
            if (type === 'fair') {
                // Fair users ONLY hide the gate on demo pages
                if (isDemoPage) {
                    gate.style.display = 'none';
                    document.body.style.overflow = 'auto'; // Ensure scroll is enabled
                    return true;
                } else {
                    // On pro pages (vip.html, etc.), fair users MUST see the gate
                    gate.style.display = 'flex';
                    document.body.style.overflow = 'hidden'; // Lock background scroll
                    return false;
                }
            } else {
                // Pro users (Admin, Master, etc.) hide the gate everywhere
                gate.style.display = 'none';
                document.body.style.overflow = 'auto'; // Ensure scroll is enabled
                return true;
            }
        }
        return true;
    }
    return false;
}

function grantVIPAccess() {
    localStorage.setItem('roer_vip_access', 'granted');
}

function revokeVIPAccess() {
    localStorage.removeItem('roer_vip_access');
    localStorage.removeItem('roer_vip_type');
    localStorage.removeItem('roer_vip_date');
    location.reload();
}

function attemptUnlock() {
    const input = document.getElementById('passInput');
    const error = document.getElementById('error');
    if (!input) return;

    if (validateVIPCode(input.value)) {
        grantVIPAccess();

        // Redirection logic after successful unlock
        const type = localStorage.getItem('roer_vip_type');
        const isStandardVipPage = window.location.pathname.endsWith('vip.html');

        // If they enter a fair key in the main VIP gate, send them to the demo dashboard
        if (type === 'fair' && isStandardVipPage) {
            window.location.href = 'vip-feria.html';
            return;
        }

        const gate = document.getElementById('gate');
        if (gate) {
            gate.style.opacity = '0';
            document.body.style.overflow = 'auto'; // Restore scroll
            setTimeout(() => { gate.style.display = 'none'; }, 500);
        }
    } else {
        if (error) {
            const todayStr = new Date().toISOString().split('T')[0];
            if (input.value.toUpperCase().trim() === FAIR_CONFIG.KEY && todayStr !== FAIR_CONFIG.DATE) {
                error.textContent = "❌ Clave de feria expirada";
            } else {
                error.textContent = "❌ Código incorrecto";
            }
            error.style.display = 'block';
            input.style.borderColor = '#FF6B6B';
            setTimeout(() => { error.style.display = 'none'; input.style.borderColor = 'var(--primary)'; }, 2000);
        }
    }
}

// BOOTSTRAP
window.addEventListener('DOMContentLoaded', () => {
    checkVIPAccess();
    showFairBanner();
    const passInput = document.getElementById('passInput');
    if (passInput) {
        passInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") attemptUnlock();
        });
    }
});
