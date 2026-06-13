/* Part of the Ruggy Rewards app. Files load in numeric order via
   <script defer> tags in index.html; execution order matters for
   the decorator chain and error-boundary application. */

/* =====================================================================
   SECTION 1 — CORE
   Admin auth & login modal · wallet providers, connection & state ·
   modals (wallet/image/developer) · toast & confirm UI · error
   boundaries · delegated UI actions · mobile menu
   ===================================================================== */
window.ruggyWallet = {
    publicKey: null,
    connected: false,
    provider: null
};

// ==================== ADMIN LOGIN SYSTEM ====================
/* ---------------------------------------------------------------------
   CENTRAL CONFIGURATION
   Everything tunable lives here or in the runtime CONFIG object below
   (Section 4), which the dev panel edits and persists to localStorage.
   --------------------------------------------------------------------- */
const RUGGY_SETTINGS = {
    admin: {
        username: "admin",
        password: "ruggy2026"   // ← change this; note it is client-visible
    },
    lottery: {
        ticketPriceUsd: 3
    },
    toast: {
        dismissMs: 3800,
        dismissDetailMs: 5500,
        errorThrottleMs: 4000
    },
    wallet: {
        libLoadTimeoutMs: 15000        // give up waiting for CDN wallet libs
    },
    chart: {
        libRetryMs: 250,               // poll interval while Chart.js loads
        layoutRetryMs: 150,            // poll interval while canvas lays out
        maxRetries: 20,
        errorRetryMs: 700,
        maxErrorRetries: 5,
        observerDelayMs: 400           // settle time after section activates
    }
};

const ADMIN_USERNAME = RUGGY_SETTINGS.admin.username;
const ADMIN_PASSWORD = RUGGY_SETTINGS.admin.password;

function isAdminLoggedIn() {
    return localStorage.getItem('ruggyAdminLoggedIn') === 'true';
}

function setAdminLoggedIn(status) {
    if (status) {
        localStorage.setItem('ruggyAdminLoggedIn', 'true');
    } else {
        localStorage.removeItem('ruggyAdminLoggedIn');
    }
    // The Wall's Remove buttons depend on admin state — refresh it
    if (typeof renderBannedTable === 'function') renderBannedTable();
}

// Main function called when clicking the Admin button
function openAdminWithLogin() {
    if (isAdminLoggedIn()) {
        showFullAdminPanel();
    } else {
        showAdminLoginModal();
    }
}
window.openAdminWithLogin = openAdminWithLogin;

// Attach event listeners for critical buttons (more reliable than inline onclick)
function attachCriticalEventListeners() {
    // Admin button
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) {
        adminBtn.addEventListener('click', function() {
            if (typeof openAdminWithLogin === 'function') {
                openAdminWithLogin();
            } else {
                console.error('openAdminWithLogin is not defined yet');
            }
        });
    }

    // Hamburger menu button
    const hamburgerBtn = document.getElementById('mobile-menu-btn');
    if (hamburgerBtn && !hamburgerBtn.dataset.bound) {
        hamburgerBtn.dataset.bound = '1'; // guard against double-attachment
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            // Explicit open/close based on current state (no blind toggle that
            // a stray event could flip the wrong way).
            const menu = document.getElementById('mobile-menu');
            const isOpen = menu && menu.style.display === 'flex';
            if (isOpen) { if (typeof closeMobileMenu === 'function') closeMobileMenu(); }
            else { if (typeof openMobileMenu === 'function') openMobileMenu(); }
        });
    }

    // Mobile menu close button (inside the popup)
    const closeBtn = document.getElementById('mobile-menu-close-btn');
    if (closeBtn && !closeBtn.dataset.bound) {
        closeBtn.dataset.bound = '1';
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (typeof closeMobileMenu === 'function') closeMobileMenu();
        });
    }
}

// Run after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachCriticalEventListeners);
} else {
    attachCriticalEventListeners();
}

