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
      if (!this.isConfigured()) return false;
      try {
        await this._ensureWeb3();
        const W = window.solanaWeb3;
        const s = this.settings;
        this._conn = new W.Connection(s.rpc, 'confirmed');
        const programId = new W.PublicKey(s.programId);
        const te = new TextEncoder();
        const find = (...seeds) => W.PublicKey.findProgramAddressSync(seeds, programId)[0];
        this._pdas = {
          programId,
          config: find(te.encode('config')),
          burnVault: find(te.encode('burn_vault')),
          stakeOf: (ownerB58) => find(te.encode('stake'), new W.PublicKey(ownerB58).toBuffer()),
        };
        this._ready = true;
        console.log('[Ruggy.Chain] live on', s.rpc, '— program', s.programId.slice(0, 8) + '…');
        return true;
      } catch (e) {
        console.warn('[Ruggy.Chain] init failed:', e.message);
        return false;
      }
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
      if (!this._ready) return null;
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
      if (!this._ready) return null;
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { if (Chain.isConfigured()) Chain.init(); });
  } else {
    if (Chain.isConfigured()) Chain.init();
  }
})();
