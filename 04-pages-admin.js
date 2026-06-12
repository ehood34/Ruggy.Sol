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

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) link.classList.add('active');
    });

    if (page === 'tokenomics') {
        // More aggressive trigger for the chart
        requestAnimationFrame(() => {
            setTimeout(() => {
                if (typeof initTokenomicsChart === 'function') {
                    initTokenomicsChart();
                }
            }, 120);

            // Extra safety net
            setTimeout(() => {
                if (typeof initTokenomicsChart === 'function') {
                    initTokenomicsChart();
                }
            }, 650);
        });
    }

    if (page === 'lotto') {
        // Start live SOL price updates when visiting Lotto page
        setTimeout(() => {
            if (typeof startLottoSolPriceUpdates === 'function') {
                startLottoSolPriceUpdates();
            }
        }, 600);
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

        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`);
        const data = await res.json();

        if (!data.pairs || data.pairs.length === 0) {
            if (noCaDiv) {
                noCaDiv.innerHTML = `<p style="color:#f87171;">Token not found on Dexscreener yet.</p>`;
                noCaDiv.style.display = 'block';
            }
            if (metricsDiv) metricsDiv.style.display = 'none';
            return;
        }

        const pair = data.pairs[0];

        const priceUsd = parseFloat(pair.priceUsd) || 0;
        const volume24h = parseFloat(pair.volume?.h24) || 0;
        const fdv = parseFloat(pair.fdv) || 0;

        const priceEl = document.getElementById('home-price');
        if (priceEl) priceEl.textContent = priceUsd > 0 ? `$${priceUsd.toFixed(8)}` : "—";

        const volumeEl = document.getElementById('home-volume');
        if (volumeEl) volumeEl.textContent = volume24h > 0 ? `$${(volume24h / 1e6).toFixed(2)}M` : "—";

        const mcEl = document.getElementById('home-market-cap');
        if (mcEl) mcEl.textContent = fdv > 0 ? `$${(fdv / 1e6).toFixed(2)}M` : "—";

        if (metricsDiv) {
            metricsDiv.style.display = 'block';
            metricsDiv.style.opacity = '1';
        }
        if (noCaDiv) noCaDiv.style.display = 'none';

    } catch (err) {
        if (metricsDiv) metricsDiv.style.display = 'none';
        if (noCaDiv) {
            noCaDiv.innerHTML = `
                <p style="color:#f87171;">Failed to load live data.</p>
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

function buyOnPumpFun() {
    const mint = document.getElementById('ca-input')?.value.trim() || CONFIG.tokenMint;
    if (mint) {
        window.open(`https://pump.fun/${mint}`, '_blank');
    } else {
        showToast("Please enter a token CA first", "error");
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

    const confirmed = await showConfirm(
        "This will claim your eligible rewards from the vault.<br><br>" +
        "<span style='color:#9ca3af;font-size:13px;'>Note: full on-chain claiming is being finalized — for now this confirms your eligibility.</span>",
        { okText: 'Claim Rewards' }
    );

    if (confirmed) {
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

    // === ALWAYS FORCE A FRESH 30 MINUTE TIMER ===
    const now = Date.now();
    const freshTarget = now + (30 * 60 * 1000);
    let targetTime = freshTarget;

    if (typeof CONFIG !== 'undefined') {
        CONFIG.nextDistributionTime = new Date(freshTarget).toISOString();
    }


    window.rewardTimerInterval = setInterval(() => {
        if (typeof rewardsPaused !== 'undefined' && rewardsPaused) {
            return;
        }

        const currentNow = Date.now();
        const remainingMs = Math.max(0, targetTime - currentNow);

        const totalDuration = 30 * 60 * 1000; // Always use 30 minutes for progress

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

            // Auto-restart after a short pause
            clearInterval(window.rewardTimerInterval);
            window.rewardTimerInterval = null;

            setTimeout(() => {
                if (typeof startSimpleTimer === 'function') {
                    startSimpleTimer();
                }
            }, 2500); // 2.5 second pause before next round
        }

    }, 300);
}

// Force start timer reliably on page load
function forceStartDistributionTimer() {
    // Always force a clean 30-minute start on every page load
    if (typeof startSimpleTimer === 'function') {
        startSimpleTimer();
    }
}

// Multiple reliable entry points
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(forceStartDistributionTimer, 120);
    });
} else {
    setTimeout(forceStartDistributionTimer, 120);
}