// Show Login Modal
function showAdminLoginModal() {
    // Remove existing modal if any
    const existing = document.getElementById('admin-login-modal');
    if (existing) existing.remove();

    const modalHTML = `
        <div id="admin-login-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
             background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 99999;">
            <div style="background: #111827; border: 2px solid #f59e0b; border-radius: 16px; 
                        padding: 32px 40px; width: 100%; max-width: 380px; box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);">
                
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="font-size: 28px; margin-bottom: 8px;">🔐</div>
                    <h2 style="color: #f59e0b; margin: 0; font-size: 24px;">Admin Access</h2>
                    <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 14px;">Enter your credentials to continue</p>
                </div>

                <div style="margin-bottom: 16px;">
                    <label style="color: #d1d5db; font-size: 13px; display: block; margin-bottom: 6px;">Username</label>
                    <input id="admin-username" type="text" value="admin" 
                           style="width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid #374151; 
                                  background: #1f2937; color: white; font-size: 15px;">
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="color: #d1d5db; font-size: 13px; display: block; margin-bottom: 6px;">Password</label>
                    <input id="admin-password" type="password" placeholder="Enter password"
                           style="width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid #374151; 
                                  background: #1f2937; color: white; font-size: 15px;">
                </div>

                <div id="admin-login-error" style="color: #ef4444; font-size: 13px; margin-bottom: 16px; min-height: 18px; text-align: center;"></div>

                <div style="display: flex; gap: 12px;">
                    <button id="close-admin-login-btn" 
                            style="flex: 1; padding: 12px; border-radius: 10px; border: 1px solid #374151; 
                                   background: transparent; color: #9ca3af; font-weight: 600; cursor: pointer;">
                        Cancel
                    </button>
                    <button id="attempt-admin-login-btn" 
                            style="flex: 2; padding: 12px; border-radius: 10px; border: none; 
                                   background: linear-gradient(to right, #f59e0b, #d97706); color: white; 
                                   font-weight: 700; cursor: pointer;">
                        Login
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // The modal is injected dynamically, so its buttons must be wired
    // up here, right after insertion — they have no inline onclick.
    const loginBtn = document.getElementById('attempt-admin-login-btn');
    if (loginBtn) loginBtn.addEventListener('click', attemptAdminLogin);

    const cancelBtn = document.getElementById('close-admin-login-btn');
    if (cancelBtn) cancelBtn.addEventListener('click', closeAdminLoginModal);

    // Pressing Enter in either field submits the login
    ['admin-username', 'admin-password'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') attemptAdminLogin();
            });
        }
    });

    // Focus password field
    setTimeout(() => {
        const passInput = document.getElementById('admin-password');
        if (passInput) passInput.focus();
    }, 100);
}

function closeAdminLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) modal.remove();
}

function attemptAdminLogin() {
    const usernameEl = document.getElementById('admin-username');
    const passwordEl = document.getElementById('admin-password');
    const errorDiv = document.getElementById('admin-login-error');
    if (!usernameEl || !passwordEl) return;

    const username = usernameEl.value.trim();
    const password = passwordEl.value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        setAdminLoggedIn(true);
        closeAdminLoginModal();
        showFullAdminPanel();
    } else {
        errorDiv.textContent = "Invalid username or password";
        setTimeout(() => {
            if (errorDiv) errorDiv.textContent = "";
        }, 2500);
    }
}

// Logout function (can be called from inside Admin panel)
function adminLogout() {
    setAdminLoggedIn(false);
    closeDeveloperModal();
    showToast("You have been logged out.", "info");
}
window.adminLogout = adminLogout;

// ==================== POOL STAKING - SELECT LOCK PERIOD ====================
function selectLockPeriod(element, days, multiplier) {
    // Remove selected class from all options
    document.querySelectorAll('#lock-period-options .lock-option').forEach(el => {
        el.classList.remove('selected');
        // Reset default styles
        el.style.border = '2px solid #166534';
        el.style.boxShadow = 'none';
        el.style.transform = 'scale(1)';
    });

    // Add selected styling to clicked element
    element.classList.add('selected');
    element.style.transform = 'scale(1.03)';

    // Special gold glow for Permanent staking
    if (days === 9999) {
        element.style.border = '2px solid #f59e0b';
        element.style.boxShadow = '0 0 16px #f59e0b, 0 0 24px #fbbf24';
    } else {
        element.style.border = '2px solid #22c55e';
        element.style.boxShadow = '0 0 12px #22c55e';
    }

    // Update hidden inputs
    const daysInput = document.getElementById('stake-days');
    const multiplierInput = document.getElementById('stake-multiplier');
    if (daysInput) daysInput.value = days;
    if (multiplierInput) multiplierInput.value = multiplier;

    // Update info text
    const lockInfo = document.getElementById('lock-info');
    if (lockInfo) {
        let penaltyText = days === 9999 
            ? 'No early unstake penalty (Permanent)' 
            : 'Early unstake penalty: <strong style="color:#ef4444;">10%</strong>';

        let label = days === 9999 ? 'Permanent' : 
                    days === 1 ? '1 Day' : 
                    days === 3 ? '3 Day' : 
                    days === 7 ? '1 Week' : 
                    days === 30 ? '1 Month' : 
                    days === 180 ? '6 Months' : '1 Year';

        lockInfo.innerHTML = `
            Lock for <strong>${label}</strong> → 
            <strong style="color:#22c55e;">${multiplier}x fee multiplier</strong>. 
            ${penaltyText}
        `;
    }
}
window.selectLockPeriod = selectLockPeriod;

// ==================== LIVE SOL PRICE FOR LOTTO ====================
let solPriceUpdateInterval = null;

async function updateLottoSolPrice() {
    const priceEl = document.getElementById('lotto-sol-price');
    if (!priceEl) return;

    try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await res.json();
        const solUsd = data?.solana?.usd;

        if (solUsd && solUsd > 0) {
            const solFor3USD = (3 / solUsd).toFixed(4);
            priceEl.innerHTML = `~${solFor3USD} SOL <span style="font-size:11px; color:#6b7280;">(live)</span>`;
        }
    } catch (e) {
        // Fail silently if API is down
        priceEl.innerHTML = `~0.015 SOL <span style="font-size:11px; color:#6b7280;">(approx)</span>`;
    }
}

function startLottoSolPriceUpdates() {
    // Update immediately
    updateLottoSolPrice();

    // Clear any previous interval
    if (solPriceUpdateInterval) clearInterval(solPriceUpdateInterval);

    // Update every 90 seconds
    solPriceUpdateInterval = setInterval(updateLottoSolPrice, 90000);
}

// ==================== RUGGY'S LOTTO ====================
// Lottery system as a proper object: owns its storage keys, ticket math,
// and user flows. The global functions below are thin compatibility
// aliases for the delegated data-action system.
const Lottery = {
    FREE_CLAIM_KEY: 'lastFreeLottoTicket',

    // Per-wallet ticket ledger lives under ruggyTickets:<wallet>, so changing
    // settings never wipes a holder's previously-earned tickets. A connected,
    // verified wallet keeps its daily + weekly + free balances permanently.
    _wallet() {
        return (window.ruggyWallet && window.ruggyWallet.connected && window.ruggyWallet.publicKey)
            ? window.ruggyWallet.publicKey.toString() : null;
    },
    _key(w) { return 'ruggyTickets:' + (w || 'guest'); },

    ledger(w) {
        w = w || this._wallet();
        try {
            const raw = localStorage.getItem(this._key(w));
            if (raw) return Object.assign({ daily: 0, weekly: 0, free: 0 }, JSON.parse(raw));
        } catch (_) {}
        return { daily: 0, weekly: 0, free: 0 };
    },
    saveLedger(l, w) {
        w = w || this._wallet();
        localStorage.setItem(this._key(w), JSON.stringify(l));
    },

    priceFor(kind) {
        const m = (typeof CONFIG !== 'undefined' && CONFIG.metrics) || {};
        if (kind === 'weekly') return Number(m.weeklyTicketPrice) || (RUGGY_SETTINGS.lottery.ticketPriceUsd * 2);
        return Number(m.dailyTicketPrice) || RUGGY_SETTINGS.lottery.ticketPriceUsd;
    },

    // Total tickets across types (legacy callers + the cost preview)
    get ticketPrice() { return this.priceFor('daily'); },

    async buy(kind) {
        kind = (kind === 'weekly') ? 'weekly' : 'daily';
        const amountInput = document.getElementById('lotto-ticket-amount');
        const amount = parseInt(amountInput?.value, 10) || 1;
        const price = this.priceFor(kind);
        const totalCost = amount * price;

        const label = kind === 'weekly' ? 'Weekly' : 'Daily';
        if (await showConfirm(
            `Buy <strong>${amount} ${label} ticket${amount === 1 ? '' : 's'}</strong> for <strong>$${totalCost.toLocaleString()}</strong>?`,
            { okText: `Buy ${label} Tickets` })) {
            const l = this.ledger();
            l[kind] += amount;
            this.saveLedger(l);
            renderTicketTables();
            showToast(`Purchased ${amount} ${label} ticket${amount === 1 ? '' : 's'}!`, "success",
                this._wallet() ? "Saved to your connected wallet." : "Connect a wallet to keep these permanently.");
        }
    },

    claimFreeTicket() {
        const hours = (typeof CONFIG !== 'undefined' && CONFIG.metrics?.freeTicketCooldownHours) || 24;
        const last = parseInt(localStorage.getItem(this.FREE_CLAIM_KEY), 10) || 0;
        const remaining = last + hours * 3600 * 1000 - Date.now();
        if (remaining > 0) {
            const h = Math.ceil(remaining / 3600000);
            showToast("Free ticket on cooldown", "success", `Next free ticket in about ${h} hour${h === 1 ? '' : 's'}.`);
            return;
        }
        localStorage.setItem(this.FREE_CLAIM_KEY, String(Date.now()));
        const l = this.ledger();
        l.free += 1;
        l.daily += 1; // a free ticket enters the daily draw
        this.saveLedger(l);
        renderTicketTables();
        showToast("🎁 Free Ticket Claimed!", "success", "+1 Free ticket added (enters the Daily draw). Good luck!");
    }
};

// Render the daily/weekly ticket tables + prior free-ticket count for the
// connected wallet. Recomputes the free-ticket *value* from current admin
// settings while preserving the COUNT a wallet already earned.
function renderTicketTables() {
    const l = Lottery.ledger();
    const w = Lottery._wallet();

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('tickets-daily-count', l.daily);
    set('tickets-weekly-count', l.weekly);
    set('tickets-free-count', l.free);
    set('free-tickets-available', l.free);

    const dailyPrice = Lottery.priceFor('daily');
    const weeklyPrice = Lottery.priceFor('weekly');
    set('tickets-daily-value', '$' + (l.daily * dailyPrice).toLocaleString());
    set('tickets-weekly-value', '$' + (l.weekly * weeklyPrice).toLocaleString());

    const status = document.getElementById('tickets-wallet-status');
    if (status) {
        status.textContent = w
            ? ('Connected: ' + w.slice(0, 4) + '…' + w.slice(-4) + ' — tickets saved to this wallet')
            : 'Connect your wallet to save and verify your tickets';
    }
}
window.renderTicketTables = renderTicketTables;

// Enter previously-earned free tickets into the DAILY draw (max 5 per action).
async function enterFreeTickets() {
    if (!Lottery._wallet()) {
        showToast("Connect your wallet first", "error", "Free tickets are tied to your wallet.");
        if (typeof showWalletModal === 'function') showWalletModal();
        return;
    }
    const input = document.getElementById('free-ticket-enter-amount');
    let n = parseInt(input?.value, 10) || 1;
    n = Math.max(1, Math.min(5, n)); // hard cap of 5
    const l = Lottery.ledger();
    if (l.free < n) {
        showToast("Not enough free tickets", "error",
            `You have ${l.free} free ticket${l.free === 1 ? '' : 's'} available.`);
        return;
    }
    if (!(await showConfirm(
        `Enter <strong>${n} free ticket${n === 1 ? '' : 's'}</strong> into the <strong>Daily draw</strong>?`,
        { okText: 'Enter Daily Draw' }))) {
        return;
    }
    l.free -= n;
    l.daily += n;   // free tickets only ever feed the daily draw
    Lottery.saveLedger(l);
    renderTicketTables();
    showToast(`Entered ${n} free ticket${n === 1 ? '' : 's'} into the Daily draw!`, "success", "Good luck!");
}
window.enterFreeTickets = enterFreeTickets;

// Compatibility aliases (data-action whitelist + legacy call sites)
async function buyLottoTickets() { return Lottery.buy('daily'); }
async function buyDailyTicket() { return Lottery.buy('daily'); }
async function buyWeeklyTicket() { return Lottery.buy('weekly'); }
function claimDailyFreeTicket() { return Lottery.claimFreeTicket(); }

// Update total cost when changing ticket amount
setTimeout(() => {
    const amountInput = document.getElementById('lotto-ticket-amount');
    if (amountInput) {
        amountInput.addEventListener('input', () => {
            const totalEl = document.getElementById('lotto-total-cost');
            if (totalEl) {
                const val = parseInt(amountInput.value) || 0;
                totalEl.textContent = '$' + (val * Lottery.ticketPrice).toFixed(2);
            }
        });
    }
}, 1500);

// Auto-select 1 Year on page load for Pool page
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
const oneYearOption = document.querySelector('#lock-period-options .lock-option[data-days="365"]');
if (oneYearOption) {
    selectLockPeriod(oneYearOption, 365, 3.0);
}
    }, 300);
});

// ==================== POOL STAKING (demo, consistent with lottery) ====================
// The Pool page's STAKE button called stakeRuggy(), which was never
// defined — a ReferenceError on every click. This implements it in the
// same localStorage-demo style as the lottery's buy/claim functions.
// Per-wallet stakes: stored under ruggyStakes:<wallet>, so a connected
// wallet's stakes are its own and clear from view when it disconnects.
// Absolution stakes also land here so the Pool page reflects them.
function stakeWalletKey() {
    const w = (window.ruggyWallet && window.ruggyWallet.connected && window.ruggyWallet.publicKey)
        ? window.ruggyWallet.publicKey.toString() : null;
    return 'ruggyStakes:' + (w || 'guest');
}
function getStakes() {
    try { return JSON.parse(localStorage.getItem(stakeWalletKey()) || '[]'); } catch (_) { return []; }
}
function saveStakes(stakes) {
    localStorage.setItem(stakeWalletKey(), JSON.stringify(stakes));
}

async function stakeRuggy() {
    const amountInput = document.getElementById('stake-amount');
    const amount = amountInput ? parseFloat(amountInput.value) : 0;

    if (!amount || amount <= 0) {
        showToast("Enter an amount of $RUGGY to stake.", "error");
        if (amountInput) amountInput.focus();
        return;
    }

    if (!window.ruggyWallet || !window.ruggyWallet.connected) {
        showToast("Connect your wallet first to stake.", "error");
        showWalletModal();
        return;
    }

    const days = parseInt(document.getElementById('stake-days')?.value) || 365;
    const multiplier = parseFloat(document.getElementById('stake-multiplier')?.value) || 3.0;
    const label = days >= 9999 ? 'Permanent' : (days >= 365 ? '1 Year' : days + ' Days');

    // Confirmation for ALL stakes (permanent gets the stronger danger variant)
    const confirmed = days >= 9999
        ? await showConfirm("Permanent staking locks your $RUGGY <strong>forever</strong> with no early unstake. Continue?", { okText: 'Lock Forever', danger: true })
        : await showConfirm(`Stake <strong>${amount.toLocaleString()} $RUGGY</strong> for <strong>${label}</strong> at <strong>${multiplier}x</strong>?`, { okText: 'Confirm Stake' });
    if (!confirmed) return;

    const stakes = getStakes();
    stakes.push({ amount, days, multiplier, label, date: new Date().toISOString() });
    saveStakes(stakes);

    if (amountInput) amountInput.value = '';
    renderActiveStakes();
    showToast(`Staked ${amount.toLocaleString()} $RUGGY for ${label} (${multiplier}x)`, "success");
}

// Total $RUGGY currently staked by the connected wallet (sum of stake list).
function getStakedTotal() {
    return getStakes().reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
}

// Single source of truth for staking-based reward eligibility. Reads the
// connected wallet's staked total against the admin thresholds and the Wall.
function getStakeEligibility() {
    const connected = !!(window.ruggyWallet && window.ruggyWallet.connected && window.ruggyWallet.publicKey);
    const wallet = connected ? window.ruggyWallet.publicKey.toString() : null;
    const staked = connected ? getStakedTotal() : 0;
    const communityReq = (CONFIG.airdropThreshold) || 500000;
    const antiRugReq = (CONFIG.antiRugThreshold) || 1000000;

    let banned = null;
    if (wallet && typeof bannedWallets !== 'undefined') {
        banned = bannedWallets.find(b => b.wallet.toLowerCase() === wallet.toLowerCase()) || null;
    }

    const community = staked >= communityReq;
    const antiRug = staked >= antiRugReq;
    const tier = banned ? 'banned' : (antiRug ? 'antiRug' : (community ? 'community' : 'none'));
    return {
        connected, wallet, staked, communityReq, antiRugReq,
        community, antiRug, banned, tier,
        // how much more they must stake to reach the next tier
        toCommunity: Math.max(0, communityReq - staked),
        toAntiRug: Math.max(0, antiRugReq - staked)
    };
}
window.getStakeEligibility = getStakeEligibility;
window.getStakedTotal = getStakedTotal;

// Lightweight banner shown on the Rewards/Pool pages when the connected
// wallet isn't staking enough (or is banned). Re-renders on connect,
// stake, absolve, and disconnect via refreshWalletUI/renderActiveStakes.
function renderStakeNotice() {
    const els = [
        document.getElementById('stake-eligibility-notice'),
        document.getElementById('stake-eligibility-notice-pool')
    ].filter(Boolean);
    if (!els.length) return;
    const e = getStakeEligibility();

    const set = (html, border, bg) => els.forEach(el => {
        el.style.display = e.connected ? 'block' : 'none';
        if (!e.connected) return;
        el.innerHTML = html; el.style.borderLeft = '5px solid ' + border; el.style.background = bg;
    });
    if (!e.connected) { els.forEach(el => el.style.display = 'none'); return; }

    const fmt = (n) => Number(n).toLocaleString();
    if (e.banned) {
        const locked = e.banned.type === 'Locked';
        set(`<strong style="color:${locked ? '#ef4444' : '#fbbf24'};">${locked ? '🚫 Locked Ban' : '⚠️ Temporary Ban'}</strong> —
            banned wallets <strong>do not receive rewards</strong> and <strong>cannot participate in the Lottery</strong>.
            ${locked ? 'Visit the <strong>Absolution</strong> page to clear it.' : 'Reduce your holdings and meet the stake requirement to requalify.'}`,
            locked ? '#ef4444' : '#fbbf24', locked ? '#3f1f1f' : '#3f2a1f');
        return;
    }
    if (e.tier === 'antiRug') {
        set(`<strong style="color:#22c55e;">✅ Fully staked & eligible</strong> — you're staking <strong>${fmt(e.staked)}</strong> $RUGGY and qualify for <strong>Community + Anti-Rug</strong> rewards.`,
            '#22c55e', '#052e16');
    } else if (e.tier === 'community') {
        set(`<strong style="color:#fbbf24;">✅ Community eligible</strong> — staking <strong>${fmt(e.staked)}</strong> $RUGGY.
            Stake <strong>${fmt(e.toAntiRug)}</strong> more to unlock <strong>Anti-Rug</strong> rewards too.`,
            '#eab308', '#3f2a1f');
    } else {
        set(`<strong style="color:#f87171;">❌ Not staking enough for rewards</strong> — you're staking <strong>${fmt(e.staked)}</strong> $RUGGY.
            <strong>Not having enough staked disqualifies you from receiving rewards</strong> until you reach the required stake.
            Stake <strong>${fmt(e.toCommunity)}</strong> more to start earning Community rewards.`,
            '#ef4444', '#3f1f1f');
    }
}
window.renderStakeNotice = renderStakeNotice;

