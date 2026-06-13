/* Part of the Ruggy Rewards app. Files load in numeric order via
   <script defer> tags in index.html; execution order matters for
   the decorator chain and error-boundary application. */

/* =====================================================================
   SECTION 6 — FINAL WIRING
   Copy-CA · page transitions (decorates navigateTo) · nav links ·
   error-boundary application · Ruggy namespace assembly
   ===================================================================== */
// Toast animation
const style = document.createElement('style');
style.textContent = `
    @keyframes toastSlideIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ==================== SCROLL TO TOP BUTTON ====================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleScrollToTopButton() {
    const btn = document.getElementById('scroll-to-top-btn');
    if (!btn) return;

    if (window.scrollY > 600) {
        btn.style.display = 'flex';
    } else {
        btn.style.display = 'none';
    }
}

window.addEventListener('scroll', toggleScrollToTopButton);
window.addEventListener('load', toggleScrollToTopButton);

// ==================== COPY CA FUNCTION ====================
function copyTokenCA() {
    // CONFIG is a top-level `let`, so it is NOT on window — the old
    // window.CONFIG lookup was always undefined and this always failed.
    const ca = (typeof CONFIG !== 'undefined' && CONFIG.tokenMint) ? CONFIG.tokenMint : '';

    if (!ca) {
        showToast("No Token CA set yet. Please set it in the Developer panel.", "error");
        return;
    }

    navigator.clipboard.writeText(ca).then(() => {
        // Show nice toast
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#22c55e;color:white;padding:12px 24px;border-radius:9999px;font-size:14px;box-shadow:0 4px 15px rgba(34,197,94,0.4);z-index:1000;';
        toast.textContent = '✅ CA copied to clipboard!';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transition = 'all 0.3s ease';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 1800);
    }).catch(() => {
        // Fallback
        prompt("Copy this CA:", ca);
    });
}

// ==================== ENHANCED PAGE TRANSITIONS ====================
const originalNavigateTo = window.navigateTo;
window.navigateTo = function(page) {
    window.scrollTo(0, 0); // land at top immediately, before the transition
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        if (section.classList.contains('active')) {
            section.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            section.style.opacity = '0';
            section.style.transform = 'translateY(8px)';
            
            setTimeout(() => {
                section.classList.remove('active');
                section.style.opacity = '';
                section.style.transform = '';
                
                const target = document.getElementById(page);
                if (target) {
                    target.classList.add('active');
                    target.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    target.style.opacity = '0';
                    target.style.transform = 'translateY(8px)';
                    
                    // Trigger reflow
                    void target.offsetWidth;
                    
                    target.style.opacity = '1';
                    target.style.transform = 'translateY(0)';
                }

                // Call the original navigateTo logic (padding + smart text wrapping)
                // after the animation timing
                if (typeof originalNavigateTo === 'function') {
                    originalNavigateTo(page);
                }
            }, 220);
        }
    });
    
    // Update active nav link immediately
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) link.classList.add('active');
    });
};

// (Top-level function declarations are already global — no manual exposure needed.)

// ==================== APPLY ERROR BOUNDARIES ====================
// Runs last, after every script block has defined (and decorated)
// its functions, so we wrap the final versions. Rebinding the window
// property also rebinds the global, so internal bare calls are
// protected too. Errors log to the console and surface one throttled
// toast instead of silently killing the feature or the page.
(function applyErrorBoundaries() {
    const CRITICAL_FUNCTIONS = [
        // wallet
        'connectWallet', 'disconnectWallet', 'tryAutoReconnect',
        'selectAndConnectWallet', 'connectSpecificWallet',
        // navigation & layout
        'navigateTo', 'toggleMobileMenu', 'applySmartTextWrapping',
        // modals
        'showWalletModal', 'openImageModal', 'showDeveloperModal',
        // chart
        'initTokenomicsChart',
        // admin
        'attemptAdminLogin', 'adminLogout', 'saveDeveloperSettings',
        'triggerDistribution', 'resetDistributionTimer', 'toggleRewardsPause',
        'connectDevWalletForHome', 'startLiveTracking',
        'runAutomatedWallScan', 'runAutomatedHallScan',
        'scanWalletForWall', 'scanWalletForHall', 'renderBannedTable',
        // user features
        'buyLottoTickets', 'claimDailyFreeTicket', 'claimFromVault',
        'stakeRuggy', 'submitAbsolutionStake', 'calculateAbsolutionStake',
        'checkLockedBanStatus', 'checkRewardsEligibility', 'copyTokenCA'
    ];

    let wrapped = 0;
    for (const name of CRITICAL_FUNCTIONS) {
        const fn = window[name];
        if (typeof fn === 'function' && !fn.__bounded) {
            window[name] = withErrorBoundary(fn, name);
            wrapped++;
        }
    }
})();

// ==================== RUGGY NAMESPACE ====================
// Structured public API over the site's subsystems. Assembled after the
// error boundaries so every member is the final protected version.
// The legacy globals remain as aliases (the delegated data-action system
// and internal cross-references use them); new code should prefer Ruggy.*
// and call sites can migrate incrementally.
window.Ruggy = {
    Settings: RUGGY_SETTINGS,
    get Config() { return CONFIG; },           // runtime config (dev panel)
    DOM,

    UI: {
        toast: (...a) => window.showToast(...a),
        confirm: (...a) => window.showConfirm(...a),
        navigate: (...a) => window.navigateTo(...a),
        reportError: (...a) => reportUIError(...a),
        withErrorBoundary
    },

    Wallet: {
        providers: WALLET_PROVIDERS,
        get state() { return window.ruggyWallet; },
        connect: (...a) => window.connectWallet(...a),
        disconnect: (...a) => window.disconnectWallet(...a),
        autoReconnect: (...a) => window.tryAutoReconnect(...a),
        showModal: (...a) => window.showWalletModal(...a)
    },

    Admin: {
        isLoggedIn: () => isAdminLoggedIn(),
        openLogin: (...a) => window.openAdminWithLogin(...a),
        logout: (...a) => window.adminLogout(...a),
        saveSettings: (...a) => window.saveDeveloperSettings(...a),
        triggerDistribution: (...a) => window.triggerDistribution(...a),
        applySettings: (...a) => window.applySiteSettings(...a),
        exportConfig: (...a) => window.exportSiteConfig(...a),
        resetData: (...a) => window.resetSiteData(...a)
    },

    Pages: {
        Lottery: {
            buyTickets: (...a) => window.buyLottoTickets(...a),
            claimFreeTicket: (...a) => window.claimDailyFreeTicket(...a)
        },
        Pool: {
            stake: (...a) => window.stakeRuggy(...a)
        },
        Rewards: {
            checkEligibility: (...a) => window.checkRewardsEligibility(...a),
            claimFromVault: (...a) => window.claimFromVault(...a)
        },
        Wall: {
            render: (...a) => window.renderBannedTable(...a),
            scan: (...a) => window.runAutomatedWallScan(...a)
        }
    },

    Chart: {
        init: (...a) => window.initTokenomicsChart(...a)
    },

    Effects: {
        moneyRain: (...a) => window.startMoneyRain(...a)
    },

    get Chain() { return window.RuggyChain; }
};
