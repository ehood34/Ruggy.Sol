// ============================================================================
// 07-chain.js — LIVE on-chain reader for the Ruggy Rewards program (devnet)
// ----------------------------------------------------------------------------
// Dormant until enabled in Admin → ⛓ Chain. When enabled with a programId +
// mint + rpc, it reads REAL on-chain state and exposes it to the rest of the
// site through window.Ruggy.Chain. Read-only: no transactions are sent here.
//
// Offsets below mirror the structs in lib.rs exactly (8-byte Anchor
// discriminator first). If you change the program's struct field order, update
// these offsets to match.
// ============================================================================
(function () {
  'use strict';

  const Chain = {
    _conn: null,
    _pdas: null,
    _ready: false,

    get settings() {
      // Merge both possible config sources. CONFIG.chain is where the Admin
      // panel SAVES values, so it wins; RUGGY_SETTINGS.chain is a fallback.
      const a = (window.RUGGY_SETTINGS && window.RUGGY_SETTINGS.chain) || {};
      const b = (window.CONFIG && window.CONFIG.chain) || {};
      const c = Object.assign({}, a, b); // b (CONFIG.chain) overrides a
      return {
        enabled: !!c.enabled,
        rpc: c.rpc || 'https://api.devnet.solana.com',
        programId: c.programId || '',
        mint: c.mint || '',
      };
    },

    isConfigured() {
      const s = this.settings;
      return !!(s.enabled && s.programId && s.mint);
    },

    async _ensureWeb3() {
      if (window.solanaWeb3) return;
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/@solana/web3.js@1.95.3/lib/index.iife.min.js';
        s.onload = resolve;
        s.onerror = () => reject(new Error('web3.js failed to load'));
        document.head.appendChild(s);
      });
    },

    async init() {
      if (!this.isConfigured()) { console.warn('[Ruggy.Chain] not configured (enable + programId + mint in Admin)'); return false; }
      try {
        await this._ensureWeb3();
        const W = window.solanaWeb3;
        if (!W) throw new Error('web3.js global (window.solanaWeb3) missing after load');
        const s = this.settings;
        console.log('[Ruggy.Chain] init step 1: settings', s);

        this._conn = new W.Connection(s.rpc, 'confirmed');
        console.log('[Ruggy.Chain] init step 2: connection ok');

        let programId;
        try { programId = new W.PublicKey(s.programId); }
        catch (e) { throw new Error('Bad Program ID "' + s.programId + '": ' + e.message); }
        console.log('[Ruggy.Chain] init step 3: programId ok', programId.toBase58());

        const seed = (str) => (W.Buffer ? W.Buffer.from(str, 'utf8') : new TextEncoder().encode(str));
        const find = (...seeds) => W.PublicKey.findProgramAddressSync(seeds, programId)[0];
        this._pdas = {
          programId,
          config: find(seed('config')),
          burnVault: find(seed('burn_vault')),
          stakeOf: (ownerB58) => find(seed('stake'), new W.PublicKey(ownerB58).toBuffer()),
        };
        this._ready = true;
        console.log('[Ruggy.Chain] init step 4: PDAs derived ✓');
        console.log('[Ruggy.Chain] config PDA:', this._pdas.config.toBase58());
        console.log('[Ruggy.Chain] live on', s.rpc);
        return true;
      } catch (e) {
        console.error('[Ruggy.Chain] init FAILED:', e.message, e);
        return false;
      }
    },

    // Ensure the connector is initialized before any read. Self-heals if the
    // page-load auto-init didn't run (e.g. settings loaded after DOMContentLoaded).
    async _ensureReady() {
      if (this._ready && this._pdas) return true;
      return await this.init();
    },

    async _account(pubkey) {
      const info = await this._conn.getAccountInfo(pubkey);
      if (!info || !info.data) return null;
      return new DataView(info.data.buffer, info.data.byteOffset, info.data.byteLength);
    },

    _pk(view, off) {
      const W = window.solanaWeb3;
      const bytes = new Uint8Array(view.buffer, view.byteOffset + off, 32);
      return new W.PublicKey(bytes).toBase58();
    },
    _u64(view, off) {
      const lo = view.getUint32(off, true);
      const hi = view.getUint32(off + 4, true);
      return hi * 4294967296 + lo;
    },

    // ---- Config (offsets after 8-byte discriminator) ----
    async config() {
      if (!(await this._ensureReady())) return null;
      const d = await this._account(this._pdas.config);
      if (!d) return null;
      return {
        authority:          this._pk(d, 8),
        mint:               this._pk(d, 40),
        mdrWallet:          this._pk(d, 72),
        communityThreshold: this._u64(d, 104),
        antirugThreshold:   this._u64(d, 112),
        burnBps:            d.getUint16(120, true),
        communityBps:       d.getUint16(122, true),
        antirugBps:         d.getUint16(124, true),
        mdrBps:             d.getUint16(126, true),
        burnStakeThreshold: this._u64(d, 128),
        totalDistributed:   this._u64(d, 136),
        totalStaked:        this._u64(d, 144),
        paused:             d.getUint8(152) === 1,
      };
    },

    // ---- A wallet's stake position (or null if none) ----
    async stakeOf(walletB58) {
      if (!(await this._ensureReady())) return null;
      try {
        const d = await this._account(this._pdas.stakeOf(walletB58));
        if (!d) return null;
        return {
          owner:      this._pk(d, 8),
          amount:     this._u64(d, 40),
          lockDays:   d.getUint32(48, true),
          lastUpdate: this._u64(d, 52),
        };
      } catch (_) { return null; }
    },

    // ---- Eligibility for a wallet, computed from live on-chain stake ----
    async eligibility(walletB58) {
      const cfg = await this.config();
      const pos = await this.stakeOf(walletB58);
      const staked = pos ? pos.amount : 0;
      const communityReq = cfg ? cfg.communityThreshold : 0;
      const antiRugReq = cfg ? cfg.antirugThreshold : 0;
      const community = staked >= communityReq;
      const antiRug = staked >= antiRugReq;
      return {
        source: 'chain',
        connected: !!walletB58,
        wallet: walletB58 || null,
        staked, communityReq, antiRugReq, community, antiRug,
        tier: antiRug ? 'antiRug' : community ? 'community' : 'none',
        toCommunity: Math.max(0, communityReq - staked),
        toAntiRug: Math.max(0, antiRugReq - staked),
      };
    },

    // ---- Pool-wide totals for the donut / stats (live) ----
    async poolTotals() {
      const cfg = await this.config();
      if (!cfg) return null;
      return {
        totalStaked: cfg.totalStaked,
        totalDistributed: cfg.totalDistributed,
        burnStakeThreshold: cfg.burnStakeThreshold,
      };
    },

    // ---- Push live chain data into the page's stat elements ----
    async refreshUI() {
      const cfg = await this.config();
      if (!cfg) return false;
      const fmt = (n) => Number(n / 1e6).toLocaleString(undefined, { maximumFractionDigits: 0 });
      const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };

      // Pool page stats (were "Loading...")
      set('pool-burned', fmt(cfg.totalDistributed * cfg.burnBps / 10000) + ' 🔥');
      set('pool-holders', fmt(cfg.totalStaked) + ' staked');
      set('pool-volume', fmt(cfg.totalDistributed));
      set('pool-liquidity', fmt(cfg.totalStaked));

      // Distribution split percentages (fee breakdown) from live bps
      set('fee-bd-liquidity', (cfg.burnBps / 100) + '%');
      set('fee-bd-community', (cfg.communityBps / 100) + '%');
      set('fee-bd-antirug', (cfg.antirugBps / 100) + '%');
      set('fee-bd-creator', (cfg.mdrBps / 100) + '%');

      // Re-render the pool donut with live totals if it's available
      if (typeof window.renderStakeDonut === 'function') {
        try { window.renderStakeDonut(); } catch (_) {}
      }
      console.log('[Ruggy.Chain] UI refreshed with live data');
      return true;
    },
  };

  window.RuggyChain = Chain;
  if (window.Ruggy) {
    try { Object.defineProperty(window.Ruggy, 'Chain', { value: Chain, configurable: true }); } catch (_) {}
  }

  // Called by the Admin panel right after Save. Re-reads settings and either
  // (re)connects to the chain or tears down if chain mode was switched off.
  window.applyChainSettings = function applyChainSettings() {
    Chain._ready = false;
    Chain._conn = null;
    Chain._pdas = null;
    if (Chain.isConfigured()) {
      Chain.init().then((ok) => {
        if (ok && typeof showToast === 'function') {
          showToast('Chain connected', 'success', 'Reading live on-chain data.');
        }
      });
    }
  };

  // On-page connection tester. Saves the form, runs init with diagnostics, and
  // writes a plain-English result into #chain-test-result. No console needed.
  window.testChainConnection = async function testChainConnection() {
    const box = document.getElementById('chain-test-result');
    const show = (html, color) => {
      if (!box) return;
      box.style.display = 'block';
      box.style.background = color === 'ok' ? '#052e1a' : color === 'warn' ? '#3f2d05' : '#3f0d0d';
      box.style.border = '1px solid ' + (color === 'ok' ? '#22c55e' : color === 'warn' ? '#f59e0b' : '#ef4444');
      box.style.color = color === 'ok' ? '#bbf7d0' : color === 'warn' ? '#fde68a' : '#fecaca';
      box.textContent = html;
    };

    // 1) Save the form first so we test what's actually entered.
    if (typeof saveDeveloperSettings === 'function') {
      try { saveDeveloperSettings(); } catch (_) {}
    }
    show('Testing… reading the form, loading web3, deriving PDAs…', 'warn');

    // 2) Read straight from the inputs (most reliable — bypasses any config merge).
    const val = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const enabled = !!(document.getElementById('chain-enabled') && document.getElementById('chain-enabled').checked);
    const programId = val('chain-program');
    const mint = val('chain-mint');
    const rpc = val('chain-rpc') || 'https://api.devnet.solana.com';

    let lines = [];
    lines.push('Enabled checkbox : ' + (enabled ? 'YES' : 'NO ❌ (check the box)'));
    lines.push('Program ID       : ' + (programId ? programId : '❌ EMPTY'));
    lines.push('Token Mint       : ' + (mint ? mint : '❌ EMPTY'));
    lines.push('RPC              : ' + rpc);

    if (!enabled || !programId || !mint) {
      lines.push('\n⛔ Fill in all three fields and check the box, then test again.');
      show(lines.join('\n'), 'err');
      return;
    }

    // 3) Force settings into CONFIG.chain directly, then init.
    try {
      window.CONFIG = window.CONFIG || {};
      CONFIG.chain = { enabled: true, rpc, programId, mint };
    } catch (_) {}

    // 4) Validate the Program ID is a real address before init.
    try {
      await Chain._ensureWeb3();
      const W = window.solanaWeb3;
      if (!W) { lines.push('\n❌ web3.js library did not load (network/CDN issue).'); show(lines.join('\n'),'err'); return; }
      try { new W.PublicKey(programId); }
      catch (e) { lines.push('\n❌ Program ID is not a valid Solana address. Check for extra spaces or missing characters.'); show(lines.join('\n'),'err'); return; }
      try { new W.PublicKey(mint); }
      catch (e) { lines.push('\n❌ Token Mint is not a valid Solana address.'); show(lines.join('\n'),'err'); return; }
    } catch (e) {
      lines.push('\n❌ Could not load web3: ' + e.message); show(lines.join('\n'),'err'); return;
    }

    // 5) Init + read config.
    Chain._ready = false; Chain._pdas = null; Chain._conn = null;
    const ok = await Chain.init();
    if (!ok) { lines.push('\n❌ init() failed — see browser console for the red error.'); show(lines.join('\n'),'err'); return; }

    lines.push('\nConfig PDA       : ' + Chain._pdas.config.toBase58());
    const cfg = await Chain.config();
    if (!cfg) {
      lines.push('\n⚠️ Connected, but NO data at that Config PDA.');
      lines.push('This almost always means the Program ID doesn\'t match your');
      lines.push('deployed program. Compare the Config PDA above to the');
      lines.push('CONFIG_PDA your 2-initialize.ts script printed in Playground.');
      show(lines.join('\n'), 'warn');
      return;
    }

    lines.push('\n✅ CONNECTED & READING LIVE DATA:');
    lines.push('  authority   : ' + cfg.authority.slice(0, 12) + '…');
    lines.push('  splits      : ' + cfg.burnBps + '/' + cfg.communityBps + '/' + cfg.antirugBps + '/' + cfg.mdrBps);
    lines.push('  distributed : ' + (cfg.totalDistributed / 1e6).toLocaleString());
    lines.push('  staked      : ' + (cfg.totalStaked / 1e6).toLocaleString());
    lines.push('\nThe homepage stats + pool donut now show this live data.');
    show(lines.join('\n'), 'ok');
    // Push the data into the page immediately, and keep it fresh every 30s.
    Chain.refreshUI();
    Chain.startAutoRefresh();
    if (typeof showToast === 'function') showToast('Chain connected ✓', 'success', 'Live data is now showing on the site.');
  };

  // Refresh live data periodically while chain mode is on.
  Chain.startAutoRefresh = function () {
    if (Chain._refreshTimer) return;
    Chain._refreshTimer = setInterval(() => {
      if (Chain.isConfigured()) Chain.refreshUI();
    }, 30000);
  };

  function autoStart() {
    if (Chain.isConfigured()) {
      Chain.init().then((ok) => {
        if (ok) {
          Chain.refreshUI();
          Chain.startAutoRefresh();
        }
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoStart);
  } else {
    autoStart();
  }
})();