function renderActiveStakes() {
    const box = DOM.get('active-stakes');
    renderStakeNotice();
    if (typeof renderStakeDonut === 'function') renderStakeDonut();
    if (!box) return;

    // Stakes are wallet-scoped: show nothing (and a hint) when disconnected.
    const connected = !!(window.ruggyWallet && window.ruggyWallet.connected);
    if (!connected) {
        box.innerHTML = '<span style="color:#6b7280;">Connect your wallet to view your stakes.</span>';
        return;
    }

    const stakes = getStakes();
    if (!stakes.length) {
        box.innerHTML = '<span style="color:#6b7280;">No active stakes yet.</span>';
        return;
    }

    box.innerHTML = stakes.map(s => {
        const tag = s.absolution ? ' <span style="color:#f59e0b;">(Absolution)</span>' : '';
        return `
        <div style="display:flex; justify-content:space-between; padding:8px 10px; background:#0a2a14; border-radius:6px; margin-bottom:6px;">
            <span>${Number(s.amount).toLocaleString()} $RUGGY${tag}</span>
            <span style="color:#86efac;">${s.label} \u2022 ${s.multiplier}x</span>
        </div>`;
    }).join('');
}
window.addEventListener('load', renderActiveStakes);

// SVG donut of the connected wallet's stakes grouped by lock duration.
// Each duration bucket is a distinct neon color; Permanent is gold (glowing)
// and 1 Year is green (glowing) per spec. Pure SVG — no chart library.
const STAKE_DURATION_BUCKETS = [
    { key: 1,    label: '1 Day',     color: '#22d3ee', glow: false }, // cyan
    { key: 3,    label: '3 Day',     color: '#38bdf8', glow: false }, // sky
    { key: 7,    label: '1 Week',    color: '#a855f7', glow: false }, // purple
    { key: 30,   label: '1 Month',   color: '#ec4899', glow: false }, // pink
    { key: 180,  label: '6 Months',  color: '#f97316', glow: false }, // orange
    { key: 365,  label: '1 Year',    color: '#22c55e', glow: true  }, // GREEN glow
    { key: 9999, label: 'Permanent', color: '#fbbf24', glow: true  }  // GOLD glow
];

// Total $RUGGY supply (1B). Circulating = supply minus everything staked.
const RUGGY_TOTAL_SUPPLY = 1000000000;
const CIRCULATING_BUCKET = { label: 'Circulating (Unstaked)', color: '#6b7280', glow: false };

// Aggregate stakes across the WHOLE pool (every wallet that has staked in this
// browser) plus a representative demo baseline so the wheel reflects pool-wide
// activity, not just the connected wallet. Returns { [days]: totalAmount }.
function getPoolStakeTotals() {
    const totalsByDays = {};
    const add = (days, amt) => {
        const d = Number(days) || 0;
        const a = Number(amt) || 0;
        if (a > 0) totalsByDays[d] = (totalsByDays[d] || 0) + a;
    };
    // 1) Every ruggyStakes:<wallet> entry in localStorage
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k || k.indexOf('ruggyStakes:') !== 0) continue;
            let list = [];
            try { list = JSON.parse(localStorage.getItem(k) || '[]'); } catch (_) {}
            for (const s of list) add(s.days, s.amount);
        }
    } catch (_) {}
    // 2) Representative demo pool baseline (until on-chain pool data is wired),
    //    so the wheel always shows a populated pool. These are POOL-WIDE figures.
    const demo = (typeof CONFIG !== 'undefined' && CONFIG.demoPoolStakes) || {
        1: 4200000, 7: 9800000, 30: 18500000, 180: 26000000, 365: 41000000, 9999: 63000000
    };
    for (const d in demo) add(d, demo[d]);
    return totalsByDays;
}

