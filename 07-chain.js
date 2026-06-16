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
      // Deployed devnet program + mint (defaults so the site reads chain
      // out-of-the-box; Admin panel can still override these).
      const DEFAULT_PROGRAM = '7YFqpu3HbWWrsZTWdfYjh55Wy6b2baaaXBZXZiXB6wN3';
      const DEFAULT_MINT = '2z3wVr3P6meXoWX9xjLjUBvCk283wgswqN5AvAt9jFcc';
      return {
        enabled: c.enabled !== undefined ? !!c.enabled : true,
        rpc: c.rpc || 'https://api.devnet.solana.com',
        programId: c.programId || DEFAULT_PROGRAM,
        mint: c.mint || DEFAULT_MINT,
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

    // ---- Config (offsets after 8-byte discriminator). Layout matches the
    //      deployed program's Config struct (LEN 222). ----
    async config() {
      if (!(await this._ensureReady())) return null;
      const d = await this._account(this._pdas.config);
      if (!d) return null;
      return {
        authority:           this._pk(d, 8),
        mint:                this._pk(d, 40),
        mdrWallet:           this._pk(d, 72),
        communityThreshold:  this._u64(d, 104),
        antirugThreshold:    this._u64(d, 112),
        burnBps:             d.getUint16(120, true),
        communityBps:        d.getUint16(122, true),
        antirugBps:          d.getUint16(124, true),
        mdrBps:              d.getUint16(126, true),
        burnStakeThreshold:  this._u64(d, 128),
        absolutionStakeBps:  d.getUint16(136, true),
        absolutionLockDays:  d.getUint32(138, true),
        ticketPrice:         this._u64(d, 142),
        lotteryMarketingBps: d.getUint16(150, true),
        lotteryBurnBps:      d.getUint16(152, true),
        roundCounter:        this._u64(d, 154),
        currentRound:        this._u64(d, 162),
        totalDistributed:    this._u64(d, 170),
        totalStaked:         this._u64(d, 178),
        // accumulators are u128 (16 bytes) — read as two u64 halves if needed
        paused:              d.getUint8(218) === 1,
        bump:                d.getUint8(219),
        vaultBump:           d.getUint8(220),
        prizeVaultBump:      d.getUint8(221),
      };
    },

    // ---- A wallet's stake position (or null if none). Bucketed layout (LEN 201). ----
    async stakeOf(walletB58) {
      if (!(await this._ensureReady())) return null;
      try {
        const d = await this._account(this._pdas.stakeOf(walletB58));
        if (!d) return null;
        const TIERS = [1, 7, 30, 180, 365, 9999];
        // buckets: [u64;6] at offset 48 (8 bytes each)
        const buckets = [];
        for (let i = 0; i < 6; i++) {
          buckets.push({ lockDays: TIERS[i], amount: this._u64(d, 48 + i * 8) });
        }
        return {
          owner:            this._pk(d, 8),
          amount:           this._u64(d, 40),        // total across buckets
          buckets,                                    // per-tier breakdown
          lastUpdate:       this._u64(d, 144),
          pendingCommunity: this._u64(d, 184),
          pendingAntirug:   this._u64(d, 192),
          lastFreeTicket:   this._u64(d, 200),
          heldFreeTickets:  this._u64(d, 208),
        };
      } catch (_) { return null; }
    },

    // ---- A lottery round's live state (winning numbers + pools) ----
    async roundInfo(roundId) {
      if (!(await this._ensureReady())) return null;
      try {
        const W = window.solanaWeb3;
        const roundPda = W.PublicKey.findProgramAddressSync(
          [this._seed('round'), this._encU64(roundId)], this._pdas.programId)[0];
        const d = await this._account(roundPda);
        if (!d) return null;
        const winningNumbers = [];
        for (let i = 0; i < 5; i++) winningNumbers.push(d.getUint8(95 + i));
        return {
          id:              this._u64(d, 8),
          drawType:        d.getUint8(16),     // 1=daily, 2=weekly
          prizePool:       this._u64(d, 17),
          ticketCount:     this._u64(d, 25),
          entrantCount:    this._u64(d, 33),
          startTs:         this._u64(d, 41),
          endTs:           this._u64(d, 49),
          state:           d.getUint8(57),     // 0 open,1 closed,2 drawn
          consolationPool: this._u64(d, 100),
          drawn:           d.getUint8(108) === 1,
          winningNumbers,                      // [n,n,n,n,n] once drawn
        };
      } catch (_) { return null; }
    },

    // ---- A wallet's entry in a round (ticket count + seed for number derive) ----
    async entryInfo(roundId, walletB58) {
      if (!(await this._ensureReady())) return null;
      try {
        const W = window.solanaWeb3;
        const roundPda = W.PublicKey.findProgramAddressSync(
          [this._seed('round'), this._encU64(roundId)], this._pdas.programId)[0];
        const wallet = new W.PublicKey(walletB58);
        const entryPda = W.PublicKey.findProgramAddressSync(
          [this._seed('entry'), roundPda.toBuffer(), wallet.toBuffer()], this._pdas.programId)[0];
        const d = await this._account(entryPda);
        if (!d) return null;
        // EntryAccount: round@8, wallet@40, tickets@72, free_tickets@80,
        //   ticket_seed@88, claimed@96, bump@97
        const tickets = this._u64(d, 72);
        const freeTickets = this._u64(d, 80);
        const seedLo = d.getUint32(88, true), seedHi = d.getUint32(92, true);
        const ticketSeedBig = (BigInt(seedHi) << 32n) | BigInt(seedLo);
        const claimed = d.getUint8(96) === 1;
        // derive this entry's ticket numbers (one set of 5 per ticket). Paid
        // tickets come first, then free tickets (top indices).
        const ticketsNums = [];
        for (let k = 0; k < tickets; k++) {
          const ts = this.ticketSeed(ticketSeedBig, k);
          ticketsNums.push(this.lottoNumbers(ts));
        }
        const paidCount = tickets - freeTickets;
        return { tickets, freeTickets, paidCount, ticketSeed: ticketSeedBig, claimed, ticketsNums };
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

    // ---- A wallet's ban record (or null if not banned) ----
    async banOf(walletB58) {
      if (!(await this._ensureReady())) return null;
      try {
        const W = window.solanaWeb3;
        const seed = (str) => (W.Buffer ? W.Buffer.from(str, 'utf8') : new TextEncoder().encode(str));
        const banPda = W.PublicKey.findProgramAddressSync(
          [seed('ban'), new W.PublicKey(walletB58).toBuffer()], this._pdas.programId
        )[0];
        const d = await this._account(banPda);
        if (!d) return null; // no account = not banned
        // BanAccount: wallet@8, rugged_usd@40, banned_at@48, reason(string)@56
        const ruggedUsd = this._u64(d, 40);
        const bannedAt = this._u64(d, 48);
        const reasonLen = d.getUint32(56, true);
        let reason = '';
        for (let i = 0; i < reasonLen; i++) reason += String.fromCharCode(d.getUint8(60 + i));
        return { wallet: walletB58, ruggedUsd, bannedAt, reason };
      } catch (_) { return null; }
    },

    // ---- ALL banned wallets (for the Wall). Scans every BanAccount the
    //      program owns via getProgramAccounts. Returns [] if none / on error.
    async allBans() {
      if (!(await this._ensureReady())) return [];
      try {
        const W = window.solanaWeb3;
        const accts = await this._conn.getProgramAccounts(this._pdas.programId, {
          filters: [{ dataSize: 125 }],
        });
        const out = [];
        for (const { account } of accts) {
          try {
            const data = account.data;
            const d = new DataView(data.buffer, data.byteOffset, data.byteLength);
            const walletBytes = new Uint8Array(d.buffer, d.byteOffset + 8, 32);
            const wallet = new W.PublicKey(walletBytes).toBase58();
            const ruggedUsd = this._u64(d, 40);
            const bannedAt = this._u64(d, 48);
            const reasonLen = d.getUint32(56, true);
            let reason = '';
            for (let i = 0; i < reasonLen && i < 64; i++) reason += String.fromCharCode(d.getUint8(60 + i));
            out.push({ wallet, ruggedUsd, bannedAt, reason });
          } catch (_) { /* skip malformed */ }
        }
        return out;
      } catch (e) {
        console.warn('[Ruggy.Chain] allBans scan failed:', e.message);
        return [];
      }
    },

    // ---- ALL stakers (for the Hall). Scans every StakeAccount (dataSize 209)
    //      and returns wallets + total staked, sorted high to low. ----
    async allStakers() {
      if (!(await this._ensureReady())) return [];
      try {
        const W = window.solanaWeb3;
        const accts = await this._conn.getProgramAccounts(this._pdas.programId, {
          filters: [{ dataSize: 217 }],   // StakeAccount::LEN
        });
        const out = [];
        for (const { account } of accts) {
          try {
            const data = account.data;
            const d = new DataView(data.buffer, data.byteOffset, data.byteLength);
            const ownerBytes = new Uint8Array(d.buffer, d.byteOffset + 8, 32);
            const owner = new W.PublicKey(ownerBytes).toBase58();
            const amount = this._u64(d, 40); // total staked (base units)
            if (amount > 0) out.push({ wallet: owner, staked: amount });
          } catch (_) { /* skip malformed */ }
        }
        out.sort((a, b) => b.staked - a.staked);
        return out;
      } catch (e) {
        console.warn('[Ruggy.Chain] allStakers scan failed:', e.message);
        return [];
      }
    },

    // ---- POOL-WIDE staked totals per lock tier (for the donut). Scans every
    //      stake account and sums each of the 6 buckets. Returns
    //      { 1:x, 7:x, 30:x, 180:x, 365:x, 9999:x } in base units. ----
    async poolBuckets() {
      if (!(await this._ensureReady())) return null;
      try {
        const accts = await this._conn.getProgramAccounts(this._pdas.programId, {
          filters: [{ dataSize: 217 }],   // StakeAccount::LEN
        });
        const TIERS = [1, 7, 30, 180, 365, 9999];
        const totals = { 1: 0, 7: 0, 30: 0, 180: 0, 365: 0, 9999: 0 };
        for (const { account } of accts) {
          try {
            const data = account.data;
            const d = new DataView(data.buffer, data.byteOffset, data.byteLength);
            // buckets[u64;6] start at offset 48 (8 bytes each)
            for (let i = 0; i < 6; i++) {
              const v = this._u64(d, 48 + i * 8);
              totals[TIERS[i]] += v;
            }
          } catch (_) { /* skip malformed */ }
        }
        return totals;
      } catch (e) {
        console.warn('[Ruggy.Chain] poolBuckets scan failed:', e.message);
        return null;
      }
    },

    // ---- CLAIM HISTORY for a wallet, read from on-chain tx history. Looks at
    //      recent transactions that touch this wallet's stake PDA and detects
    //      claim_distribution calls (by instruction discriminator), returning
    //      [{ sig, time, type }]. Amounts aren't parsed (would need full event
    //      decode); type is 'Reward Claim'. Best-effort + capped for speed. ----
    async claimHistoryOf(walletB58, limit) {
      if (!(await this._ensureReady())) return [];
      try {
        const W = window.solanaWeb3;
        const stakePda = this._pdas.stakeOf(walletB58);
        const sigs = await this._conn.getSignaturesForAddress(stakePda, { limit: limit || 20 });
        const out = [];
        // discriminator bytes for claim_distribution, as a base58-free match:
        const CLAIM = this._DISC.claim_distribution.join(',');
        for (const s of sigs) {
          if (s.err) continue;
          try {
            const tx = await this._conn.getTransaction(s.signature, { maxSupportedTransactionVersion: 0 });
            if (!tx) continue;
            const msg = tx.transaction.message;
            const keys = (msg.staticAccountKeys || msg.accountKeys || []).map(k => k.toString());
            const progIdx = keys.indexOf(this._pdas.programId.toString());
            if (progIdx < 0) continue;
            const ixs = msg.compiledInstructions || msg.instructions || [];
            let isClaim = false;
            for (const ix of ixs) {
              if (ix.programIdIndex !== progIdx) continue;
              const dataBytes = ix.data ? Array.from(typeof ix.data === 'string'
                ? W.bs58 ? W.bs58.decode(ix.data) : [] : ix.data) : [];
              if (dataBytes.slice(0, 8).join(',') === CLAIM) { isClaim = true; break; }
            }
            if (isClaim) {
              out.push({
                sig: s.signature,
                time: s.blockTime ? new Date(s.blockTime * 1000) : null,
                type: 'Reward Claim',
              });
            }
          } catch (_) { /* skip */ }
        }
        return out;
      } catch (e) {
        console.warn('[Ruggy.Chain] claimHistoryOf failed:', e.message);
        return [];
      }
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

      // Make the homepage market-cap widget use our on-chain mint as the CA,
      // and kick off its Dexscreener live tracking. (Price/mcap only appear once
      // the token actually trades on a DEX — on devnet there's no pool, so those
      // stay "—" until mainnet liquidity exists. The CA prompt clears though.)
      const mint = this.settings.mint;
      if (mint) {
        try {
          window.CONFIG = window.CONFIG || {};
          if (CONFIG.tokenMint !== mint) {
            CONFIG.tokenMint = mint;
            if (typeof startLiveTracking === 'function') startLiveTracking();
          }
        } catch (_) {}
        // show the CA on the page if there's a slot for it
        set('home-token-name', (CONFIG && CONFIG.tokenName) ? CONFIG.tokenName : 'RUGGY');
      }

      // Pool page stats (were "Loading...") — these ARE on-chain
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

      // ---- Sync the Wall from LIVE on-chain bans (replaces localStorage) ----
      try {
        const bans = await this.allBans();
        if (typeof window.setBannedWallFromChain === 'function') {
          window.setBannedWallFromChain(bans);
        } else {
          window.ruggyChainBans = bans;
        }
      } catch (e) {
        console.warn('[Ruggy.Chain] wall sync failed:', e.message);
      }

      // ---- Sync the Hall (Top Holders / Stakers) from LIVE stake accounts ----
      try {
        const stakers = await this.allStakers();
        window.ruggyChainStakers = stakers;
        if (typeof window.setHallFromChain === 'function') {
          window.setHallFromChain(stakers);
        }
      } catch (e) {
        console.warn('[Ruggy.Chain] hall sync failed:', e.message);
      }

      // ---- Pool buckets per lock tier (for the staking donut) ----
      try {
        const buckets = await this.poolBuckets();
        if (buckets) {
          window.ruggyPoolBuckets = buckets;
          if (typeof renderStakeDonut === 'function') renderStakeDonut();
        }
      } catch (e) {
        console.warn('[Ruggy.Chain] pool buckets sync failed:', e.message);
      }

      // ---- Held free-ticket balance for the connected wallet ----
      try {
        if (typeof renderFreeTicketBalance === 'function') renderFreeTicketBalance();
      } catch (_) {}

      // ---- Expose pool ATAs the write-path needs (same accounts the test
      //      scripts derive). Reward pools: community = Config's ATA, anti-rug =
      //      a Config-owned account via createWithSeed. Lottery: prize/burn/mdr. ----
      try {
        const W = window.solanaWeb3;
        const TOK = new W.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
        const configAta = await this._ata(this._pdas.config);
        // anti-rug Config-owned account via the same seed the scripts use
        const owner = this._wallet() ? this._wallet().pubkey : null;
        let antirugAta = null;
        if (owner) {
          antirugAta = await W.PublicKey.createWithSeed(owner, 'ruggy-antirug-v1', TOK);
        }
        window.ruggyRewardPools = {
          communityAta: configAta.toBase58(),
          antirugAta: antirugAta ? antirugAta.toBase58() : null,
        };
        // lottery pools
        const [burnVaultPda] = W.PublicKey.findProgramAddressSync([this._seed('burn_vault')], this._pdas.programId);
        const [prizeVaultPda] = W.PublicKey.findProgramAddressSync([this._seed('prize_vault')], this._pdas.programId);
        const [mdrPda] = W.PublicKey.findProgramAddressSync([this._seed('mdr_pool')], this._pdas.programId);
        const burnVaultAta = await this._ata(burnVaultPda);
        const prizeVaultAta = await this._ata(prizeVaultPda);
        const mdrAta = await this._ata(mdrPda);
        window.ruggyLotteryPools = {
          burnVaultAta: burnVaultAta.toBase58(),
          prizeVaultAta: prizeVaultAta.toBase58(),
          mdrAta: mdrAta.toBase58(),
        };
      } catch (e) {
        console.warn('[Ruggy.Chain] pool ATA derive failed:', e.message);
      }

      console.log('[Ruggy.Chain] UI refreshed with live data');
      return true;
    },

    // ========================================================================
    // WRITE PATH — build, sign (via connected wallet), and send real on-chain
    // transactions. Vanilla web3.js (no Anchor TS lib), so we encode Anchor
    // instructions by hand: 8-byte discriminator + borsh args + account metas.
    // ========================================================================

    // ---- 5-number lotto helpers (match the program EXACTLY via BigInt) ----
    _MASK64: (1n << 64n) - 1n,
    _xorshift(s) {
      const M = this._MASK64;
      s ^= (s << 13n) & M; s &= M;
      s ^= (s >> 7n);      s &= M;
      s ^= (s << 17n) & M; s &= M;
      return s;
    },
    // 5 distinct numbers 1..=35 from a 64-bit seed (matches lotto_numbers)
    lottoNumbers(seedBig) {
      let s = (seedBig === 0n) ? 0xD1B54A32D192ED03n : (seedBig & this._MASK64);
      const out = []; const MAX = 15n;
      while (out.length < 5) {
        s = this._xorshift(s);
        const n = Number((s % MAX) + 1n);
        if (!out.includes(n)) out.push(n);
      }
      return out;
    },
    // per-ticket seed (matches ticket_seed)
    ticketSeed(entrySeedBig, ticketIndex) {
      const M = this._MASK64;
      let s = (entrySeedBig
        + (BigInt(ticketIndex) * 0x9E3779B97F4A7C15n)) & M;
      s = (s * 0xC2B2AE3D27D4EB4Fn) & M;
      s ^= (s >> 33n); s &= M;
      return (s === 0n) ? 0xABCDEF0123456789n : s;
    },
    countMatches(ticketNums, winningNums) {
      let m = 0;
      for (const n of ticketNums) if (winningNums.includes(n)) m++;
      return m;
    },

    // Anchor discriminators (first 8 bytes of sha256("global:<name>")).
    _DISC: {
      open_stake:         [136, 215, 163, 130, 234, 194, 229, 229],
      stake:              [206, 176, 202, 18, 200, 209, 179, 108],
      extend_stake:       [70, 33, 150, 252, 104, 136, 238, 16],
      unstake:            [90, 95, 107, 42, 205, 124, 50, 225],
      buy_tickets:        [48, 16, 122, 137, 24, 214, 198, 58],
      claim_free_ticket:  [85, 181, 122, 25, 240, 20, 104, 82],
      enter_free_tickets: [56, 251, 253, 60, 33, 104, 163, 138],
      claim_distribution: [204, 156, 94, 85, 2, 125, 232, 180],
      claim_prize:        [157, 233, 139, 121, 246, 62, 234, 235],
      set_splits:               [175, 2, 86, 49, 225, 202, 232, 189],
      set_thresholds:           [4, 43, 52, 220, 35, 12, 178, 232],
      set_burn_stake_threshold: [142, 157, 93, 34, 131, 223, 211, 130],
      set_absolution:           [62, 6, 219, 239, 28, 211, 14, 117],
      set_paused:               [91, 60, 125, 192, 176, 225, 166, 218],
      set_ticket_params:        [222, 33, 213, 47, 35, 237, 92, 45],
    },

    // ---- small borsh encoders ----
    _encU64(n) {
      const b = new Uint8Array(8); let v = BigInt(n);
      for (let i = 0; i < 8; i++) { b[i] = Number(v & 0xffn); v >>= 8n; }
      return b;
    },
    _encU32(n) {
      const b = new Uint8Array(4); let v = n >>> 0;
      for (let i = 0; i < 4; i++) { b[i] = v & 0xff; v >>>= 8; }
      return b;
    },
    _encU16(n) {
      const b = new Uint8Array(2); let v = n & 0xffff;
      b[0] = v & 0xff; b[1] = (v >> 8) & 0xff;
      return b;
    },
    _encBool(v) {
      return new Uint8Array([v ? 1 : 0]);
    },
    _concat(arrays) {
      let len = 0; arrays.forEach(a => len += a.length);
      const out = new Uint8Array(len); let off = 0;
      arrays.forEach(a => { out.set(a, off); off += a.length; });
      return out;
    },
    // Buffer-free seed bytes for PDA derivation (some web3.js IIFE builds don't
    // expose Buffer). findProgramAddressSync accepts Uint8Array seeds fine.
    _seed(str) {
      const W = window.solanaWeb3;
      if (W && W.Buffer && W.Buffer.from) return W.Buffer.from(str, 'utf8');
      return new TextEncoder().encode(str);
    },

    // ---- the connected wallet (provider + pubkey) ----
    _wallet() {
      const w = window.ruggyWallet;
      if (!w || !w.connected || !w.publicKey || !w.provider) return null;
      return { provider: w.provider, pubkey: w.publicKey };
    },

    // ---- associated token address for (mint, owner) ----
    async _ata(ownerPk) {
      const W = window.solanaWeb3;
      const mint = new W.PublicKey(this.settings.mint);
      const ATA_PROG = new W.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
      const TOK_PROG = new W.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
      const [addr] = W.PublicKey.findProgramAddressSync(
        [ownerPk.toBuffer(), TOK_PROG.toBuffer(), mint.toBuffer()], ATA_PROG
      );
      return addr;
    },

    // ---- build a TransactionInstruction ----
    _ix(disc, dataBytes, keys) {
      const W = window.solanaWeb3;
      const data = this._concat([new Uint8Array(disc), dataBytes || new Uint8Array(0)]);
      return new W.TransactionInstruction({
        programId: this._pdas.programId,
        keys,
        data: (W.Buffer && W.Buffer.from) ? W.Buffer.from(data) : data,
      });
    },

    // ---- sign + send + confirm a set of instructions ----
    async _send(instructions) {
      const W = window.solanaWeb3;
      const wal = this._wallet();
      if (!wal) throw new Error('Connect your wallet first.');
      if (!(await this._ensureReady())) throw new Error('Chain not configured.');

      const tx = new W.Transaction();
      instructions.forEach(ix => tx.add(ix));
      tx.feePayer = wal.pubkey;
      const { blockhash } = await this._conn.getLatestBlockhash('finalized');
      tx.recentBlockhash = blockhash;

      // Phantom/Solflare style: signAndSendTransaction; fallback to signTransaction.
      let sig;
      if (wal.provider.signAndSendTransaction) {
        const res = await wal.provider.signAndSendTransaction(tx);
        sig = res.signature || res;
      } else if (wal.provider.signTransaction) {
        const signed = await wal.provider.signTransaction(tx);
        sig = await this._conn.sendRawTransaction(signed.serialize());
      } else {
        throw new Error('Wallet does not support signing.');
      }
      await this._conn.confirmTransaction(sig, 'confirmed');
      return sig;
    },

    // ---- ensure the user's stake account exists (open_stake if missing) ----
    async _ensureStakeAccount(ownerPk, ixList) {
      const stakePda = this._pdas.stakeOf(ownerPk.toBase58());
      const info = await this._conn.getAccountInfo(stakePda);
      if (!info) {
        const W = window.solanaWeb3;
        ixList.push(this._ix(this._DISC.open_stake, null, [
          { pubkey: stakePda, isSigner: false, isWritable: true },
          { pubkey: ownerPk, isSigner: true, isWritable: true },
          { pubkey: W.SystemProgram.programId, isSigner: false, isWritable: false },
        ]));
      }
      return stakePda;
    },

    // ===== USER ACTIONS =====
    tx: {
      // stake(amount, lockDays)
      async stake(amountTokens, lockDays) {
        const C = window.RuggyChain, W = window.solanaWeb3;
        const wal = C._wallet(); if (!wal) throw new Error('Connect your wallet first.');
        const owner = wal.pubkey;
        const TOK = new W.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
        const amount = C._encU64(Math.round(amountTokens * 1e6));
        const lock = C._encU32(lockDays);
        const ixList = [];
        const stakePda = await C._ensureStakeAccount(owner, ixList);
        const banPda = W.PublicKey.findProgramAddressSync(
          [C._seed('ban'), owner.toBuffer()], C._pdas.programId)[0];
        const stakerAta = await C._ata(owner);
        const stakeVault = await C._ata(C._pdas.config); // config-owned vault
        ixList.push(C._ix(C._DISC.stake, C._concat([amount, lock]), [
          { pubkey: C._pdas.config, isSigner: false, isWritable: true },
          { pubkey: banPda, isSigner: false, isWritable: false },
          { pubkey: stakePda, isSigner: false, isWritable: true },
          { pubkey: stakerAta, isSigner: false, isWritable: true },
          { pubkey: stakeVault, isSigner: false, isWritable: true },
          { pubkey: owner, isSigner: true, isWritable: true },
          { pubkey: TOK, isSigner: false, isWritable: false },
        ]));
        return C._send(ixList);
      },

      // extend_stake(fromLockDays, toLockDays)
      async extend(fromLockDays, toLockDays) {
        const C = window.RuggyChain, W = window.solanaWeb3;
        const wal = C._wallet(); if (!wal) throw new Error('Connect your wallet first.');
        const owner = wal.pubkey;
        const stakePda = C._pdas.stakeOf(owner.toBase58());
        const data = C._concat([C._encU32(fromLockDays), C._encU32(toLockDays)]);
        return C._send([C._ix(C._DISC.extend_stake, data, [
          { pubkey: stakePda, isSigner: false, isWritable: true },
          { pubkey: owner, isSigner: true, isWritable: false },
        ])]);
      },

      // unstake(amount, lockDays)
      async unstake(amountTokens, lockDays) {
        const C = window.RuggyChain, W = window.solanaWeb3;
        const wal = C._wallet(); if (!wal) throw new Error('Connect your wallet first.');
        const owner = wal.pubkey;
        const TOK = new W.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
        const stakePda = C._pdas.stakeOf(owner.toBase58());
        const banPda = W.PublicKey.findProgramAddressSync(
          [C._seed('ban'), owner.toBuffer()], C._pdas.programId)[0];
        const stakerAta = await C._ata(owner);
        const stakeVault = await C._ata(C._pdas.config);
        const [burnVaultPda] = W.PublicKey.findProgramAddressSync([C._seed('burn_vault')], C._pdas.programId);
        const burnVaultAta = await C._ata(burnVaultPda);
        const data = C._concat([C._encU64(Math.round(amountTokens * 1e6)), C._encU32(lockDays)]);
        return C._send([C._ix(C._DISC.unstake, data, [
          { pubkey: C._pdas.config, isSigner: false, isWritable: true },
          { pubkey: banPda, isSigner: false, isWritable: false },
          { pubkey: stakePda, isSigner: false, isWritable: true },
          { pubkey: stakerAta, isSigner: false, isWritable: true },
          { pubkey: stakeVault, isSigner: false, isWritable: true },
          { pubkey: burnVaultAta, isSigner: false, isWritable: true },
          { pubkey: owner, isSigner: true, isWritable: true },
          { pubkey: TOK, isSigner: false, isWritable: false },
        ])]);
      },

      // claim_distribution() — pulls community (+ anti-rug) rewards
      async claimRewards(communityPoolAta, antirugPoolAta) {
        const C = window.RuggyChain, W = window.solanaWeb3;
        const wal = C._wallet(); if (!wal) throw new Error('Connect your wallet first.');
        const owner = wal.pubkey;
        const TOK = new W.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
        const stakePda = C._pdas.stakeOf(owner.toBase58());
        const banPda = W.PublicKey.findProgramAddressSync(
          [C._seed('ban'), owner.toBuffer()], C._pdas.programId)[0];
        const claimantAta = await C._ata(owner);
        const community = new W.PublicKey(communityPoolAta);
        const antirug = new W.PublicKey(antirugPoolAta);
        return C._send([C._ix(C._DISC.claim_distribution, null, [
          { pubkey: C._pdas.config, isSigner: false, isWritable: false },
          { pubkey: banPda, isSigner: false, isWritable: false },
          { pubkey: stakePda, isSigner: false, isWritable: true },
          { pubkey: community, isSigner: false, isWritable: true },
          { pubkey: antirug, isSigner: false, isWritable: true },
          { pubkey: claimantAta, isSigner: false, isWritable: true },
          { pubkey: owner, isSigner: true, isWritable: true },
          { pubkey: TOK, isSigner: false, isWritable: false },
        ])]);
      },

      // buy_tickets(count) for the current round
      async buyTickets(count, roundId, prizeVaultAta, mdrAta, burnVaultAta) {
        const C = window.RuggyChain, W = window.solanaWeb3;
        const wal = C._wallet(); if (!wal) throw new Error('Connect your wallet first.');
        const buyer = wal.pubkey;
        const TOK = new W.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
        const roundPda = W.PublicKey.findProgramAddressSync(
          [C._seed('round'), C._encU64(roundId)], C._pdas.programId)[0];
        const entryPda = W.PublicKey.findProgramAddressSync(
          [C._seed('entry'), roundPda.toBuffer(), buyer.toBuffer()], C._pdas.programId)[0];
        const banPda = W.PublicKey.findProgramAddressSync(
          [C._seed('ban'), buyer.toBuffer()], C._pdas.programId)[0];
        const buyerAta = await C._ata(buyer);
        return C._send([C._ix(C._DISC.buy_tickets, C._encU32(count), [
          { pubkey: C._pdas.config, isSigner: false, isWritable: false },
          { pubkey: banPda, isSigner: false, isWritable: false },
          { pubkey: roundPda, isSigner: false, isWritable: true },
          { pubkey: entryPda, isSigner: false, isWritable: true },
          { pubkey: buyerAta, isSigner: false, isWritable: true },
          { pubkey: new W.PublicKey(mdrAta), isSigner: false, isWritable: true },
          { pubkey: new W.PublicKey(burnVaultAta), isSigner: false, isWritable: true },
          { pubkey: new W.PublicKey(prizeVaultAta), isSigner: false, isWritable: true },
          { pubkey: buyer, isSigner: true, isWritable: true },
          { pubkey: TOK, isSigner: false, isWritable: false },
          { pubkey: W.SystemProgram.programId, isSigner: false, isWritable: false },
        ])]);
      },

      // claim_free_ticket() — bank ONE free ticket to your held balance.
      // No round needed, no cooldown (stack freely). Staking required.
      async claimFreeTicket() {
        const C = window.RuggyChain, W = window.solanaWeb3;
        const wal = C._wallet(); if (!wal) throw new Error('Connect your wallet first.');
        const claimant = wal.pubkey;
        const stakePda = C._pdas.stakeOf(claimant.toBase58());
        const banPda = W.PublicKey.findProgramAddressSync(
          [C._seed('ban'), claimant.toBuffer()], C._pdas.programId)[0];
        return C._send([C._ix(C._DISC.claim_free_ticket, null, [
          { pubkey: C._pdas.config, isSigner: false, isWritable: false },
          { pubkey: banPda, isSigner: false, isWritable: false },
          { pubkey: stakePda, isSigner: false, isWritable: true },
          { pubkey: claimant, isSigner: true, isWritable: true },
        ])]);
      },

      // enter_free_tickets(count) — move up to 5 HELD free tickets into the
      // current DAILY round's draw.
      async enterFreeTickets(roundId, count) {
        const C = window.RuggyChain, W = window.solanaWeb3;
        const wal = C._wallet(); if (!wal) throw new Error('Connect your wallet first.');
        const claimant = wal.pubkey;
        const stakePda = C._pdas.stakeOf(claimant.toBase58());
        const banPda = W.PublicKey.findProgramAddressSync(
          [C._seed('ban'), claimant.toBuffer()], C._pdas.programId)[0];
        const roundPda = W.PublicKey.findProgramAddressSync(
          [C._seed('round'), C._encU64(roundId)], C._pdas.programId)[0];
        const entryPda = W.PublicKey.findProgramAddressSync(
          [C._seed('entry'), roundPda.toBuffer(), claimant.toBuffer()], C._pdas.programId)[0];
        const data = new Uint8Array([count & 0xff]); // u8 count
        return C._send([C._ix(C._DISC.enter_free_tickets, data, [
          { pubkey: C._pdas.config, isSigner: false, isWritable: false },
          { pubkey: banPda, isSigner: false, isWritable: false },
          { pubkey: stakePda, isSigner: false, isWritable: true },
          { pubkey: roundPda, isSigner: false, isWritable: true },
          { pubkey: entryPda, isSigner: false, isWritable: true },
          { pubkey: claimant, isSigner: true, isWritable: true },
          { pubkey: W.SystemProgram.programId, isSigner: false, isWritable: false },
        ])]);
      },

      // claim_prize(entryStartIndex)
      async claimPrize(roundId, ticketIndex, prizeVaultAta) {
        const C = window.RuggyChain, W = window.solanaWeb3;
        const wal = C._wallet(); if (!wal) throw new Error('Connect your wallet first.');
        const claimant = wal.pubkey;
        const TOK = new W.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
        const roundPda = W.PublicKey.findProgramAddressSync(
          [C._seed('round'), C._encU64(roundId)], C._pdas.programId)[0];
        const entryPda = W.PublicKey.findProgramAddressSync(
          [C._seed('entry'), roundPda.toBuffer(), claimant.toBuffer()], C._pdas.programId)[0];
        const [prizeVaultPda] = W.PublicKey.findProgramAddressSync(
          [C._seed('prize_vault')], C._pdas.programId);
        const claimantAta = await C._ata(claimant);
        return C._send([C._ix(C._DISC.claim_prize, C._encU64(ticketIndex), [
          { pubkey: C._pdas.config, isSigner: false, isWritable: false },
          { pubkey: roundPda, isSigner: false, isWritable: true },
          { pubkey: entryPda, isSigner: false, isWritable: true },
          { pubkey: prizeVaultPda, isSigner: false, isWritable: false },
          { pubkey: new W.PublicKey(prizeVaultAta), isSigner: false, isWritable: true },
          { pubkey: claimantAta, isSigner: false, isWritable: true },
          { pubkey: claimant, isSigner: true, isWritable: true },
          { pubkey: TOK, isSigner: false, isWritable: false },
        ])]);
      },

      // ---- ADMIN SETTERS (authority only). Each uses the AdminOnly context:
      //      config (writable) + authority (signer). They write Config fields
      //      live on-chain — no redeploy. _adminIx wires the shared accounts. ----
      _adminIx(disc, dataBytes) {
        const C = window.RuggyChain;
        const wal = C._wallet(); if (!wal) throw new Error('Connect your wallet first.');
        return C._ix(disc, dataBytes, [
          { pubkey: C._pdas.config, isSigner: false, isWritable: true },
          { pubkey: wal.pubkey, isSigner: true, isWritable: false },
        ]);
      },

      // set_splits(burn, community, antirug, mdr) — all in BPS, must total 10000
      async setSplits(burnBps, communityBps, antirugBps, mdrBps) {
        const C = window.RuggyChain;
        const data = C._concat([C._encU16(burnBps), C._encU16(communityBps), C._encU16(antirugBps), C._encU16(mdrBps)]);
        return C._send([C.tx._adminIx(C._DISC.set_splits, data)]);
      },

      // set_thresholds(community, antirug) — token amounts (base units)
      async setThresholds(communityBase, antirugBase) {
        const C = window.RuggyChain;
        const data = C._concat([C._encU64(communityBase), C._encU64(antirugBase)]);
        return C._send([C.tx._adminIx(C._DISC.set_thresholds, data)]);
      },

      // set_burn_stake_threshold(threshold) — base units
      async setBurnStakeThreshold(thresholdBase) {
        const C = window.RuggyChain;
        return C._send([C.tx._adminIx(C._DISC.set_burn_stake_threshold, C._encU64(thresholdBase))]);
      },

      // set_absolution(stake_bps, lock_days)
      async setAbsolution(stakeBps, lockDays) {
        const C = window.RuggyChain;
        const data = C._concat([C._encU16(stakeBps), C._encU32(lockDays)]);
        return C._send([C.tx._adminIx(C._DISC.set_absolution, data)]);
      },

      // set_paused(bool)
      async setPaused(paused) {
        const C = window.RuggyChain;
        return C._send([C.tx._adminIx(C._DISC.set_paused, C._encBool(paused))]);
      },

      // set_ticket_params(ticket_price, marketing_bps, burn_bps)
      async setTicketParams(priceBase, marketingBps, burnBps) {
        const C = window.RuggyChain;
        const data = C._concat([C._encU64(priceBase), C._encU16(marketingBps), C._encU16(burnBps)]);
        return C._send([C.tx._adminIx(C._DISC.set_ticket_params, data)]);
      },
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

  // ---- ADMIN: push config values to the on-chain program ----
  // Shared helper: validate chain is ready + show result, run a tx fn.
  function _adminResult(html, kind) {
    const box = document.getElementById('chain-admin-result');
    if (!box) return;
    box.style.display = 'block';
    box.style.background = kind === 'ok' ? '#052e1a' : kind === 'warn' ? '#3f2d05' : '#3f0d0d';
    box.style.border = '1px solid ' + (kind === 'ok' ? '#22c55e' : kind === 'warn' ? '#f59e0b' : '#ef4444');
    box.style.color = kind === 'ok' ? '#bbf7d0' : kind === 'warn' ? '#fde68a' : '#fecaca';
    box.textContent = html;
  }
  async function _adminGuard() {
    if (!Chain.isConfigured || !Chain.isConfigured()) {
      _adminResult('⛔ Enable Chain (above) first.', 'err'); return false;
    }
    if (!(window.ruggyWallet && window.ruggyWallet.connected)) {
      _adminResult('⛔ Connect your wallet (must be the program authority).', 'err');
      if (typeof showWalletModal === 'function') showWalletModal();
      return false;
    }
    return true;
  }
  const _num = (id) => { const el = document.getElementById(id); return el ? parseFloat(el.value) : NaN; };
  const _pctToBps = (p) => Math.round(p * 100); // 12.5% -> 1250 bps

  window.pushSplitsToChain = async function () {
    if (!(await _adminGuard())) return;
    const burn = _pctToBps(_num('chain-burn-pct')), comm = _pctToBps(_num('chain-community-pct'));
    const anti = _pctToBps(_num('chain-antirug-pct')), mdr = _pctToBps(_num('chain-mdr-pct'));
    if ([burn, comm, anti, mdr].some(isNaN)) { _adminResult('⛔ Fill all four split %s.', 'err'); return; }
    if (burn + comm + anti + mdr !== 10000) { _adminResult('⛔ Splits must total exactly 100% (got ' + ((burn+comm+anti+mdr)/100) + '%).', 'err'); return; }
    _adminResult('Confirm in your wallet…', 'warn');
    try {
      const sig = await Chain.tx.setSplits(burn, comm, anti, mdr);
      _adminResult('✅ Fee splits updated on-chain.\nTx: ' + String(sig).slice(0, 24) + '…', 'ok');
      try { await Chain.refreshUI(); } catch (_) {}
    } catch (e) { _adminResult('❌ ' + (e.message || e), 'err'); }
  };

  window.pushThresholdsToChain = async function () {
    if (!(await _adminGuard())) return;
    const comm = _num('chain-community-threshold'), anti = _num('chain-antirug-threshold');
    if (isNaN(comm) || isNaN(anti)) { _adminResult('⛔ Fill both thresholds.', 'err'); return; }
    _adminResult('Confirm in your wallet…', 'warn');
    try {
      const sig = await Chain.tx.setThresholds(Math.round(comm * 1e6), Math.round(anti * 1e6));
      _adminResult('✅ Thresholds updated on-chain.\nTx: ' + String(sig).slice(0, 24) + '…', 'ok');
      try { await Chain.refreshUI(); } catch (_) {}
    } catch (e) { _adminResult('❌ ' + (e.message || e), 'err'); }
  };

  window.pushTicketParamsToChain = async function () {
    if (!(await _adminGuard())) return;
    const price = _num('chain-ticket-price'), mdr = _pctToBps(_num('chain-ticket-mdr')), burn = _pctToBps(_num('chain-ticket-burn'));
    if (isNaN(price) || isNaN(mdr) || isNaN(burn)) { _adminResult('⛔ Fill price, MDR %, and burn %.', 'err'); return; }
    if (mdr + burn > 10000) { _adminResult('⛔ MDR % + Burn % can\u2019t exceed 100%.', 'err'); return; }
    _adminResult('Confirm in your wallet…', 'warn');
    try {
      const sig = await Chain.tx.setTicketParams(Math.round(price * 1e6), mdr, burn);
      _adminResult('✅ Ticket params updated on-chain.\nTx: ' + String(sig).slice(0, 24) + '…', 'ok');
      try { await Chain.refreshUI(); } catch (_) {}
    } catch (e) { _adminResult('❌ ' + (e.message || e), 'err'); }
  };

  window.pushAbsolutionToChain = async function () {
    if (!(await _adminGuard())) return;
    const pct = _pctToBps(_num('chain-absolution-pct')), days = _num('chain-absolution-days');
    if (isNaN(pct) || isNaN(days)) { _adminResult('⛔ Fill stake % and lock days.', 'err'); return; }
    _adminResult('Confirm in your wallet…', 'warn');
    try {
      const sig = await Chain.tx.setAbsolution(pct, Math.round(days));
      _adminResult('✅ Absolution params updated on-chain.\nTx: ' + String(sig).slice(0, 24) + '…', 'ok');
      try { await Chain.refreshUI(); } catch (_) {}
    } catch (e) { _adminResult('❌ ' + (e.message || e), 'err'); }
  };

  window.pushBurnStakeThresholdToChain = async function () {
    if (!(await _adminGuard())) return;
    const t = _num('chain-burn-stake-threshold');
    if (isNaN(t)) { _adminResult('⛔ Enter a threshold.', 'err'); return; }
    _adminResult('Confirm in your wallet…', 'warn');
    try {
      const sig = await Chain.tx.setBurnStakeThreshold(Math.round(t * 1e6));
      _adminResult('✅ Burn-stake threshold updated on-chain.\nTx: ' + String(sig).slice(0, 24) + '…', 'ok');
      try { await Chain.refreshUI(); } catch (_) {}
    } catch (e) { _adminResult('❌ ' + (e.message || e), 'err'); }
  };

  window.pushPauseToChain = async function () {
    if (!(await _adminGuard())) return;
    _adminResult('Confirm in your wallet…', 'warn');
    try {
      const sig = await Chain.tx.setPaused(true);
      _adminResult('⏸ Protocol PAUSED on-chain.\nTx: ' + String(sig).slice(0, 24) + '…', 'ok');
      try { await Chain.refreshUI(); } catch (_) {}
    } catch (e) { _adminResult('❌ ' + (e.message || e), 'err'); }
  };

  window.pushUnpauseToChain = async function () {
    if (!(await _adminGuard())) return;
    _adminResult('Confirm in your wallet…', 'warn');
    try {
      const sig = await Chain.tx.setPaused(false);
      _adminResult('▶ Protocol UNPAUSED on-chain.\nTx: ' + String(sig).slice(0, 24) + '…', 'ok');
      try { await Chain.refreshUI(); } catch (_) {}
    } catch (e) { _adminResult('❌ ' + (e.message || e), 'err'); }
  };

  // Load the live on-chain config into the admin inputs (so you edit from truth)
  window.loadChainConfigToPanel = async function () {
    if (!Chain.isConfigured || !Chain.isConfigured()) { _adminResult('⛔ Enable Chain first.', 'err'); return; }
    _adminResult('Reading on-chain config…', 'warn');
    try {
      const c = await Chain.config();
      if (!c) { _adminResult('❌ Config not found on-chain (is it initialized?).', 'err'); return; }
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
      set('chain-burn-pct', (c.burnBps / 100)); set('chain-community-pct', (c.communityBps / 100));
      set('chain-antirug-pct', (c.antirugBps / 100)); set('chain-mdr-pct', (c.mdrBps / 100));
      set('chain-community-threshold', Math.round(Number(c.communityThreshold) / 1e6));
      set('chain-antirug-threshold', Math.round(Number(c.antirugThreshold) / 1e6));
      set('chain-ticket-price', Math.round(Number(c.ticketPrice) / 1e6));
      set('chain-ticket-mdr', (c.lotteryMarketingBps / 100)); set('chain-ticket-burn', (c.lotteryBurnBps / 100));
      set('chain-absolution-pct', (c.absolutionStakeBps / 100)); set('chain-absolution-days', c.absolutionLockDays);
      set('chain-burn-stake-threshold', Math.round(Number(c.burnStakeThreshold) / 1e6));
      _adminResult('✅ Loaded current on-chain values into the form. Paused: ' + (c.paused ? 'YES' : 'no'), 'ok');
    } catch (e) { _adminResult('❌ ' + (e.message || e), 'err'); }
  };


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
