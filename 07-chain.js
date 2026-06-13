/* Part of the Ruggy Rewards app. CHAIN CONNECTOR (read layer).
   When enabled in the admin panel (⛓ Chain section), this connects the
   site to the deployed devnet/mainnet program and replaces simulated
   numbers with real chain state:
     - distribution countdown <- Config.last_distribution + interval
     - lottery jackpot display <- daily Lottery.pot
     - Ruggy.Chain.* API: config(), lottery(kind), hall(), isBanned(),
       checkEligibility(wallet) — used by pages and (next step) buttons.
   Loads @solana/web3.js from CDN lazily, only when chain mode is on.
   Account layouts mirror programs/ruggy/src/lib.rs — keep in sync. */

const Chain = {
    REFRESH_MS: 30_000,
    _conn: null,
    _timer: null,
    _pdas: null,

    get settings() {
        return (typeof CONFIG !== 'undefined' && CONFIG.chain) || {};
    },

    get enabled() {
        const s = this.settings;
        return !!(s.enabled && s.programId && s.mint);
    },

    async start() {
        if (this._timer) { clearInterval(this._timer); this._timer = null; }
        if (!this.enabled) return;
        try {
            await this._loadWeb3();
            this._connect();
            await this.refresh();
            this._timer = setInterval(() => this.refresh().catch(() => {}), this.REFRESH_MS);
            console.log('[Ruggy.Chain] live —', this.settings.rpc);
        } catch (err) {
            reportUIError(err, 'chain connector');
        }
    },

    _loadWeb3() {
        if (window.solanaWeb3) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://unpkg.com/@solana/web3.js@1.95.3/lib/index.iife.min.js';
            s.onload = resolve;
            s.onerror = () => reject(new Error('web3.js CDN failed to load'));
            document.head.appendChild(s);
        });
    },

    _connect() {
        const W = window.solanaWeb3;
        const s = this.settings;
        this._conn = new W.Connection(s.rpc || 'https://api.devnet.solana.com', 'confirmed');
        const programId = new W.PublicKey(s.programId);
        const mint = new W.PublicKey(s.mint);
        const find = (...seeds) => W.PublicKey.findProgramAddressSync(seeds, programId)[0];
        const m = mint.toBuffer();
        const te = new TextEncoder();
        this._pdas = {
            mint,
            programId,
            config: find(te.encode('config'), m),
            hall: find(te.encode('hall'), m),
            lottery: (k) => find(te.encode('lottery'), m, new Uint8Array([k])),
            receipt: (w) => find(te.encode('rewards'), m, w.toBuffer()),
        };
    },

    async _account(pubkey) {
        const info = await this._conn.getAccountInfo(pubkey);
        if (!info) return null;
        return new DataView(info.data.buffer, info.data.byteOffset, info.data.byteLength);
    },

    // ---- decoders (offsets mirror lib.rs; 8-byte anchor discriminator) ----
    async config() {
        const d = await this._account(this._pdas.config);
        if (!d) return null;
        const bannedCount = d.getUint32(96, true);
        const banned = [];
        for (let i = 0; i < bannedCount; i++) {
            const off = 100 + i * 32;
            banned.push(new window.solanaWeb3.PublicKey(
                new Uint8Array(d.buffer, d.byteOffset + off, 32)).toBase58());
        }
        return {
            distributionInterval: Number(d.getBigInt64(72, true)),
            lastDistribution: Number(d.getBigInt64(80, true)),
            airdropThreshold: d.getBigUint64(88, true),
            banned,
        };
    },

    async lottery(kind) {
        const d = await this._account(this._pdas.lottery(kind));
        if (!d) return null;
        return {
            kind,
            ticketPrice: d.getBigUint64(73, true),
            drawInterval: Number(d.getBigInt64(83, true)),
            lastDraw: Number(d.getBigInt64(91, true)),
            round: Number(d.getBigUint64(99, true)),
            pot: d.getBigUint64(107, true),
            entrants: d.getUint32(115, true),
        };
    },

    async hall() {
        const d = await this._account(this._pdas.hall);
        if (!d) return null;
        const count = d.getUint8(48);
        const entries = [];
        for (let i = 0; i < count; i++) {
            const off = 49 + i * 48;
            entries.push({
                wallet: new window.solanaWeb3.PublicKey(
                    new Uint8Array(d.buffer, d.byteOffset + off, 32)).toBase58(),
                amount: d.getBigUint64(off + 32, true),
            });
        }
        return { updatedAt: Number(d.getBigInt64(40, true)), entries };
    },

    async checkEligibility(walletBase58) {
        const W = window.solanaWeb3;
        const cfg = await this.config();
        if (!cfg) return null;
        const onWall = cfg.banned.includes(walletBase58);
        let balance = 0n;
        try {
            const res = await this._conn.getParsedTokenAccountsByOwner(
                new W.PublicKey(walletBase58), { mint: this._pdas.mint });
            for (const a of res.value) {
                balance += BigInt(a.account.data.parsed.info.tokenAmount.amount);
            }
        } catch (_) { /* none */ }
        return {
            balance,
            threshold: cfg.airdropThreshold,
            onWall,
            eligible: balance >= cfg.airdropThreshold && !onWall,
        };
    },

    // ---- push live values into the page ----
    fmt(baseUnits, decimals = 9) {
        return (Number(baseUnits) / 10 ** decimals).toLocaleString(undefined, { maximumFractionDigits: 0 });
    },

    async refresh() {
        const cfg = await this.config();
        if (cfg && cfg.lastDistribution > 0) {
            const nextMs = (cfg.lastDistribution + cfg.distributionInterval) * 1000;
            if (nextMs > Date.now() &&
                CONFIG.nextDistributionTime !== new Date(nextMs).toISOString()) {
                CONFIG.nextDistributionTime = new Date(nextMs).toISOString();
                CONFIG.distributionIntervalMinutes = Math.round(cfg.distributionInterval / 60);
                if (window.rewardTimerInterval) {
                    clearInterval(window.rewardTimerInterval);
                    window.rewardTimerInterval = null;
                }
                if (typeof startSimpleTimer === 'function') startSimpleTimer();
            }
        }
        const daily = await this.lottery(0);
        if (daily) {
            const el = document.getElementById('lotto-jackpot-display');
            if (el) el.textContent = this.fmt(daily.pot) + ' RUGGY';
        }
    },
};

function applyChainSettings() {
    Chain.start();
}
window.RuggyChain = Chain;
window.applyChainSettings = applyChainSettings;

document.addEventListener('DOMContentLoaded', () => {
    // CONFIG is loaded by 04-pages-admin's DOMContentLoaded (earlier file);
    // small delay lets it land before we read chain settings.
    setTimeout(() => Chain.start(), 800);
});