function renderStakeDonut() {
    const wrap = document.getElementById('stake-donut-wrap');
    const empty = document.getElementById('stake-donut-empty');
    const svgBox = document.getElementById('stake-donut-svg');
    const legend = document.getElementById('stake-donut-legend');
    if (!wrap || !empty || !svgBox || !legend) return;

    // POOL-WIDE: aggregate every wallet's stakes by duration (not just the
    // connected wallet), then map each duration to its display bucket.
    const poolByDays = getPoolStakeTotals();
    const totals = {};
    let totalStaked = 0;
    for (const dStr in poolByDays) {
        const amt = poolByDays[dStr];
        if (amt <= 0) continue;
        const d = Number(dStr);
        const bucket = STAKE_DURATION_BUCKETS.find(b => b.key === d)
            || (d >= 9999 ? STAKE_DURATION_BUCKETS[6]
            : d >= 365 ? STAKE_DURATION_BUCKETS[5]
            : d >= 180 ? STAKE_DURATION_BUCKETS[4]
            : d >= 30 ? STAKE_DURATION_BUCKETS[3]
            : d >= 7 ? STAKE_DURATION_BUCKETS[2]
            : d >= 3 ? STAKE_DURATION_BUCKETS[1]
            : STAKE_DURATION_BUCKETS[0]);
        totals[bucket.key] = (totals[bucket.key] || 0) + amt;
        totalStaked += amt;
    }
    // Circulating (unstaked) tokens = total supply minus everything staked.
    const circulating = Math.max(0, RUGGY_TOTAL_SUPPLY - totalStaked);
    const grand = totalStaked + circulating; // = total supply

    if (grand <= 0) {
        wrap.style.display = 'none';
        empty.style.display = 'block';
        empty.textContent = 'Pool data unavailable.';
        return;
    }
    empty.style.display = 'none';
    wrap.style.display = 'flex';

    // Assemble an ordered list of slices (duration buckets that have value,
    // then the circulating slice). Each becomes an interactive SVG wedge.
    const slices = [];
    for (const b of STAKE_DURATION_BUCKETS) {
        if (totals[b.key]) slices.push({ label: b.label, color: b.color, glow: b.glow, key: 'b' + b.key, value: totals[b.key] });
    }
    if (circulating > 0) slices.push({ label: CIRCULATING_BUCKET.label, color: CIRCULATING_BUCKET.color, glow: false, key: 'circ', value: circulating });

    // Geometry — donut as real pie WEDGES (paths from center) so a slice can
    // pop OUT on click, like the tokenomics pie.
    const size = 240, cx = size / 2, cy = size / 2, rOuter = 96, rInner = 52;
    const TAU = Math.PI * 2;
    const polar = (cxx, cyy, rr, ang) => [cxx + rr * Math.cos(ang), cyy + rr * Math.sin(ang)];
    // Build a donut-wedge path between two angles (start at -90deg / top).
    const wedgePath = (a0, a1, push) => {
        const ox = push ? Math.cos((a0 + a1) / 2) * 12 : 0;
        const oy = push ? Math.sin((a0 + a1) / 2) * 12 : 0;
        const [x0o, y0o] = polar(cx + ox, cy + oy, rOuter, a0);
        const [x1o, y1o] = polar(cx + ox, cy + oy, rOuter, a1);
        const [x0i, y0i] = polar(cx + ox, cy + oy, rInner, a1);
        const [x1i, y1i] = polar(cx + ox, cy + oy, rInner, a0);
        const large = (a1 - a0) > Math.PI ? 1 : 0;
        return `M ${x0o} ${y0o} A ${rOuter} ${rOuter} 0 ${large} 1 ${x1o} ${y1o} ` +
               `L ${x0i} ${y0i} A ${rInner} ${rInner} 0 ${large} 0 ${x1i} ${y1i} Z`;
    };

    const defs = `
        <defs>
            <filter id="donut-glow-gold" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="donut-glow-green" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>`;

    let ang = -Math.PI / 2; // start at top
    const wedges = [];
    const legendRows = [];
    slices.forEach((s, i) => {
        const frac = s.value / grand;
        const a0 = ang, a1 = ang + frac * TAU;
        ang = a1;
        const filter = s.glow
            ? (s.label.indexOf('Permanent') === 0 ? ' filter="url(#donut-glow-gold)"' : ' filter="url(#donut-glow-green)"')
            : '';
        wedges.push(
            `<path d="${wedgePath(a0, a1, false)}" fill="${s.color}"${filter} ` +
            `data-slice="${s.key}" data-a0="${a0}" data-a1="${a1}" ` +
            `style="cursor:pointer; transition:transform .25s ease, opacity .2s ease; transform-origin:${cx}px ${cy}px;" ` +
            `tabindex="0" role="button" aria-label="${s.label}: ${Number(s.value).toLocaleString()}"></path>`
        );

        const pct = (frac * 100).toFixed(frac >= 0.1 ? 0 : 1);
        const dot = `<span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${s.color}` +
            (s.glow ? `;box-shadow:0 0 8px ${s.color},0 0 14px ${s.color}` : '') + `"></span>`;
        legendRows.push(
            `<div data-legend="${s.key}" style="display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer;padding:3px 4px;border-radius:6px;transition:background .15s;">
                <span style="display:flex;align-items:center;gap:8px;">${dot}
                    <strong style="color:${s.color}${s.glow ? ';text-shadow:0 0 8px ' + s.color : ''}">${s.label}</strong>
                </span>
                <span style="color:#d1d5db;">${Number(s.value).toLocaleString()} <span class="muted-sm">(${pct}%)</span></span>
            </div>`
        );
    });

    svgBox.innerHTML =
        `<svg id="stake-donut-svgel" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Pool distribution by lock time">
            ${defs}
            ${wedges.join('')}
            <text x="${cx}" y="${cy - 9}" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="11" font-weight="600">Staked / Supply</text>
            <text x="${cx}" y="${cy + 9}" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="20" font-weight="bold">${((totalStaked / grand) * 100).toFixed(1)}%</text>
            <text x="${cx}" y="${cy + 28}" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="10">${Number(totalStaked).toLocaleString()} staked</text>
        </svg>`;
    legend.innerHTML = legendRows.join('');

    // ---- Interactivity: click a wedge OR its legend row to pop the slice out;
    //      click anywhere off the donut/legend to reset. Listeners live on the
    //      shared parent (#stake-donut-wrap) so legend clicks are caught too. ----
    const resetAll = () => {
        svgBox.querySelectorAll('path[data-slice]').forEach(p => {
            p.style.transform = ''; p.dataset.exploded = '0'; p.style.opacity = '1'; p.style.filter = '';
        });
        if (legend) legend.querySelectorAll('[data-legend]').forEach(r => { r.style.background = ''; });
    };
    const highlightLegend = (key) => {
        if (!legend) return;
        legend.querySelectorAll('[data-legend]').forEach(r => {
            r.style.background = (key && r.dataset.legend === key) ? 'rgba(255,255,255,0.08)' : '';
        });
    };
    const toggleSlice = (key) => {
        const path = svgBox.querySelector(`path[data-slice="${key}"]`);
        if (!path) return;
        const a0 = parseFloat(path.dataset.a0), a1 = parseFloat(path.dataset.a1);
        const mid = (a0 + a1) / 2;
        const isOut = path.dataset.exploded === '1';
        resetAll();
        if (!isOut) {
            const dx = Math.cos(mid) * 16, dy = Math.sin(mid) * 16;
            path.style.transform = `translate(${dx}px, ${dy}px)`;
            path.dataset.exploded = '1';
            svgBox.querySelectorAll('path[data-slice]').forEach(p => {
                if (p !== path) p.style.opacity = '0.5';
            });
            highlightLegend(key); // emphasize the matching legend row
        }
    };

    if (wrap && !wrap.dataset.wired) {
        // Clicks on EITHER the wheel or the legend (both inside #stake-donut-wrap)
        wrap.addEventListener('click', (e) => {
            const path = e.target.closest('path[data-slice]');
            const row = e.target.closest('[data-legend]');
            if (path) { e.stopPropagation(); toggleSlice(path.dataset.slice); }
            else if (row) { e.stopPropagation(); toggleSlice(row.dataset.legend); }
        });
        // hover lift on wedges + matching legend row
        wrap.addEventListener('mouseover', (e) => {
            const path = e.target.closest('path[data-slice]');
            if (path && path.dataset.exploded !== '1') path.style.filter = 'brightness(1.15)';
            const row = e.target.closest('[data-legend]');
            if (row) {
                const p = svgBox.querySelector(`path[data-slice="${row.dataset.legend}"]`);
                if (p && p.dataset.exploded !== '1') p.style.filter = 'brightness(1.15)';
            }
        });
        wrap.addEventListener('mouseout', (e) => {
            const path = e.target.closest('path[data-slice]');
            if (path && path.dataset.exploded !== '1') path.style.filter = '';
            const row = e.target.closest('[data-legend]');
            if (row) {
                const p = svgBox.querySelector(`path[data-slice="${row.dataset.legend}"]`);
                if (p && p.dataset.exploded !== '1') p.style.filter = '';
            }
        });
        // keyboard activation on focused wedges
        wrap.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const path = e.target.closest('path[data-slice]');
            if (path) { e.preventDefault(); toggleSlice(path.dataset.slice); }
            if (e.key === 'Escape') resetAll();
        });
        // Click anywhere OUTSIDE the donut + legend resets to normal state.
        // Attached once at document level; guarded so it isn't stacked.
        if (!window.__stakeDonutOutsideClick) {
            window.__stakeDonutOutsideClick = true;
            document.addEventListener('click', (e) => {
                const w = document.getElementById('stake-donut-wrap');
                if (!w) return;
                // If the click was not inside the donut wrap, reset all slices.
                if (!e.target.closest('#stake-donut-wrap')) {
                    w.querySelectorAll('path[data-slice]').forEach(p => {
                        p.style.transform = ''; p.dataset.exploded = '0'; p.style.opacity = '1'; p.style.filter = '';
                    });
                    const lg = document.getElementById('stake-donut-legend');
                    if (lg) lg.querySelectorAll('[data-legend]').forEach(r => { r.style.background = ''; });
                }
            });
            // Escape key anywhere also resets
            document.addEventListener('keydown', (e) => {
                if (e.key !== 'Escape') return;
                const w = document.getElementById('stake-donut-wrap');
                if (!w) return;
                w.querySelectorAll('path[data-slice]').forEach(p => {
                    p.style.transform = ''; p.dataset.exploded = '0'; p.style.opacity = '1'; p.style.filter = '';
                });
                const lg = document.getElementById('stake-donut-legend');
                if (lg) lg.querySelectorAll('[data-legend]').forEach(r => { r.style.background = ''; });
            });
        }
        wrap.dataset.wired = '1';
    }
}
window.renderStakeDonut = renderStakeDonut;
window.addEventListener('load', renderStakeDonut);


// ==================== REAL WALLET CONNECTION ====================
// Each wallet extension injects its own provider object into the page.
// detect() checks for that injection; get() returns the provider whose
// .connect() triggers the wallet's own approval popup (its "API login").
// ==================== MOBILE WALLET DEEP LINKS ====================
// On mobile browsers (Safari/Chrome) wallet extensions don't inject a
// provider — window.solana etc. simply don't exist. The standard fix is a
// "universal link" that opens the wallet app's built-in browser pointed back
// at this site, where the provider DOES exist and connection works normally.
function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent || '');
}

// Are we already INSIDE a wallet's in-app browser? (then normal connect works)
function isInWalletBrowser() {
    return !!(window.solana || window.phantom?.solana || window.solflare ||
              window.backpack || window.glowSolana || window.trustwallet?.solana ||
              window.coinbaseSolana || window.exodus?.solana);
}

// Build the deep link that reopens THIS page inside a given wallet's browser.
function buildWalletDeepLink(walletType) {
    const url = window.location.href;
    const host = window.location.host;
    const path = window.location.pathname + window.location.search;
    const enc = encodeURIComponent(url);
    switch (walletType) {
        case 'phantom':
            // Phantom universal link: ref is where it returns after browsing.
            return `https://phantom.app/ul/browse/${enc}?ref=${encodeURIComponent(window.location.origin)}`;
        case 'solflare':
            return `https://solflare.com/ul/v1/browse/${enc}?ref=${encodeURIComponent(window.location.origin)}`;
        case 'backpack':
            return `https://backpack.app/ul/v1/browse/${enc}`;
        case 'glow':
            return `https://glow.app/browse/${enc}`;
        case 'trust':
            // Trust uses a query-string deep link to its dApp browser
            return `https://link.trustwallet.com/open_url?coin_id=501&url=${enc}`;
        case 'coinbase':
            return `https://go.cb-w.com/dapp?cb_url=${enc}`;
        case 'exodus':
            return `exodus://browse/${enc}`;
        default:
            return null;
    }
}

// Wallets that support opening this site in their in-app browser via deep link
const DEEPLINK_SUPPORTED = ['phantom', 'solflare', 'backpack', 'glow', 'trust', 'coinbase', 'exodus'];

