/* Part of the Ruggy Rewards app. Files load in numeric order via
   <script defer> tags in index.html; execution order matters for
   the decorator chain and error-boundary application. */

/* =====================================================================
   SECTION 4 — PAGES & ADMIN PANEL
   Runtime CONFIG (persisted via dev panel) · Hall/Wall scanning &
   tables · pool staking · vault claims · eligibility · live tracking ·
   tokenomics chart · dynamic nav padding
   ===================================================================== */
let CONFIG = {
    tokenMint: "",
    airdropThreshold: 500000,
    antiRugThreshold: 1000000,
    distributionIntervalMinutes: 30,
    nextDistributionTime: null
};

const safeStorage = {
    getItem: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    },
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {}
    }
};

function loadConfig() {
    try {
        const saved = safeStorage.getItem('ruggyConfig');
        if (saved) {
            const parsed = JSON.parse(saved);
            CONFIG = { ...CONFIG, ...parsed };
        }
    } catch (e) {}

    // Appearance / effects defaults (admin panel > Appearance & Effects)
    CONFIG.ui = Object.assign({
        neonLevel: 'normal',        // 'soft' | 'normal' | 'max'
        breathe: true,              // page-title breathing pulse
        rainOnZero: true,           // money rain when timer hits 00:00
        rainDurationSec: 60,
        rainMaxBills: 40,
        rainBillWidth: 124,
        rainImage: ''               // empty = MoneyRain.BILL_IMAGE default
    }, CONFIG.ui || {});

    // Site metrics & rules (admin panel > 📊 Rules & Metrics).
    // EVERY number the website mentions in prose/tooltips binds to these via
    // [data-m] spans, and the JS rules read them too — change once, updates
    // everywhere. Splits + thresholds reuse their existing CONFIG fields.
    CONFIG.metrics = Object.assign({
        holderShutoff: 500,            // auto-distribution stops after N STAKERS (key name kept for saved-config compat)
        distributionEnabled: true,     // manual master shutoff
        roiTakeProfit: 200,            // % ROI that opens the take-profit window
        roiSafeSellPct: 50,            // % you may take in that window
        lockedBanSellPct: 30,          // selling >= this % at once = locked ban
        overholdPct: 3,                // holding > this % of supply = temp ban
        hallTopShown: 12,              // rows in Top Holders
        hallLongestShown: 12,          // rows in Longest Holders
        hallBagworkersShown: 5,        // bagworker slots
        wallShown: 25,                 // wall rows per view
        absolutionStakePct: 20,        // stake % of pulled value
        absolutionLockDays: 1,
        lotteryDailyTime: '8:00 PM UTC',
        lotteryWeeklyDay: 'Sunday',
        lotteryWeeklyTime: '8:00 PM UTC',
        freeTicketCooldownHours: 24,
        // Lottery draw schedule labels (shown under the jackpot)
        miniDrawLabel: 'Today • 8:00 PM UTC',
        bigDrawLabel: 'Sunday • 8:00 PM UTC',
        // Lottery fee breakdown (% of the weekly pool)
        lottoMainPct: 80,
        lottoDailyPct: 10,
        lottoMdrPct: 10,
        lottoBurnPct: 10,
        dailyMaxOfWeeklyPct: 50,   // daily lottery max winnings = 50% of weekly pool
        // Post-50%-LP-lock distribution (when burns stop, fees redirect)
        postLockLiquidity: 0,
        postLockCommunity: 60,
        postLockAntiRug: 30,
        postLockCreator: 10,
        dailyTicketPrice: 3,
        weeklyTicketPrice: 6,
        consolationHigherPct: 20,   // % to the higher number-match tier
        consolationLowerPct: 10,    // % to the lower number-match tier
        consolationHigherMatch: 3,  // "match N numbers" for the higher tier
        consolationLowerMatch: 2,   // "match N numbers" for the lower tier
        lotteryWallet: ''           // dedicated lottery wallet (set in admin / from chain)
    }, CONFIG.metrics || {});

    // Chain connection (admin panel > ⛓ Chain)
    CONFIG.chain = Object.assign({
        enabled: false,
        rpc: 'https://api.devnet.solana.com',
        programId: '',
        mint: ''
    }, CONFIG.chain || {});

    // Editable site content defaults (admin panel > Site Content)
    CONFIG.content = Object.assign({
        heroTitle: 'RUGGY',
        heroSub: 'The Ultimate Anti-Rug Mascot',
        jackpotText: '$124,850',
        ticketPrice: 3
    }, CONFIG.content || {});

    // Set default distribution splits if not present (first time load)
    if (!CONFIG.distributionSplits) {
        CONFIG.distributionSplits = {
            liquidity: 40,
            antiRug: 20,
            community: 30,
            creator: 10
        };
    }

    updateHomeWalletDisplays();
}

// ===== CONFIG SYSTEM =====
// Call loadConfig immediately so CONFIG is ready for the pie chart on first load
if (typeof CONFIG !== 'undefined') {
    loadConfig();
}

function saveConfig() {
    safeStorage.setItem('ruggyConfig', JSON.stringify(CONFIG));
}


// Human-readable page titles for the tab + screen-reader announcement
const PAGE_TITLES = {
    home: 'Ruggy Rewards', tokenomics: 'Tokenomics', lore: 'Lore',
    rewards: 'Rewards', gallery: 'Gallery', hall: 'Hall of Fame',
    wall: 'Wall of Shame', pool: 'Staking Pool', absolution: 'Absolution',
    lotto: 'Lottery'
};

function navigateTo(page) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

    const targetSection = document.getElementById(page);
    
    if (targetSection) {
        targetSection.classList.add('active');
    } else {
        console.warn(`Page "${page}" not found. Redirecting to home.`);
        const homeSection = document.getElementById('home');
        if (homeSection) homeSection.classList.add('active');
    }

    // A11y: update the document title (screen readers announce page changes)
    const label = PAGE_TITLES[page] || 'Ruggy Rewards';
    document.title = page === 'home' ? 'Ruggy Rewards' : label + ' • Ruggy Rewards';

    // Always land at the top of the newly-opened page (mobile especially —
    // previously pages could appear scrolled to the middle).
    window.scrollTo(0, 0);
    // A11y: mark the section focusable and focus WITHOUT scrolling, so screen
    // readers announce the new page but the viewport stays at the top.
    const active = document.querySelector('.section.active');
    if (active) {
        active.setAttribute('tabindex', '-1');
        try { active.focus({ preventScroll: true }); } catch (_) {}
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        const isActive = link.dataset.page === page;
        link.classList.toggle('active', isActive);
        // A11y: tell screen readers which nav item is the current page
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });

    if (page === 'tokenomics') {
        // Start fetching Chart.js immediately (on-demand), then init — which
        // self-heals until the library + layout are ready.
        if (typeof ensureChartJsLoaded === 'function') ensureChartJsLoaded();
        if (typeof initTokenomicsChart === 'function') initTokenomicsChart();
    } else {
        // Leaving Tokenomics: clear any open pie-slice explanation so it
        // doesn't linger stale and reappear on the next visit.
        const exp = document.getElementById('pie-explanation');
        if (exp) exp.style.display = 'none';
    }

    if (page === 'lotto') {
        // Start live SOL price updates when visiting Lotto page
        setTimeout(() => {
            if (typeof startLottoSolPriceUpdates === 'function') {
                startLottoSolPriceUpdates();
            }
        }, 600);
    }

    // Rewards/Pool pages show the live staking-eligibility notice
    if (page === 'rewards' || page === 'pool') {
        if (typeof renderStakeNotice === 'function') renderStakeNotice();
    }
    if (page === 'pool' && typeof renderStakeDonut === 'function') {
        setTimeout(renderStakeDonut, 60);
    }
}

let liveTrackingInterval = null;

async function startLiveTracking() {
    const mint = CONFIG.tokenMint;
    if (!mint) {
        return;
    }

    if (liveTrackingInterval) {
        clearInterval(liveTrackingInterval);
    }

    await fetchAndUpdateLiveData(mint);

    liveTrackingInterval = setInterval(() => {
        fetchAndUpdateLiveData(mint);
    }, 15000);
}

async function fetchAndUpdateLiveData(mint) {
    const metricsDiv = document.getElementById('home-metrics');
    const noCaDiv = document.getElementById('home-no-ca');

    try {
        if (metricsDiv) metricsDiv.style.opacity = '0.6';

        // ---- ON-CHAIN token data via the Solana RPC (same data Solana Explorer
        // shows). Works on devnet, where there's no DEX/price yet. ----
        const rpc = (window.RuggyChain && RuggyChain.settings && RuggyChain.settings.rpc)
            ? RuggyChain.settings.rpc : 'https://api.devnet.solana.com';
        const cluster = /devnet/.test(rpc) ? 'devnet' : /testnet/.test(rpc) ? 'testnet' : 'mainnet';

        // getTokenSupply returns uiAmount + decimals for the mint
        const res = await fetch(rpc, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0', id: 1, method: 'getTokenSupply', params: [mint],
            }),
        });
        const data = await res.json();
        const supplyInfo = data?.result?.value;

        if (!supplyInfo) {
            if (noCaDiv) {
                noCaDiv.innerHTML = `<p style="color:#f87171;">Couldn't read the mint on-chain. Check the CA.</p>`;
                noCaDiv.style.display = 'block';
            }
            if (metricsDiv) metricsDiv.style.display = 'none';
            return;
        }

        const supply = Number(supplyInfo.uiAmount) || 0;
        const decimals = supplyInfo.decimals;

        // Supply where "market cap" used to be
        const mcEl = document.getElementById('home-market-cap');
        if (mcEl) {
            mcEl.textContent = supply > 0
                ? (supply >= 1e6 ? `${(supply / 1e6).toFixed(2)}M` : supply.toLocaleString())
                : "—";
        }

        // Price / volume don't exist on devnet (no DEX) — show a clear placeholder
        const priceEl = document.getElementById('home-price');
        if (priceEl) priceEl.textContent = "— (devnet)";
        const volumeEl = document.getElementById('home-volume');
        if (volumeEl) volumeEl.textContent = "— (devnet)";

        // Explorer link — point the CA / token name area at Solana Explorer
        const explorerUrl = `https://explorer.solana.com/address/${mint}?cluster=${cluster}`;
        const caLink = document.getElementById('home-explorer-link');
        if (caLink) { caLink.href = explorerUrl; caLink.style.display = 'inline-block'; }

        if (metricsDiv) {
            metricsDiv.style.display = 'block';
            metricsDiv.style.opacity = '1';
        }
        if (noCaDiv) noCaDiv.style.display = 'none';

    } catch (err) {
        if (metricsDiv) metricsDiv.style.display = 'none';
        if (noCaDiv) {
            noCaDiv.innerHTML = `
                <p style="color:#f87171;">Failed to load on-chain token data.</p>
                <button id="start-live-tracking-btn" data-action="startLiveTracking" class="buy-button" style="max-width:160px; margin-top:12px; padding:10px 16px; font-size:13px;">
                    Retry
                </button>
            `;
            noCaDiv.style.display = 'block';
        }
    }
}

window.addEventListener('load', () => {
    if (CONFIG.tokenMint) {
        setTimeout(() => {
            startLiveTracking();
        }, 1000);
    }

    // Ensure pie chart loads on initial page load if Tokenomics is active
    setTimeout(() => {
        const tokenomicsActive = document.getElementById('tokenomics')?.classList.contains('active');
        if (tokenomicsActive && typeof initTokenomicsChart === 'function') {
            initTokenomicsChart();
        }
    }, 1200);
});

async function buyOnPumpFun() {
    const mint = document.getElementById('ca-input')?.value.trim() || CONFIG.tokenMint;
    if (!mint) {
        showToast("Please enter a token CA first", "error");
        return;
    }
    if (await showConfirm(
        "Open <strong>pump.fun</strong> in a new tab to buy $RUGGY?<br><br>" +
        "<span style='color:#9ca3af;font-size:13px;'>You'll complete the purchase on pump.fun with your connected wallet.</span>",
        { okText: 'Open pump.fun' })) {
        window.open(`https://pump.fun/${mint}`, '_blank');
    }
}

let claimHistory = [];

