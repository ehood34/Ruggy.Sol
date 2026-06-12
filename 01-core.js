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
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function() {
            if (typeof toggleMobileMenu === 'function') {
                toggleMobileMenu();
            } else {
                console.error('toggleMobileMenu is not defined yet');
            }
        });
    }

    // Mobile menu close button (inside the popup)
    const closeBtn = document.getElementById('mobile-menu-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (typeof toggleMobileMenu === 'function') {
                toggleMobileMenu();
            }
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
    STORAGE_KEY: 'ruggyLottoTickets',
    FREE_CLAIM_KEY: 'lastFreeLottoTicket',

    get ticketPrice() { return RUGGY_SETTINGS.lottery.ticketPriceUsd; },

    getTickets() {
        return parseInt(localStorage.getItem(this.STORAGE_KEY) || '0', 10);
    },

    addTickets(n) {
        localStorage.setItem(this.STORAGE_KEY, this.getTickets() + n);
    },

    async buyTickets() {
        const amountInput = document.getElementById('lotto-ticket-amount');
        if (!amountInput) return;

        const amount = parseInt(amountInput.value, 10) || 1;
        const totalCost = amount * this.ticketPrice;

        if (await showConfirm(`Buy <strong>${amount} tickets</strong> for <strong>$${totalCost}</strong>?`, { okText: 'Buy Tickets' })) {
            this.addTickets(amount);
            showToast(`Purchased ${amount} Lottery Tickets!`, "success", "Your tickets have been added to the next draw. Good luck!");
        }
    },

    claimFreeTicket() {
        const today = new Date().toDateString();
        if (localStorage.getItem(this.FREE_CLAIM_KEY) === today) {
            showToast("You've already claimed your free ticket today. Come back tomorrow!", "success");
            return;
        }
        localStorage.setItem(this.FREE_CLAIM_KEY, today);
        this.addTickets(1);
        showToast("🎁 Free Ticket Claimed!", "success", "+1 Free Lottery Ticket added to your account. Good luck in today's draw!");
    }
};

// Compatibility aliases (data-action whitelist + legacy call sites)
async function buyLottoTickets() { return Lottery.buyTickets(); }
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

    if (days >= 9999 && !(await showConfirm("Permanent staking locks your $RUGGY <strong>forever</strong> with no early unstake. Continue?", { okText: 'Lock Forever', danger: true }))) {
        return;
    }

    let stakes = [];
    try { stakes = JSON.parse(localStorage.getItem('ruggyStakes') || '[]'); } catch (_) {}
    stakes.push({ amount, days, multiplier, label, date: new Date().toISOString() });
    localStorage.setItem('ruggyStakes', JSON.stringify(stakes));

    if (amountInput) amountInput.value = '';
    renderActiveStakes();
    showToast(`Staked ${amount.toLocaleString()} $RUGGY for ${label} (${multiplier}x)`, "success");
}

function renderActiveStakes() {
    const box = DOM.get('active-stakes');
    if (!box) return;

    let stakes = [];
    try { stakes = JSON.parse(localStorage.getItem('ruggyStakes') || '[]'); } catch (_) {}

    if (!stakes.length) {
        box.innerHTML = '<span style="color:#6b7280;">No active stakes yet.</span>';
        return;
    }

    box.innerHTML = stakes.map(s => `
        <div style="display:flex; justify-content:space-between; padding:8px 10px; background:#0a2a14; border-radius:6px; margin-bottom:6px;">
            <span>${Number(s.amount).toLocaleString()} $RUGGY</span>
            <span style="color:#86efac;">${s.label} \u2022 ${s.multiplier}x</span>
        </div>
    `).join('');
}
window.addEventListener('load', renderActiveStakes);

// ==================== REAL WALLET CONNECTION ====================
// Each wallet extension injects its own provider object into the page.
// detect() checks for that injection; get() returns the provider whose
// .connect() triggers the wallet's own approval popup (its "API login").
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
}

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
    // This function can pre-load current CONFIG values into the admin panel inputs
    // For now it just ensures the panel is ready
    const caInput = document.getElementById('dev-ca');
    if (caInput) {
        // Load from localStorage if available (safer than global CONFIG)
        try {
            const saved = localStorage.getItem('ruggy_dev_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                if (settings.tokenMint) {
                    caInput.value = settings.tokenMint;
                }
            }
        } catch (e) {
            // Ignore storage errors
        }
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
            name: null
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
    const lastWallet = localStorage.getItem('ruggyLastConnectedWallet');
    if (!lastWallet || !WALLET_PROVIDERS[lastWallet]) return;

    const w = WALLET_PROVIDERS[lastWallet];
    if (!w.detect()) return;

    try {
        await ensureWalletLibrariesLoaded();
    } catch (e) {
        return;
    }

    const provider = w.get();
    if (!provider || typeof provider.connect !== 'function') return;

    try {
        // Silent reconnect - only connects if user previously approved
        const resp = await provider.connect({ onlyIfTrusted: true });
        const publicKey = await resolveWalletPublicKey(resp, provider);
        if (publicKey) {
            setWalletState(provider, publicKey, lastWallet, w.name);
            attachProviderEvents(provider);
        }
    } catch (err) {
        // Silent fail is expected if user hasn't approved the site before
    }
}