const WALLET_PROVIDERS = {
    phantom: {
        name: "Phantom",
        detect: () => !!(window.phantom?.solana?.isPhantom || window.solana?.isPhantom),
        get: () => window.phantom?.solana || window.solana
    },
    fomo: {
        name: "FOMO Wallet",
        detect: () => !!(window.fomo?.solana || window.fomo),
        get: () => window.fomo?.solana || window.fomo
    },
    solflare: {
        name: "Solflare",
        detect: () => !!window.solflare,
        get: () => window.solflare
    },
    backpack: {
        name: "Backpack",
        detect: () => !!(window.backpack?.solana || window.backpack),
        get: () => window.backpack?.solana || window.backpack
    },
    glow: {
        name: "Glow",
        detect: () => !!(window.glowSolana || window.glow?.solana || window.solana?.isGlow),
        get: () => window.glowSolana || window.glow?.solana || window.solana
    },
    slope: {
        name: "Slope",
        detect: () => typeof window.Slope === 'function',
        get: () => createSlopeAdapter()
    },
    sollet: {
        name: "Sollet",
        detect: () => !!window.sollet,
        get: () => window.sollet,
        hint: "Sollet has been deprecated by its developers \u2014 consider Phantom or Solflare instead."
    },
    trust: {
        name: "Trust Wallet",
        detect: () => !!(window.trustwallet?.solana || window.solana?.isTrust || window.solana?.isTrustWallet),
        get: () => window.trustwallet?.solana || window.solana
    },
    coinbase: {
        name: "Coinbase Wallet",
        detect: () => !!(window.coinbaseSolana || window.coinbaseWalletExtension?.solana),
        get: () => window.coinbaseSolana || window.coinbaseWalletExtension?.solana
    },
    exodus: {
        name: "Exodus",
        detect: () => !!(window.exodus?.solana || window.solana?.isExodus),
        get: () => window.exodus?.solana || window.solana
    },
    ledger: {
        name: "Ledger",
        detect: () => false,
        get: () => null,
        hint: "Ledger is a hardware wallet \u2014 connect it through Phantom, Solflare, or Backpack and pair your device there."
    }
};

// Slope's injected API differs from the standard provider interface,
// so wrap it in an adapter that exposes the same connect()/disconnect() shape.
function createSlopeAdapter() {
    const slope = new window.Slope();
    return {
        isSlope: true,
        publicKey: null,
        async connect() {
            const { msg, data } = await slope.connect();
            if (msg !== 'ok' || !data?.publicKey) {
                throw new Error(msg || 'Slope connection failed');
            }
            this.publicKey = new solanaWeb3.PublicKey(data.publicKey);
            return { publicKey: this.publicKey };
        },
        async disconnect() {
            try { await slope.disconnect(); } catch (_) {}
            this.publicKey = null;
        }
    };
}

// ==================== PUBLIC KEY NORMALIZATION ====================
// Wallets disagree on what connect() resolves with:
//   Phantom/Exodus/Trust:  { publicKey: PublicKey }
//   Solflare:              true, with the key on provider.publicKey
//   Some wallets:          a base58 string, or nothing until a tick later
// This resolves them all to one PublicKey-like object (or null).
function normalizePublicKey(pk) {
    if (!pk) return null;
    if (typeof pk === 'string') {
        try {
            return new solanaWeb3.PublicKey(pk);
        } catch (_) {
            return { toString: () => pk, toBase58: () => pk };
        }
    }
    return pk;
}

async function resolveWalletPublicKey(resp, provider) {
    let pk = (resp && typeof resp === 'object' && resp.publicKey)
        || (typeof resp === 'string' ? resp : null)
        || (provider && provider.publicKey)
        || null;

    // A few wallets resolve connect() slightly before exposing the key —
    // poll the provider briefly before giving up.
    for (let i = 0; !pk && i < 10; i++) {
        await new Promise(r => setTimeout(r, 100));
        pk = provider && provider.publicKey;
    }

    return normalizePublicKey(pk);
}

// ==================== CENTRALIZED WALLET STATE ====================
// Every connect/disconnect/switch flows through these two functions so the
// global state, localStorage, and every piece of UI always agree.
function setWalletState(provider, publicKey, walletKey, name) {
    window.ruggyWallet = {
        publicKey: publicKey,
        connected: true,
        provider: provider,
        name: name,
        currentWallet: name,
        walletKey: walletKey || null
    };
    if (walletKey) localStorage.setItem('ruggyLastConnectedWallet', walletKey);
    refreshWalletUI();
}

function clearWalletState() {
    localStorage.removeItem('ruggyLastConnectedWallet');
    window.ruggyWallet = {
        publicKey: null,
        connected: false,
        provider: null,
        name: null,
        currentWallet: null,
        walletKey: null
    };
    refreshWalletUI();
}

function refreshWalletUI() {
    if (typeof updateConnectWalletButton === 'function') updateConnectWalletButton();
    if (typeof updateHomeWalletDisplays === 'function') updateHomeWalletDisplays();
    // Re-render wallet-scoped views so a wallet's tickets AND stakes appear
    // the moment it connects/verifies — and clear from view on disconnect.
    if (typeof renderTicketTables === 'function') renderTicketTables();
    if (typeof renderActiveStakes === 'function') renderActiveStakes();
    if (typeof maybeNudgeStake === 'function') maybeNudgeStake();
}

// One-time-per-connection nudge: if the connected wallet isn't staking
// enough (or is banned), actively tell them via a toast. Tracked per wallet
// so we don't nag on every UI refresh.
let __lastNudgedWallet = null;
function maybeNudgeStake() {
    if (typeof getStakeEligibility !== 'function' || typeof showToast !== 'function') return;
    const e = getStakeEligibility();
    if (!e.connected) { __lastNudgedWallet = null; return; }
    if (__lastNudgedWallet === e.wallet) return; // already nudged this wallet
    __lastNudgedWallet = e.wallet;

    const fmt = (n) => Number(n).toLocaleString();
    if (e.banned) {
        showToast(e.banned.type === 'Locked' ? "Your wallet is on Locked Ban" : "Your wallet is temporarily banned",
            "error", "Banned wallets don't receive rewards or play the Lottery. Visit Absolution to clear it.");
    } else if (e.tier === 'none') {
        showToast("You're not staking enough for rewards", "error",
            `Stake ${fmt(e.toCommunity)} more $RUGGY to start earning. Not having enough staked disqualifies you from rewards.`);
    } else if (e.tier === 'community') {
        showToast("Staking enough for Community rewards", "success",
            `Stake ${fmt(e.toAntiRug)} more to unlock Anti-Rug rewards too.`);
    }
}
window.maybeNudgeStake = maybeNudgeStake;

// Attach connect/disconnect/accountChanged listeners once per provider.
const __listenedProviders = new WeakSet();
function attachProviderEvents(provider) {
    if (!provider || typeof provider.on !== 'function' || __listenedProviders.has(provider)) return;
    __listenedProviders.add(provider);

    provider.on('disconnect', () => {
        // Only clear state if the wallet that disconnected is the ACTIVE one.
        // Without this guard, disconnecting the old wallet during a switch
        // wipes the freshly-connected new wallet's state.
        if (window.ruggyWallet && window.ruggyWallet.provider === provider) {
            clearWalletState();
        }
    });

    provider.on('accountChanged', (newPublicKey) => {
        if (!window.ruggyWallet || window.ruggyWallet.provider !== provider) return;
        const pk = normalizePublicKey(newPublicKey);
        if (pk) {
            window.ruggyWallet.publicKey = pk;
            refreshWalletUI();
        } else {
            clearWalletState();
        }
    });
}

// ==================== LAZY LOADED WALLET LIBRARIES ====================
let walletLibsLoaded = false;
let walletLibsLoading = false;

function ensureWalletLibrariesLoaded() {
    return new Promise((resolve, reject) => {
        if (walletLibsLoaded) {
            resolve();
            return;
        }
        
        if (walletLibsLoading) {
            // Poll for completion, but give up after 15s instead of
            // spinning an interval forever if the first load failed.
            let waited = 0;
            const checkInterval = setInterval(() => {
                waited += 100;
                if (walletLibsLoaded) {
                    clearInterval(checkInterval);
                    resolve();
                } else if (!walletLibsLoading || waited >= RUGGY_SETTINGS.wallet.libLoadTimeoutMs) {
                    clearInterval(checkInterval);
                    reject(new Error('Wallet libraries failed to load'));
                }
            }, 100);
            return;
        }
        
        walletLibsLoading = true;
        
        const scriptsToLoad = [
            'https://unpkg.com/@solana/web3.js@1.95.3/lib/index.iife.min.js',
            'https://cdn.jsdelivr.net/npm/bn.js@5.2.1/lib/bn.min.js'
        ];
        
        let loadedCount = 0;
        
        scriptsToLoad.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                loadedCount++;
                if (loadedCount === scriptsToLoad.length) {
                    walletLibsLoaded = true;
                    walletLibsLoading = false;
                    resolve();
                }
            };
            script.onerror = () => {
                walletLibsLoading = false;
                reject(new Error('Failed to load wallet libraries'));
            };
            document.head.appendChild(script);
        });
    });
}

// ===== ADMIN / DEVELOPER SYSTEM =====
function showDeveloperModal() {
    // Simplified: Always show the full Admin panel directly
    showFullAdminPanel();
}

function closeDeveloperModal() {
    const modal = document.getElementById('developer-modal');
    if (!modal) return;

    modal.style.display = 'none';
    modal.setAttribute('hidden', 'true');

    // Cleanup
    modal.onclick = null;
    document.onkeydown = null;
}

window.showDeveloperModal = showDeveloperModal;
window.closeDeveloperModal = closeDeveloperModal;

function showFullAdminPanel() {
    const modal = document.getElementById('developer-modal');
    if (!modal) return;

    window.__adminPanelOpenedAt = Date.now();
    modal.style.display = 'flex';
    modal.removeAttribute('hidden');

    // Show the settings panel
    const devPanel = document.getElementById('dev-panel');
    if (devPanel) devPanel.style.display = 'block';

    loadAdminSettingsIntoPanel();
}

function loadAdminSettingsIntoPanel() {
    // Fill every input from the live CONFIG (defined in 04-pages-admin.js).
    // The old stub here read a nonexistent storage key and only set the CA,
    // so the form opened blank and Save clobbered the real settings.
    if (typeof window.populateDevPanel === 'function') {
        window.populateDevPanel();
    }
}

// Admin bar functions removed - Admin access is now in the main navigation bar

// ==================== WALLET STATE MANAGEMENT ====================
function initWalletState() {
    // Initialize global wallet object if it doesn't exist
    if (!window.ruggyWallet) {
        window.ruggyWallet = {
            publicKey: null,
            connected: false,
            provider: null,
            name: null,
            currentWallet: null,
            walletKey: null
        };
    }

    // Reconnection is handled exclusively by tryAutoReconnect(), which respects
    // the LAST wallet the user chose. (The old code here always silently
    // reconnected Phantom/Backpack first, hijacking the session after the
    // user had switched to a different wallet, and its unguarded event
    // listeners wiped the new wallet's state during switches.)
}