async function claimFromVault() {
    if (!window.ruggyWallet || !window.ruggyWallet.connected) {
        showToast("Please connect your wallet first using the Connect Wallet button.", "error");
        return;
    }

    const mint = CONFIG.tokenMint;
    if (!mint) {
        showToast("Token CA is not set. Please set it in the Developer panel first.", "error");
        return;
    }

    // Read live pending rewards so the confirm dialog shows the real amount.
    let pendingMsg = "This will claim your eligible rewards from <strong>both</strong> the Community and Anti-Rug vaults in one transaction.";
    if (window.RuggyChain && RuggyChain.isConfigured && RuggyChain.isConfigured() && window.ruggyWallet?.publicKey) {
        try {
            const [pos, cfg] = await Promise.all([
                RuggyChain.stakeOf(window.ruggyWallet.publicKey.toString()),
                RuggyChain.config(),
            ]);
            if (pos) {
                const antiReq = cfg ? Number(cfg.antirugThreshold) : 0;
                const pc = Number(pos.pendingCommunity) / 1e6;
                const pa = (Number(pos.amount) >= antiReq) ? Number(pos.pendingAntirug) / 1e6 : 0;
                const fmtN = (n) => Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
                if (pc > 0 || pa > 0) {
                    pendingMsg = `Claim <strong>${fmtN(pc + pa)}</strong> $RUGGY from your vaults:<br>` +
                        `<span style="color:#86efac;">Community ${fmtN(pc)} + Anti-Rug ${fmtN(pa)}</span><br><br>` +
                        `<span style="color:#9ca3af;font-size:13px;">Both vaults are claimed in a single transaction.</span>`;
                } else {
                    pendingMsg = "You have <strong>no rewards pending</strong> right now. Rewards accrue as transfer fees are distributed — check back after the next distribution.";
                }
            }
        } catch (_) { /* keep default msg */ }
    }

    const confirmed = await showConfirm(pendingMsg, { okText: 'Claim Rewards' });

    if (confirmed) {
        // ON-CHAIN claim_distribution
        if (window.RuggyChain && RuggyChain.isConfigured && RuggyChain.isConfigured()) {
            try {
                const pools = window.ruggyRewardPools || {};
                if (!pools.communityAta || !pools.antirugAta) {
                    showToast("Reward pools not loaded", "error", "Pool accounts aren't available yet — try again shortly.");
                    return;
                }
                showToast("Confirm in your wallet…", "success", "Claiming your rewards on-chain.");
                const sig = await RuggyChain.tx.claimRewards(pools.communityAta, pools.antirugAta);
                claimHistory.unshift({ date: new Date().toLocaleString(), amount: 0, type: "Distribution", tx: String(sig).slice(0, 12) + "…" });
                if (claimHistory.length > 8) claimHistory.pop();
                renderClaimHistory();
                try { await RuggyChain.refreshUI(); } catch (_) {}
                showToast("Rewards claimed on-chain ✓", "success", "Tx: " + String(sig).slice(0, 8) + "…");
                return;
            } catch (e) {
                showToast("Claim failed", "error", (e && e.message) ? e.message : "Transaction rejected.");
                return;
            }
        }

        const amount = Math.floor(Math.random() * 85000) + 15000;
        const newClaim = {
            date: new Date().toLocaleString(),
            amount: amount,
            type: Math.random() > 0.6 ? "Community" : "Anti-Rug",
            tx: "Simulated-" + Date.now().toString().slice(-8)
        };

        claimHistory.unshift(newClaim);
        if (claimHistory.length > 8) claimHistory.pop();

        renderClaimHistory();
        
        showToast("Claim Successful!", "success", `You claimed ${amount.toLocaleString()} $RUGGY from the vault \u2022 Tx: ${newClaim.tx}`);
    }
}

