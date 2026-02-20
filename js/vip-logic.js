/**
 * VIP Logic Shared - Estudio ROER
 * Centralizes code validation and localStorage persistence.
 */

const MASTER_CODES = ["ROER2026ADMIN", "ROER-ADMIN-2026"];
const SEED = [3, 7, 1, 5, 9, 2, 8, 4];
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function getClientID() {
    return localStorage.getItem('roer_client_id') || "";
}

function getDayID() {
    const now = new Date();
    return Math.floor((now - new Date(2026, 0, 1)) / (1000 * 60 * 60 * 24));
}

function verifyChecksum(clean, dayID) {
    const raw = clean[0] + clean[1] + clean[2] + clean[4] + clean[5] + clean[6];
    const c1 = clean[3];
    const c2 = clean[7];
    const clientID = getClientID().toUpperCase().trim();

    let sum = dayID * 7;

    // Add ClientID influence (CRITICAL: match admin-vip.html)
    if (clientID) {
        for (let i = 0; i < clientID.length; i++) {
            sum += clientID.charCodeAt(i) * (i + 1);
        }
    }

    for (let i = 0; i < raw.length; i++) {
        sum += raw.charCodeAt(i) * SEED[i % SEED.length];
    }

    return c1 === CHARS[sum % CHARS.length] && c2 === CHARS[(sum * 13 + 5) % CHARS.length];
}

function validateVIPCode(code) {
    code = code.toUpperCase().trim();
    if (MASTER_CODES.includes(code)) return true;

    // Auto-fix format if ROER is missing or dash is missing
    if (!code.startsWith('ROER-')) {
        if (code.startsWith('ROER')) code = 'ROER-' + code.slice(4);
        else code = 'ROER-' + code;
    }

    const clean = code.replace('ROER-', '').replace(/-/g, '');
    if (clean.length !== 8) return false;
    for (let ch of clean) { if (!CHARS.includes(ch)) return false; }

    const today = getDayID();
    if (verifyChecksum(clean, today)) return true;
    if (verifyChecksum(clean, today - 1)) return true; // Allow yesterday
    return false;
}

function checkVIPAccess() {
    if (localStorage.getItem('roer_vip_access') === 'granted') {
        const gate = document.getElementById('gate');
        if (gate) gate.style.display = 'none';
        return true;
    }
    return false;
}

function grantVIPAccess() {
    localStorage.setItem('roer_vip_access', 'granted');
}

function revokeVIPAccess() {
    localStorage.removeItem('roer_vip_access');
    location.reload();
}

/**
 * Common unlock function for all tools
 */
function attemptUnlock() {
    const input = document.getElementById('passInput');
    const error = document.getElementById('error');

    if (validateVIPCode(input.value)) {
        grantVIPAccess();
        const gate = document.getElementById('gate');
        if (gate) {
            gate.style.opacity = '0';
            setTimeout(() => {
                gate.style.display = 'none';
            }, 500);
        }
    } else {
        if (error) {
            error.style.display = 'block';
            input.style.borderColor = '#FF6B6B';
            setTimeout(() => {
                error.style.display = 'none';
                input.style.borderColor = 'var(--primary)';
            }, 2000);
        }
    }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
    checkVIPAccess();

    // Add Enter key support if input exists
    const passInput = document.getElementById('passInput');
    if (passInput) {
        passInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") attemptUnlock();
        });
    }
});