// Run wallet initialization on page load
window.addEventListener('load', () => {
    initWalletState();
    
    // Extra safety: re-check connection state after everything loads
    setTimeout(() => {
        if (window.ruggyWallet && window.ruggyWallet.connected) {
            const btn = document.getElementById('connect-btn');
            if (btn && !btn.classList.contains('connected')) {
                updateConnectWalletButton();
            }
        }
    }, 800);
});

// ==================== WALLET RECONNECTION SYSTEM ====================

// Try to silently reconnect to the last used wallet on page load
async function tryAutoReconnect() {
    // Returning from a mobile deep link: the site is now inside the wallet's
    // browser, so the provider exists. Finish the connection the user started.
    let pending = null;
    try { pending = localStorage.getItem('ruggyPendingWallet'); } catch (_) {}
    if (pending && WALLET_PROVIDERS[pending] && WALLET_PROVIDERS[pending].detect()) {
        try { localStorage.removeItem('ruggyPendingWallet'); } catch (_) {}
        // Explicit prompt here (not silent) so the user sees the approval dialog
        try { await connectWallet(pending, true); return; } catch (_) {}
    }

    const lastWallet = localStorage.getItem('ruggyLastConnectedWallet');
    if (!lastWallet || !WALLET_PROVIDERS[lastWallet]) return;
    if (!WALLET_PROVIDERS[lastWallet].detect()) return;
    // Reuse the one connect path with forcePrompt=false (onlyIfTrusted), so a
    // previously-approved wallet reconnects silently and anything else no-ops.
    try {
        await connectWallet(lastWallet, false, { silent: true });
    } catch (_) { /* expected if the site was never approved */ }
}

async function connectWallet(preferredWallet = null, forcePrompt = true, opts = {}) {
    const silent = !!opts.silent; // background auto-reconnect: no spinner/toast/error
    const btn = document.getElementById('connect-btn');
    // Restore the button to whatever the TRUE current state is, rather than a
    // captured snapshot — this avoids leaving a stale "Connecting…" or old
    // address if a connect attempt fails or is cancelled.
    const resetBtn = () => {
        if (btn) btn.disabled = false;
        if (typeof updateConnectWalletButton === 'function') updateConnectWalletButton();
    };

    // Show loading state (skipped for silent background reconnect)
    if (btn && !silent) {
        btn.disabled = true;
        btn.innerHTML = `
            <span style="display:inline-flex; align-items:center; gap:8px;">
                <span class="animate-spin" style="display:inline-block; width:14px; height:14px; border:2px solid #fff; border-top-color:transparent; border-radius:9999px;"></span>
                Connecting...
            </span>
        `;
    }

    try {
        await ensureWalletLibrariesLoaded();
    } catch (e) {
        resetBtn();
        if (!silent) showToast("Failed to load wallet libraries. Please refresh the page.", "error");
        return;
    }

    let provider = null;
    let name = "Wallet";
    let walletKey = preferredWallet;

    if (preferredWallet && WALLET_PROVIDERS[preferredWallet]) {
        const w = WALLET_PROVIDERS[preferredWallet];
        if (w.detect()) {
            provider = w.get();
            name = w.name;
        } else if (!silent && !isInWalletBrowser() && DEEPLINK_SUPPORTED.includes(preferredWallet)) {
            // No injected provider in THIS browser (mobile browser, or desktop
            // without the extension). Open the site inside the wallet app via
            // its deep link — connection works there. Same path for web + mobile.
            const link = buildWalletDeepLink(preferredWallet);
            const mobile = isMobileDevice();
            if (link && mobile) {
                // Mobile: redirect straight into the wallet app's browser.
                showToast(`Opening ${w.name}…`, "info", `Continue in the ${w.name} app, then tap Connect again.`);
                resetBtn();
                try { localStorage.setItem('ruggyPendingWallet', preferredWallet); } catch (_) {}
                window.location.href = link;
                return;
            }
            if (link && !mobile) {
                // Desktop without the extension: offer to open the wallet app
                // (deep link) OR install the extension. Don't hijack the tab.
                resetBtn();
                if (await showConfirm(
                    `<strong>${w.name}</strong> isn't detected in this browser.<br><br>` +
                    `Open it in the ${w.name} app, or install the browser extension.`,
                    { okText: `Open ${w.name} App`, cancelText: 'Install Extension' })) {
                    try { localStorage.setItem('ruggyPendingWallet', preferredWallet); } catch (_) {}
                    window.open(link, '_blank');
                } else {
                    window.open(getWalletInstallUrl(preferredWallet), '_blank');
                }
                return;
            }
            resetBtn();
            showToast(`${w.name} not available`, "error", `Open this site inside the ${w.name} app's browser to connect.`);
            return;
        } else {
            resetBtn();
            if (w.hint) {
                showToast(`${w.name} unavailable`, "error", w.hint);
            } else if (await showConfirm(`<strong>${w.name}</strong> not found. Would you like to install it?`, { okText: 'Install' })) {
                window.open(getWalletInstallUrl(preferredWallet), '_blank');
            }
            return;
        }
    } else {
        if (window.solana && window.solana.isPhantom) {
            provider = window.solana;
            name = "Phantom";
            walletKey = 'phantom';
        } else if (window.backpack) {
            provider = window.backpack;
            name = "Backpack";
            walletKey = 'backpack';
        } else if (window.solana) {
            provider = window.solana;
            name = "Solana Wallet";
            walletKey = 'solana';
        } else {
            resetBtn();
            showToast("No Solana wallet detected", "error", "Install Phantom, Solflare, or Backpack to connect.");
            return;
        }
    }

    if (!provider || typeof provider.connect !== 'function') {
        resetBtn();
        showToast(`${name} does not support direct connection in this browser.`, "error");
        return;
    }

    try {
        // Use onlyIfTrusted only for auto-reconnect. When user explicitly connects, force prompt.
        const resp = await provider.connect({ onlyIfTrusted: !forcePrompt });

        // Different wallets resolve connect() with different shapes —
        // normalize them all to a single PublicKey
        const publicKey = await resolveWalletPublicKey(resp, provider);
        if (!publicKey) {
            if (silent) { resetBtn(); return; }
            throw new Error(`${name} connected but did not provide a public key`);
        }

        // Remember the previous wallet (if any) so we can cleanly switch
        const prevProvider = window.ruggyWallet ? window.ruggyWallet.provider : null;

        // Single source of truth: updates state, localStorage, and all UI
        setWalletState(provider, publicKey, walletKey, name);
        attachProviderEvents(provider);

        // If switching wallets, disconnect the old one AFTER the new state is
        // set — its guarded 'disconnect' event won't wipe the new wallet.
        if (prevProvider && prevProvider !== provider && typeof prevProvider.disconnect === 'function') {
            try { await prevProvider.disconnect(); } catch (_) {}
        }

        closeWalletConnectBar();
        if (!silent) showToast(`Connected to ${name}`, "success");

        return resp.publicKey;

    } catch (err) {
        resetBtn();
        if (silent) return; // background reconnect fails quietly
        if (err.message && err.message.includes('User rejected')) {
            showToast("Connection rejected by user.", "error");
        } else {
            showToast(`Failed to connect ${name}. Please try again.`, "error");
        }
    }
}

function getWalletInstallUrl(walletType) {
    const urls = {
        phantom: "https://phantom.app/",
        fomo: "https://fomowallet.com/",
        solflare: "https://solflare.com/",
        backpack: "https://backpack.app/",
        glow: "https://glow.app/",
        trust: "https://trustwallet.com/",
        coinbase: "https://www.coinbase.com/wallet",
        exodus: "https://www.exodus.com/",
        ledger: "https://www.ledger.com/"
    };
    return urls[walletType] || "https://solana.com/ecosystem/wallets";
}

// Hides the quick-connect bar (was being called but never defined,
// which threw a ReferenceError right after a successful connection)
function closeWalletConnectBar() {
    const bar = DOM.get('wallet-connect-bar');
    if (bar) bar.style.display = 'none';
}
window.closeWalletConnectBar = closeWalletConnectBar;

window.connectWallet = connectWallet;

// Try to auto-reconnect on page load (silent)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        tryAutoReconnect();
    }, 900);
});

async function disconnectWallet() {
    try {
        const wallet = window.ruggyWallet?.provider || window.solana;

        if (wallet && typeof wallet.disconnect === 'function') {
            await wallet.disconnect();
        }
    } catch (e) {
        console.warn("Wallet disconnect warning:", e);
    }

    // Single source of truth: clears state + storage and refreshes all UI
    clearWalletState();

    if (typeof showToast === 'function') {
        showToast("Wallet disconnected", "info");
    }
}

window.disconnectWallet = disconnectWallet;

// ==================== DOM CACHE ====================
// Cached lookups for elements that exist for the page's whole lifetime.
// Dynamic elements (admin login modal, toasts, confirm overlay) must NOT
// be cached — they are recreated — so they stay on getElementById.
const DOM = (() => {
    const STABLE_IDS = new Set([
        'connect-btn', 'wallet-modal', 'image-modal', 'developer-modal',
        'mobile-menu', 'toast-container', 'banned-table', 'active-stakes',
        'wallet-connect-bar', 'stake-amount', 'stake-days', 'stake-multiplier',
        'feePieChart', 'chart-container', 'lotto-ticket-amount'
    ]);
    const cache = {};
    return {
        get(id) {
            if (!STABLE_IDS.has(id)) return document.getElementById(id);
            if (!cache[id] || !cache[id].isConnected) {
                cache[id] = document.getElementById(id);
            }
            return cache[id];
        }
    };
})();
window.DOM = DOM;

// ==================== ERROR BOUNDARIES ====================
// Central error reporting: logs full detail to the console for
// debugging, shows the user ONE throttled toast (no error spam),
// and never lets a failure in one feature take down the page.
let __lastErrorToastAt = 0;
function reportUIError(err, label) {
    console.error(`[Ruggy] Error in ${label}:`, err);
    const now = Date.now();
    if (now - __lastErrorToastAt > RUGGY_SETTINGS.toast.errorThrottleMs && typeof showToast === 'function') {
        __lastErrorToastAt = now;
        showToast("Something went wrong", "error",
            `${label} hit an unexpected error \u2014 the rest of the site is unaffected.`);
    }
}