function renderClaimHistory() {
    const tbody = document.getElementById('claim-history-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (claimHistory.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="4" style="padding: 20px; text-align: center; color: #6b7280;">
                No claims yet. Be the first to claim from the vault!
            </td>
        `;
        tbody.appendChild(row);
        return;
    }

    claimHistory.forEach(claim => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #374151';
        row.innerHTML = `
            <td style="padding: 10px; font-size: 12px;">${claim.date}</td>
            <td style="padding: 10px; color: #22c55e; font-weight: bold;">${claim.amount.toLocaleString()} $RUGGY</td>
            <td style="padding: 10px;">
                <span style="background: ${claim.type === 'Community' ? '#1e3a8a' : '#166534'}; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
                    ${claim.type}
                </span>
            </td>
            <td style="padding: 10px; font-family: monospace; font-size: 11px; color: #60a5fa;">
                ${claim.tx}
            </td>
        `;
        tbody.appendChild(row);
    });
}

window.addEventListener('load', () => {
    if (claimHistory.length === 0) {
        claimHistory = [
            {
                date: new Date(Date.now() - 1000 * 60 * 45).toLocaleString(),
                amount: 67200,
                type: "Anti-Rug",
                tx: "Sim-28491a3f"
            },
            {
                date: new Date(Date.now() - 1000 * 60 * 120).toLocaleString(),
                amount: 34100,
                type: "Community",
                tx: "Sim-9b2e7c1d"
            }
        ];
    }
    renderClaimHistory();
});

let rewardsPaused = false;

function toggleRewardsPause() {
    rewardsPaused = !rewardsPaused;
    const btn = document.getElementById('pause-rewards-btn');
    const timerEl = document.getElementById('nav-timer');
    
    if (rewardsPaused) {
        btn.textContent = "▶ Resume Rewards";
        btn.style.background = "linear-gradient(to right, #22c55e, #16a34a)"; // Green for Resume
        if (timerEl) {
            timerEl.textContent = "PAUSED";
            timerEl.style.color = "#ef4444";
        }
        if (window.rewardTimerInterval) {
            clearInterval(window.rewardTimerInterval);
            window.rewardTimerInterval = null;
        }
    } else {
        btn.textContent = "⏸ Pause Rewards";
        btn.style.background = "#ef4444"; // Red for Pause
        if (timerEl) timerEl.style.color = "#f59e0b";
        startSimpleTimer();
    }
}

function startSimpleTimer(retryCount = 0) {
    const timerEl = document.getElementById('nav-timer');
    const barFill = document.getElementById('timer-bar-fill');
    const lambo = document.getElementById('timer-lambo');
    const timerContainer = document.getElementById('timer-bar-container');
    
    // If elements are missing, retry a few times
    if (!timerEl || !barFill || !lambo || !timerContainer) {
        if (retryCount < 8) {
            setTimeout(() => startSimpleTimer(retryCount + 1), 120);
        } else {
            console.warn('[Timer] Timer elements still missing after retries');
        }
        return;
    }

    // Clear any existing interval
    if (window.rewardTimerInterval) {
        clearInterval(window.rewardTimerInterval);
    }

    // Manual master shutoff (admin > Rules & Metrics)
    if (typeof CONFIG !== 'undefined' && CONFIG.metrics && CONFIG.metrics.distributionEnabled === false) {
        const tEl = document.getElementById('distribution-timer') || document.getElementById('reward-timer');
        if (tEl) tEl.textContent = 'PAUSED';
        return;
    }

    // === TIMER HONORS THE ADMIN-SET INTERVAL ===
    // Duration comes from CONFIG.distributionIntervalMinutes (dev panel).
    // If an explicit future target exists (admin just applied a new
    // interval), count down to it; otherwise start a fresh full interval.
    const now = Date.now();
    const intervalMinutes = (typeof CONFIG !== 'undefined' && CONFIG.distributionIntervalMinutes) || 30;
    const durationMs = intervalMinutes * 60 * 1000;

    let targetTime = now + durationMs;
    if (typeof CONFIG !== 'undefined' && CONFIG.nextDistributionTime) {
        const saved = new Date(CONFIG.nextDistributionTime).getTime();
        if (saved > now && saved <= now + durationMs) {
            targetTime = saved;
        }
    }
    if (typeof CONFIG !== 'undefined') {
        CONFIG.nextDistributionTime = new Date(targetTime).toISOString();
    }


    window.rewardTimerInterval = setInterval(() => {
        if (typeof rewardsPaused !== 'undefined' && rewardsPaused) {
            return;
        }

        const currentNow = Date.now();
        const remainingMs = Math.max(0, targetTime - currentNow);

        const totalDuration = durationMs; // progress scales to the configured interval

        const progress = Math.max(0, Math.min(100, (remainingMs / totalDuration) * 100));

        const totalSeconds = Math.floor(remainingMs / 1000);
        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;

        timerEl.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;

        // Update visual bar and sprite
        barFill.style.width = `${progress}%`;
        lambo.style.left = `${progress}%`;

        // Neon green glow when under 2 minutes
        if (remainingMs < 120000 && remainingMs > 1000) {
            timerContainer.style.boxShadow = '0 0 22px #22c55e, 0 0 40px #16a34a';
            timerContainer.style.borderColor = '#22c55e';
            lambo.style.boxShadow = '0 0 18px #22c55e, 0 0 30px #16a34a';
        } else {
            timerContainer.style.boxShadow = '0 0 12px rgba(251, 191, 36, 0.5)';
            timerContainer.style.borderColor = '#fbbf24';
            lambo.style.boxShadow = 'none';
        }

        if (remainingMs <= 1000) {
            lambo.style.left = "12%";
            barFill.style.width = "0%";
            timerEl.textContent = "00:00";

            // 💵 Distribution moment: make it rain (admin-toggleable)
            if (typeof MoneyRain !== 'undefined' && (!CONFIG.ui || CONFIG.ui.rainOnZero !== false)) {
                MoneyRain.start();
            }

            // Auto-restart after a short pause (fresh full interval)
            clearInterval(window.rewardTimerInterval);
            window.rewardTimerInterval = null;
            if (typeof CONFIG !== 'undefined') CONFIG.nextDistributionTime = null;

            setTimeout(() => {
                if (typeof startSimpleTimer === 'function') {
                    startSimpleTimer();
                }
            }, 2500); // 2.5 second pause before next round
        }

    }, 300);
}

// When a backgrounded tab becomes visible again, browsers may have throttled
// the 300ms interval. The countdown is wall-clock based so the NUMBER is always
// right, but force an immediate restart so the bar/sprite snap to correct without
// waiting for the next throttled tick.
if (typeof document !== 'undefined' && !window.__ruggyVisHandler) {
    window.__ruggyVisHandler = true;
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && typeof startSimpleTimer === 'function'
            && !(typeof rewardsPaused !== 'undefined' && rewardsPaused)) {
            startSimpleTimer();
        }
    });
}

// Force start timer reliably on page load
// One entry point. startSimpleTimer self-heals (retries until its DOM elements
// exist) and is idempotent (clears any prior interval first), so a single call
// once the DOM is ready is sufficient — no staggered setTimeout nets needed.
function forceStartDistributionTimer() {
    if (typeof startSimpleTimer === 'function') startSimpleTimer();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceStartDistributionTimer);
} else {
    forceStartDistributionTimer();
}

function updateSplitPercentages() {
    const liq = parseInt(document.getElementById('dev-liq-percent').value) || 0;
    const anti = parseInt(document.getElementById('dev-antirug-percent').value) || 0;
    const comm = parseInt(document.getElementById('dev-community-percent').value) || 0;
    const creator = parseInt(document.getElementById('dev-creator-percent').value) || 0;

    const total = liq + anti + comm + creator;

    document.getElementById('liq-percent').textContent = liq;
    document.getElementById('antirug-percent').textContent = anti;
    document.getElementById('community-percent').textContent = comm;
    document.getElementById('creator-percent').textContent = creator;
    document.getElementById('split-total').textContent = total;

    const warning = document.getElementById('split-warning');
    if (warning) {
        warning.style.display = (total === 100) ? 'none' : 'inline';
    }
}

function applySocialLinks() {
    const xLink = document.getElementById('social-x');
    const telegramLink = document.getElementById('social-telegram');
    const dexscreenerLink = document.getElementById('social-dexscreener');
    const pumpfunLink = document.getElementById('social-pumpfun');

    if (xLink && CONFIG.socialX) xLink.href = CONFIG.socialX;
    if (telegramLink && CONFIG.socialTelegram) telegramLink.href = CONFIG.socialTelegram;
    if (dexscreenerLink && CONFIG.socialDexscreener) dexscreenerLink.href = CONFIG.socialDexscreener;
    if (pumpfunLink && CONFIG.socialPumpfun) pumpfunLink.href = CONFIG.socialPumpfun;
}

function updateHomeWalletDisplays() {
    const infoBox = document.getElementById('home-distribution-info');
    if (!infoBox) return;

    const splits = CONFIG.distributionSplits || { liquidity: 40, antiRug: 20, community: 30, creator: 10 };

    const liqEl = document.getElementById('home-liq-split');
    const antiEl = document.getElementById('home-antirug-split');
    const commEl = document.getElementById('home-community-split');
    const creatorEl = document.getElementById('home-creator-split');

    if (liqEl) liqEl.textContent = splits.liquidity;
    if (antiEl) antiEl.textContent = splits.antiRug;
    if (commEl) commEl.textContent = splits.community;
    if (creatorEl) creatorEl.textContent = splits.creator;

    const devEl = document.getElementById('home-dev-wallet');
    const creatorWalletEl = document.getElementById('home-creator-wallet');
    const burnEl = document.getElementById('home-burn-wallet');

    if (devEl) devEl.textContent = CONFIG.devWallet || "Not set";
    if (creatorWalletEl) creatorWalletEl.textContent = CONFIG.creatorWallet || "Not set";
    if (burnEl) burnEl.textContent = CONFIG.burnWallet || "Not set";

    if (CONFIG.tokenMint || CONFIG.devWallet || CONFIG.creatorWallet || CONFIG.burnWallet) {
        infoBox.style.display = 'block';
    }
}

async function checkRewardsEligibility() {
    const caDisplay = document.getElementById('rewards-token-ca');
    const walletInfo = document.getElementById('wallet-info');
    const eligibilityMsg = document.getElementById('eligibility-message');

    if (!CONFIG.tokenMint) {
        showToast("Please set the Token CA in the Developer panel first.", "error");
        return;
    }

    if (caDisplay) caDisplay.textContent = CONFIG.tokenMint;

    // Use the already-connected wallet if present; otherwise prompt to connect.
    let walletAddress = null;
    const existing = (window.ruggyWallet && window.ruggyWallet.connected && window.ruggyWallet.publicKey)
        ? window.ruggyWallet.publicKey.toString() : null;

    if (existing) {
        walletAddress = existing;
    } else if (window.solana) {
        showToast("Connect your wallet to check eligibility", "info");
        try {
            const resp = await window.solana.connect();
            walletAddress = resp.publicKey.toString();
        } catch (err) {
            showToast("Wallet connection was cancelled.", "error",
                "Connect your wallet to see your reward eligibility.");
            return;
        }
    } else {
        showToast("No Solana wallet found", "error",
            "Install Phantom, Solflare, or Backpack, then tap Check Eligibility again.");
        return;
    }

    if (!walletInfo || !eligibilityMsg) return;

    walletInfo.style.display = 'block';
    const addrEl = document.getElementById('wallet-address');
    if (addrEl) addrEl.textContent = walletAddress.slice(0,4) + "..." + walletAddress.slice(-4);

    // ---- LIVE eligibility from chain when configured ----
    let e;
    if (window.RuggyChain && RuggyChain.isConfigured && RuggyChain.isConfigured()) {
        try {
            const [pos, ban, cfg] = await Promise.all([
                RuggyChain.stakeOf(walletAddress),
                RuggyChain.banOf(walletAddress),
                RuggyChain.config(),
            ]);
            const staked = pos ? Number(pos.amount) / 1e6 : 0;
            const communityReq = cfg ? Number(cfg.communityThreshold) / 1e6 : 500000;
            const antiRugReq = cfg ? Number(cfg.antirugThreshold) / 1e6 : 1000000;
            const banned = ban ? { type: (Number(ban.ruggedUsd) > 0 ? 'Locked' : 'Temporary'), reason: ban.reason || 'On the Wall' } : null;
            e = {
                connected: true, wallet: walletAddress, staked, communityReq, antiRugReq,
                community: staked >= communityReq, antiRug: staked >= antiRugReq, banned,
                pendingCommunity: pos ? Number(pos.pendingCommunity) / 1e6 : 0,
                pendingAntirug: pos ? Number(pos.pendingAntirug) / 1e6 : 0,
                toCommunity: Math.max(0, communityReq - staked),
                toAntiRug: Math.max(0, antiRugReq - staked),
            };
        } catch (err) {
            e = getStakeEligibility(); // fallback
        }
    } else {
        e = getStakeEligibility();
    }

    const staked = e.staked;
    const communityReq = e.communityReq;
    const antiRugReq = e.antiRugReq;
    const fmt = (n) => Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });

    const balEl = document.getElementById('wallet-balance');
    if (balEl) balEl.textContent = fmt(staked) + " $RUGGY staked";
    const supEl = document.getElementById('supply-percentage');
    if (supEl) supEl.textContent = (staked > 0 ? ((staked / 1000000000) * 100).toFixed(3) : '0.000') + "% of supply";

    eligibilityMsg.style.display = 'block';

    if (e.banned) {
        eligibilityMsg.style.borderLeft = '5px solid ' + (e.banned.type === 'Locked' ? '#ef4444' : '#fbbf24');
        eligibilityMsg.style.background = e.banned.type === 'Locked' ? '#3f1f1f' : '#3f2a1f';
        if (e.banned.type === "Locked") {
            eligibilityMsg.innerHTML = `
                <strong style="color:#ef4444; font-size:15px;">🚫 LOCKED BAN</strong><br><br>
                You are on Ruggy's Wall. <strong>Banned wallets do not receive rewards and cannot participate in the Lottery.</strong><br>
                You can still buy $RUGGY, but you must clear your ban on the <strong>Absolution</strong> page first.<br><br>
                <span style="color:#f87171;">Reason: ${escapeHTML(e.banned.reason)}</span>
            `;
        } else {
            eligibilityMsg.innerHTML = `
                <strong style="color:#fbbf24; font-size:15px;">⚠️ TEMPORARILY BANNED</strong><br><br>
                <strong>Banned wallets do not receive rewards and cannot participate in the Lottery.</strong><br>
                Reduce your holdings below <strong><span data-m="overholdPct" data-fmt="pct">3%</span></strong> of supply <em>and</em> meet the stake requirement to requalify.<br><br>
                <span style="color:#f87171;">Reason: ${escapeHTML(e.banned.reason)}</span>
            `;
        }
        applyMetricsToNode(eligibilityMsg);
        return;
    }

    if (e.antiRug) {
        eligibilityMsg.style.borderLeft = '5px solid #22c55e';
        eligibilityMsg.style.background = '#052e16';
        const pendingLine = (e.pendingCommunity != null && (e.pendingCommunity > 0 || e.pendingAntirug > 0))
            ? `<br><br><span style="color:#86efac;">💰 Claimable now: <strong>${fmt(e.pendingCommunity + e.pendingAntirug)}</strong> $RUGGY (Community ${fmt(e.pendingCommunity)} + Anti-Rug ${fmt(e.pendingAntirug)})</span>`
            : (e.pendingCommunity != null ? `<br><br><span style="color:#9ca3af;">No rewards pending yet — they accrue as fees are distributed.</span>` : '');
        eligibilityMsg.innerHTML = `
            <strong style="color:#22c55e;">✅ Fully Eligible for Anti-Rug Rewards!</strong><br><br>
            You are <strong>staking ${fmt(staked)}</strong> $RUGGY.<br>
            You qualify for <strong>Community</strong> + <strong>Anti-Rug</strong> rewards = the full reward tier.${pendingLine}
        `;
    } else if (e.community) {
        eligibilityMsg.style.borderLeft = '5px solid #eab308';
        eligibilityMsg.style.background = '#3f2a1f';
        const pendingLine = (e.pendingCommunity != null && e.pendingCommunity > 0)
            ? `<br><br><span style="color:#fde68a;">💰 Claimable now: <strong>${fmt(e.pendingCommunity)}</strong> $RUGGY (Community)</span>`
            : '';
        eligibilityMsg.innerHTML = `
            <strong style="color:#fbbf24;">✅ Eligible for Community Rewards</strong><br><br>
            You are <strong>staking ${fmt(staked)}</strong> $RUGGY.<br>
            Stake <strong>${fmt(e.toAntiRug)}</strong> more (total ${fmt(antiRugReq)}) to also unlock <strong>Anti-Rug</strong> rewards.${pendingLine}
        `;
    } else {
        eligibilityMsg.style.borderLeft = '5px solid #ef4444';
        eligibilityMsg.style.background = '#3f1f1f';
        eligibilityMsg.innerHTML = `
            <strong style="color:#f87171;">❌ Not Staking Enough Yet</strong><br><br>
            You are <strong>staking ${fmt(staked)}</strong> $RUGGY.<br>
            <strong>Not having enough staked disqualifies you from receiving rewards</strong> until you reach the required stake.<br>
            Stake at least <strong>${fmt(communityReq)}</strong> for Community rewards, or <strong>${fmt(antiRugReq)}</strong> for full Anti-Rug rewards.<br>
            <a data-action="navigate" data-page="pool" style="color:#60a5fa; cursor:pointer; text-decoration:underline;">Go to the Pool page to stake →</a>
        `;
    }
}

// Re-bind any data-m spans that were injected via innerHTML
function applyMetricsToNode(node) {
    if (!node || typeof metricsView !== 'function') return;
    const view = metricsView();
    node.querySelectorAll('[data-m]').forEach((el) => {
        const k = el.dataset.m;
        if (view[k] === undefined || view[k] === null) return;
        const f = el.dataset.fmt || 'raw';
        el.textContent = f === 'pct' ? view[k] + '%' : f === 'usd' ? '$' + Number(view[k]).toLocaleString() : f === 'num' ? Number(view[k]).toLocaleString() : view[k];
    });
}

async function connectDevWalletForHome() {
    if (!window.solana) {
        showToast("Please install a Solana wallet (Phantom, Solflare, etc.)", "error");
        return;
    }
    try {
        const response = await window.solana.connect();
        const devWalletAddress = response.publicKey.toString();
        CONFIG.devWallet = devWalletAddress;
        saveConfig();
        
        const display = document.getElementById('dev-wallet-display');
        if (display) display.textContent = devWalletAddress;
        
        updateHomeWalletDisplays();
    } catch (err) {
        showToast("Failed to connect dev wallet", "error");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
    applySiteSettings();

    // ==================== DYNAMIC NAV PADDING (Includes Wallet Bar when visible) ====================
    function updateDynamicNavPadding() {
        const mainNav = document.querySelector('nav');
        const walletBar = document.getElementById('wallet-connect-bar');

        let totalHeight = 0;

        if (mainNav) {
            totalHeight += mainNav.offsetHeight;
        }

        // Add height of wallet bar only if it's currently visible
        if (walletBar && walletBar.style.display === 'block') {
            totalHeight += walletBar.offsetHeight;
        }

        // Small safety buffer
        totalHeight += 10;

        document.documentElement.style.setProperty('--nav-height', totalHeight + 'px');
    }

    // Run on load + after everything settles
    updateDynamicNavPadding();
    setTimeout(updateDynamicNavPadding, 300);
    setTimeout(updateDynamicNavPadding, 800);
    setTimeout(updateDynamicNavPadding, 1500);

    // Update on resize (important for mobile orientation changes)
    let navResizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(navResizeTimer);
        navResizeTimer = setTimeout(updateDynamicNavPadding, 150);
    });

    // Also update when wallet bar visibility might change
    const walletBarObserver = new MutationObserver(() => {
        updateDynamicNavPadding();
    });
    const walletBarEl = document.getElementById('wallet-connect-bar');
    if (walletBarEl) {
        walletBarObserver.observe(walletBarEl, { attributes: true, attributeFilter: ['style'] });
    }

    // Re-run after navigation (in case layout shifts)
    const originalNavigateToForPadding = window.navigateTo;
    if (originalNavigateToForPadding) {
        window.navigateTo = function(page) {
            originalNavigateToForPadding(page);
            setTimeout(updateDynamicNavPadding, 200);
        };
    }

    // Final safety call after everything settles
    setTimeout(updateDynamicNavPadding, 1500);


    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // don't let the tap reach the backdrop/close handlers
            // Close the menu FIRST (idempotent, no toggle race), then navigate.
            if (typeof closeMobileMenu === 'function') closeMobileMenu();
            // IMPORTANT: call window.navigateTo (the final wrapped version),
            // not the bare hoisted original, so only ONE nav implementation runs.
            if (link.dataset.page) window.navigateTo(link.dataset.page);
        });
    });

    const playSpriteVideo = () => {
        const vid = document.getElementById('timer-video');
        if (vid) {
            vid.play().catch(() => {});
        }
        document.removeEventListener('click', playSpriteVideo);
        document.removeEventListener('touchstart', playSpriteVideo);
    };
    document.addEventListener('click', playSpriteVideo, { once: true });
    document.addEventListener('touchstart', playSpriteVideo, { once: true });

    applySocialLinks();

    // === FRESH DISTRIBUTION TIMER ON PAGE LOAD (admin-configured interval) ===
    (function initializeDistributionTimer() {
        const now = Date.now();
        const minutes = CONFIG.distributionIntervalMinutes || 30;
        CONFIG.nextDistributionTime = new Date(now + (minutes * 60 * 1000)).toISOString();

        // Start the countdown (self-healing + idempotent, no delay needed)
        if (typeof startSimpleTimer === 'function') startSimpleTimer();
    })();

    updateHomeWalletDisplays();
    (window.navigateTo || navigateTo)('home');

    setTimeout(() => {
        if (document.getElementById('tokenomics')?.classList.contains('active')) {
            if (typeof initTokenomicsChart === 'function') {
                setTimeout(() => {
                    initTokenomicsChart();
                }, 450);
            }
        }
    }, 1200);

    initRuggyHall();
});

// Render the Hall (Top Holders / Top Stakers tables) from LIVE on-chain stake
// accounts. Called by the chain refresh; replaces the random demo data. Because
// the program tracks staked amounts (not raw wallet balances), both tables are
// driven by stake size — "top stakers" is exact; "top holders" uses the same
// live set (holders that stake) since wallet token balances aren't enumerable
// cheaply on devnet.
function setHallFromChain(stakers) {
    if (!Array.isArray(stakers)) return;
    const fmtM = (base) => (Number(base) / 1e6 / 1e6).toFixed(2); // base units -> millions
    const shorten = (w) => w.length > 12 ? w.slice(0, 4) + '...' + w.slice(-4) : w;

    const topN = (CONFIG.metrics?.hallTopShown) || 12;
    const longN = (CONFIG.metrics?.hallLongestShown) || 12;

    const topHoldersBody = document.getElementById('top-holders-table');
    if (topHoldersBody) {
        topHoldersBody.innerHTML = '';
        if (!stakers.length) {
            topHoldersBody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#6b7280;padding:12px;">No stakers yet</td></tr>';
        } else {
            stakers.slice(0, topN).forEach((s, i) => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${i + 1}</td><td>${shorten(s.wallet)}</td><td>${fmtM(s.staked)}M</td>`;
                topHoldersBody.appendChild(row);
            });
        }
    }

    const longestBody = document.getElementById('longest-holders-table');
    if (longestBody) {
        longestBody.innerHTML = '';
        if (!stakers.length) {
            longestBody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#6b7280;padding:12px;">No stakers yet</td></tr>';
        } else {
            stakers.slice(0, longN).forEach((s, i) => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${i + 1}</td><td>${shorten(s.wallet)}</td><td>🔒 ${fmtM(s.staked)}M</td>`;
                longestBody.appendChild(row);
            });
        }
    }
    if (typeof renderBagworkers === 'function') renderBagworkers();
}
window.setHallFromChain = setHallFromChain;

function initRuggyHall() {
    // If live chain stakers are available, use them instead of demo data.
    if (Array.isArray(window.ruggyChainStakers)) {
        setHallFromChain(window.ruggyChainStakers);
        return;
    }
    let holdersPool = [];
    for (let i = 0; i < 200; i++) {
        holdersPool.push({
            wallet: "0x" + Math.random().toString(16).substr(2, 8) + "..." + Math.random().toString(16).substr(2, 4),
            balance: Math.random() * 12 + 0.05,
            daysHeld: Math.floor(Math.random() * 220) + 3,
            staked: Math.random() * 8 + 0.1   // millions of $RUGGY locked
        });
    }

    const topHolders = [...holdersPool]
        .sort((a, b) => b.balance - a.balance)
        .slice(0, (CONFIG.metrics?.hallTopShown) || 12);

    const topHoldersBody = document.getElementById('top-holders-table');
    if (topHoldersBody) {
        topHoldersBody.innerHTML = '';
        topHolders.forEach((holder, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${holder.wallet}</td>
                <td>${holder.balance.toFixed(2)}M</td>
            `;
            topHoldersBody.appendChild(row);
        });
    }

    const longestHolders = [...holdersPool]
        .sort((a, b) => b.staked - a.staked)
        .slice(0, (CONFIG.metrics?.hallLongestShown) || 12);

    const longestBody = document.getElementById('longest-holders-table');
    if (longestBody) {
        longestBody.innerHTML = '';
        longestHolders.forEach((holder, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${holder.wallet}</td>
                <td>🔒 ${holder.staked.toFixed(2)}M</td>
            `;
            longestBody.appendChild(row);
        });
    }

    renderBagworkers();
}

async function scanWalletForHall() {
    const input = document.getElementById('hall-monitor-input');
    const resultDiv = document.getElementById('hall-scan-result');
    if (!resultDiv) return;

    // Prefer the connected wallet; fall back to a typed address.
    const connected = (window.ruggyWallet && window.ruggyWallet.connected && window.ruggyWallet.publicKey)
        ? window.ruggyWallet.publicKey.toString() : null;
    let wallet = connected || (input && input.value.trim());

    if (!wallet) {
        showToast("Connect your wallet or enter an address", "error",
            "Connect your wallet to check your own Hall standing.");
        if (typeof showWalletModal === 'function' && !input?.value) showWalletModal();
        return;
    }

    // ---- LIVE: pull real on-chain stake + the live stakers list (the Hall) ----
    if (window.RuggyChain && RuggyChain.isConfigured && RuggyChain.isConfigured()) {
        resultDiv.innerHTML = '<p style="color:#9ca3af;">Checking the chain…</p>';
        resultDiv.style.display = 'block';
        try {
            // ensure we have the latest stakers list
            let stakers = window.ruggyChainStakers;
            if (!Array.isArray(stakers)) {
                if (typeof RuggyChain.allStakers === 'function') {
                    stakers = await RuggyChain.allStakers();
                } else {
                    stakers = [];
                }
            }

            // this wallet's real staked total (base units -> tokens)
            const pos = await RuggyChain.stakeOf(wallet);
            const stakedTokens = pos ? Number(pos.amount) / 1e6 : 0;

            // rank within the live stakers list
            const idx = stakers.findIndex(s => s.wallet === wallet);
            const rank = idx >= 0 ? idx + 1 : null;
            const topN = (CONFIG.metrics?.hallTopShown) || 12;
            const inHall = rank !== null && rank <= topN;

            // thresholds from live config (anti-rug = top staker tier)
            let antirugReq = 1000000, communityReq = 500000;
            try {
                const cfg = await RuggyChain.config();
                if (cfg) { antirugReq = Number(cfg.antirugThreshold) / 1e6; communityReq = Number(cfg.communityThreshold) / 1e6; }
            } catch (_) {}

            let verdict, color;
            if (inHall && stakedTokens >= antirugReq) { verdict = `🏆 IN THE HALL — rank #${rank} staker, Anti-Rug tier!`; color = "#fbbf24"; }
            else if (inHall) { verdict = `🔒 IN THE HALL — you're rank #${rank} on the stakers board.`; color = "#60a5fa"; }
            else if (stakedTokens >= antirugReq) { verdict = "🔒 Anti-Rug tier staker — not in the top board yet, but climbing."; color = "#22c55e"; }
            else if (stakedTokens >= communityReq) { verdict = "✅ Community tier staker — stake more to reach the Hall board."; color = "#22c55e"; }
            else if (stakedTokens > 0) { verdict = "Staking, but below the Hall thresholds — keep stacking."; color = "#9ca3af"; }
            else { verdict = "Not staking yet — stake $RUGGY to enter the Hall."; color = "#9ca3af"; }

            resultDiv.innerHTML = `
                <h4 style="color: #f59e0b; margin-bottom: 12px;">${connected ? 'Your Hall Standing' : 'Wallet Check Result'}</h4>
                <p><strong>Wallet:</strong> ${escapeHTML(wallet.slice(0, 6) + '…' + wallet.slice(-6))}</p>
                <p><strong>Staked (on-chain):</strong> 🔒 ${stakedTokens.toLocaleString(undefined, {maximumFractionDigits: 0})} $RUGGY</p>
                <p><strong>Stakers-board rank:</strong> ${rank !== null ? '#' + rank + ' of ' + stakers.length : 'not ranked'}</p>
                <p style="margin-top: 10px; font-weight:bold; color: ${color};">${verdict}</p>
            `;
            resultDiv.style.display = 'block';
            return;
        } catch (e) {
            resultDiv.innerHTML = '<p style="color:#ef4444;">Could not read chain: ' + escapeHTML(e.message || String(e)) + '</p>';
            resultDiv.style.display = 'block';
            return;
        }
    }

    // Fallback (chain not configured): show a clear "connect to chain" message
    resultDiv.innerHTML = `
        <h4 style="color: #f59e0b; margin-bottom: 12px;">Hall Standing</h4>
        <p><strong>Wallet:</strong> ${escapeHTML(wallet.slice(0, 6) + '…' + wallet.slice(-6))}</p>
        <p style="margin-top:10px; color:#9ca3af;">Connect to the chain (Admin → ⛓ Chain) to see real Hall standing.</p>
    `;
    resultDiv.style.display = 'block';
}