async function connectWallet(preferredWallet = null, forcePrompt = true) {
    const btn = document.getElementById('connect-btn');
    const originalText = btn ? btn.innerHTML : '';
    const resetBtn = () => {
        resetBtn();
    };

    // Show loading state
    if (btn) {
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
        showToast("Failed to load wallet libraries. Please refresh the page.", "error");
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
        } else {
            resetBtn();
            if (w.hint) {
                showToast(`${w.name} unavailable`, "error", w.hint);
            } else {
                if (await showConfirm(`<strong>${w.name}</strong> not found. Would you like to install it?`, { okText: 'Install' })) {
                    window.open(getWalletInstallUrl(preferredWallet), '_blank');
                }
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
        showToast(`Connected to ${name}`, "success");

        return resp.publicKey;

    } catch (err) {
        resetBtn();

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
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;

    const isHidden = menu.style.display === 'none' || menu.style.display === '';

    if (isHidden) {
        // Start the menu card just below the fixed navigation bar,
        // measured live so it adapts to whatever height the nav has.
        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.getBoundingClientRect().height : 70;
        menu.style.paddingTop = (navHeight + 12) + 'px';

        menu.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        menu.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Expose toggleMobileMenu globally
window.toggleMobileMenu = toggleMobileMenu;

// Attach close behavior to mobile menu links (so menu closes after navigation)
function attachMobileMenuLinkListeners() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;

    const links = mobileMenu.querySelectorAll('a[data-page]');
    links.forEach(link => {
        link.addEventListener('click', () => {
            // Close menu after a short delay so navigation can start
            setTimeout(() => {
                if (typeof window.toggleMobileMenu === 'function') {
                    window.toggleMobileMenu();
                }
            }, 80);
        });
    });
}

// Run after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachMobileMenuLinkListeners);
} else {
    attachMobileMenuLinkListeners();
}

async function connectSpecificWallet(walletType) {
    // When user explicitly clicks a wallet in the modal, we want to show the approval prompt
    await connectWallet(walletType, true);
}

// Expose globally
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

function calculateAbsolutionStake() {
    const usdValue = parseFloat(document.getElementById('rugged-amount').value);
    const breakdown = document.getElementById('absolution-stake-breakdown');
    const warning = document.getElementById('stake-warning');

    if (!usdValue || usdValue <= 0) {
        showToast("Please enter the dollar value of Ruggy you originally pulled.", "error");
        return;
    }

    const required = usdValue * 0.20;
    const stillOwed = Math.max(0, required - absolutionStakedAmount);

    document.getElementById('required-stake').textContent = `$${required.toFixed(2)}`;
    document.getElementById('already-staked').textContent = `$${absolutionStakedAmount.toFixed(2)}`;
    document.getElementById('still-owed').textContent = `$${stillOwed.toFixed(2)}`;

    breakdown.style.display = 'block';
    warning.style.display = stillOwed > 0 ? 'block' : 'none';
}

function submitAbsolutionStake() {
    const usdValue = parseFloat(document.getElementById('rugged-amount').value);
    const breakdown = document.getElementById('absolution-stake-breakdown');

    if (!usdValue || usdValue <= 0) {
        showToast("Please enter the dollar value you rugged first.", "error");
        return;
    }

    const required = usdValue * 0.20;
    const stillOwed = Math.max(0, required - absolutionStakedAmount);

    if (stillOwed > 0) {
        const stakeNow = stillOwed;
        absolutionStakedAmount += stakeNow;

        showToast(`Staking $${stakeNow.toFixed(2)} worth of $RUGGY for 3 days...`, "info");

        calculateAbsolutionStake();

        if (absolutionStakedAmount >= required) {
            setTimeout(() => {
                showToast("Full stake confirmed on-chain", "success", "You have been removed from Ruggy's Wall. Ruggy is watching... behave.");
                breakdown.innerHTML = `
                    <p style="color: #22c55e; margin: 0; font-weight: bold; text-align:center;">
                        ✅ You are now absolved. Your 3-day stake is active.
                    </p>
                `;
            }, 800);
        }
    } else {
        showToast("✅ You have already staked enough. Forgiveness processed.", "success");
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
    'runAutomatedWallScan', 'runAutomatedHallScan'
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
            if (typeof navigateTo === 'function') navigateTo(el.dataset.page);
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
    if (e.target.id === 'mobile-menu') toggleMobileMenu();
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
function attachWalletListeners() {
    const connectBtn = document.getElementById('connect-btn');
    if (connectBtn) {
        // Remove any old inline onclick or previous listeners
        connectBtn.onclick = null;
        const newBtn = connectBtn.cloneNode(true);
        connectBtn.parentNode.replaceChild(newBtn, connectBtn);
        
        // Attach clean listener
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof window.showWalletModal === 'function') {
                window.showWalletModal();
            } else {
                console.error('[Wallet] showWalletModal is not defined');
            }
        });
    }

    const closeBtn = document.getElementById('close-wallet-modal');
    if (closeBtn) {
        closeBtn.onclick = null;
        closeBtn.addEventListener('click', function() {
            if (typeof window.closeWalletModal === 'function') {
                window.closeWalletModal();
            }
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

        // Main button click → disconnect with confirmation
        btn.onclick = async (e) => {
            e.stopImmediatePropagation();
            if (await showConfirm('Disconnect wallet?', { okText: 'Disconnect', danger: true })) {
                disconnectWallet();
            }
        };

        // X icon also disconnects
        const xIcon = btn.querySelector('.disconnect-icon');
        if (xIcon) {
            xIcon.onclick = (e) => {
                e.stopImmediatePropagation();
                disconnectWallet();
            };
        }

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
        btn.onclick = () => showWalletModal();
    }
}

function selectAndConnectWallet(walletType) {
    closeWalletModal();
    setTimeout(() => {
        connectWallet(walletType);
    }, 150);
}