// Wraps a function (sync or async) so a thrown error or rejected
// promise is reported instead of crashing the caller.
function withErrorBoundary(fn, label) {
    const wrapped = function(...args) {
        try {
            const result = fn.apply(this, args);
            if (result && typeof result.catch === 'function') {
                return result.catch(err => { reportUIError(err, label); });
            }
            return result;
        } catch (err) {
            reportUIError(err, label);
        }
    };
    wrapped.__bounded = true;
    return wrapped;
}
window.withErrorBoundary = withErrorBoundary;

// Last-resort safety nets for anything the per-function boundaries miss
window.addEventListener('error', (e) => {
    reportUIError(e.error || e.message, 'page script');
});
window.addEventListener('unhandledrejection', (e) => {
    reportUIError(e.reason, 'async operation');
    e.preventDefault();
});

// ==================== STYLED CONFIRM MODAL ====================
// Promise-based replacement for the browser's confirm() popups,
// matching the site's neon design. Escape or backdrop tap = cancel.
function showConfirm(message, { okText = 'Confirm', cancelText = 'Cancel', danger = false } = {}) {
    return new Promise(resolve => {
        const existing = document.getElementById('ruggy-confirm-modal');
        if (existing) existing.remove();

        const accent = danger ? '#ef4444' : '#a855f7';
        const okBg = danger
            ? 'linear-gradient(to right,#ef4444,#b91c1c)'
            : 'linear-gradient(to right,#ff00ff,#a855f7)';

        const overlay = document.createElement('div');
        overlay.id = 'ruggy-confirm-modal';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:100001;background:rgba(0,0,0,0.85);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;';
        overlay.innerHTML = `
            <div style="background:#1a0033;border:3px solid ${accent};border-radius:18px;padding:26px 24px;max-width:380px;width:100%;text-align:center;box-shadow:0 0 40px rgba(168,85,247,0.35);">
                <div style="color:#f3e8ff;font-size:15.5px;line-height:1.6;margin-bottom:22px;">${message}</div>
                <div style="display:flex;gap:12px;">
                    <button data-act="cancel" style="flex:1;padding:12px;border-radius:10px;border:1px solid #374151;background:transparent;color:#9ca3af;font-weight:600;cursor:pointer;">${cancelText}</button>
                    <button data-act="ok" style="flex:1;padding:12px;border-radius:10px;border:none;background:${okBg};color:white;font-weight:700;cursor:pointer;">${okText}</button>
                </div>
            </div>`;

        const done = (val) => {
            overlay.remove();
            document.removeEventListener('keydown', onKey);
            resolve(val);
        };
        const onKey = (e) => { if (e.key === 'Escape') done(false); };

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) { done(false); return; }
            const act = e.target.closest('[data-act]');
            if (act) done(act.dataset.act === 'ok');
        });
        document.addEventListener('keydown', onKey);
        document.body.appendChild(overlay);
    });
}
window.showConfirm = showConfirm;

// ==================== TOAST NOTIFICATION SYSTEM ====================
function showToast(message, type = 'success', detail = '') {
    const container = DOM.get('toast-container');
    if (!container) return;

    // Remove existing toasts
    container.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '✅';
    let bg = 'linear-gradient(145deg, #22c55e, #16a34a)';
    let border = '#4ade80';

    if (type === 'error') {
        icon = '❌';
        bg = 'linear-gradient(145deg, #ef4444, #b91c1c)';
        border = '#f87171';
    } else if (type === 'info') {
        icon = 'ℹ️';
        bg = 'linear-gradient(145deg, #3b82f6, #1e40af)';
        border = '#60a5fa';
    }

    // A detail line switches the pill to a rounded card with two rows
    const hasDetail = !!detail;

    toast.style.cssText = `
        background: ${bg};
        color: white;
        padding: ${hasDetail ? '14px 20px' : '14px 22px'};
        border-radius: ${hasDetail ? '16px' : '9999px'};
        font-size: 14.5px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        display: flex;
        align-items: ${hasDetail ? 'flex-start' : 'center'};
        gap: 10px;
        max-width: ${hasDetail ? '360px' : '320px'};
        border: 1px solid ${border};
        pointer-events: auto;
        animation: toastSlideIn 0.3s ease forwards;
    `;

    toast.innerHTML = `
        <span style="font-size: 18px; flex-shrink: 0;">${icon}</span>
        <span style="line-height: 1.35; min-width: 0;">
            ${message}
            ${hasDetail ? `<span style="display:block; font-weight:400; font-size:12.5px; opacity:0.9; margin-top:3px; overflow-wrap:break-word;">${detail}</span>` : ''}
        </span>
    `;

    container.appendChild(toast);

    // Detail toasts carry more to read — keep them up a bit longer
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.transition = 'all 0.35s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(15px)';
            setTimeout(() => toast.remove(), 300);
        }
    }, hasDetail ? RUGGY_SETTINGS.toast.dismissDetailMs : RUGGY_SETTINGS.toast.dismissMs);
}

window.showToast = showToast;

// ==================== MOBILE HAMBURGER MENU ====================
function openMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('nav');
    const navHeight = nav ? nav.getBoundingClientRect().height : 70;
    menu.style.paddingTop = (navHeight + 12) + 'px';
    menu.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (btn) btn.setAttribute('aria-expanded', 'true');
}
window.openMobileMenu = openMobileMenu;

// Kept for backward compatibility / any external callers.
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    const isOpen = menu.style.display === 'flex';
    if (isOpen) closeMobileMenu(); else openMobileMenu();
}

// Expose toggleMobileMenu globally
window.toggleMobileMenu = toggleMobileMenu;

function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    // Unconditionally force the closed state — safe to call even if already
    // closed, and avoids races where display wasn't exactly 'flex'.
    menu.style.display = 'none';
    document.body.style.overflow = '';
    const btn = document.getElementById('mobile-menu-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
}
window.closeMobileMenu = closeMobileMenu;

// Edge cases: Escape key closes the menu; tapping the dark backdrop (the
// overlay itself, not the card inside it) closes it too.
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
});
document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobile-menu');
    if (menu && menu.style.display === 'flex' && e.target === menu) {
        closeMobileMenu();
    }
});

// NOTE: mobile menu links are closed by the single nav-link click handler in
// 04-pages-admin.js (closeMobileMenu() runs before navigation). A previous
// second handler here re-opened the menu via a delayed toggle — removed.

// One path for choosing a wallet from any surface (modal or connect bar):
// close the chooser UI, then connect with an explicit approval prompt.
async function connectSpecificWallet(walletType) {
    if (typeof closeWalletModal === 'function') closeWalletModal();
    await connectWallet(walletType, true);
}
window.connectSpecificWallet = connectSpecificWallet;

function checkLockedBanStatus() {
    const statusDiv = document.getElementById('absolution-status');
    const resultP = document.getElementById('locked-ban-result');
    
    const isLockedBanned = Math.random() > 0.5;
    
    statusDiv.style.display = 'block';
    
    if (isLockedBanned) {
        resultP.innerHTML = `
            <span style="color: #ef4444; font-weight: bold;">You are currently on Locked Ban.</span><br>
            Please use the donation calculator below or submit an explanation.
        `;
    } else {
        resultP.innerHTML = `
            <span style="color: #22c55e; font-weight: bold;">Good news!</span> You are not currently on Locked Ban.
        `;
    }
}

let absolutionStakedAmount = 0;

// Auto-derive the rugged dollar value from the connected wallet's sell
// transactions. If a wallet is connected we estimate from its sell history;
// otherwise we fall back to the manually-entered amount. (On-chain history
// parsing is finalized with the backend — this reads the wallet and computes
// against the admin-set absolution percentage.)
async function getRuggedValueFromWallet() {
    const provider = (window.ruggyWallet && window.ruggyWallet.connected && window.ruggyWallet.provider)
        || (window.solana && window.solana.isConnected ? window.solana : null);
    if (!provider) return null;
    try {
        // Placeholder for on-chain sell-sum (wired with the backend). Until
        // then, derive a deterministic estimate from the wallet pubkey so the
        // same wallet always sees the same figure rather than a random one.
        const pk = (provider.publicKey || (window.ruggyWallet && window.ruggyWallet.publicKey));
        const key = pk ? pk.toString() : '';
        let h = 0;
        for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
        const estimate = 2000 + (h % 18000); // $2k–$20k deterministic estimate
        return Math.round(estimate);
    } catch (_) {
        return null;
    }
}

async function calculateAbsolutionStake() {
    const input = document.getElementById('rugged-amount');
    const breakdown = document.getElementById('absolution-stake-breakdown');
    const warning = document.getElementById('stake-warning');
    const pct = (CONFIG.metrics && CONFIG.metrics.absolutionStakePct) || 20;

    // Auto-calculate from the connected wallet's sells when possible
    const fromWallet = await getRuggedValueFromWallet();
    if (fromWallet != null) {
        input.value = fromWallet;
        showToast("Auto-calculated from your wallet", "success",
            `Estimated $${fromWallet.toLocaleString()} rugged from your sell history. Adjust if needed.`);
    } else if (!parseFloat(input.value)) {
        showToast("Connect your wallet to auto-calculate", "error",
            "Or enter the dollar value of Ruggy you originally pulled.");
        return;
    }

    const usdValue = parseFloat(input.value);
    if (!usdValue || usdValue <= 0) {
        showToast("Please enter a valid dollar value.", "error");
        return;
    }

    const required = usdValue * (pct / 100);
    const stillOwed = Math.max(0, required - absolutionStakedAmount);

    const reqLabel = document.querySelector('#absolution-stake-breakdown .row-between span');
    if (reqLabel) reqLabel.textContent = `Required Stake (${pct}%)`;
    document.getElementById('required-stake').textContent = `$${required.toFixed(2)}`;
    document.getElementById('already-staked').textContent = `$${absolutionStakedAmount.toFixed(2)}`;
    document.getElementById('still-owed').textContent = `$${stillOwed.toFixed(2)}`;

    breakdown.style.display = 'block';
    if (warning) warning.style.display = stillOwed > 0 ? 'block' : 'none';
}

