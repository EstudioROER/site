/**
 * VIP Logic Shared - Estudio ROER
 */

const MASTER_CODES = ["ROER2026ADMIN", "ROER-ADMIN-2026", "ESTUDIOROER", "VIP2025", "VIP2026"];
const SEED = [3, 7, 1, 5, 9, 2, 8, 4];
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

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
    if (MASTER_CODES.includes(code)) return true;

    // Normalize: Remove 'ROER' prefix and dashes
    let clean = code;
    if (clean.startsWith('ROER-')) clean = clean.slice(5);
    else if (clean.startsWith('ROER')) clean = clean.slice(4);
    clean = clean.replace(/-/g, '');

    if (clean.length !== 8) return false;

    const today = getDayID();
    const myID = getClientID();

    // Check configuration permutations
    if (verifyChecksum(clean, today, myID)) return true;
    if (verifyChecksum(clean, today - 1, myID)) return true;
    if (verifyChecksum(clean, today, "")) return true;
    if (verifyChecksum(clean, today - 1, "")) return true;

    return false;
}

// UI HANDLERS
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

function attemptUnlock() {
    const input = document.getElementById('passInput');
    const error = document.getElementById('error');
    if (!input) return;

    if (validateVIPCode(input.value)) {
        grantVIPAccess();
        const gate = document.getElementById('gate');
        if (gate) {
            gate.style.opacity = '0';
            setTimeout(() => { gate.style.display = 'none'; }, 500);
        }
    } else {
        if (error) {
            error.style.display = 'block';
            input.style.borderColor = '#FF6B6B';
            setTimeout(() => { error.style.display = 'none'; input.style.borderColor = 'var(--primary)'; }, 2000);
        }
    }
}

// BOOTSTRAP
window.addEventListener('DOMContentLoaded', () => {
    checkVIPAccess();
    const passInput = document.getElementById('passInput');
    if (passInput) {
        passInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") attemptUnlock();
        });
    }
});