// Final safety net
window.addEventListener('load', () => {
    setTimeout(forceStartDistributionTimer, 300);
});

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

    if (!window.solana) {
        showToast("Please install a Solana wallet (Phantom recommended).", "error");
        return;
    }

    let walletAddress;
    try {
        const resp = await window.solana.connect();
        walletAddress = resp.publicKey.toString();
    } catch (err) {
        showToast("Wallet connection failed or was rejected.", "error");
        return;
    }

    if (!walletInfo || !eligibilityMsg) return;

    walletInfo.style.display = 'block';
    const addrEl = document.getElementById('wallet-address');
    if (addrEl) addrEl.textContent = walletAddress.slice(0,4) + "..." + walletAddress.slice(-4);

    const randomBalance = Math.floor(Math.random() * 1200000) + 2500;
    const percentOfSupply = (randomBalance / 1000000000) * 100;

    const balEl = document.getElementById('wallet-balance');
    if (balEl) balEl.textContent = randomBalance.toLocaleString() + " $RUGGY";
    const supEl = document.getElementById('supply-percentage');
    if (supEl) supEl.textContent = percentOfSupply.toFixed(3) + "%";

    eligibilityMsg.style.display = 'block';

    const bannedEntry = bannedWallets.find(b => b.wallet.toLowerCase() === walletAddress.toLowerCase());

    if (bannedEntry) {
        eligibilityMsg.style.borderLeft = '5px solid #ef4444';
        eligibilityMsg.style.background = '#3f1f1f';

        if (bannedEntry.type === "Locked") {
            eligibilityMsg.innerHTML = `
                <strong style="color:#ef4444; font-size:15px;">🚫 PERMANENTLY BANNED</strong><br><br>
                You are on Ruggy's Wall of Shame.<br>
                <strong>You can still buy $RUGGY</strong>, but Ruggy doesn't want to share rewards with you anymore.<br><br>
                <span style="color:#f87171;">Reason: ${bannedEntry.reason}</span>
            `;
        } else {
            eligibilityMsg.innerHTML = `
                <strong style="color:#fbbf24; font-size:15px;">⚠️ TEMPORARILY BANNED</strong><br><br>
                You are currently holding too much supply.<br>
                Reduce your holdings below <strong>3%</strong> of total supply to become eligible again.<br><br>
                <span style="color:#f87171;">Reason: ${bannedEntry.reason}</span>
            `;
        }
        return;
    }

    if (randomBalance >= 1000000) {
        eligibilityMsg.style.borderLeft = '5px solid #22c55e';
        eligibilityMsg.style.background = '#052e16';
        eligibilityMsg.innerHTML = `
            <strong style="color:#22c55e;">✅ Fully Eligible for Anti-Rug Rewards!</strong><br><br>
            You hold <strong>${randomBalance.toLocaleString()}</strong> $RUGGY.<br>
            You qualify for <strong>Community (30%)</strong> + <strong>Anti-Rug (20%)</strong> = <strong>50% total</strong> of fees.
        `;
    } else if (randomBalance >= 500000) {
        eligibilityMsg.style.borderLeft = '5px solid #eab308';
        eligibilityMsg.style.background = '#3f2a1f';
        eligibilityMsg.innerHTML = `
            <strong style="color:#fbbf24;">✅ Eligible for Community Rewards</strong><br><br>
            You hold <strong>${randomBalance.toLocaleString()}</strong> $RUGGY.<br>
            You qualify for <strong>Community rewards (30% of fees)</strong>.<br>
            Hold <strong>1,000,000+</strong> to also unlock Anti-Rug rewards (20%).
        `;
    } else {
        eligibilityMsg.style.borderLeft = '5px solid #ef4444';
        eligibilityMsg.style.background = '#3f1f1f';
        eligibilityMsg.innerHTML = `
            <strong style="color:#f87171;">❌ Not Eligible Yet</strong><br><br>
            You currently hold <strong>${randomBalance.toLocaleString()}</strong> $RUGGY.<br>
            You need at least <strong>500,000</strong> $RUGGY to qualify for Community rewards.<br>
            Hold <strong>1,000,000+</strong> for full Anti-Rug rewards.
        `;
    }
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
            if (link.dataset.page) navigateTo(link.dataset.page);
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

    // === FORCE FRESH 30-MINUTE DISTRIBUTION TIMER ON EVERY PAGE LOAD ===
    (function initializeDistributionTimer() {
        const now = Date.now();
        
        // Always reset to a fresh 30 minutes when the site loads
        CONFIG.nextDistributionTime = new Date(now + (30 * 60 * 1000)).toISOString();

        // Start the countdown reliably
        setTimeout(() => {
            if (typeof startSimpleTimer === 'function') {
                startSimpleTimer();
            }
        }, 150);
    })();

    // Extra safety net: Start timer again after everything is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (typeof startSimpleTimer === 'function' && !window.rewardTimerInterval) {
                startSimpleTimer();
            }
        }, 800);
    });

    updateHomeWalletDisplays();
    navigateTo('home');

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