function runAutomatedHallScan() {
    showToast("Hall scan complete", "success", "Top holders and top stakers have been refreshed.");
    initRuggyHall();
    
    const resultDiv = document.getElementById('hall-scan-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <h4 style="color: #22c55e; margin-bottom: 12px;">Automated Scan Complete</h4>
            <p>New top holders and top stakers have been updated in the tables above.</p>
        `;
        resultDiv.style.display = 'block';
    }
}

function renderBagworkers() {
    const body = document.getElementById('bagworkers-table');
    if (!body) return;

    body.innerHTML = '';
    const bagworkers = CONFIG.bagworkers || [
        "0xBagWorker1...promo",
        "0xViralRug...shill",
        "0xMoonBoy...calls",
        "0xDiamond...hands",
        "0xRuggyMaxi...alpha"
    ];

    bagworkers.forEach((name, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${name}</td>
        `;
        body.appendChild(row);
    });
}

let bannedWallets = [];

function loadBannedWall() {
    // If the chain connector already fetched live bans, use those.
    if (Array.isArray(window.ruggyChainBans)) {
        setBannedWallFromChain(window.ruggyChainBans);
        return;
    }
    try {
        const saved = safeStorage.getItem('ruggyBannedWall');
        if (saved) bannedWallets = JSON.parse(saved);
    } catch (e) {}

    if (bannedWallets.length === 0) {
        bannedWallets = [];
        const reasons = [
            "Sold 42% of holdings in one transaction",
            "Holding over 3% of total supply",
            "Sold 35% of holdings",
            "Holding 4.8% of total supply",
            "Sold 31% in a single tx"
        ];
        for (let i = 0; i < 12; i++) {
            const isLocked = Math.random() > 0.6;
            bannedWallets.push({
                wallet: "0x" + Math.random().toString(16).substr(2, 4) + "..." + Math.random().toString(16).substr(2, 4),
                reason: reasons[Math.floor(Math.random() * reasons.length)],
                type: isLocked ? "Locked" : "Temporary",
                date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 14).toISOString()
            });
        }
        saveBannedWall();
    }

    renderBannedTable();
}

function saveBannedWall() {
    try {
        safeStorage.setItem('ruggyBannedWall', JSON.stringify(bannedWallets));
    } catch (e) {}
}

// Replace the Wall's list with LIVE on-chain bans (from RuggyChain.allBans()).
// Called by the chain connector on every refresh. When the chain is the source,
// absolved wallets (ban account closed) naturally disappear from this list.
function setBannedWallFromChain(chainBans) {
    if (!Array.isArray(chainBans)) return;
    bannedWallets = chainBans.map(b => {
        const usd = Number(b.ruggedUsd) || 0;
        // permanent ("Locked") vs temporary is a display heuristic; the chain
        // only stores the ban itself. Treat any ban with a rugged-$ amount as
        // a hard ban; others as temporary (under-staked).
        return {
            wallet: b.wallet,
            reason: b.reason || 'On the Wall',
            type: usd > 0 ? 'Locked' : 'Temporary',
            ruggedUsd: usd,
            date: b.bannedAt ? new Date(Number(b.bannedAt) * 1000).toISOString() : new Date().toISOString(),
            onChain: true,
        };
    });
    if (typeof renderBannedTable === 'function') renderBannedTable();
}
window.setBannedWallFromChain = setBannedWallFromChain;