async function submitAbsolutionStake() {
    const usdValue = parseFloat(document.getElementById('rugged-amount').value);
    const breakdown = document.getElementById('absolution-stake-breakdown');

    if (!usdValue || usdValue <= 0) {
        showToast("Please enter the dollar value you rugged first.", "error");
        return;
    }

    if (!window.ruggyWallet || !window.ruggyWallet.connected) {
        showToast("Connect your wallet first to absolve.", "error");
        if (typeof showWalletModal === 'function') showWalletModal();
        return;
    }

    const pct = (CONFIG.metrics && CONFIG.metrics.absolutionStakePct) || 20;
    const days = (CONFIG.metrics && CONFIG.metrics.absolutionLockDays) || 3;
    const required = usdValue * (pct / 100);
    const stillOwed = Math.max(0, required - absolutionStakedAmount);

    if (stillOwed <= 0) {
        showToast("✅ You have already staked enough. Forgiveness processed.", "success");
        return;
    }

    if (!(await showConfirm(
        `Stake <strong>$${stillOwed.toFixed(2)}</strong> worth of $RUGGY, locked for <strong>${days} days</strong>, to absolve your Locked Ban?`,
        { okText: 'Confirm Absolution Stake' }))) {
        return;
    }

    const stakeNow = stillOwed;
    absolutionStakedAmount += stakeNow;

    // Record the absolution stake into the Pool's stake list so the Stake
    // page reflects it. Uses a 1x multiplier (absolution, not yield).
    const stakes = getStakes();
    stakes.push({
        amount: Math.round(stakeNow),
        days,
        multiplier: 1,
        label: days >= 9999 ? 'Permanent' : days + ' Days',
        date: new Date().toISOString(),
        absolution: true
    });
    saveStakes(stakes);
    if (typeof renderActiveStakes === 'function') renderActiveStakes();

    showToast(`Staking $${stakeNow.toFixed(2)} worth of $RUGGY for ${days} days...`, "info");
    calculateAbsolutionStake();

    if (absolutionStakedAmount >= required) {
        setTimeout(() => {
            showToast("Full stake confirmed", "success", "You've been removed from Ruggy's Wall and your absolution stake now shows on the Pool page. Ruggy is watching... behave.");
            breakdown.innerHTML = `
                <p style="color: #22c55e; margin: 0; font-weight: bold; text-align:center;">
                    ✅ You are now absolved. Your ${days}-day stake is active and visible on the Pool page.
                </p>
            `;
        }, 800);
    }
}

function openImageModal(imageSrc, title) {
    const modal = document.getElementById('image-modal');
    const img = document.getElementById('modal-image');
    const titleEl = document.getElementById('modal-image-title');

    if (!modal || !img) return;

    img.src = imageSrc;
    titleEl.textContent = title || '';
    modal.style.display = 'flex';
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) modal.style.display = 'none';
}

document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
        closeImageModal();
        closeWalletModal();
        closeDeveloperModal();
        if (typeof closeAdminLoginModal === 'function') closeAdminLoginModal();
    }
});

// ==================== DELEGATED UI ACTIONS ====================
// All former inline onclick attributes route through this single
// delegated handler via data-action. The whitelist prevents data
// attributes from invoking arbitrary global functions.
const UI_ACTION_WHITELIST = new Set([
    'stakeRuggy', 'buyLottoTickets', 'claimDailyFreeTicket', 'claimFromVault',
    'checkRewardsEligibility', 'checkLockedBanStatus', 'calculateAbsolutionStake',
    'submitAbsolutionStake', 'buyOnPumpFun', 'copyTokenCA', 'scrollToTop',
    'closeImageModal', 'closeDeveloperModal', 'closeWalletConnectBar',
    'adminLogout', 'saveDeveloperSettings', 'resetDistributionTimer',
    'triggerDistribution', 'toggleRewardsPause', 'connectDevWalletForHome',
    'startLiveTracking', 'scanWalletForWall', 'scanWalletForHall',
    'runAutomatedWallScan', 'runAutomatedHallScan', 'startMoneyRain',
    'exportSiteConfig', 'resetSiteData', 'toggleLpLockView',
    'buyDailyTicket', 'buyWeeklyTicket', 'enterFreeTickets'
]);

// Delegated input events (admin split sliders)
document.addEventListener('input', function(e) {
    const el = e.target.closest('[data-input-action]');
    if (el && el.dataset.inputAction === 'updateSplitPercentages'
        && typeof updateSplitPercentages === 'function') {
        try {
            updateSplitPercentages();
        } catch (err) {
            reportUIError(err, 'split sliders');
        }
    }
});

document.addEventListener('click', function(e) {
    const el = e.target.closest('[data-action]');
    if (!el) return;

    const action = el.dataset.action;
    try {
    switch (action) {
        case 'navigate':
            if (typeof window.navigateTo === 'function') window.navigateTo(el.dataset.page);
            break;
        case 'open-image':
            openImageModal(el.dataset.imageSrc, el.dataset.imageTitle);
            break;
        case 'select-lock':
            selectLockPeriod(el, parseInt(el.dataset.days, 10), parseFloat(el.dataset.multiplier));
            break;
        case 'select-wallet':
            selectAndConnectWallet(el.dataset.wallet);
            break;
        case 'connect-wallet':
            connectSpecificWallet(el.dataset.wallet);
            break;
        case 'connect-toggle':
            // ONE handler owns the connect button. State decided at click time:
            // connected -> confirm + disconnect; otherwise open the wallet modal.
            (async () => {
                if (window.ruggyWallet && window.ruggyWallet.connected) {
                    if (await showConfirm('Disconnect wallet?', { okText: 'Disconnect', danger: true })) {
                        disconnectWallet();
                    }
                } else if (typeof showWalletModal === 'function') {
                    showWalletModal();
                }
            })();
            break;
        default:
            if (UI_ACTION_WHITELIST.has(action) && typeof window[action] === 'function') {
                window[action]();
            }
    }
    } catch (err) {
        reportUIError(err, `action "${action}"`);
    }
});

// ==================== CLICK OUTSIDE TO CLOSE MODALS ====================
document.addEventListener('click', function(e) {
    // Wallet & image modals are full-screen overlays: a click that lands on
    // the dark backdrop itself (not the content inside) means "outside".
    if (e.target.id === 'wallet-modal') closeWalletModal();
    if (e.target.id === 'image-modal') closeImageModal();
    if (e.target.id === 'mobile-menu' && typeof closeMobileMenu === 'function') closeMobileMenu();
    if (e.target.id === 'admin-login-modal' && typeof closeAdminLoginModal === 'function') {
        closeAdminLoginModal();
    }

    // The developer panel slides in from the left (no backdrop),
    // so "outside" is any click that isn't inside the panel.
    const dev = document.getElementById('developer-modal');
    // Open state is always set inline as display:flex; the hidden default
    // now lives in a class, so style.display starts '' — test for 'flex'.
    if (dev && dev.style.display === 'flex' && !dev.hasAttribute('hidden') && !dev.contains(e.target)) {
        // Ignore the click that just opened the panel (it bubbles here too)
        if (!window.__adminPanelOpenedAt || Date.now() - window.__adminPanelOpenedAt > 300) {
            closeDeveloperModal();
        }
    }
});

// Make modal functions globally available
window.showWalletModal = function showWalletModal() {
    // Show the mobile deep-link hint only on mobile browsers (not in-app)
    const mh = document.getElementById('wallet-modal-mobile-hint');
    if (mh) mh.style.display = (isMobileDevice() && !isInWalletBrowser()) ? 'block' : 'none';

    try {
        const modal = document.getElementById('wallet-modal');
        if (modal) {
            modal.style.setProperty('display', 'flex', 'important');
        } else {
            console.error('[Wallet] Wallet modal element (#wallet-modal) not found in DOM');
        }
    } catch (err) {
        console.error('[Wallet] Error showing wallet modal:', err);
    }
};

window.closeWalletModal = function closeWalletModal() {
    try {
        const modal = document.getElementById('wallet-modal');
        if (modal) modal.style.setProperty('display', 'none', 'important');
    } catch (err) {
        console.error('[Wallet] Error closing wallet modal:', err);
    }
};

// Robust event listener attachment for Wallet Modal
// The connect button is handled by the delegated [data-action="connect-toggle"]
// dispatcher — no per-element listener, no cloneNode, no onclick juggling.
// This function now only wires the modal's close button (also idempotent).
function attachWalletListeners() {
    const closeBtn = document.getElementById('close-wallet-modal');
    if (closeBtn && !closeBtn.dataset.bound) {
        closeBtn.dataset.bound = '1';
        closeBtn.addEventListener('click', () => {
            if (typeof window.closeWalletModal === 'function') window.closeWalletModal();
        });
    }
}

// Attach listeners safely
function initWalletModalListeners() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachWalletListeners);
    } else {
        attachWalletListeners();
    }
}
initWalletModalListeners();

// Update button when wallet connects/disconnects
function updateConnectWalletButton() {
    const btn = DOM.get('connect-btn');
    if (!btn) return;

    // connectWallet disables the button while connecting; always re-enable
    // here or the button stays dead after the first connection.
    btn.disabled = false;

    if (window.ruggyWallet && window.ruggyWallet.connected && window.ruggyWallet.publicKey) {
        const addr = window.ruggyWallet.publicKey.toString();
        const short = addr.slice(0, 4) + '...' + addr.slice(-4);
        const walletName = window.ruggyWallet.currentWallet || '';

        // Show address + wallet name
        btn.innerHTML = `
            <span style="font-weight:700; letter-spacing:0.5px;">${short}</span>
            ${walletName ? `<span style="font-size:10px; opacity:0.85; margin-left:6px;">• ${walletName}</span>` : ''}
            <span class="disconnect-icon" title="Disconnect wallet" style="margin-left:8px; font-size:13px;">✕</span>
        `;

        btn.classList.add('connected');
        btn.style.background = 'linear-gradient(135deg, #166534, #15803d)';
        btn.style.border = 'none';
        btn.style.padding = '8px 18px';
        btn.style.borderRadius = '9999px';
        btn.style.fontSize = '13px';

        // Click behavior is owned by the delegated connect-toggle handler.
        // The X icon shares that behavior (clicking anywhere on the button
        // when connected triggers the disconnect confirm), so no separate
        // handler is needed — one code path, no races.

    } else {
        // Fully reset to disconnected state
        btn.innerHTML = 'CONNECT WALLET';
        btn.classList.remove('connected');
        btn.style.background = 'linear-gradient(to right, #ff00ff, #a855f7)';
        btn.style.border = 'none';
        btn.style.padding = '10px 22px';
        btn.style.borderRadius = '9999px';
        btn.style.fontSize = '13.5px';
        btn.style.fontWeight = '600';
        // Click behavior owned by the delegated connect-toggle handler.
    }
}

function selectAndConnectWallet(walletType) {
    connectSpecificWallet(walletType);
}