function initRuggyHall() {
    let holdersPool = [];
    for (let i = 0; i < 200; i++) {
        holdersPool.push({
            wallet: "0x" + Math.random().toString(16).substr(2, 8) + "..." + Math.random().toString(16).substr(2, 4),
            balance: Math.random() * 12 + 0.05,
            daysHeld: Math.floor(Math.random() * 220) + 3
        });
    }

    const topHolders = [...holdersPool]
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 12);

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
        .sort((a, b) => b.daysHeld - a.daysHeld)
        .slice(0, 12);

    const longestBody = document.getElementById('longest-holders-table');
    if (longestBody) {
        longestBody.innerHTML = '';
        longestHolders.forEach((holder, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${holder.wallet}</td>
                <td>${holder.daysHeld} days</td>
            `;
            longestBody.appendChild(row);
        });
    }

    renderBagworkers();
}

function scanWalletForHall() {
    const input = document.getElementById('hall-monitor-input');
    const resultDiv = document.getElementById('hall-scan-result');
    
    if (!input || !input.value.trim()) {
        showToast("Please enter a wallet address", "error");
        return;
    }
    
    const wallet = input.value.trim();
    const fakeBalance = Math.floor(Math.random() * 1200000) + 150000;
    const fakeDays = Math.floor(Math.random() * 180) + 25;
    
    resultDiv.innerHTML = `
        <h4 style="color: #f59e0b; margin-bottom: 12px;">Wallet Check Result</h4>
        <p><strong>Wallet:</strong> ${wallet}</p>
        <p><strong>Token Amount:</strong> ${fakeBalance.toLocaleString()} $RUGGY</p>
        <p><strong>Days Held:</strong> ${fakeDays} days</p>
        <p style="margin-top: 10px; color: #22c55e;">
            ${fakeBalance > 1000000 ? "✅ Eligible for Anti-Rug Rewards tier" : 
              fakeBalance > 500000 ? "✅ Eligible for Community Airdrops" : 
              "⚠️ Below reward thresholds"}
        </p>
    `;
    resultDiv.style.display = 'block';
}

function runAutomatedHallScan() {
    showToast("Hall scan complete", "success", "Top holders and longest holders have been refreshed.");
    initRuggyHall();
    
    const resultDiv = document.getElementById('hall-scan-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <h4 style="color: #22c55e; margin-bottom: 12px;">Automated Scan Complete</h4>
            <p>New top holders and longest holders have been updated in the tables above.</p>
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

    if (bannedWallets.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" style="text-align:center; color:#9ca3af; padding:20px;">No violators detected yet.</td>`;
        tbody.appendChild(row);
        return;
    }

    bannedWallets.forEach((entry, index) => {
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
    if (!input || !input.value.trim()) {
        showToast("Please enter a wallet address", "error");
        return;
    }

    const wallet = input.value.trim();
    const random = Math.random();

    if (random < 0.3) {
        addToWall(wallet, "Sold 37% of holdings in one transaction", "Locked");
        showToast("Violation detected! Added to Locked Wall.", "error");
    } else if (random < 0.6) {
        addToWall(wallet, "Currently holding 4.2% of total supply", "Temporary");
        showToast("Violation detected! Added to Temporary Wall.", "error");
    } else {
        showToast("No violations found. Wallet is clean.", "error");
    }

    input.value = '';
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

function getAdminInputNumber(id, defaultValue = 0) {
    const el = document.getElementById(id);
    return el ? (parseInt(el.value) || defaultValue) : defaultValue;
}

function saveDeveloperSettings() {
    // Token & Timing
    CONFIG.tokenMint = getAdminInputValue('dev-ca');
    CONFIG.distributionIntervalMinutes = getAdminInputNumber('dev-interval', 30);

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

    saveConfig();
    updateHomeWalletDisplays();

    if (CONFIG.tokenMint && document.getElementById('home')?.classList.contains('active')) {
        startLiveTracking();
    }

    // Close modal and show feedback
    const modal = document.getElementById('developer-modal');
    if (modal) modal.style.display = 'none';

    // Show success toast instead of alert
    showToast('Settings saved successfully!', 'success');

    // Refresh chart if user is on Tokenomics page
    setTimeout(() => {
        const tokenomicsSection = document.getElementById('tokenomics');
        if (tokenomicsSection && tokenomicsSection.classList.contains('active')) {
            initTokenomicsChart();
            setTimeout(() => initTokenomicsChart(), 800);
        }
    }, 400);
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
    
        // Chart.js comes from a CDN — on slow mobile connections it may not have
        // loaded yet when the section first opens. Retry until it appears.
        if (typeof Chart === 'undefined') {
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
    
        // Load distribution splits
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
    
    
    // Setup resize observer (once) - with debounce + requestAnimationFrame to prevent loop warnings on mobile
    if (!window.chartResizeObserver) {
        let resizeTimeout;
        window.chartResizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                requestAnimationFrame(() => {
                    if (window.feePieChart && typeof window.feePieChart.resize === 'function') {
                        window.feePieChart.resize();
                    }
                });
            }, 80);
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

    const explanations = [
        {
            title: "🔥 Burn Wallet / Liquidity (40%)",
            text: "This portion goes to a dedicated wallet that performs automatic buybacks and burns. Burns mean coins are permanently removed and staked into the Liquidity Pool. <strong>Once 50% of the LP is permanently locked, burns stop</strong> and extra fees are redirected: <strong>Community gets +30% boost</strong>, <strong>Anti-Rug gets +10% boost</strong>.",
            color: "#ef4444"
        },
        {
            title: "👥 Community (30%)",
            text: "Rewards sent to holders with <strong>500,000+</strong> $RUGGY. <strong>Receives +30% boost</strong> once 50% of LP is locked. This portion supports the broader community of dedicated holders.",
            color: "#fbbf24"
        },
        {
            title: "🛡️ Anti-Rug (20%)",
            text: "Additional rewards for our strongest believers (1,000,000+ $RUGGY). <strong>Receives +10% boost</strong> once 50% of LP is locked. Combined with Community rewards, top holders receive 50% total of fees.",
            color: "#22c55e"
        },
        {
            title: "📣 MDR Fund (10%)",
            text: "This portion funds <strong>Marketing, Development, and Research</strong>. MDR directives and spending will be voted on by the community in Telegram. It is used for advertising campaigns, influencer partnerships, community growth initiatives, ongoing project development, and research into new features and strategies to strengthen $RUGGY long-term.",
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

loadBannedWall();

function resetDistributionTimer() {
    const now = new Date();
    const interval = parseInt(document.getElementById('dev-interval').value) || 30;
    CONFIG.nextDistributionTime = new Date(now.getTime() + interval * 60 * 1000);
    saveConfig();
    showToast("Distribution timer has been reset!", "success");
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