// Escape user-controlled strings before HTML interpolation (the Wall
// table previously injected wallet/reason text into innerHTML raw —
// an admin-entered string containing markup would have executed).
function escapeHTML(str) {
    return String(str ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function renderBannedTable() {
    const tbody = DOM.get('banned-table');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Total-banned counter (Wall page header)
    const counter = document.getElementById('wall-total-banned');
    if (counter) counter.textContent = bannedWallets.length.toLocaleString();

    if (bannedWallets.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" style="text-align:center; color:#9ca3af; padding:20px;">No violators detected yet.</td>`;
        tbody.appendChild(row);
        return;
    }

    bannedWallets.slice(0, (CONFIG.metrics?.wallShown) || 25).forEach((entry, index) => {
        const row = document.createElement('tr');
        const date = new Date(entry.date).toLocaleDateString();

        row.innerHTML = `
            <td>${escapeHTML(entry.wallet)}</td>
            <td style="color:#f87171;">${escapeHTML(entry.reason)}</td>
            <td>
                <span style="padding:2px 8px; border-radius:4px; font-size:11px; background:${entry.type === 'Locked' ? '#3f1f1f' : '#3f2a1f'}; color:${entry.type === 'Locked' ? '#f87171' : '#fbbf24'}">
                    ${entry.type}
                </span>
            </td>
            <td>${date}</td>
            <td>
                ${ (typeof isAdminLoggedIn === 'function' && isAdminLoggedIn()) 
                    ? `<button class="remove-from-wall-btn" data-index="${index}" style="background:#ef4444; color:white; border:none; padding:4px 10px; border-radius:4px; font-size:11px; cursor:pointer;">
                           Remove
                       </button>` 
                    : `<span style="color:#6b7280; font-size:11px;">Admin Only</span>` 
                }
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Remove buttons are re-rendered with the table, so use one delegated
// listener on the tbody instead of per-button handlers (they had none).
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.remove-from-wall-btn');
    if (btn) removeFromWall(parseInt(btn.dataset.index, 10));
});

function addToWall(wallet, reason, type) {
    const exists = bannedWallets.find(w => w.wallet === wallet);
    if (exists) {
        showToast("This wallet is already on the Wall.", "info");
        return;
    }

    bannedWallets.unshift({
        wallet: wallet,
        reason: reason,
        type: type,
        date: new Date().toISOString()
    });

    saveBannedWall();
    renderBannedTable();
}

async function removeFromWall(index) {
    // Security check: Only allow removal if user is logged in as Admin
    if (!isAdminLoggedIn()) {
        showToast("Admin access required to remove wallets from the Wall.", "error");
        return;
    }

    if (await showConfirm("Remove this wallet from the Wall?", { okText: 'Remove', danger: true })) {
        bannedWallets.splice(index, 1);
        saveBannedWall();
        renderBannedTable();
    }
}

function scanWalletForWall() {
    const input = document.getElementById('monitor-wallet-input');
    const resultDiv = document.getElementById('wall-scan-result');

    // Prefer the connected wallet; fall back to a typed address.
    const connected = (window.ruggyWallet && window.ruggyWallet.connected && window.ruggyWallet.publicKey)
        ? window.ruggyWallet.publicKey.toString() : null;
    const wallet = connected || (input && input.value.trim());

    if (!wallet) {
        showToast("Connect your wallet or enter an address", "error",
            "Connect your wallet to check your own Wall status.");
        if (typeof showWalletModal === 'function' && !input?.value) showWalletModal();
        return;
    }

    // Is THIS wallet already on the Wall?
    const entry = bannedWallets.find(b => b.wallet.toLowerCase() === wallet.toLowerCase());
    const render = (html, color) => {
        if (resultDiv) {
            resultDiv.innerHTML = html;
            resultDiv.style.display = 'block';
            resultDiv.style.borderLeft = '5px solid ' + color;
        }
    };

    if (entry) {
        const locked = entry.type === 'Locked';
        render(`
            <h4 style="color:${locked ? '#ef4444' : '#fbbf24'}; margin-bottom:10px;">
                ${locked ? '🚫 You are on the Wall — LOCKED BAN' : '⚠️ You are on the Wall — TEMPORARY BAN'}
            </h4>
            <p><strong>Wallet:</strong> ${escapeHTML(wallet.slice(0,6)+'…'+wallet.slice(-6))}</p>
            <p style="color:#f87171;"><strong>Reason:</strong> ${escapeHTML(entry.reason)}</p>
            <p style="margin-top:8px;">${locked
                ? 'Locked Ban accounts cannot receive rewards or play the Lottery. Visit the <strong>Absolution</strong> page to clear it.'
                : 'Reduce your holdings below the temporary-ban threshold to become eligible again.'}</p>
        `, locked ? '#ef4444' : '#fbbf24');
        showToast(connected ? "You are currently on the Wall" : "This wallet is on the Wall", "error");
        if (input) input.value = '';
        return;
    }

    // Not currently banned — for a typed (non-connected) address keep the
    // admin "scan for violations" behavior; for your own wallet, reassure.
    if (connected) {
        render(`
            <h4 style="color:#22c55e; margin-bottom:10px;">✅ You're in the clear</h4>
            <p><strong>Wallet:</strong> ${escapeHTML(wallet.slice(0,6)+'…'+wallet.slice(-6))}</p>
            <p style="margin-top:8px;">This wallet is not on Ruggy's Wall. Keep following the rules to stay off it.</p>
        `, '#22c55e');
        showToast("You're not on the Wall — clean!", "success");
        return;
    }

    // Admin scan path for a typed address
    const random = Math.random();
    if (random < 0.3) {
        addToWall(wallet, "Sold 37% of holdings in one transaction", "Locked");
        showToast("Violation detected! Added to Locked Wall.", "error");
    } else if (random < 0.6) {
        addToWall(wallet, "Currently holding 4.2% of total supply", "Temporary");
        showToast("Violation detected! Added to Temporary Wall.", "error");
    } else {
        showToast("No violations found. Wallet is clean.", "success");
    }
    if (input) input.value = '';
}

function runAutomatedWallScan() {
    const fakeWallets = [
        "0xA1b2...c3d4", "0xE5f6...g7h8", "0xI9j0...k1l2",
        "0xM3n4...o5p6", "0xQ7r8...s9t0"
    ];

    let added = 0;

    fakeWallets.forEach(wallet => {
        const random = Math.random();
        if (random < 0.4) {
            const type = random < 0.2 ? "Locked" : "Temporary";
            const reason = type === "Locked" 
                ? "Sold 35%+ of holdings in one tx" 
                : "Holding over 3% of supply";
            
            addToWall(wallet, reason, type);
            added++;
        }
    });

    if (added > 0) {
        showToast(`Automated scan complete. ${added} new violators added to the Wall.`, "success");
    } else {
        showToast("Automated scan complete. No new violators found.", "success");
    }
}

// (Developer modal function is now defined early in the document for maximum reliability)

// ==================== ADMIN HELPER FUNCTIONS ====================
function getAdminInputValue(id, defaultValue = '') {
    const el = document.getElementById(id);
    return el ? el.value.trim() : defaultValue;
}

// ==================== PANEL POPULATE + CONFIG TOOLS ====================
// Fills EVERY admin input from the live CONFIG when the panel opens.
// (The old loadAdminSettingsIntoPanel stub read a wrong storage key and
// only filled the CA — so Save would clobber saved settings with the
// blank defaults shown in the form.)
function populateDevPanel() {
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined && val !== null) el.value = val;
    };
    const check = (id, on) => {
        const el = document.getElementById(id);
        if (el) el.checked = !!on;
    };

    // Token & timing
    set('dev-ca', CONFIG.tokenMint);
    set('dev-interval', CONFIG.distributionIntervalMinutes);

    // Bagworkers
    (CONFIG.bagworkers || []).forEach((w, i) => set('dev-bagworker-' + (i + 1), w));

    // Splits
    const s = CONFIG.distributionSplits || {};
    set('dev-liq-percent', s.liquidity);
    set('dev-antirug-percent', s.antiRug);
    set('dev-community-percent', s.community);
    set('dev-creator-percent', s.creator);

    // Wallets + socials
    set('dev-burn-wallet', CONFIG.burnWallet);
    set('dev-creator-wallet', CONFIG.creatorWallet);
    set('dev-x-link', CONFIG.socialX);
    set('dev-telegram-link', CONFIG.socialTelegram);
    set('dev-dexscreener-link', CONFIG.socialDexscreener);
    set('dev-pumpfun-link', CONFIG.socialPumpfun);

    // Site content
    const c = CONFIG.content || {};
    set('content-hero-title', c.heroTitle);
    set('content-hero-sub', c.heroSub);
    set('content-jackpot', c.jackpotText);

    // Rules & Metrics
    const mv = CONFIG.metrics || {};
    check('m-dist-enabled', mv.distributionEnabled !== false);
    set('m-holder-shutoff', mv.holderShutoff);
    set('m-community-threshold', CONFIG.airdropThreshold);
    set('m-antirug-threshold', CONFIG.antiRugThreshold);
    set('m-roi-takeprofit', mv.roiTakeProfit);
    set('m-roi-safesell', mv.roiSafeSellPct);
    set('m-lockedban-pct', mv.lockedBanSellPct);
    set('m-overhold-pct', mv.overholdPct);
    set('m-hall-top', mv.hallTopShown);
    set('m-hall-longest', mv.hallLongestShown);
    set('m-hall-bagworkers', mv.hallBagworkersShown);
    set('m-wall-shown', mv.wallShown);
    set('m-abs-pct', mv.absolutionStakePct);
    set('m-abs-days', mv.absolutionLockDays);
    set('m-lotto-daily-time', mv.lotteryDailyTime);
    set('m-lotto-weekly-day', mv.lotteryWeeklyDay);
    set('m-lotto-weekly-time', mv.lotteryWeeklyTime);
    set('m-free-ticket-hours', mv.freeTicketCooldownHours);
    set('m-mini-draw', mv.miniDrawLabel);
    set('m-big-draw', mv.bigDrawLabel);
    set('m-lotto-mdr', mv.lottoMdrPct);
    set('m-lotto-burn', mv.lottoBurnPct);
    set('m-daily-max', mv.dailyMaxOfWeeklyPct);
    set('m-postlock-liq', mv.postLockLiquidity);
    set('m-postlock-community', mv.postLockCommunity);
    set('m-postlock-antirug', mv.postLockAntiRug);
    set('m-postlock-creator', mv.postLockCreator);
    set('m-daily-ticket-price', mv.dailyTicketPrice);
    set('m-weekly-ticket-price', mv.weeklyTicketPrice);
    set('m-consol-higher-pct', mv.consolationHigherPct);
    set('m-consol-lower-pct', mv.consolationLowerPct);
    set('m-consol-higher-match', mv.consolationHigherMatch);
    set('m-consol-lower-match', mv.consolationLowerMatch);
    set('m-lottery-wallet', mv.lotteryWallet);

    // Chain
    const ch = CONFIG.chain || {};
    check('chain-enabled', ch.enabled);
    set('chain-rpc', ch.rpc);
    set('chain-program', ch.programId);
    set('chain-mint', ch.mint);

    // Appearance & effects
    const u = CONFIG.ui || {};
    set('ui-neon-level', u.neonLevel || 'normal');
    check('ui-breathe', u.breathe !== false);
    check('ui-rain-on-zero', u.rainOnZero !== false);
    set('ui-rain-duration', u.rainDurationSec);
    set('ui-rain-max', u.rainMaxBills);
    set('ui-rain-width', u.rainBillWidth);
    set('ui-rain-image', u.rainImage);
}
window.populateDevPanel = populateDevPanel;

// Download the full CONFIG as a JSON file — settings live in THIS
// browser's localStorage, so export/import is how you move them
// between devices or back them up.
function exportSiteConfig() {
    const blob = new Blob([JSON.stringify(CONFIG, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ruggy-config.json';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("Settings exported", "success", "ruggy-config.json downloaded \u2014 import it on another device to transfer settings.");
}
window.exportSiteConfig = exportSiteConfig;

function importSiteConfig(file) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const parsed = JSON.parse(reader.result);
            if (!parsed || typeof parsed !== 'object') throw new Error('not an object');
            safeStorage.setItem('ruggyConfig', JSON.stringify(parsed));
            showToast("Settings imported", "success", "Reloading with the imported configuration\u2026");
            setTimeout(() => location.reload(), 900);
        } catch (e) {
            showToast("Import failed", "error", "That file is not a valid ruggy-config.json export.");
        }
    };
    reader.readAsText(file);
}
window.importSiteConfig = importSiteConfig;

async function resetSiteData() {
    const ok = await showConfirm(
        "Reset ALL site data in this browser?<br><br>" +
        "<span style='color:#9ca3af;font-size:13px;'>Clears settings, stakes, lottery tickets, free-ticket timers, the Wall, dev panel settings, and all per-wallet data. This cannot be undone.</span>",
        { okText: 'Reset Everything', danger: true }
    );
    if (!ok) return;

    const keepAdminSession = true;
    const removeKey = (k) => { try { localStorage.removeItem(k); } catch (_) {} };

    const fixed = [
        'ruggyConfig', 'ruggy_dev_settings', 'ruggyStakes', 'ruggyLottoTickets',
        'lastFreeLottoTicket', 'ruggyBannedWall', 'ruggyLastConnectedWallet',
        'ruggyPendingWallet',
    ];
    if (!keepAdminSession) fixed.push('ruggyAdminLoggedIn');

    const dynamic = [];
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k) continue;
            const isRuggy = /^ruggy/i.test(k);
            const isAdmin = k === 'ruggyAdminLoggedIn';
            if (isRuggy && !(keepAdminSession && isAdmin)) dynamic.push(k);
        }
    } catch (_) {}

    const all = Array.from(new Set([...fixed, ...dynamic]));
    all.forEach(removeKey);

    try {
        const sk = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            const k = sessionStorage.key(i);
            if (k && /^ruggy/i.test(k) && !(keepAdminSession && k === 'ruggyAdminLoggedIn')) sk.push(k);
        }
        sk.forEach(k => { try { sessionStorage.removeItem(k); } catch (_) {} });
    } catch (_) {}

    try { window.ruggyStakes = null; } catch (_) {}
    try { window.ruggyChainStakers = null; } catch (_) {}
    try { window.ruggyChainBans = null; } catch (_) {}

    showToast("Site data reset", "success", "Cleared " + all.length + " keys. Reloading fresh\u2026");
    setTimeout(() => location.reload(), 900);
}
window.resetSiteData = resetSiteData;

// Import file input wiring (delegated change listener)
document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'import-config-file' && e.target.files && e.target.files[0]) {
        importSiteConfig(e.target.files[0]);
        e.target.value = '';
    }
});

function getAdminInputNumber(id, defaultValue = 0) {
    const el = document.getElementById(id);
    return el ? (parseInt(el.value) || defaultValue) : defaultValue;
}

// Push EVERY on-chain-capable value from the MAIN config panel to the program,
// in sequence. Lets you edit in one place (the normal config UI) and sync it all
// live. Skips anything the program can't store (schedule, display rows, etc.).
async function pushAllConfigToChain() {
    if (!(window.RuggyChain && RuggyChain.isConfigured && RuggyChain.isConfigured())) {
        showToast("Enable Chain first", "error", "Turn on Chain in the ⛓ section, then connect your authority wallet.");
        return;
    }
    if (!(window.ruggyWallet && window.ruggyWallet.connected)) {
        showToast("Connect your wallet", "error", "Connect the program authority wallet to push config.");
        if (typeof showWalletModal === 'function') showWalletModal();
        return;
    }
    const numId = (id, d) => { const el = document.getElementById(id); const v = el ? parseFloat(el.value) : NaN; return isNaN(v) ? d : v; };
    const bps = (p) => Math.round(p * 100);

    const ok = await showConfirm(
        "This pushes your fee splits, thresholds, ticket params, absolution, and burn-stake threshold to the <strong>live on-chain program</strong>, one transaction each.<br><br>" +
        "<span style='color:#9ca3af;font-size:13px;'>You'll confirm each in your wallet. Your wallet must be the program authority.</span>",
        { okText: 'Push All to Chain' }
    );
    if (!ok) return;

    const results = [];
    const step = async (label, fn) => {
        try { const sig = await fn(); results.push("✅ " + label + " (" + String(sig).slice(0, 8) + "…)"); }
        catch (e) { results.push("❌ " + label + ": " + (e.message || e)); }
    };

    // 1) Fee splits — main panel uses liq(=burn)/antirug/community/creator(=mdr)
    const burn = bps(numId('dev-liq-percent', 50));
    const anti = bps(numId('dev-antirug-percent', 10));
    const comm = bps(numId('dev-community-percent', 30));
    const mdr  = bps(numId('dev-creator-percent', 10));
    if (burn + comm + anti + mdr === 10000) {
        await step("Fee splits", () => RuggyChain.tx.setSplits(burn, comm, anti, mdr));
    } else {
        results.push("⏭ Fee splits SKIPPED — must total 100% (got " + ((burn+comm+anti+mdr)/100) + "%).");
    }

    // 2) Thresholds
    await step("Thresholds", () => RuggyChain.tx.setThresholds(
        Math.round(numId('m-community-threshold', 500000) * 1e6),
        Math.round(numId('m-antirug-threshold', 1000000) * 1e6)));

    // 3) Ticket params (price + lottery mdr/burn)
    const tMdr = bps(numId('m-lotto-mdr', 10)), tBurn = bps(numId('m-lotto-burn', 10));
    if (tMdr + tBurn <= 10000) {
        await step("Ticket params", () => RuggyChain.tx.setTicketParams(
            Math.round(numId('m-daily-ticket-price', 3) * 1e6), tMdr, tBurn));
    } else {
        results.push("⏭ Ticket params SKIPPED — MDR%+Burn% over 100%.");
    }

    // 4) Absolution
    await step("Absolution", () => RuggyChain.tx.setAbsolution(
        bps(numId('m-abs-pct', 10)), Math.round(numId('m-abs-days', 1))));

    // 5) Burn-stake threshold (reuse community threshold field if no dedicated one)
    const bst = numId('chain-burn-stake-threshold', NaN);
    if (!isNaN(bst)) {
        await step("Burn-stake threshold", () => RuggyChain.tx.setBurnStakeThreshold(Math.round(bst * 1e6)));
    }

    try { await RuggyChain.refreshUI(); } catch (_) {}
    showToast("Config pushed to chain", "success", results.join("  •  "));
    // also drop the detail into the chain-admin result box if present
    const box = document.getElementById('chain-admin-result');
    if (box) { box.style.display = 'block'; box.style.background = '#052e1a'; box.style.border = '1px solid #22c55e'; box.style.color = '#bbf7d0'; box.textContent = results.join("\n"); }
}
window.pushAllConfigToChain = pushAllConfigToChain;

function saveDeveloperSettings() {
    // Token & Timing
    CONFIG.tokenMint = getAdminInputValue('dev-ca');
    const previousInterval = CONFIG.distributionIntervalMinutes;
    CONFIG.distributionIntervalMinutes = getAdminInputNumber('dev-interval', 30);
    const intervalChanged = previousInterval !== CONFIG.distributionIntervalMinutes;

    // Bagworkers
    CONFIG.bagworkers = [];
    for (let i = 1; i <= 5; i++) {
        const val = getAdminInputValue('dev-bagworker-' + i);
        if (val) CONFIG.bagworkers.push(val);
    }

    // Distribution Splits
    CONFIG.distributionSplits = {
        liquidity: getAdminInputNumber('dev-liq-percent', 40),
        antiRug: getAdminInputNumber('dev-antirug-percent', 20),
        community: getAdminInputNumber('dev-community-percent', 30),
        creator: getAdminInputNumber('dev-creator-percent', 5)
    };

    // Wallets
    CONFIG.burnWallet = getAdminInputValue('dev-burn-wallet');
    CONFIG.creatorWallet = getAdminInputValue('dev-creator-wallet');

    // Social Links
    CONFIG.socialX = getAdminInputValue('dev-x-link');
    CONFIG.socialTelegram = getAdminInputValue('dev-telegram-link');
    CONFIG.socialDexscreener = getAdminInputValue('dev-dexscreener-link');
    CONFIG.socialPumpfun = getAdminInputValue('dev-pumpfun-link');

    // Site Content
    CONFIG.content = CONFIG.content || {};
    CONFIG.content.heroTitle = getAdminInputValue('content-hero-title') || 'RUGGY';
    CONFIG.content.heroSub = getAdminInputValue('content-hero-sub') || 'The Ultimate Anti-Rug Mascot';
    CONFIG.content.jackpotText = getAdminInputValue('content-jackpot') || '$124,850';

    // Appearance & Effects
    CONFIG.ui = CONFIG.ui || {};
    CONFIG.ui.neonLevel = getAdminInputValue('ui-neon-level') || 'normal';
    CONFIG.ui.breathe = !!document.getElementById('ui-breathe')?.checked;
    CONFIG.ui.rainOnZero = !!document.getElementById('ui-rain-on-zero')?.checked;
    CONFIG.ui.rainDurationSec = getAdminInputNumber('ui-rain-duration', 60);
    CONFIG.ui.rainMaxBills = getAdminInputNumber('ui-rain-max', 40);
    CONFIG.ui.rainBillWidth = getAdminInputNumber('ui-rain-width', 124);
    CONFIG.ui.rainImage = getAdminInputValue('ui-rain-image');

    // Rules & Metrics
    CONFIG.metrics = CONFIG.metrics || {};
    const mm = CONFIG.metrics;
    mm.distributionEnabled = !!document.getElementById('m-dist-enabled')?.checked;
    mm.holderShutoff = getAdminInputNumber('m-holder-shutoff', 500);
    CONFIG.airdropThreshold = getAdminInputNumber('m-community-threshold', 500000);
    CONFIG.antiRugThreshold = getAdminInputNumber('m-antirug-threshold', 1000000);
    mm.roiTakeProfit = getAdminInputNumber('m-roi-takeprofit', 200);
    mm.roiSafeSellPct = getAdminInputNumber('m-roi-safesell', 50);
    mm.lockedBanSellPct = getAdminInputNumber('m-lockedban-pct', 30);
    mm.overholdPct = parseFloat(document.getElementById('m-overhold-pct')?.value) || 3;
    mm.hallTopShown = getAdminInputNumber('m-hall-top', 12);
    mm.hallLongestShown = getAdminInputNumber('m-hall-longest', 12);
    mm.hallBagworkersShown = getAdminInputNumber('m-hall-bagworkers', 5);
    mm.wallShown = getAdminInputNumber('m-wall-shown', 25);
    mm.absolutionStakePct = getAdminInputNumber('m-abs-pct', 20);
    mm.absolutionLockDays = getAdminInputNumber('m-abs-days', 1);
    mm.lotteryDailyTime = getAdminInputValue('m-lotto-daily-time') || '8:00 PM UTC';
    mm.lotteryWeeklyDay = getAdminInputValue('m-lotto-weekly-day') || 'Sunday';
    mm.lotteryWeeklyTime = getAdminInputValue('m-lotto-weekly-time') || '8:00 PM UTC';
    mm.freeTicketCooldownHours = getAdminInputNumber('m-free-ticket-hours', 24);
    mm.miniDrawLabel = getAdminInputValue('m-mini-draw') || 'Today • 8:00 PM UTC';
    mm.bigDrawLabel = getAdminInputValue('m-big-draw') || 'Sunday • 8:00 PM UTC';
    mm.lottoMdrPct = getAdminInputNumber('m-lotto-mdr', 10);
    mm.lottoBurnPct = getAdminInputNumber('m-lotto-burn', 10);
    mm.dailyMaxOfWeeklyPct = getAdminInputNumber('m-daily-max', 50);
    mm.postLockLiquidity = getAdminInputNumber('m-postlock-liq', 0);
    mm.postLockCommunity = getAdminInputNumber('m-postlock-community', 60);
    mm.postLockAntiRug = getAdminInputNumber('m-postlock-antirug', 30);
    mm.postLockCreator = getAdminInputNumber('m-postlock-creator', 10);
    mm.dailyTicketPrice = parseFloat(document.getElementById('m-daily-ticket-price')?.value) || 3;
    mm.weeklyTicketPrice = parseFloat(document.getElementById('m-weekly-ticket-price')?.value) || 6;
    mm.consolationHigherPct = getAdminInputNumber('m-consol-higher-pct', 20);
    mm.consolationLowerPct = getAdminInputNumber('m-consol-lower-pct', 10);
    mm.consolationHigherMatch = getAdminInputNumber('m-consol-higher-match', 3);
    mm.consolationLowerMatch = getAdminInputNumber('m-consol-lower-match', 2);
    mm.lotteryWallet = getAdminInputValue('m-lottery-wallet');

    // Chain
    CONFIG.chain = CONFIG.chain || {};
    CONFIG.chain.enabled = !!document.getElementById('chain-enabled')?.checked;
    CONFIG.chain.rpc = getAdminInputValue('chain-rpc') || 'https://api.devnet.solana.com';
    CONFIG.chain.programId = getAdminInputValue('chain-program');
    CONFIG.chain.mint = getAdminInputValue('chain-mint');

    const sp = CONFIG.distributionSplits || {};
    const splitTotal = (sp.liquidity||0)+(sp.antiRug||0)+(sp.community||0)+(sp.creator||0);
    if (splitTotal !== 100) {
        showToast("Splits don't total 100%", "error",
            `Your four fee splits add to ${splitTotal}%. The site will display them as entered — adjust so they total 100%.`);
    }

    // Lottery allocation sanity: consolation + MDR + burn must leave room for Main
    const consol = (mm.consolationHigherPct || 0) + (mm.consolationLowerPct || 0);
    const nonMain = consol + (mm.lottoMdrPct || 0) + (mm.lottoBurnPct || 0);
    if (nonMain > 100) {
        showToast("Lottery allocation over 100%", "error",
            `Consolation + MDR + Burn = ${nonMain}%, leaving nothing for the Main Prize Pool. Lower them so they total under 100%.`);
    }

    saveConfig();
    applySiteSettings();
    if (typeof applyChainSettings === 'function') applyChainSettings();
    updateHomeWalletDisplays();
    // If the chart is showing the post-lock view, rebuild it with new splits
    if (window.lpLockView && typeof initTokenomicsChart === 'function') initTokenomicsChart();

    // A changed interval applies to the live countdown immediately
    if (intervalChanged) {
        CONFIG.nextDistributionTime = new Date(
            Date.now() + CONFIG.distributionIntervalMinutes * 60 * 1000
        ).toISOString();
        if (window.rewardTimerInterval) {
            clearInterval(window.rewardTimerInterval);
            window.rewardTimerInterval = null;
        }
        if (typeof startSimpleTimer === 'function') startSimpleTimer();
    }

    if (CONFIG.tokenMint && document.getElementById('home')?.classList.contains('active')) {
        startLiveTracking();
    }

    // Close modal and show feedback
    const modal = document.getElementById('developer-modal');
    if (modal) modal.style.display = 'none';

    // Show success toast instead of alert
    showToast('Settings saved successfully!', 'success');

    // Refresh chart if user is on Tokenomics page
    // applyMetrics already live-updates the chart's data if it exists; only a
    // full re-init is needed if the user is viewing Tokenomics when they save.
    const tokenomicsSection = document.getElementById('tokenomics');
    if (tokenomicsSection && tokenomicsSection.classList.contains('active')) {
        if (typeof initTokenomicsChart === 'function') initTokenomicsChart();
    }
}

// ==================== TOKENOMICS CHART ====================



// Tokenomics chart as a proper object: owns init, retry policy (from
// RUGGY_SETTINGS.chart), and the activation observer. Globals below are
// compatibility aliases.
const TokenomicsChart = {
    init(attempt = 0) {
        const section = document.getElementById('tokenomics');
        const canvas = document.getElementById('feePieChart');
        const container = document.getElementById('chart-container');
    
        if (!section || !canvas || !container) {
    console.warn('[Chart] Missing elements, aborting');
    return;
        }
    
        // Chart.js is loaded on demand (only here, only when Tokenomics opens).
        // Kick off the load if it hasn't started, then retry until it's ready.
        if (typeof Chart === 'undefined') {
    ensureChartJsLoaded();
    if (attempt < RUGGY_SETTINGS.chart.maxRetries) {
        setTimeout(() => TokenomicsChart.init(attempt + 1), RUGGY_SETTINGS.chart.libRetryMs);
    }
    return;
        }
    
        // Wait for the canvas to have real layout. setTimeout (not rAF) is used on
        // purpose: mobile browsers throttle requestAnimationFrame during navigation
        // transitions, which used to burn all the retries in ~200ms and give up
        // before layout settled. Only width matters — height is derived from the
        // chart's aspectRatio, and a height:auto canvas can legitimately start small.
        if (canvas.offsetWidth < 50) {
    if (attempt < RUGGY_SETTINGS.chart.maxRetries) {
        setTimeout(() => TokenomicsChart.init(attempt + 1), RUGGY_SETTINGS.chart.layoutRetryMs);
    }
    return;
        }
    
        // Destroy old chart if exists
        if (window.feePieChart && typeof window.feePieChart.destroy === 'function') {
    try { window.feePieChart.destroy(); } catch (e) {}
    window.feePieChart = null;
        }
    
        // Load distribution splits. In LP-locked view, burns have stopped and
        // fees redirect — use the post-lock split set from CONFIG.metrics.
        let splits = { liquidity: 40, antiRug: 20, community: 30, creator: 10 };
        try {
    const saved = localStorage.getItem('ruggyConfig');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.distributionSplits) {
            splits = { ...splits, ...parsed.distributionSplits };
        }
    }
        } catch (e) {}
        if (window.lpLockView) {
    splits = currentSplitSet();
        }
    
        const labels = [
    `Liquidity & Burns (${splits.liquidity}%)`,
    `Community (${splits.community}%)`,
    `Anti-Rug Holders (${splits.antiRug}%)`,
    `MDR Fund (${splits.creator}%)`
        ];
    
        const dataValues = [splits.liquidity, splits.community, splits.antiRug, splits.creator];
    
        try {
    window.feePieChart = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: ['#ef4444', '#fbbf24', '#22c55e', '#a855f7'],
                borderColor: '#0f172a',
                borderWidth: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.08,
            animation: { duration: 850, easing: 'easeOutQuart' },
            onHover: (evt, elements) => {
                evt.native.target.style.cursor = elements.length ? 'pointer' : 'default';
            },
            onClick: (evt, elements) => {
                if (elements && elements.length && typeof showPieExplanation === 'function') {
                    showPieExplanation(elements[0].index);
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#1e2937',
                    callbacks: {
                        label: (ctx) => ctx.label + ': ' + ctx.raw + '%'
                    }
                }
            }
        }
    });
    
    // Hide loading state if present
    const loading = container.querySelector('.chart-loading');
    if (loading) loading.style.display = 'none';
    
    
    // Resize observer (once). The old version observed the container and
    // called chart.resize() on every fire — but resizing a height:auto
    // canvas changes the container's HEIGHT, which re-fires the observer,
    // which resizes again... a feedback loop that shows up as the card
    // "vibrating". Fix: only react to WIDTH changes (height is derived from
    // aspectRatio, so width is the only real input), and ignore fires where
    // the width hasn't actually changed.
    if (!window.chartResizeObserver) {
        let lastWidth = 0;
        let resizeTimeout;
        window.chartResizeObserver = new ResizeObserver((entries) => {
            const w = Math.round(entries[0].contentRect.width);
            if (w === lastWidth) return;   // height-only change -> ignore (breaks the loop)
            lastWidth = w;
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.feePieChart && typeof window.feePieChart.resize === 'function') {
                    window.feePieChart.resize();
                }
            }, 120);
        });
        window.chartResizeObserver.observe(container);
    }
    
        } catch (err) {
    console.error('[Chart] Failed to create chart:', err);
    if (attempt < RUGGY_SETTINGS.chart.maxErrorRetries) {
        setTimeout(() => TokenomicsChart.init(attempt + 1), RUGGY_SETTINGS.chart.errorRetryMs);
    }
        }
    },

    observe() {
        const section = document.getElementById('tokenomics');
        if (!section) return;
    
        const observer = new MutationObserver(() => {
    if (section.classList.contains('active')) {
        setTimeout(() => {
            TokenomicsChart.init();
        }, RUGGY_SETTINGS.chart.observerDelayMs);
    }
        });
    
        observer.observe(section, {
    attributes: true,
    attributeFilter: ['class']
        });
    }
};

// Compatibility aliases
function initTokenomicsChart(attempt = 0) { return TokenomicsChart.init(attempt); }
// Loads Chart.js from the CDN exactly once, on demand. Returns immediately if
// it's already loaded or loading. This keeps Chart.js (~75KB) off every other
// page — it's only fetched when the user actually opens Tokenomics.
let __chartJsState = 'idle'; // idle | loading | loaded
function ensureChartJsLoaded() {
    if (typeof Chart !== 'undefined') { __chartJsState = 'loaded'; return; }
    if (__chartJsState === 'loading') return;
    __chartJsState = 'loading';
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    s.async = true;
    s.onload = () => { __chartJsState = 'loaded'; };
    s.onerror = () => { __chartJsState = 'idle'; }; // allow a later retry
    document.head.appendChild(s);
}

function setupTokenomicsChartObserver() { return TokenomicsChart.observe(); }
window.initTokenomicsChart = initTokenomicsChart;

// Initial safety net + observer setup
window.addEventListener('load', () => {
    setTimeout(() => {
const section = document.getElementById('tokenomics');
if (section && section.classList.contains('active')) {
    initTokenomicsChart();
}
setupTokenomicsChartObserver();
    }, 900);
});

function showPieExplanation(index) {
    const explanationBox = document.getElementById('pie-explanation');
    const content = document.getElementById('pie-explanation-content');
    if (!explanationBox || !content) return;

    let s = CONFIG.distributionSplits || { liquidity: 40, antiRug: 20, community: 30, creator: 10 };
    if (window.lpLockView && CONFIG.metrics) {
        const mm = CONFIG.metrics;
        s = { liquidity: mm.postLockLiquidity, antiRug: mm.postLockAntiRug,
              community: mm.postLockCommunity, creator: mm.postLockCreator };
    }
    const v = metricsView();
    const explanations = [
        {
            title: `🔥 Burn Wallet / Liquidity (${s.liquidity}%)`,
            text: "This portion goes to a dedicated wallet that performs automatic buybacks and burns. Burns mean coins are permanently removed and staked into the Liquidity Pool. <strong>Once 50% of the LP is permanently locked, burns stop</strong> and extra fees are redirected: <strong>Community gets a boost</strong>, <strong>Anti-Rug gets a boost</strong>.",
            color: "#ef4444"
        },
        {
            title: `👥 Community (${s.community}%)`,
            text: `Rewards sent to stakers with <strong>${Number(v.communityThreshold).toLocaleString()}+</strong> $RUGGY staked. This portion supports the broader community of dedicated stakers.`,
            color: "#fbbf24"
        },
        {
            title: `🛡 Anti-Rug Vault (${s.antiRug}%)`,
            text: `Insurance vault for stakers with <strong>${Number(v.antiRugThreshold).toLocaleString()}+</strong> $RUGGY staked. Protects loyal stakers against catastrophic dumps.`,
            color: "#22c55e"
        },
        {
            title: `🚀 MDR Fund (${s.creator}%)`,
            text: "Marketing, Development & Research — keeps Ruggy growing: promotions, listings, development, and community events.",
            color: "#a855f7"
        }
    ];

    const exp = explanations[index];
    content.innerHTML = `
        <strong style="color:${exp.color}; font-size:14px;">${exp.title}</strong><br>
        <span style="color:#d1d5db; line-height:1.5;">${exp.text}</span>
    `;
    explanationBox.style.display = 'block';
    explanationBox.style.borderLeftColor = exp.color;
}

// Returns the split set the chart/breakdown should currently show.
function currentSplitSet() {
    if (window.lpLockView && CONFIG.metrics) {
        const mm = CONFIG.metrics;
        return { liquidity: mm.postLockLiquidity, antiRug: mm.postLockAntiRug,
                 community: mm.postLockCommunity, creator: mm.postLockCreator };
    }
    return CONFIG.distributionSplits || { liquidity: 40, antiRug: 20, community: 30, creator: 10 };
}
window.currentSplitSet = currentSplitSet;

// Keep the on-page "Fee Breakdown" list in sync with whichever split set
// the chart is showing (normal or post-LP-lock).
function syncFeeBreakdown() {
    const s = currentSplitSet();
    const map = {
        'fee-bd-liquidity': s.liquidity,
        'fee-bd-community': s.community,
        'fee-bd-antirug': s.antiRug,
        'fee-bd-creator': s.creator
    };
    for (const [id, val] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el) el.textContent = val + '%';
    }
}
window.syncFeeBreakdown = syncFeeBreakdown;

// Toggle between normal and post-50%-LP-lock fee distribution on the chart.
function toggleLpLockView() {
    window.lpLockView = !window.lpLockView;
    const btn = document.getElementById('lp-lock-toggle');
    const note = document.getElementById('lp-lock-note');
    if (btn) {
        btn.textContent = window.lpLockView
            ? '🔒 Show Normal Distribution'
            : '🔓 Show 50% LP Locked Distribution';
        btn.style.borderColor = window.lpLockView ? '#fbbf24' : '#22c55e';
        btn.style.color = window.lpLockView ? '#fde68a' : '#86efac';
    }
    if (note) note.style.display = window.lpLockView ? 'block' : 'none';
    // rebuild the chart + fee breakdown with the chosen split set
    if (typeof initTokenomicsChart === 'function') initTokenomicsChart();
    syncFeeBreakdown();
    // clear any open slice explanation (percentages changed)
    const exp = document.getElementById('pie-explanation');
    if (exp) exp.style.display = 'none';
}
window.toggleLpLockView = toggleLpLockView;

loadBannedWall();

// ==================== METRICS BINDING ENGINE ====================
// Resolves every bindable value, including derived ones. HTML binds via
// <span data-m="key"></span>; formats: data-fmt="pct|num|raw" (default raw).
function metricsView() {
    const m = CONFIG.metrics || {};
    const s = CONFIG.distributionSplits || { liquidity: 40, antiRug: 20, community: 30, creator: 10 };
    return {
        // fee splits (+ derived)
        liquidityPct: s.liquidity,
        antiRugPct: s.antiRug,
        communityPct: s.community,
        creatorPct: s.creator,
        bothGroupsPct: (Number(s.community) || 0) + (Number(s.antiRug) || 0),
        // thresholds & cadence
        communityThreshold: CONFIG.airdropThreshold,
        antiRugThreshold: CONFIG.antiRugThreshold,
        intervalMinutes: CONFIG.distributionIntervalMinutes,
        holderShutoff: m.holderShutoff,
        distributionStatus: m.distributionEnabled ? 'ACTIVE' : 'PAUSED BY ADMIN',
        // ROI / ban rules
        roiTakeProfit: m.roiTakeProfit,
        roiSafeSellPct: m.roiSafeSellPct,
        lockedBanSellPct: m.lockedBanSellPct,
        overholdPct: m.overholdPct,
        // hall / wall
        hallTopShown: m.hallTopShown,
        hallLongestShown: m.hallLongestShown,
        hallBagworkersShown: m.hallBagworkersShown,
        wallShown: m.wallShown,
        wallTotalBanned: (typeof bannedWallets !== 'undefined' ? bannedWallets.length : 0),
        // absolution / lottery
        absolutionStakePct: m.absolutionStakePct,
        absolutionLockDays: m.absolutionLockDays,
        lotteryDailyTime: m.lotteryDailyTime,
        lotteryWeeklyDay: m.lotteryWeeklyDay,
        lotteryWeeklyTime: m.lotteryWeeklyTime,
        freeTicketCooldownHours: m.freeTicketCooldownHours,
        miniDrawLabel: m.miniDrawLabel,
        bigDrawLabel: m.bigDrawLabel,
        lottoMainPct: m.lottoMainPct,
        lottoDailyPct: m.lottoDailyPct,
        lottoMdrPct: m.lottoMdrPct,
        lottoBurnPct: m.lottoBurnPct,
        freeTicketCooldownDisplay: (() => {
            const h = Number(m.freeTicketCooldownHours) || 24;
            if (h % 24 === 0) {
                const d = h / 24;
                return d === 1 ? 'day' : d + ' days';
            }
            return h + ' hours';
        })(),
        dailyMaxOfWeeklyPct: m.dailyMaxOfWeeklyPct,
        postLockLiquidity: m.postLockLiquidity,
        postLockCommunity: m.postLockCommunity,
        postLockAntiRug: m.postLockAntiRug,
        postLockCreator: m.postLockCreator,
        dailyTicketPrice: m.dailyTicketPrice,
        weeklyTicketPrice: m.weeklyTicketPrice,
        consolationHigherPct: m.consolationHigherPct,
        consolationLowerPct: m.consolationLowerPct,
        consolationHigherMatch: m.consolationHigherMatch,
        consolationLowerMatch: m.consolationLowerMatch,
        consolationTotalPct: (Number(m.consolationHigherPct) || 0) + (Number(m.consolationLowerPct) || 0),
        // Main pool is the remainder so the allocation always sums to 100%:
        // 100 - consolation - MDR - burn
        mainPoolPct: Math.max(0, 100
            - ((Number(m.consolationHigherPct) || 0) + (Number(m.consolationLowerPct) || 0))
            - (Number(m.lottoMdrPct) || 0)
            - (Number(m.lottoBurnPct) || 0)),
        lotteryWallet: m.lotteryWallet,
        lotteryWalletShort: m.lotteryWallet ? (m.lotteryWallet.slice(0, 4) + '…' + m.lotteryWallet.slice(-4)) : 'Not set'
    };
}
window.metricsView = metricsView;

function applyMetrics() {
    const view = metricsView();
    document.querySelectorAll('[data-m]').forEach((el) => {
        const key = el.dataset.m;
        if (!(key in view) || view[key] === undefined || view[key] === null) return;
        const v = view[key];
        const fmt = el.dataset.fmt || 'raw';
        el.textContent =
            fmt === 'pct' ? v + '%' :
            fmt === 'usd' ? '$' + Number(v).toLocaleString() :
            fmt === 'num' ? Number(v).toLocaleString() :
            v;
    });
    // rules that re-render lists
    if (typeof renderBannedTable === 'function') renderBannedTable();
    if (typeof syncFeeBreakdown === 'function') syncFeeBreakdown();
    if (typeof renderTicketTables === 'function') renderTicketTables();
    // live chart refresh with new splits — fully defensive. window.feePieChart
    // starts as the CANVAS element (ids auto-become window globals), becomes a
    // Chart instance only after initTokenomicsChart runs. Optional chaining +
    // its own try/catch guarantee this can NEVER throw and break Save.
    try {
        const chart = window.feePieChart;
        const ds = chart?.data?.datasets?.[0];
        if (ds && typeof chart.update === 'function' && CONFIG.distributionSplits) {
            let s = CONFIG.distributionSplits;
            if (window.lpLockView && CONFIG.metrics) {
                const mm = CONFIG.metrics;
                s = { liquidity: mm.postLockLiquidity, antiRug: mm.postLockAntiRug,
                      community: mm.postLockCommunity, creator: mm.postLockCreator };
            }
            // slice order matches initTokenomicsChart: liquidity, community, antiRug, creator
            ds.data = [s.liquidity, s.community, s.antiRug, s.creator];
            chart.data.labels = [
                `Liquidity & Burns (${s.liquidity}%)`,
                `Community (${s.community}%)`,
                `Anti-Rug Holders (${s.antiRug}%)`,
                `MDR Fund (${s.creator}%)`
            ];
            chart.update();
        }
    } catch (e) {
        console.warn('[Ruggy] chart refresh skipped:', e.message);
    }
}
window.applyMetrics = applyMetrics;

// ==================== APPLY SITE SETTINGS ====================
// Pushes CONFIG.ui + CONFIG.content into the live page. Runs on load
// (after loadConfig) and again whenever the admin saves.
function applySiteSettings() {
    const ui = CONFIG.ui || {};
    const content = CONFIG.content || {};

    // --- Content ---
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && content.heroTitle) heroTitle.textContent = content.heroTitle;

    const heroSub = document.querySelector('.hero-sub');
    if (heroSub && content.heroSub) heroSub.textContent = content.heroSub;

    const jackpot = document.getElementById('lotto-jackpot-display');
    if (jackpot && content.jackpotText) jackpot.textContent = content.jackpotText;

    const price = Number(CONFIG.metrics?.dailyTicketPrice) || Number(content.ticketPrice) || 3;
    RUGGY_SETTINGS.lottery.ticketPriceUsd = price;
    const priceDisplay = document.getElementById('lotto-ticket-price-display');
    if (priceDisplay) priceDisplay.textContent = '$' + price + ' USD';

    // Lottery wallet display in the prize breakdown
    const lwAddr = document.getElementById('lottery-wallet-addr');
    if (lwAddr) {
        const w = CONFIG.metrics?.lotteryWallet;
        lwAddr.textContent = w ? (w.slice(0, 4) + '…' + w.slice(-4)) : 'Not set';
    }
    const lwTotal = document.getElementById('lottery-wallet-total');
    if (lwTotal && CONFIG.content?.jackpotText) lwTotal.textContent = CONFIG.content.jackpotText;

    // --- Appearance ---
    document.body.classList.remove('neon-soft', 'neon-max');
    if (ui.neonLevel === 'soft') document.body.classList.add('neon-soft');
    if (ui.neonLevel === 'max') document.body.classList.add('neon-max');
    document.body.classList.toggle('no-breathe', ui.breathe === false);

    applyMetrics();
}
window.applySiteSettings = applySiteSettings;

// ==================== MONEY RAIN ====================
// Retro pixel dollar bills rain from the top of the screen — fired when
// the distribution timer hits 00:00 (and from the admin test button).
// Proper object per the house pattern; window.startMoneyRain is the
// compatibility alias used by the data-action whitelist.
const MoneyRain = {
    DEFAULT_DURATION_MS: 60000,   // rain for 1 minute
    MAX_BILLS: 40,                // concurrent cap keeps phones smooth
    BILL_IMAGE: 'https://i.ibb.co/d07MM3Wf/IMG-4464.jpg',
    BILL_WIDTH: 124,              // px — matches the image's native 1776x576
    BILL_HEIGHT: 40,              // ratio (3.08:1) exactly: zero crop, zero stretch

    active: false,
    _spawnTimer: null,
    _endsAt: 0,
    _imageBroken: false,
    _preloaded: false,

    // Warm the image cache so the first bill doesn't pop in blank
    preload() {
        if (this._preloaded) return;
        this._preloaded = true;
        const img = new Image();
        img.onerror = () => { this._imageBroken = true; };
        img.src = this._image || this.BILL_IMAGE;
    },

    start(durationMs) {
        if (this.active) return;  // already raining — don't stack storms
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Admin-configurable behavior (panel > Appearance & Effects)
        const ui = (typeof CONFIG !== 'undefined' && CONFIG.ui) || {};
        this._duration = durationMs
            || (Number(ui.rainDurationSec) > 0 ? Number(ui.rainDurationSec) * 1000 : this.DEFAULT_DURATION_MS);
        this._maxBills = Number(ui.rainMaxBills) > 0 ? Number(ui.rainMaxBills) : this.MAX_BILLS;
        this._width = Number(ui.rainBillWidth) > 0 ? Number(ui.rainBillWidth) : this.BILL_WIDTH;
        this._height = Math.round(this._width / 3.083);   // keep the image's native ratio
        const image = (ui.rainImage || '').trim() || this.BILL_IMAGE;
        if (image !== this._image) {
            this._image = image;
            this._imageBroken = false;  // new image gets a fresh chance
            this._preloaded = false;
        }

        this.preload();
        this.active = true;
        this._endsAt = Date.now() + this._duration;
        this._spawn();
    },

    stop() {
        this.active = false;
        clearTimeout(this._spawnTimer);
        // Bills already in the air finish their fall and self-remove.
    },

    _makeBill() {
        // Image bill (uniform size set in CSS); falls back to the
        // CSS-drawn pixel bill if the image can't load.
        let bill;
        if (!this._imageBroken) {
            bill = document.createElement('img');
            bill.className = 'money-bill';
            bill.src = this._image || this.BILL_IMAGE;
            bill.alt = '';
            bill.decoding = 'async';
            bill.onerror = () => {
                this._imageBroken = true;
                bill.remove();
            };
        } else {
            bill = document.createElement('div');
            bill.className = 'money-bill money-bill-css';
        }

        // Force the dollar rectangle inline with !important — immune to
        // stale cached stylesheets and any present/future CSS cascade.
        bill.style.setProperty('width', (this._width || this.BILL_WIDTH) + 'px', 'important');
        bill.style.setProperty('height', (this._height || this.BILL_HEIGHT) + 'px', 'important');
        bill.style.setProperty('object-fit', 'cover', 'important');
        return bill;
    },

    _spawn() {
        if (!this.active || Date.now() > this._endsAt) {
            this.stop();
            return;
        }

        if (document.querySelectorAll('.money-bill').length < (this._maxBills || this.MAX_BILLS)) {
            const bill = this._makeBill();

            // Uniform size (CSS); randomize only position and motion
            bill.style.left = (Math.random() * 100) + 'vw';
            bill.style.animationDuration = (3.5 + Math.random() * 3.5) + 's';
            bill.style.setProperty('--tilt', (Math.random() * 40 - 20) + 'deg');
            bill.style.setProperty('--drift', (Math.random() * 180 - 90) + 'px');
            bill.style.setProperty('--spin', (Math.random() * 720 - 360) + 'deg');

            bill.addEventListener('animationend', () => bill.remove());
            document.body.appendChild(bill);
        }

        this._spawnTimer = setTimeout(() => this._spawn(), 110 + Math.random() * 170);
    }
};

// Compatibility alias (admin test button + Ruggy namespace)
function startMoneyRain(durationMs) { return MoneyRain.start(durationMs); }
window.startMoneyRain = startMoneyRain;

function resetDistributionTimer() {
    const interval = parseInt(document.getElementById('dev-interval')?.value, 10) || 30;

    // Persist both the interval and the new target
    CONFIG.distributionIntervalMinutes = interval;
    CONFIG.nextDistributionTime = new Date(Date.now() + interval * 60 * 1000).toISOString();
    saveConfig();

    // Restart the LIVE countdown so the nav timer jumps to the new
    // interval immediately (previously this only saved config and the
    // visible timer kept counting its old target).
    if (window.rewardTimerInterval) {
        clearInterval(window.rewardTimerInterval);
        window.rewardTimerInterval = null;
    }
    if (typeof startSimpleTimer === 'function') startSimpleTimer();

    showToast("Distribution timer updated", "success",
        `Counting down ${interval} minute${interval === 1 ? '' : 's'} from now.`);
    updateHomeWalletDisplays();
}

async function triggerDistribution() {
    let wallet = null;
    let walletName = "your wallet";

    if (window.solana && window.solana.isPhantom) {
        wallet = window.solana;
        walletName = "Phantom";
    } else if (window.solana) {
        wallet = window.solana;
        walletName = "your wallet";
    } else if (window.solflare) {
        wallet = window.solflare;
        walletName = "Solflare";
    } else {
        showToast("No wallet connected", "error", "Install Phantom, Solflare, or Backpack and connect your wallet first.");
        return;
    }

    try {
        let walletPublicKey = null;

        if (wallet.isConnected && wallet.publicKey) {
            walletPublicKey = wallet.publicKey;
        } else {
            try {
                const resp = await wallet.connect({ onlyIfTrusted: true });
                if (resp && resp.publicKey) walletPublicKey = resp.publicKey;
            } catch (_) {}
        }

        if (!walletPublicKey) {
            showToast(`Please click the 'CONNECT WALLET' button at the top first to connect ${walletName}.`, "error");
            return;
        }

        const connection = new solanaWeb3.Connection(
            "https://api.devnet.solana.com",
            "confirmed"
        );

        const programId = new solanaWeb3.PublicKey("V8twS2PfNj5kwGv4VXmCebSwhGV8vg3uu2Y5PMtA83B");
        const configAccount = new solanaWeb3.PublicKey("AEqGdzp9Pwz8t12rcKcJE3p1uNqMdLH8n741c7mf5XG6");

        const emptyRoot = new Array(32).fill(0);
        const totalAmount = new BN(5000000);

        const data = Buffer.concat([
            Buffer.from([1]),
            Buffer.from(emptyRoot),
            totalAmount.toArrayLike(Buffer, "le", 8)
        ]);

        const transaction = new solanaWeb3.Transaction().add(
            new solanaWeb3.TransactionInstruction({
                keys: [
                    { pubkey: configAccount, isSigner: false, isWritable: true },
                    { pubkey: walletPublicKey, isSigner: true, isWritable: false },
                ],
                programId: programId,
                data: data,
            })
        );

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = walletPublicKey;

        const signedTx = await wallet.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTx.serialize());

        showToast("✅ Distribution triggered! Signature: " + signature, "success");

    } catch (error) {
        showToast("Failed to trigger distribution. " + (error.message || error), "error");
    }
}
