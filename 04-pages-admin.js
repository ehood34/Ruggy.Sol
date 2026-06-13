<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    
    <!-- ==================== SEO & SOCIAL META TAGS ==================== -->
    <title>Ruggy Rewards • pump.fun | Anti-Rug Tokenomics & Community Rewards</title>
    <meta name="description" content="Hold Ruggy and earn real rewards. Transparent 40% Liquidity Burns, 30% Community Airdrops, 20% Anti-Rug Holders & 10% MDR. Fair tokenomics designed to reward loyalty and punish rugs on Solana.">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://ruggy.fun">
    <meta property="og:title" content="Ruggy Rewards • pump.fun | Anti-Rug Tokenomics & Community Rewards">
    <meta property="og:description" content="Hold Ruggy and earn real rewards. Transparent fee distribution with 40% Liquidity Burns, 30% Community Airdrops, and strong anti-rug mechanics.">
    <meta property="og:image" content="https://i.ibb.co/YBMXZJrX/grok-image-306bf515-c3d0-441f-a54d-f6a44f9e4fc4.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Ruggy Rewards • pump.fun | Anti-Rug Tokenomics">
    <meta name="twitter:description" content="Earn rewards for holding Ruggy. 40% Liquidity Burns • 30% Community Airdrops • Strong Anti-Rug Mechanics on Solana.">
    <meta name="twitter:image" content="https://i.ibb.co/YBMXZJrX/grok-image-306bf515-c3d0-441f-a54d-f6a44f9e4fc4.jpg">

    <!-- Performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap">
    <link rel="preconnect" href="https://i.ibb.co" crossorigin>
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="preconnect" href="https://unpkg.com" crossorigin>
    <link rel="preload" as="image" href="https://i.ibb.co/Dfyk19B8/grok-image-7117a15e-b973-4517-a098-e981cc27fecc.jpg" fetchpriority="high">

    <style>
        /* ============================================
           MOBILE OPTIMIZATIONS
        ============================================ */
        @media (max-width: 768px) {
            /* Wallet Connect Bar */
            #wallet-connect-bar > div {
                flex-wrap: nowrap;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                padding: 6px 12px;
                gap: 8px;
            }
            
            #wallet-connect-bar button {
                font-size: 11.5px;
                padding: 5px 10px;
                white-space: nowrap;
                flex-shrink: 0;
            }
            
            #wallet-connect-bar span {
                font-size: 12px;
                margin-right: 4px;
                flex-shrink: 0;
            }

            /* === IMPROVED MOBILE STYLES === */

            /* General Page Padding */
            .section {
                padding-left: 16px !important;
                padding-right: 16px !important;
            }

            /* Cards - Better mobile spacing + no clipping */
            .card {
                padding: 20px 18px !important;
                margin-bottom: 16px;
            }

            .card h3 {
                font-size: 1.05rem !important;
                line-height: 1.3;
            }

            .card p, .card div {
                font-size: 0.95rem;
                line-height: 1.5;
            }

            /* Hamburger Menu Improvements on Small Screens */
            #mobile-menu {
                padding: 20px 16px;
            }

            #mobile-menu .nav-link {
                padding: 16px 18px;
                font-size: 15.5px;
            }

            /* Admin Modal on Mobile */
            #developer-modal > div {
                width: 94% !important;
                max-height: 92vh;
                padding: 20px 16px !important;
            }

            /* Form inputs in Admin */
            #developer-modal input,
            #developer-modal select {
                font-size: 15px;
                padding: 10px 12px;
            }

            /* Tokenomics Chart Container */
            #chart-container {
                padding: 16px 12px;
            }

            /* Prevent page-level horizontal overflow — but NOT on .card:
               cards scroll their own content instead of clipping it. */
            body, html, .section {
                overflow-x: hidden;
            }

            /* Footer disclaimer */
            div[style*="padding: 40px 20px 30px"] {
                padding-left: 16px !important;
                padding-right: 16px !important;
            }
        }

        /* Very Small Screens (iPhone SE, older devices) */
        @media (max-width: 360px) {
            .card {
                padding: 16px 14px !important;
            }

            .card h3 {
                font-size: 0.98rem !important;
            }

            #mobile-menu .nav-link {
                padding: 14px 16px;
                font-size: 15px;
            }
        }

        /* Toast Notification Styles */
        .toast {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background: #1f2937;
            color: white;
            padding: 14px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3);
            z-index: 99999;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            max-width: 90vw;
            animation: toastSlideIn 0.3s ease forwards;
        }

        .toast.success { border-left: 4px solid #22c55e; }
        .toast.error   { border-left: 4px solid #ef4444; }
        .toast.info    { border-left: 4px solid #3b82f6; }

        @keyframes toastSlideIn {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to   { opacity: 1; transform: translate(-50%, 0); }
        }

        /* Hide Hamburger Menu on Desktop / Wide Screens */
        @media (min-width: 768px) {
            #mobile-menu-btn {
                display: none !important;
            }
        }

        /* Connected Wallet Button Pill Style */
        #connect-btn.connected {
            background: linear-gradient(135deg, #166534, #15803d);
            color: white;
            padding: 8px 16px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
        }

        #connect-btn.connected:hover {
            filter: brightness(1.1);
            transform: translateY(-1px);
        }

        #connect-btn .disconnect-icon {
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            font-size: 12px;
            line-height: 1;
        }

        /* ============================================
           HOME CYCLING COLOR ANIMATION (8 Theme Colors)
        ============================================ */
        /* homeColorCycle is defined in the RETRO NEON RESTORATION layer */

        /* ========================================
           PAGE TITLE COLORS - Match Navigation Colors
        ======================================== */

        /* TOKENOMICS - Light gray like nav */
        #tokenomics .neon-text,
        #tokenomics h2.neon-text {
            color: #9ca3af !important;
        }

        /* LORE - Purple like nav */
        #lore .neon-text,
        #lore h2.neon-text {
            color: #c084fc !important;
        }

        /* REWARDS - Green like nav */
        #rewards .neon-text,
        #rewards h2.neon-text {
            color: #22c55e !important;
        }

        /* GALLERY - Pink/Magenta like nav */
        #gallery .neon-text,
        #gallery h2.neon-text {
            color: #ff00ff !important;
        }

        /* HALL - Gold/Amber like nav */
        #hall .neon-text,
        #hall h2.neon-text {
            color: #f59e0b !important;
        }

        /* WALL - Red like nav */
        #wall .neon-text,
        #wall h2.neon-text {
            color: #ef4444 !important;
        }

        /* POOL - Blue like nav */
        #pool .neon-text,
        #pool h2.neon-text {
            color: #3b82f6 !important;
        }

        /* ABSOLUTION - White like nav */
        #absolution .neon-text,
        #absolution h2.neon-text {
            color: #f1f5f9 !important;
        }

        /* LOTTERY page title - Already handled by .lotto-animated-title */

        /* HOME page main title (RUGGY) - Keep multi-color, no override */
        #home h1.neon-text {
            color: inherit !important;
        }

        body { font-family: 'Press Start 2P', system-ui, sans-serif; background: linear-gradient(135deg, #0a0a0a, #1a0033); color: white; margin: 0; padding: 0; }
        .section { display: none; }
        .section.active { display: block; }
        .nav-link { 
            transition: all 0.3s ease; 
            cursor: pointer; 
            position: relative;
        }

        @media (max-width: 768px) {
            /* Completely hide the second (horizontal) navigation bar on mobile */
            #desktop-nav,
            #desktop-nav > div {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                overflow: hidden !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            
            /* Extra safety for nav links */
            #desktop-nav .nav-link,
            #desktop-nav a {
                display: none !important;
            }

            h1, h2, h3, h4, .neon-text, .card h3, .explore-card h3 {
                white-space: normal !important;
                overflow-wrap: break-word;
                word-break: break-word;
                line-height: 1.3;
            }
        }

        /* =====================================================
           GLOBAL TEXT WRAPPING - All words must always be visible
           No ellipsis ever. Natural wrapping with good spacing.
           ===================================================== */
        .card h3,
        .explore-card h3,
        .card p,
        .explore-card p {
            white-space: normal !important;
            overflow-wrap: break-word;
            word-break: normal;
            overflow: visible;
        }

        /* ============================================
           UNIFORM TITLE EMOJIS
           Leading emojis in titles are wrapped in this span by
           normalizeTitleEmojis(). inline-block + line-height:1 takes the
           emoji out of the text line-box height calculation, so a second
           line of wrapped text can never crop its bottom — and every
           title across the site gets identical emoji size, alignment,
           and spacing relative to its text.
           ============================================ */
        .title-emoji {
            /* Emoji sits centered on its own line above the title text —
               fully outside the text's line boxes, so nothing can clip it. */
            display: block;
            text-align: center;
            line-height: 1;
            font-size: 1.35em;
            margin: 0 auto 8px;
            text-indent: 0;
        }

        /* Hover effects (replaces inline onmouseover/onmouseout JS) */
        .hover-scale { transition: transform 0.2s ease; }
        .hover-scale:hover { transform: scale(var(--scale, 1.03)); }

        .icon-glow { transition: all 0.3s ease; }
        .icon-glow:hover {
            border-color: var(--glow) !important;
            box-shadow: 0 0 8px var(--glow);
        }

        .gallery-card { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
        .gallery-card:hover {
            transform: translateY(-6px) scale(1.04);
            box-shadow: 0 0 20px #ff00ff, 0 10px 30px rgba(0,0,0,0.4);
            border-color: #ff00ff !important;
        }

        /* Wallet selection buttons (replaces 11 copies of identical inline
           style + onmouseover/onmouseout JS; colors come from custom props) */
        .wallet-option {
            background: linear-gradient(145deg, var(--w1), var(--w2));
            color: white;
            font-weight: 700;
            padding: 16px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            box-shadow: 0 4px 15px var(--wshadow), inset 0 1px 0 rgba(255,255,255,0.3);
            transition: all 0.2s ease;
            font-size: 15px;
        }
        .wallet-option:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px var(--wshadow-h), inset 0 1px 0 rgba(255,255,255,0.4);
        }

        /* Slim scrollbars for scrollable cards */
        .card::-webkit-scrollbar,
        .explore-card::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .card::-webkit-scrollbar-thumb,
        .explore-card::-webkit-scrollbar-thumb {
            background: #6b21a8;
            border-radius: 3px;
        }
        .card,
        .explore-card {
            scrollbar-width: thin;
            scrollbar-color: #6b21a8 transparent;
        }

        /* Extra safety for all card content */
        .card,
        .explore-card {
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }

        /* Active state: brighten the link's own color (respects inline color) */
        .nav-link.active {
            filter: brightness(1.55) saturate(1.25);
            transform: translateY(-1px);
        }

        /* Hover state: brighten the link's own color */
        .nav-link:hover {
            filter: brightness(1.4) saturate(1.2);
            transform: translateY(-1px);
        }

        /* Gallery Card Hover Effects */
        .gallery-card {
            transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), 
                        box-shadow 0.3s ease, 
                        border-color 0.3s ease;
            will-change: transform;
        }

        .gallery-card:hover {
            transform: scale(1.045) translateY(-4px);
            box-shadow: 
                0 0 25px rgba(255, 0, 255, 0.6),
                0 15px 35px rgba(0, 0, 0, 0.5);
            border-color: #ff00ff;
        }

        /* nav-gradient keyframe removed - no longer used for navigation hover */
        .card { 
            background: rgba(0,0,0,0.7); 
            border: 3px solid #6b21a8; 
            border-radius: 20px; 
            padding: 24px; 
            transition: all 0.4s ease;
            min-height: 280px;
            display: flex;
            flex-direction: column;
            /* Content wider/taller than the card scrolls instead of clipping */
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            box-shadow: 
                0 0 8px rgba(107, 33, 168, 0.6),
                0 0 16px rgba(107, 33, 168, 0.4);
            line-height: 1.65;
        }

        .card p,
        .card li,
        .card .stat-row {
            margin-bottom: 10px;
        }

        .card h3 {
            margin-bottom: 14px;
        }

        @media (max-width: 768px) {
            .card,
            .explore-card,
            [class*="card"] {
                /* was overflow:hidden !important — that clipped emoji tops in
                   tight-line-height titles AND blocked card scrolling entirely */
                overflow: auto !important;
                -webkit-overflow-scrolling: touch;
                box-sizing: border-box !important;
                min-height: auto !important;
                padding: 16px !important;
            }
            
            .card h3 {
                margin-bottom: 10px !important;
                font-size: 17px !important;
                /* emoji glyphs are taller than Latin text — give them headroom */
                line-height: 1.45 !important;
                padding-top: 2px;
            }
            
            .card p,
            .card li,
            .card .stat-row {
                margin-bottom: 8px !important;
                font-size: 14px !important;
            }
            
            .card button,
            .card .buy-button,
            .card input,
            .card select {
                padding: 12px 16px !important;
                font-size: 14px !important;
                white-space: normal !important;
                overflow-wrap: break-word !important;
                word-break: break-word !important;
                line-height: 1.4 !important;
                text-align: center !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }

            .card p {
                line-height: 1.5;
            }

            .explore-card {
                padding: 14px !important;
            }
            
            .explore-card h3 {
                font-size: 15px !important;
                margin-bottom: 6px !important;
            }
            
            .explore-card p {
                font-size: 12.5px !important;
                margin-bottom: 6px !important;
            }

            #pool .card {
                overflow: auto;
                padding: 16px !important;
            }
            
            #pool #lock-period-options {
                grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)) !important;
                gap: 8px !important;
            }
            
            #pool .lock-option {
                font-size: 11px !important;
                padding: 8px 4px !important;
            }
            
            #pool input,
            #pool button {
                font-size: 15px;
            }

            #absolution .card {
                overflow: auto;
                padding: 16px !important;
            }
            
            #absolution .buy-button {
                font-size: 14px !important;
                padding: 14px 16px !important;
                white-space: normal !important;
                line-height: 1.45 !important;
                overflow-wrap: break-word !important;
                word-break: break-word !important;
                text-indent: 0 !important;
                max-width: 100% !important;
                text-align: center !important;
            }
            
            #absolution input {
                font-size: 15px;
            }
            
            #absolution #absolution-stake-breakdown {
                font-size: 13px;
            }

            #tokenomics .card,
            #rewards .card,
            #dev-login .card {
                padding: 16px !important;
            }
        }

        #home .card:hover {
            transform: translateY(-6px) scale(1.01);
            border: 3px solid transparent;
            background: 
                linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)) padding-box,
                linear-gradient(90deg, #ff00ff, #c026d3, #a855f7, #ff00ff) border-box;
            background-size: 200% 100%;
            animation: nav-gradient 1.5s linear infinite;
            box-shadow: 
                0 0 12px #ff00ff,
                0 0 24px #c026d3,
                0 0 36px #a855f7;
        }

        /* Global hover gradient now disabled for all titles via rules at end of stylesheet */

        #lore .card:hover {
            transform: none;
            border: 3px solid #6b21a8;
            background: rgba(0,0,0,0.7);
            animation: none;
        }

        #lore .card:hover h3,
        #lore .card:hover p {
            background: none;
            -webkit-text-fill-color: #f3e8ff;
            animation: none;
        }
        .buy-button { 
            background: linear-gradient(to right, #22c55e, #16a34a); 
            color: white; 
            padding: 16px 20px; 
            border: none; 
            border-radius: 12px; 
            font-size: 15px; 
            font-weight: bold; 
            cursor: pointer; 
            width: 100%; 
            max-width: 100%;
            margin-top: 16px; 
            white-space: normal;
            overflow-wrap: break-word;
            word-break: break-word;
            line-height: 1.4;
            text-align: center;
            box-sizing: border-box;
            transition: all 0.2s ease;
        }

        .modal { 
            position: fixed; 
            z-index: 100; 
            left: 0; 
            top: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0, 0, 0, 0.88); 
            backdrop-filter: blur(8px);
            /* Hidden by default — JS sets inline display:flex to open. Previously
               display:flex here silently beat .section's display:none (later rule,
               equal specificity), making both modals render OPEN on page load. */
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        }

        .modal-content { 
            background: #1a0033; 
            padding: 32px 28px; 
            border: 3px solid #ff00ff; 
            width: 92%; 
            max-width: 520px; 
            border-radius: 20px; 
            max-height: 85vh; 
            overflow: auto; 
            -webkit-overflow-scrolling: touch;
            box-shadow: 0 0 40px rgba(255, 0, 255, 0.35);
            animation: popupAppear 0.25s ease-out forwards;
            margin: 0; /* Remove any default margin */
        }

        @keyframes popupAppear {
            from {
                opacity: 0;
                transform: scale(0.92) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideInFromLeft {
            from {
                transform: translateX(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .timer { font-size: 13px; color: #f59e0b; font-weight: bold; }

        /* Better Chart.js Tooltip Styling for Readability */
        .chartjs-tooltip {
            max-width: 520px !important;
            min-width: 280px !important;
            white-space: normal !important;
            overflow-wrap: break-word !important;
            word-break: normal !important;
            line-height: 1.65 !important;
            font-size: 14px !important;
            padding: 10px 14px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }

        input, button, textarea, select {
            max-width: 100%;
            box-sizing: border-box;
        }

        .card {
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }

        table {
            width: 100%;
            max-width: 100%;
            table-layout: auto;
            border-collapse: collapse;
            font-size: 13px;
        }
        th, td {
            padding: 10px 8px;
            text-align: center !important;
            vertical-align: middle;
            border-bottom: 1px solid #374151;
            white-space: normal;
        }
        th {
            color: #f59e0b;
            font-weight: bold;
        }
        th:first-child, td:first-child { width: 12%; }
        th:nth-child(2), td:nth-child(2) { width: 50%; }
        th:nth-child(3), td:nth-child(3) { width: 38%; }

        .table-container {
            max-height: 420px;
            overflow: auto;
            border: 1px solid #374151;
            border-radius: 8px;
        }

        @media (max-width: 900px) {
            nav > div {
                flex-wrap: wrap;
            }
            nav .nav-link {
                font-size: 15px !important;
                padding: 8px 12px !important;
                min-height: 44px;
                display: inline-flex;
                align-items: center;
            }
            nav .nav-link + a {
                margin-left: 4px;
            }

            .section {
                padding-left: 12px !important;
                padding-right: 12px !important;
                padding-top: 80px !important;
            }

            .card {
                padding: 16px !important;
            }

            .gallery-card {
                min-width: 180px !important;
            }

            #tokenomics > div[style*="grid-template-columns: 1fr 1fr"] {
                grid-template-columns: 1fr !important;
                gap: 25px !important;
            }

            #feePieChart {
                max-width: 100% !important;
                margin: 0 auto;
                width: 100% !important;
                height: 100% !important;
            }

            #rewards > div[style*="grid-template-columns: 1fr 1fr"] {
                grid-template-columns: 1fr !important;
                gap: 18px !important;
            }

            #hall > div[style*="grid-template-columns: 1fr 1fr 1fr"] {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
            }

            .table-container {
                max-height: 380px;
                overflow: auto;
            }

            #top-holders-table,
            #longest-holders-table,
            #bagworkers-table,
            #banned-table {
                min-width: 620px;
            }

            #wall .card[style*="margin-bottom: 25px"] > div[style*="display: flex"] {
                flex-direction: column !important;
                gap: 10px !important;
            }

            #wall input#monitor-wallet-input {
                width: 100% !important;
                min-width: unset !important;
            }

            .card, table, canvas, img {
                max-width: 100% !important;
                box-sizing: border-box;
            }

            h2, h3, p, span, td, th {
                word-wrap: break-word;
                overflow-wrap: break-word;
            }

            #tokenomics img,
            #rewards img,
            #lore img,
            #gallery img,
            #hall img,
            #wall img {
                height: auto !important;
                max-height: 220px !important;
            }

            h2.neon-text,
            .section h2 {
                font-size: 24px !important;
                white-space: normal !important;
                overflow: visible;
            }

            #wall .card[style*="margin-top: 30px"] > div[style*="display: grid"] {
                display: flex !important;
                flex-wrap: nowrap !important;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                gap: 16px;
                padding-bottom: 10px;
            }

            #home > div {
                text-align: center;
            }
            
            #home .card {
                margin-left: auto;
                margin-right: auto;
            }

            #home-metrics,
            #home > div[style*="max-width: 1100px"] {
                max-width: 100% !important;
                padding-left: 12px !important;
                padding-right: 12px !important;
                margin-left: auto !important;
                margin-right: auto !important;
            }
        }

        .topbar-scroll::-webkit-scrollbar {
            display: none;
        }

        /* =====================================================
           GLOBAL TITLE & SUBTITLE AUTO-FIT + INDENT ON OVERFLOW
           ===================================================== */
        h1, h2, h3, h4, .neon-text, .section h2, .card h3, .explore-card h3 {
            white-space: normal !important;
            overflow-wrap: break-word;
            word-break: break-word;
            overflow: visible;
            /* Negative text-indent removed: it shifted the first line of
               CENTERED headings left, clipping leading emojis on mobile. */
            text-indent: 0;
            padding-left: 0;
            line-height: 1.3;
        }

        /* Responsive sizing for main titles */
        h1.neon-text, h2.neon-text, .section h2 {
            font-size: clamp(24px, 7.5vw, 44px) !important;
        }

        @media (max-width: 767px) {
            #desktop-nav {
                padding-bottom: 8px;
            }
        }

        @media (max-width: 767px) {
            html, body {
                overflow-x: hidden !important;
                max-width: 100vw !important;
            }

            .max-w-7xl, 
            [style*="max-width: 1280px"],
            [style*="max-width: 1100px"],
            [style*="max-width: 1200px"] {
                max-width: 100% !important;
                padding-left: 12px !important;
                padding-right: 12px !important;
                margin-left: auto !important;
                margin-right: auto !important;
                box-sizing: border-box;
            }

            * {
                max-width: 100% !important;
                box-sizing: border-box;
            }

            h1, h2, .text-4xl, .text-5xl, .text-6xl {
                font-size: clamp(22px, 7vw, 36px) !important;
                word-break: break-word;
                overflow-wrap: break-word;
            }

            .card, 
            .explore-card,
            [class*="card"] {
                margin-left: 8px !important;
                margin-right: 8px !important;
                padding: 16px !important;
                max-width: calc(100% - 16px) !important;
                overflow: auto !important;
                box-sizing: border-box !important;
            }

            table {
                display: block;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                max-width: 100%;
                font-size: 13px;
            }

            th, td {
                white-space: normal;
                padding: 8px 6px !important;
            }

            #dev input,
            #dev select,
            #dev button {
                font-size: 14px !important;
                padding: 10px 12px !important;
            }

            #rewards .card {
                padding: 14px !important;
            }

            #gallery img {
                max-width: 100%;
                height: auto;
            }

            #tokenomics canvas {
                max-width: 100% !important;
                height: auto !important;
            }

            #hall table,
            #wall table {
                font-size: 12px;
            }

            [style*="min-width"] {
                min-width: auto !important;
            }

            #hall .card,
            #wall .card {
                overflow: auto;
            }

            p, span, div {
                word-wrap: break-word;
                overflow-wrap: break-word;
            }

            #desktop-nav a {
                font-size: 13px !important;
                padding: 6px 10px !important;
            }
        }

        /* ============================================
           DYNAMIC AUTO PADDING - Keeps banners under nav
           Works on both mobile and desktop
           ============================================ */
        :root {
            --nav-height: 170px;
        }

        #home {
            padding-top: calc(var(--nav-height) + 20px) !important;
        }

        #tokenomics, #lore, #rewards, #gallery, #hall, #wall, #pool, #absolution, #lotto {
            padding-top: calc(var(--nav-height) + 16px) !important;
        }

        /* ============================================
           GLOBAL TITLE & SUBTITLE AUTO-FIT + INDENT
           All titles now auto-size and indent naturally
           instead of clipping when they overflow
           ============================================ */
        h1, h2, h3, .neon-text, .section h2 {
            white-space: normal !important;
            overflow-wrap: break-word;
            word-break: break-word;
            line-height: 1.25;
        }

        /* Responsive sizing for main page titles */
        h2.neon-text,
        .section h2 {
            font-size: clamp(26px, 7.5vw, 42px) !important;
        }

        h1.neon-text {
            font-size: clamp(38px, 11vw, 68px) !important;
        }

        @media (max-width: 768px) {
            #desktop-nav {
                padding: 4px 0 !important;
            }
            #desktop-nav > div {
                gap: 10px !important;
                padding-top: 4px !important;
                padding-bottom: 4px !important;
            }
            #desktop-nav a {
                font-size: 13px !important;
                padding: 6px 10px !important;
            }
        }

        /* =====================================================
           SMART GLOBAL TEXT WRAPPING (Final Version)
           - Single word titles (ABSOLUTION, TOKENOMICS, etc.): Always stay on ONE line
           - Multi-word text: If it overflows, the ENTIRE word indents to next line
           - Applied to all important text on the website
           ===================================================== */
        h1, h2, h3, .neon-text, 
        .card h3, .explore-card h3,
        .section h2, .section h3 {
            white-space: normal;
            overflow-wrap: break-word;
            word-break: normal;
            line-height: 1.35;
            overflow: visible;
        }

        /* All titles, subtitles and card text: Must always show completely. No ellipsis ever. */
        h1, h2, h3, .neon-text, 
        .card h3, .explore-card h3,
        .section h2, .section h3 {
            white-space: normal !important;
            overflow-wrap: break-word;
            word-break: break-word;
            overflow: visible !important;
            text-overflow: clip !important;
            line-height: 1.45;
        }

        /* Mobile: Better wrapping and spacing */
        @media (max-width: 768px) {
            h1, h2, h3, .neon-text,
            .card h3, .explore-card h3 {
                padding-left: 4px;
                padding-right: 4px;
            }
        }

        /* ==================== COMPREHENSIVE RESPONSIVE LAYOUT FOR MOBILE ==================== */
        @media (max-width: 768px) {
            /* Navigation */
            nav {
                padding: 4px 10px !important;
            }
            #desktop-nav > div {
                gap: 8px !important;
                font-size: 12.5px !important;
            }

            /* Tokenomics: Stack columns */
            #tokenomics > div[style*="grid-template-columns: 1fr 1fr"] {
                grid-template-columns: 1fr !important;
                gap: 32px !important;
            }

            /* Pool staking grid - responsive */
            #lock-period-options {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 8px !important;
            }
            .lock-option {
                font-size: 11.5px !important;
                padding: 10px 6px !important;
                transition: all 0.2s ease;
                white-space: normal !important;
                word-break: break-word;
                overflow: hidden;
                box-sizing: border-box;
            }

            .lock-option.selected {
                border-color: #22c55e !important;
                box-shadow: 0 0 12px #22c55e !important;
            }

            .lock-option:active {
                transform: scale(0.92);
                filter: brightness(0.85);
                transition: transform 0.05s ease;
            }

            .lock-option.selected {
                border-color: #22c55e !important;
                background: #052e16 !important;
                box-shadow: 0 0 12px #22c55e;
                transform: scale(1.02);
            }

            /* General cards */
            .card {
                padding: 15px !important;
                margin-left: 6px;
                margin-right: 6px;
            }

            /* Tables */
            .table-container {
                max-height: 300px;
            }

            /* Admin modal on mobile */
            #developer-modal .modal-content {
                width: 95% !important;
                max-width: 95% !important;
            }
        }

        @media (max-width: 480px) {
            #lock-period-options {
                grid-template-columns: repeat(2, 1fr) !important;
            }
            .card {
                padding: 13px !important;
            }

            /* Very small screens - tighter but still readable */
            .card h3 {
                font-size: 15px !important;
                line-height: 1.4 !important;
                padding-top: 2px;
            }
            
            .section {
                padding-top: 70px !important;
                padding-bottom: 30px !important;
            }
            
            /* Admin panel on very small screens */
            #developer-modal .modal-content {
                width: 97% !important;
                padding: 16px !important;
            }
            
            #dev-panel input,
            #dev-panel select {
                font-size: 13px !important;
                padding: 8px 10px !important;
            }
        }

        /* Lottery cards: extra breathing room on the right on mobile
           (the space-between rows were pressing amounts against the border) */
        @media (max-width: 768px) {
            #lotto .card {
                padding-right: 24px !important;
            }
        }

        /* Extra small screens (iPhone SE, older Android) */
        @media (max-width: 360px) {
            .card {
                padding: 11px !important;
            }
            
            .card h3 {
                font-size: 14.5px !important;
            }
            
            button {
                font-size: 13px !important;
                padding: 9px 14px !important;
            }
            
            .nav-link {
                font-size: 12.5px !important;
                padding: 6px 8px !important;
            }
        }

        /* Lotto title styling lives in the RETRO NEON RESTORATION layer */

        /* ===== UTILITY CLASSES (extracted from repeated inline styles) ===== */
        .tile { cursor: pointer; border-radius: 16px; overflow: hidden; border: 2px solid #374151; background: #111827; }
        .tile-img { width: 100%; height: 260px; object-fit: cover; display: block; }
        .tile-img-sm { width: 100%; height: 160px; object-fit: cover; object-position: center 25%; }
        .tile-caption { padding: 14px; text-align: center; }
        .tile-title { margin: 0; font-weight: 600; color: #f3e8ff; }
        .muted-sm { font-size: 13px; color: #9ca3af; }
        .muted-sm-flat { font-size: 13px; color: #9ca3af; margin: 0; }
        .pad-card { padding: 20px 20px 26px; }
        .label-xs { font-size: 11px; display: block; margin-bottom: 4px; }
        .center-mb30 { text-align: center; margin-bottom: 30px; }


        /* =====================================================================
           RETRO NEON RESTORATION
           Sits last in the cascade on purpose. Multi-layer glows restore the
           vibrant arcade look; every glowing element keeps a dark text-stroke
           so it stays readable against the glow. The same-name @keyframes
           redefinitions below override the earlier, dimmer ones (last
           definition of a keyframe name wins).
           ===================================================================== */

        /* --- Navigation links: full neon tube treatment.
               The faint white inner layer is the "hot glass core" of a real
               neon tube; the dark stroke keeps letterforms crisp inside it. --- */
        nav .nav-link,
        #desktop-nav .nav-link,
        .nav-link {
            -webkit-text-stroke: 0.7px rgba(0, 0, 0, 0.85);
            text-shadow:
                0 0 1px rgba(255, 255, 255, 0.85),
                0 0 4px currentColor,
                0 0 10px currentColor,
                0 0 22px currentColor,
                0 0 38px currentColor !important;
        }
        nav .nav-link:hover {
            text-shadow:
                0 0 1px rgba(255, 255, 255, 0.95),
                0 0 6px currentColor,
                0 0 14px currentColor,
                0 0 30px currentColor,
                0 0 52px currentColor !important;
            filter: brightness(1.15);
        }

        /* --- Page titles & section headings: the brightest tubes on the sign,
               with a slow breathing pulse like a real storefront --- */
        .page-title,
        h1.neon-text, h2.neon-text,
        .section h2,
        .section-title {
            -webkit-text-stroke: 0.8px rgba(0, 0, 0, 0.8);
            text-shadow:
                0 0 1px rgba(255, 255, 255, 0.9),
                0 0 6px currentColor,
                0 0 16px currentColor,
                0 0 32px currentColor,
                0 0 56px currentColor !important;
            animation: neonBreathe 3.2s ease-in-out infinite;
        }

        @keyframes neonBreathe {
            0%, 100% { filter: brightness(1); }
            50%      { filter: brightness(1.18); }
        }

        /* Respect users who turn animations off */
        @media (prefers-reduced-motion: reduce) {
            .page-title, h1.neon-text, h2.neon-text, .section h2, .section-title {
                animation: none;
            }
        }

        /* --- Card headings: bright but a notch below page titles --- */
        .card h3,
        .explore-card h3 {
            -webkit-text-stroke: 0.6px rgba(0, 0, 0, 0.75);
            text-shadow:
                0 0 1px rgba(255, 255, 255, 0.7),
                0 0 4px currentColor,
                0 0 10px currentColor,
                0 0 20px currentColor !important;
        }

        /* --- RUGGY logo: fully CSS-controlled. Each letter carries only a
               color token inline (style="--c: #ef4444"); ALL glow lives here. --- */
        .logo-letter {
            color: var(--c, #ff00ff);
            -webkit-text-stroke: 0.7px rgba(0, 0, 0, 0.85);
            text-shadow:
                0 0 1px rgba(255, 255, 255, 0.9),
                0 0 6px currentColor,
                0 0 14px currentColor,
                0 0 28px currentColor,
                0 0 46px currentColor;
        }

        /* --- HOME nav link: cycling rainbow --- */
        .home-cycling {
            animation: homeColorCycle 16s linear infinite !important;
            font-weight: 700;
            -webkit-text-stroke: 0.6px rgba(0, 0, 0, 0.6);
        }

        /* --- LOTTERY: flashing green <-> gold, all variants in one place --- */
        #lotto-title.lotto-animated-title,
        .nav-link.lotto-animated-title,
        .card h3.lotto-animated-title {
            color: #22c55e;
            animation: lottoTextFlash 1.8s infinite alternate ease-in-out !important;
            text-shadow: 0 0 3px #22c55e, 0 0 10px #22c55e, 0 0 22px #eab308 !important;
            font-weight: 900;
            -webkit-text-stroke: 0.6px rgba(0, 0, 0, 0.65);
        }
        .nav-link.lotto-animated-title {
            display: inline-flex;
            align-items: center;
            vertical-align: middle;
            line-height: 1;
        }
        #lotto-title.lotto-animated-title:hover {
            animation-duration: 0.55s !important;
            filter: brightness(1.3) saturate(1.3) !important;
        }
        .nav-link.lotto-animated-title:hover,
        .nav-link.lotto-animated-title.active {
            animation-duration: 0.6s !important;
            filter: brightness(1.4) saturate(1.3) !important;
            text-shadow: 0 0 4px #22c55e, 0 0 14px #22c55e, 0 0 30px #eab308 !important;
            transform: translateY(-1px);
        }
        /* Keep generic purple hovers off lotto text WITHOUT the old
           background-clip transparency hack (transparent fill + glow halos
           rendered as a blurry blob, especially on mobile). Solid color +
           faster flash reads far better. */
        #lotto-title:hover,
        .card h3.lotto-animated-title:hover {
            background: none !important;
            -webkit-text-fill-color: currentColor !important;
        }

        /* --- Gallery captions glow on tile hover --- */
        .gallery-card:hover p {
            color: #ff00ff;
            text-shadow: 0 0 4px #ff00ff, 0 0 12px rgba(255, 0, 255, 0.6);
        }

        /* --- HOME cycling animation: brighter ramp (same name overrides) --- */
        @keyframes homeColorCycle {
            0%    { color: #9ca3af; text-shadow: 0 0 4px #9ca3af, 0 0 12px #9ca3af, 0 0 24px #6b7280; }
            12.5% { color: #c084fc; text-shadow: 0 0 4px #c084fc, 0 0 12px #c084fc, 0 0 24px #a855f7; }
            25%   { color: #22c55e; text-shadow: 0 0 4px #22c55e, 0 0 12px #22c55e, 0 0 24px #16a34a; }
            37.5% { color: #ff00ff; text-shadow: 0 0 4px #ff00ff, 0 0 12px #ff00ff, 0 0 24px #ec4899; }
            50%   { color: #fbbf24; text-shadow: 0 0 4px #fbbf24, 0 0 12px #fbbf24, 0 0 24px #f59e0b; }
            62.5% { color: #ef4444; text-shadow: 0 0 4px #ef4444, 0 0 12px #ef4444, 0 0 24px #dc2626; }
            75%   { color: #3b82f6; text-shadow: 0 0 4px #3b82f6, 0 0 12px #3b82f6, 0 0 24px #2563eb; }
            87.5% { color: #f1e7ff; text-shadow: 0 0 4px #f1e7ff, 0 0 12px #f1e7ff, 0 0 24px #c4b5fd; }
            100%  { color: #9ca3af; text-shadow: 0 0 4px #9ca3af, 0 0 12px #9ca3af, 0 0 24px #6b7280; }
        }

        /* --- Lottery flashing: punchy green <-> gold (same name overrides) --- */
        @keyframes lottoTextFlash {
            0%   { color: #22c55e; text-shadow: 0 0 3px #22c55e, 0 0 10px #22c55e, 0 0 22px #eab308; }
            100% { color: #eab308; text-shadow: 0 0 3px #eab308, 0 0 10px #eab308, 0 0 22px #22c55e; }
        }

        /* --- Pixel-font readability: the arcade font is dense, give it air --- */
        nav .nav-link {
            letter-spacing: 0.5px;
        }
        .section h2,
        .page-title {
            line-height: 1.5;
            letter-spacing: 1px;
        }

        /* --- MOBILE TUNING: glow scales with glyph size. The desktop halos
               (up to 56px) overwhelm 15-24px mobile text, bleeding far outside
               the characters — so every glow is trimmed ~50-60% under 768px.
               Same selectors, smaller radii; the look survives, the blur doesn't. --- */
        @media (max-width: 768px) {
            nav .nav-link,
            #desktop-nav .nav-link,
            .nav-link {
                text-shadow:
                    0 0 1px rgba(255, 255, 255, 0.8),
                    0 0 3px currentColor,
                    0 0 7px currentColor,
                    0 0 12px currentColor !important;
            }
            nav .nav-link:hover {
                text-shadow:
                    0 0 1px rgba(255, 255, 255, 0.9),
                    0 0 4px currentColor,
                    0 0 9px currentColor,
                    0 0 16px currentColor !important;
            }
            .page-title,
            h1.neon-text, h2.neon-text,
            .section h2,
            .section-title {
                text-shadow:
                    0 0 1px rgba(255, 255, 255, 0.85),
                    0 0 4px currentColor,
                    0 0 10px currentColor,
                    0 0 20px currentColor !important;
            }
            .card h3,
            .explore-card h3 {
                text-shadow:
                    0 0 1px rgba(255, 255, 255, 0.6),
                    0 0 3px currentColor,
                    0 0 8px currentColor !important;
            }
            .logo-letter {
                text-shadow:
                    0 0 1px rgba(255, 255, 255, 0.85),
                    0 0 4px currentColor,
                    0 0 9px currentColor,
                    0 0 16px currentColor;
            }
            #lotto-title.lotto-animated-title,
            .nav-link.lotto-animated-title,
            .card h3.lotto-animated-title {
                text-shadow: 0 0 2px #22c55e, 0 0 7px #22c55e, 0 0 13px #eab308 !important;
            }
        }

        /* Body copy stays clean: never let glow bleed into paragraphs/small text */
        p, li, td, th, input, button, .muted-sm, .muted-sm-flat, .label-xs {
            -webkit-text-stroke: 0;
        }

        /* ===== UTILITY CLASSES, BATCH 2 (extracted from repeated inline styles) ===== */
        .btn-bare { cursor: pointer; padding: 0; overflow: visible; transition: transform 0.2s; }
        .mb12 { margin-bottom:12px; }
        .mb10 { margin-bottom:10px; }
        .mb20 { margin-bottom: 20px; }
        .gold { color: #fbbf24; }
        .green { color: #22c55e; }
        .gray { color: #9ca3af; }
        .bold { font-weight: bold; }
        .hint-green { font-size: 10px; color: #86efac; }
        .feature-img { max-width: 100%; height: 280px; object-fit: cover; border-radius: 16px; border: 3px solid #6b21a8; }
        .page-h2 { font-size: clamp(28px, 8vw, 42px); text-align: center; margin-bottom: 8px; }
        .row-top { display: flex; align-items: flex-start; gap: 10px; }
        .row-between { display: flex; justify-content: space-between; }
        .text-14 { font-size: 14px; line-height: 1.4; }
        .text-15 { font-size: 15px; line-height: 1.7; }
        .text-14-flat { font-size: 14px; margin: 0; }
        .muted-125 { font-size: 12.5px; color:#9ca3af; }
        .muted-12 { font-size: 12px; color: #9ca3af; }
        .cell { padding: 10px; text-align: left; }
        .label-sm { font-size:12px; display:block; margin-bottom:4px; }
        .w-full { width:100%; }
        .page-wrap { padding-top: 110px; padding-bottom: 80px; max-width: 1100px; margin: 0 auto; }
        .green-mb15 { color: #22c55e; margin-bottom: 15px; }
        .stat-lg { font-size: 28px; font-weight: bold; }
        .center-mb25 { text-align: center; margin-bottom: 25px; }
        .fs15 { font-size: 15px; }
        .row-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 13px; padding-bottom: 10px; border-bottom: 1px solid #374151; }
        .stat-box-green { padding: 10px 6px; background: #052e16; border: 2px solid #166534; border-radius: 8px; text-align: center; cursor: pointer; font-size: 11px; }
        .stat-box-green { padding: 10px 6px; background: #052e16; border: 2px solid #f59e0b; border-radius: 8px; text-align: center; cursor: pointer; font-size: 11px; box-shadow: 0 0 8px #f59e0b; }
        .dev-input { width:100%; padding:9px; border-radius:6px; border:1px solid #6b21a8; background:#111827; color:white; font-size:12px; font-family: monospace; }
        .dev-input { width:100%; padding:9px; border-radius:6px; border:1px solid #6b21a8; background:#111827; color:white; }
        .dev-input-sm { width:100%; padding:8px; margin-bottom:6px; border-radius:6px; border:1px solid #6b21a8; background:#111827; color:white; font-size:13px; }

        /* --- Hero (home page) typography: extracted from inline styles --- */
        .hero-title {
            font-size: clamp(42px, 12vw, 68px);
            margin-bottom: 12px;
        }
        .hero-sub {
            font-size: clamp(18px, 4.5vw, 24px);
            color: #f3e8ff;
            margin-bottom: 30px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        /* ===== UTILITY CLASSES, BATCH 3 (deduplicated inline styles; uN names are auto-generated) ===== */
        .u1 { text-align: center; color: #9ca3af; margin-bottom: 35px; font-size: 15px; }
        .u2 { font-size: 15px; color: #9ca3af; }
        .u3 { color:#f59e0b; margin-bottom:10px; font-size:13px; }
        .u4 { width: 100%; height: 100%; object-fit: cover; border-radius: 9999px; }
        .u5 { font-size: 14px; color: #9ca3af; }
        .u6 { font-size: 20px; font-weight: bold; }
        .u7 { cursor: pointer; padding: 0; overflow: hidden; transition: transform 0.2s; }
        .u8 { text-align: center; color: #9ca3af; margin-bottom: 30px; font-size: 15px; }
        .u9 { color: #f59e0b; margin-bottom: 12px; }
        .u10 { color: #ef4444; margin-bottom: 20px; }
        .u11 { color: #f87171; margin-bottom: 8px; }
        .u12 { color: #fbbf24; margin-bottom: 8px; }
        .u13 { color: #3b82f6; margin-bottom: 15px; }
        .u14 { font-size: 28px; font-weight: bold; color: #22c55e; }
        .u15 { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .u16 { color:#86efac; font-size:12px; }
        .u17 { padding-top: 110px; padding-bottom: 80px; max-width: 900px; margin: 0 auto; }
        .u18 { padding-top: 110px; padding-bottom: 80px; max-width: 1400px; margin: 0 auto; }
        .u19 { max-width: 100%; height: 260px; object-fit: cover; border-radius: 16px; border: 3px solid #6b21a8; }
        .u20 { color: #f59e0b; margin-bottom: 15px; }
        .u21 { display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; }
        .u22 { flex: 1; min-width: 280px; padding: 12px; border-radius: 8px; border: 2px solid #6b21a8; background: #111827; color: white; font-family: monospace; }
        .u23 { width: auto; padding: 12px 24px; background: linear-gradient(to right, #3b82f6, #2563eb); }
        .u24 { color: #f59e0b; margin-bottom: 20px; text-align: center; }
        .u25 { font-size: 13px; color: #86efac; }
        .u26 { font-size: 32px; font-weight: bold; color: #22c55e; }
        .mb15 { margin-bottom: 15px; }
        .u27 { font-size: 22px; font-weight: bold; color: #fbbf24; }
        .u28 { display: flex; justify-content: space-between; padding-bottom: 10px; border-bottom: 1px solid #374151; }
        .u29 { margin-bottom:20px; padding:15px; background:#1f2937; border-radius:10px; }
        .u30 { --w1: #c4b5fd; --w2: #7c3aed; --wshadow: rgba(124, 58, 237, 0.4); --wshadow-h: rgba(124, 58, 237, 0.5); }

        /* ===== UTILITY CLASSES, BATCH 4 (canonicalized duplicates) ===== */
        .u101 { flex-shrink: 0; }
        .u102 { color: #f59e0b; }
        .u103 { color: #f87171; }
        .u104 { width: 100%; font-size: 13px; }
        .u105 { margin-bottom: 30px; }
        .u106 { color: #ef4444; }

        /* ===== EXTRACTED LAYOUT BLOCKS (one-off styles > 120 chars moved out of
           the markup; xN names map 1:1 to the element that owned them) ===== */
        .x201 { background: rgba(0,0,0,0.95); padding: 6px 16px; border-bottom: 1px solid #c026ff; position: fixed; width: 100%; z-index: 50; }
        .x202 { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; -ms-overflow-style: none; padding-bottom: 6px; }
        .x203 { position: relative; width: 100%; height: 48px; background: white; border-radius: 9999px; border: 3px solid #fbbf24; box-shadow: 0 0 12px rgba(251, 191, 36, 0.5); overflow: hidden; }
        .x204 { position: absolute; left: 0; top: 0; height: 100%; width: 100%; background: linear-gradient(to right, #22c55e, #16a34a); transition: width 0.3s linear; border-radius: 9999px; z-index: 6; }
        .x205 { position: absolute; left: 6px; top: 50%; transform: translateY(-50%); font-size: 26px; z-index: 15; line-height: 1; background: white; border: 2px solid #22c55e; border-radius: 9999px; padding: 4px 7px; box-shadow: 0 0 8px rgba(34, 197, 94, 0.5); }
        .x206 { position: absolute; top: 50%; transform: translateY(-50%); left: 100%; transition: left 0.25s linear; z-index: 10; width: 52px; height: 52px; border-radius: 8px; overflow: hidden; }
        .x207 { --glow: #ff00ff; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 9999px; background: #1f2937; border: 2px solid #6b21a8; }
        .x208 { --glow: #c026d3; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 9999px; background: #1f2937; border: 2px solid #6b21a8; }
        .x209 { --glow: #3b82f6; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 9999px; background: #1f2937; border: 2px solid #6b21a8; overflow: hidden; }
        .x210 { --glow: #ec4899; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 9999px; background: #1f2937; border: 2px solid #6b21a8; overflow: hidden; }
        .x211 { background: #1f2937; color: #f59e0b; font-weight: 700; padding: 8px 14px; border-radius: 8px; border: 2px solid #6b21a8; cursor: pointer; font-size: 13px; white-space: nowrap; display: flex; align-items: center; gap: 6px; transition: all 0.2s ease; --glow: #f59e0b; }
        .x212 { background: linear-gradient(to right, #ff00ff, #a855f7); color: white; font-weight: 700; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 12px; white-space: nowrap; }
        .x213 { background: #fbbf24; border-radius: 12px; border: 3px solid #f59e0b; z-index: 100000; box-shadow: 0 0 12px rgba(251, 191, 36, 0.6); }
        .x214 { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 100000; background: rgba(15, 10, 31, 0.92); align-items: flex-start; justify-content: center; overflow-y: auto; -webkit-overflow-scrolling: touch; }
        .x215 { width: 92%; max-width: 420px; background: #120b2a; border: 2px solid #6b21a8; border-radius: 24px; box-shadow: 0 25px 60px -15px rgb(0 0 0 / 0.6); max-height: 80vh; overflow-y: auto; margin: 0 0 30px 0; }
        .x216 { background: rgba(255,255,255,0.08); border: none; color: #c4b5fd; font-size: 26px; width: 42px; height: 42px; border-radius: 9999px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; }
        .x217 { padding: 16px 20px; border-radius: 14px; background: rgba(255,255,255,0.04); text-align: center; font-weight: 700; color: #22c55e; animation: lottoTextFlash 1.8s infinite alternate ease-in-out; }
        .x218 { display: none; background: #1a0033; border-bottom: 2px solid #6b21a8; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4); position: relative; z-index: 9999; }
        .x219 { max-width: 1280px; margin: 0 auto; padding: 8px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .x220 { background: linear-gradient(145deg, #c4b5fd, #7c3aed); color: white; border: none; padding: 7px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.2s ease; }
        .x221 { background: linear-gradient(145deg, #fbbf24, #d97706); color: white; border: none; padding: 7px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.2s ease; }
        .x222 { background: linear-gradient(145deg, #4ade80, #16a34a); color: white; border: none; padding: 7px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.2s ease; }
        .x223 { background: #374151; color: #e5e7eb; border: none; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 18px; line-height: 1; }
        .x224 { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; object-fit: cover; object-position: center 30%; z-index: 1; pointer-events: none; -webkit-touch-callout: none; user-select: none; }
        .x225 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; align-items: stretch; justify-content: center; }
        .x226 { position: relative; width: 100%; max-width: 520px; margin: 0 auto; background: #111827; border-radius: 20px; padding: 24px 20px; border: 1px solid #374151; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3); overflow: hidden; box-sizing: border-box; }
        .x227 { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #9ca3af; font-size: 14px; z-index: 1; display: none; text-align: center; }
        .x228 { width: 100% !important; height: auto !important; max-height: 460px; display: block; position: relative; z-index: 2; }
        .x229 { max-height: 200px; overflow-y: auto; padding: 14px 16px; background: #1f2937; border-radius: 10px; border-left: 4px solid #6b21a8; font-size: 13.5px; display: none; line-height: 1.65; color: #d1d5db; }
        .x230 { display: inline-block; width: 14px; height: 14px; background: #ef4444; border-radius: 3px; flex-shrink: 0; margin-top: 3px; }
        .x231 { display: inline-block; width: 14px; height: 14px; background: #fbbf24; border-radius: 3px; flex-shrink: 0; margin-top: 3px; }
        .x232 { display: inline-block; width: 14px; height: 14px; background: #22c55e; border-radius: 3px; flex-shrink: 0; margin-top: 3px; }
        .x233 { display: inline-block; width: 14px; height: 14px; background: #a855f7; border-radius: 3px; flex-shrink: 0; margin-top: 3px; }
        .x234 { max-width: 820px; margin: 0 auto 25px; padding: 14px 18px; background: #3f1f1f; border: 1px solid #ef4444; border-radius: 10px; text-align: center; }
        .x235 { margin-bottom:15px; padding:10px; background:#1f2937; border-radius:8px; font-family:monospace; font-size:13px; color:#ddd; cursor:pointer; }
        .x236 { display: none; background: #052e16; border-left: 5px solid #22c55e; border-radius: 10px; padding: 16px; font-size: 14px; line-height: 1.6; }
        .x237 { width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #166534; background: #052e16; color: white; font-size: 16px; }
        .x238 { padding: 10px 4px; background: #052e16; border: 2px solid #166534; border-radius: 8px; text-align: center; cursor: pointer; font-size: 11px; }
        .x239 { margin-top: 14px; padding: 12px; background: #3f1f1f; border: 1px solid #ef4444; border-radius: 8px; font-size: 12px; color: #fca5a5; line-height: 1.5; }
        .x240 { flex: 1; min-width: 180px; padding: 12px; border-radius: 8px; border: 2px solid #374151; background: #111827; color: white; }
        .x241 { margin-top: 12px; padding: 10px; background: #3f1f1f; border-radius: 6px; font-size: 13px; color: #fca5a5; display: none; }
        .x242 { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr)); gap: 30px; max-width: 1100px; margin: 0 auto; }
        .x243 { flex: 1; padding: 14px; border-radius: 10px; border: 2px solid #6b21a8; background: #111827; color: white; font-size: 18px; text-align: center; }
        .x244 { background: linear-gradient(to right, #fbbf24, #f59e0b); color: black; font-weight: bold; padding: 16px 28px; white-space: nowrap; }
        .x245 { display: none; position: fixed; top: 0; left: 0; width: 420px; height: 100vh; z-index: 999999; background: #0f001f; border-right: 4px solid #f59e0b; box-shadow: 8px 0 40px rgba(0,0,0,0.9); overflow-y: auto; animation: slideInFromLeft 0.3s ease-out forwards; }
        .x246 { position: sticky; top: 12px; right: 16px; float: right; background: #1f2937; border: 2px solid #f59e0b; color: #fbbf24; font-size: 24px; cursor: pointer; line-height: 1; font-weight: bold; width: 38px; height: 38px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; z-index: 10; margin: 12px 16px 0 0; }
        .x247 { background: #7f1d1d; color: #fca5a5; border: 1px solid #ef4444; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; }
        .x248 { margin-bottom: 24px; padding: 16px; background: #1f2937; border: 3px solid #f97316; border-radius: 12px; text-align: center; }
        .x249 { background: linear-gradient(to right, #f97316, #ea580c); color: white; border: none; padding: 14px 20px; font-size: 15px; font-weight: bold; border-radius: 10px; cursor: pointer; width: 100%; }
        .x250 { display: none; position: fixed; bottom: 24px; right: 24px; z-index: 999; width: 52px; height: 52px; border-radius: 9999px; background: linear-gradient(145deg, #7c3aed, #a855f7); color: white; border: none; cursor: pointer; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.5); transition: all 0.3s ease; font-size: 26px; line-height: 1; display: flex; align-items: center; justify-content: center; transform: translateY(-1px); }
        .x251 { position: fixed; bottom: 90px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
        .x252 { text-align: center; padding: 40px 20px 30px; font-size: 11px; color: #6b7280; max-width: 700px; margin: 0 auto; line-height: 1.6; }
        .x253 { max-width: 620px; text-align: center; background: #111827; border: 3px solid #6b21a8; border-radius: 20px; padding: 40px 30px; margin: 0 auto; }
        .x254 { background: linear-gradient(to right, #22c55e, #16a34a); color: white; border: none; padding: 14px 28px; font-size: 16px; font-weight: bold; border-radius: 12px; cursor: pointer; }

        /* --- Tokenomics: breathing room between the chart and the slice
               explanation box that appears below it --- */
        #pie-explanation {
            margin-top: 18px;
        }
        #chart-container {
            margin-bottom: 6px;
        }

        /* =====================================================================
           MONEY RAIN — retro pixel dollar bills that fall when the distribution
           timer hits 00:00. Bills are pure CSS (no images): pixel-font "$",
           hard 2px borders, inner highlight frame, and a green neon glow to
           match the rest of the sign. GPU-only animation (transform), bills
           remove themselves on animationend.
           ===================================================================== */
        .money-bill {
            position: fixed;
            top: -130px;
            z-index: 99990;
            pointer-events: none;          /* never blocks clicks */
            /* Real-dollar proportions (~2.35:1), big enough to read mid-fall.
               object-fit: cover fills the rectangle from the source image
               without distortion (crops excess instead of stretching). */
            width: 124px;
            height: 40px;
            object-fit: cover;
            border-radius: 3px;
            image-rendering: pixelated;    /* crisp retro scaling */
            filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.65));
            animation: billFall linear forwards;
            will-change: transform;
            border: 0;
            background: none;
        }

        /* Fallback if the bill image can't load: the original CSS-drawn pixel bill */
        .money-bill-css {
            width: 124px;
            height: 40px;
            background: linear-gradient(180deg, #16a34a 0%, #15803d 60%, #166534 100%);
            border: 2px solid #052e16;
            border-radius: 2px;
            box-shadow:
                inset 0 0 0 2px #4ade80,
                0 0 10px rgba(34, 197, 94, 0.55);
            color: #d9f99d;
            font-family: 'Press Start 2P', monospace;
            font-size: 18px;
            line-height: 36px;
            text-align: center;
            text-shadow: 0 0 4px #22c55e;
            filter: none;
        }
        .money-bill-css::before {
            content: "$";
        }

        @keyframes billFall {
            0% {
                transform: translateY(-130px) translateX(0) rotate(var(--tilt, 0deg));
            }
            100% {
                transform: translateY(112vh) translateX(var(--drift, 0px)) rotate(var(--spin, 360deg));
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .money-bill { display: none; }
        }

        /* =====================================================================
           ADMIN PANEL: collapsible sections + tool buttons
           ===================================================================== */
        .admin-section {
            background: #160b2e;
            border: 1px solid #4c1d95;
            border-radius: 10px;
            margin-bottom: 12px;
            overflow: hidden;
        }
        .admin-section summary {
            cursor: pointer;
            padding: 11px 14px;
            font-weight: 700;
            font-size: 13.5px;
            color: #e9d5ff;
            list-style: none;
            user-select: none;
        }
        .admin-section summary::-webkit-details-marker { display: none; }
        .admin-section summary::after {
            content: "▸";
            float: right;
            transition: transform 0.2s ease;
        }
        .admin-section[open] summary::after { transform: rotate(90deg); }
        .admin-section-body { padding: 4px 14px 14px; }
        .admin-check {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #d1d5db;
            margin: 10px 0;
            cursor: pointer;
        }
        .admin-tool-btn {
            width: 100%;
            margin-bottom: 8px;
            font-size: 12.5px;
            background: #1f2937;
            border: 1px solid #4b5563;
            color: #e5e7eb;
        }

        /* =====================================================================
           NEON INTENSITY LEVELS (admin > Appearance). Same selectors as the
           restoration layer, placed later with body-class specificity so they
           win cleanly. Soft reuses mobile-scale halos; Maximum goes full Vegas.
           ===================================================================== */
        body.neon-soft .nav-link,
        body.neon-soft nav .nav-link {
            text-shadow: 0 0 1px rgba(255,255,255,0.8), 0 0 3px currentColor, 0 0 7px currentColor, 0 0 12px currentColor !important;
        }
        body.neon-soft .page-title,
        body.neon-soft h1.neon-text, body.neon-soft h2.neon-text,
        body.neon-soft .section h2, body.neon-soft .section-title {
            text-shadow: 0 0 1px rgba(255,255,255,0.85), 0 0 4px currentColor, 0 0 10px currentColor, 0 0 20px currentColor !important;
        }
        body.neon-soft .card h3, body.neon-soft .explore-card h3 {
            text-shadow: 0 0 1px rgba(255,255,255,0.6), 0 0 3px currentColor, 0 0 8px currentColor !important;
        }
        body.neon-soft .logo-letter {
            text-shadow: 0 0 1px rgba(255,255,255,0.85), 0 0 4px currentColor, 0 0 9px currentColor, 0 0 16px currentColor;
        }

        body.neon-max .nav-link,
        body.neon-max nav .nav-link {
            text-shadow: 0 0 2px rgba(255,255,255,1), 0 0 6px currentColor, 0 0 14px currentColor, 0 0 30px currentColor, 0 0 55px currentColor !important;
        }
        body.neon-max .page-title,
        body.neon-max h1.neon-text, body.neon-max h2.neon-text,
        body.neon-max .section h2, body.neon-max .section-title {
            text-shadow: 0 0 2px rgba(255,255,255,1), 0 0 8px currentColor, 0 0 22px currentColor, 0 0 45px currentColor, 0 0 80px currentColor !important;
        }
        body.neon-max .card h3, body.neon-max .explore-card h3 {
            text-shadow: 0 0 1px rgba(255,255,255,0.85), 0 0 6px currentColor, 0 0 14px currentColor, 0 0 28px currentColor !important;
        }
        body.neon-max .logo-letter {
            text-shadow: 0 0 2px rgba(255,255,255,1), 0 0 8px currentColor, 0 0 20px currentColor, 0 0 40px currentColor, 0 0 64px currentColor;
        }

        /* Breathing toggle (admin > Appearance) */
        body.no-breathe .page-title,
        body.no-breathe h1.neon-text, body.no-breathe h2.neon-text,
        body.no-breathe .section h2, body.no-breathe .section-title {
            animation: none !important;
        }
    </style>

    <!-- Neon Glow for Navigation + Page Titles -->

    <!-- Chart.js for Tokenomics Pie Chart -->
    <script defer src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- App JS: numeric order is load+execution order (defer preserves it).
         All files sit in the SAME folder as index.html. -->
    <script>
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
                // Cooldown is admin-configurable (Rules & Metrics > free ticket hold time)
                const hours = (typeof CONFIG !== 'undefined' && CONFIG.metrics?.freeTicketCooldownHours) || 24;
                const last = parseInt(localStorage.getItem(this.FREE_CLAIM_KEY), 10) || 0;
                const remaining = last + hours * 3600 * 1000 - Date.now();
                if (remaining > 0) {
                    const h = Math.ceil(remaining / 3600000);
                    showToast("Free ticket on cooldown", "success", `Next free ticket in about ${h} hour${h === 1 ? '' : 's'}.`);
                    return;
                }
                localStorage.setItem(this.FREE_CLAIM_KEY, String(Date.now()));
                this.addTickets(1);
                showToast("🎁 Free Ticket Claimed!", "success", "+1 Free Lottery Ticket added to your account. Good luck in the next draw!");
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
            'runAutomatedWallScan', 'runAutomatedHallScan', 'startMoneyRain',
            'exportSiteConfig', 'resetSiteData'
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
    </script>
    <script>
        /* Part of the Ruggy Rewards app. Files load in numeric order via
           <script defer> tags in index.html; execution order matters for
           the decorator chain and error-boundary application. */

        /* =====================================================================
           SECTION 2 — BANNER VIDEO
           ===================================================================== */
        setTimeout(() => {
                const bannerVideo = document.getElementById('home-banner-video');
                if (bannerVideo) {
                    bannerVideo.addEventListener('click', e => e.preventDefault(), { passive: false });
                    bannerVideo.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
                    bannerVideo.addEventListener('touchend', e => e.preventDefault(), { passive: false });
                    bannerVideo.addEventListener('contextmenu', e => e.preventDefault());
                    
                    document.addEventListener('touchstart', () => {
                        if (bannerVideo.paused) bannerVideo.play().catch(() => {});
                    }, { once: true });
                }
            }, 800);
    </script>
    <script>
        /* Part of the Ruggy Rewards app. Files load in numeric order via
           <script defer> tags in index.html; execution order matters for
           the decorator chain and error-boundary application. */

        /* =====================================================================
           SECTION 3 — REWARDS PAGE HELPERS
           ===================================================================== */
        function updateLiveStats() {
                const roiEl = document.getElementById('user-roi');
                const heldEl = document.getElementById('user-held');
                const soldEl = document.getElementById('user-sold');
                const statusEl = document.getElementById('take-profit-status');

                if (roiEl && heldEl && soldEl && statusEl) {
                    const roi = Math.floor(Math.random() * 180) + 80;
                    const held = (Math.random() * 2.8 + 0.4).toFixed(1);
                    const sold = Math.floor(Math.random() * 45);

                    roiEl.textContent = `+${roi}%`;
                    heldEl.textContent = `${held}%`;
                    soldEl.textContent = `${sold}%`;

                    if (roi >= 200 && sold < 50) {
                        statusEl.textContent = "Available";
                        statusEl.style.color = "#22c55e";
                    } else if (sold >= 50) {
                        statusEl.textContent = "Used - Wait for next 200%";
                        statusEl.style.color = "#ef4444";
                    } else {
                        statusEl.textContent = "Building...";
                        statusEl.style.color = "#fbbf24";
                    }
                }
            }

            setTimeout(updateLiveStats, 800);
    </script>
    <script>
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
                holderShutoff: 500,            // auto-distribution stops after N holders
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
                absolutionLockDays: 3,
                lotteryDailyTime: '8:00 PM UTC',
                lotteryWeeklyDay: 'Sunday',
                lotteryWeeklyTime: '8:00 PM UTC',
                freeTicketCooldownHours: 24
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

            // === FRESH DISTRIBUTION TIMER ON PAGE LOAD (admin-configured interval) ===
            (function initializeDistributionTimer() {
                const now = Date.now();
                const minutes = CONFIG.distributionIntervalMinutes || 30;
                CONFIG.nextDistributionTime = new Date(now + (minutes * 60 * 1000)).toISOString();

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
                .sort((a, b) => b.daysHeld - a.daysHeld)
                .slice(0, (CONFIG.metrics?.hallLongestShown) || 12);

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
            set('content-ticket-price', c.ticketPrice);

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
                "<span style='color:#9ca3af;font-size:13px;'>Clears settings, stakes, lottery tickets, and the Wall. The admin login session is kept. This cannot be undone.</span>",
                { okText: 'Reset Everything', danger: true }
            );
            if (!ok) return;
            ['ruggyConfig', 'ruggyStakes', 'ruggyLottoTickets', 'lastFreeLottoTicket',
             'ruggyBannedWall', 'ruggyLastConnectedWallet'].forEach(k => {
                try { localStorage.removeItem(k); } catch (_) {}
            });
            showToast("Site data reset", "success", "Reloading fresh\u2026");
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
            CONFIG.content.ticketPrice = getAdminInputNumber('content-ticket-price', 3);

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
            mm.absolutionLockDays = getAdminInputNumber('m-abs-days', 3);
            mm.lotteryDailyTime = getAdminInputValue('m-lotto-daily-time') || '8:00 PM UTC';
            mm.lotteryWeeklyDay = getAdminInputValue('m-lotto-weekly-day') || 'Sunday';
            mm.lotteryWeeklyTime = getAdminInputValue('m-lotto-weekly-time') || '8:00 PM UTC';
            mm.freeTicketCooldownHours = getAdminInputNumber('m-free-ticket-hours', 24);

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

            saveConfig();
            applySiteSettings();
            if (typeof applyChainSettings === 'function') applyChainSettings();
            updateHomeWalletDisplays();

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

            const s = CONFIG.distributionSplits || { liquidity: 40, antiRug: 20, community: 30, creator: 10 };
            const v = metricsView();
            const explanations = [
                {
                    title: `🔥 Burn Wallet / Liquidity (${s.liquidity}%)`,
                    text: "This portion goes to a dedicated wallet that performs automatic buybacks and burns. Burns mean coins are permanently removed and staked into the Liquidity Pool. <strong>Once 50% of the LP is permanently locked, burns stop</strong> and extra fees are redirected: <strong>Community gets a boost</strong>, <strong>Anti-Rug gets a boost</strong>.",
                    color: "#ef4444"
                },
                {
                    title: `👥 Community (${s.community}%)`,
                    text: `Rewards sent to holders with <strong>${Number(v.communityThreshold).toLocaleString()}+</strong> $RUGGY. This portion supports the broader community of dedicated holders.`,
                    color: "#fbbf24"
                },
                {
                    title: `🛡 Anti-Rug Vault (${s.antiRug}%)`,
                    text: `Insurance vault for holders with <strong>${Number(v.antiRugThreshold).toLocaleString()}+</strong> $RUGGY. Protects loyal holders against catastrophic dumps.`,
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
                freeTicketCooldownHours: m.freeTicketCooldownHours
            };
        }

        function applyMetrics() {
            const view = metricsView();
            document.querySelectorAll('[data-m]').forEach((el) => {
                const key = el.dataset.m;
                if (!(key in view) || view[key] === undefined || view[key] === null) return;
                const v = view[key];
                const fmt = el.dataset.fmt || 'raw';
                el.textContent =
                    fmt === 'pct' ? v + '%' :
                    fmt === 'num' ? Number(v).toLocaleString() :
                    v;
            });
            // rules that re-render lists
            if (typeof renderBannedTable === 'function') renderBannedTable();
            // live chart refresh with new splits
            // NOTE: before initTokenomicsChart runs, window.feePieChart is the
            // CANVAS element (ids auto-become window properties) — not the Chart.
            // Require a real Chart instance (has .update and .data) before touching it.
            const chart = window.feePieChart;
            if (chart && typeof chart.update === 'function' && chart.data && CONFIG.distributionSplits) {
                const s = CONFIG.distributionSplits;
                // slice order matches initTokenomicsChart: liquidity, community, antiRug, creator
                chart.data.datasets[0].data = [s.liquidity, s.community, s.antiRug, s.creator];
                chart.data.labels = [
                    `Liquidity & Burns (${s.liquidity}%)`,
                    `Community (${s.community}%)`,
                    `Anti-Rug Holders (${s.antiRug}%)`,
                    `MDR Fund (${s.creator}%)`
                ];
                chart.update();
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

            const price = Number(content.ticketPrice) || 3;
            RUGGY_SETTINGS.lottery.ticketPriceUsd = price;
            const priceDisplay = document.getElementById('lotto-ticket-price-display');
            if (priceDisplay) priceDisplay.textContent = '$' + price + ' USD';

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
    </script>
    <script>
        /* Part of the Ruggy Rewards app. Files load in numeric order via
           <script defer> tags in index.html; execution order matters for
           the decorator chain and error-boundary application. */

        /* =====================================================================
           SECTION 5 — TITLE TEXT & EMOJI NORMALIZATION
           ===================================================================== */
        // Matches a leading emoji cluster: pictographs, skin-tone modifiers,
        // variation selector (\uFE0F), and ZWJ sequences.
        const LEADING_EMOJI = /^([\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\uFE0F\u200D]+)[ \t]*/u;

        function normalizeTitleEmojis() {
            const titles = document.querySelectorAll('h1, h2, h3, .neon-text, .card h3, .explore-card h3, .section h2');

            titles.forEach(el => {
                // Already normalized, or starts with markup rather than text
                if (el.querySelector(':scope > .title-emoji')) return;
                const first = el.firstChild;
                if (!first || first.nodeType !== Node.TEXT_NODE) return;

                const m = first.textContent.match(LEADING_EMOJI);
                if (!m) return;

                const span = document.createElement('span');
                span.className = 'title-emoji';
                span.textContent = m[1];
                first.textContent = first.textContent.slice(m[0].length);
                el.insertBefore(span, first);
            });
        }

        function applySmartTextWrapping() {
            normalizeTitleEmojis();

            const titles = document.querySelectorAll('h1, h2, h3, .neon-text, .card h3, .explore-card h3, .section h2');

            titles.forEach(el => {
                const text = el.textContent.trim();
                const wordCount = text.split(/\s+/).length;

                if (wordCount === 1) {
                    el.style.whiteSpace = 'nowrap';
                    el.style.overflow = 'visible';
                } else {
                    el.style.whiteSpace = 'normal';
                    el.style.overflowWrap = 'break-word';
                    // No negative indent — it clipped leading emojis in
                    // centered headings on mobile.
                    el.style.textIndent = '0';
                    el.style.paddingLeft = '';
                }
            });
        }

        // Run on load and after navigation
        window.addEventListener('load', applySmartTextWrapping);
        document.addEventListener('click', (e) => {
            if (e.target.closest('[onclick*="navigateTo"]')) {
                setTimeout(applySmartTextWrapping, 400);
            }
        });
        window.addEventListener('resize', () => {
            clearTimeout(window.__smartWrapTimer);
            window.__smartWrapTimer = setTimeout(applySmartTextWrapping, 200);
        });
    </script>
    <script>
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
    </script>
    <script>
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
    </script>

    <!-- ==================== GLOBAL WALLET CONNECTION (Multi-wallet support) ==================== -->
    
</head>
<body>

    <!-- Navbar -->
    <nav class="x201">
        <div style="max-width: 1280px; margin: 0 auto;">
            
            <!-- Top Row: Logo + Timer + Icons + Connect Wallet -->
            <div class="x202 topbar-scroll">
                <div style="display: flex; align-items: center; gap: 14px; min-width: max-content; padding-right: 10px;">
                    
                    <!-- Logo + Title -->
                    <div data-action="navigate" data-page="home" 
                         class="hover-scale" style="--scale: 1.03; display: flex; align-items: center; gap: 8px; flex-shrink: 0; cursor: pointer;"
                         title="Go to Homepage">
                        <img decoding="async" fetchpriority="high" width="48" height="48" src="https://i.ibb.co/Dfyk19B8/grok-image-7117a15e-b973-4517-a098-e981cc27fecc.jpg" 
                             id="logo" style="width: 34px; height: 34px; border-radius: 9999px; border: 3px solid #ff00ff; object-fit: cover;">
                        <!-- Multi-colored glowing RUGGY logo -->
                        <h1 style="margin: 0; font-size: 22px; letter-spacing: 3.5px; font-weight: 800; display: flex; align-items: center; gap: 6px;">
                            <span class="logo-letter" style="--c: #ef4444">R</span>
                            <span class="logo-letter" style="--c: #3b82f6">U</span>
                            <span class="logo-letter" style="--c: #22c55e">G</span>
                            <span class="logo-letter" style="--c: #eab308">G</span>
                            <span class="logo-letter" style="--c: #c084fc">Y</span>
                        </h1>
                    </div>

                    <!-- Distribution Timer -->
                    <div class="hover-scale" style="--scale: 1.02; width: 220px; flex-shrink: 0; cursor: pointer;" 
                         data-action="navigate" data-page="rewards" 
                         title="Click to view Rewards & Claim">
                        <div style="font-size: 9px; color: #f59e0b; text-align: center; margin-bottom: 4px; font-weight: bold;">NEXT REWARD IN</div>
                        
                        <div id="timer-bar-container" 
                             class="x203">
                            
                            <div id="timer-bar-fill" 
                                 class="x204"></div>
                            
                            <div id="bank-target"
                                 class="x205">
                                🏦
                            </div>
                            
                            <div id="timer-lambo" 
                                 class="x206">
                                <video 
                                    id="timer-video"
                                    autoplay 
                                    loop 
                                    muted 
                                    playsinline
                                    style="width: 100%; height: 100%; object-fit: cover; display: block;"
                                    src="https://pub-21b06b5258c545bba385c46094bf8574.r2.dev/IMG_4382-ezgif.com-gif-to-mp4-converter.MP4">
                                </video>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 5px;">
                            <span id="nav-timer" class="timer" 
                                  style="font-size: 14px; font-weight: bold; color: #f59e0b; text-shadow: 0 1px 3px rgba(0,0,0,0.6);">
                                15:00
                            </span>
                        </div>
                    </div>

                    <!-- Social Icons -->
                    <div style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
                        <a id="social-x" href="https://x.com" target="_blank" rel="noopener noreferrer" 
                           class="icon-glow x207" >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                <path d="M18.244 2.25l-7.451 8.502L4.5 2.25H1.5l7.5 8.625L1.5 21.75h3l6.75-7.875L18 21.75h3l-7.5-8.625L21 2.25h-2.756z"/>
                            </svg>
                        </a>

                        <a id="social-telegram" href="https://t.me" target="_blank" rel="noopener noreferrer" 
                           class="icon-glow x208" >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                        </a>

                        <a id="social-dexscreener" href="https://dexscreener.com" target="_blank" rel="noopener noreferrer" 
                           class="icon-glow x209" >
                            <img decoding="async" width="28" height="28" src="https://i.ibb.co/99rsGw3q/IMG-4375.png" 
                                 class="u4" alt="Dexscreener">
                        </a>

                        <a id="social-pumpfun" href="https://pump.fun" target="_blank" rel="noopener noreferrer" 
                           class="icon-glow x210" >
                            <img decoding="async" width="28" height="28" src="https://smithii.io/wp-content/uploads/2025/07/400-x-400.webp" 
                                 class="u4" alt="Pump.fun">
                        </a>
                    </div>

                    <!-- Admin Access -->
                    <div class="u101">
                        <button id="admin-btn" 
                                class="x211 icon-glow"
                                title="Admin Panel">
                            🔐 Admin
                        </button>
                    </div>

                    <!-- Connect Wallet Button -->
                    <div class="u101">
                        <button id="connect-btn" 
                                class="x212">
                            CONNECT WALLET
                        </button>
                    </div>
                </div>
            </div>

            <!-- Desktop Navigation Links -->
            <div id="desktop-nav" class="hidden" style="gap: 18px; font-size: 15px; align-items: center; padding: 4px 0;">
                <a data-page="home" class="nav-link active home-cycling" 
                   style="text-decoration: none; font-weight: 700;">HOME</a>
                <a data-page="tokenomics" class="nav-link" style="color: #9ca3af; text-decoration: none;">TOKENOMICS</a>
                <a data-page="lore" class="nav-link" style="color: #c084fc; text-decoration: none;">LORE</a>
                <a data-page="rewards" class="nav-link" style="color: #22c55e; text-decoration: none;">REWARDS</a>
                <a data-page="gallery" class="nav-link" style="color: #ff00ff; text-decoration: none;">GALLERY</a>
                <a data-page="hall" class="nav-link" style="color: #f59e0b; text-decoration: none;">HALL</a>
                <a data-page="wall" class="nav-link" style="color: #ef4444; text-decoration: none;">WALL</a>
                <a data-page="pool" class="nav-link" style="color: #3b82f6; text-decoration: none;">POOL</a>
                <a data-page="absolution" class="nav-link" style="color: white; text-decoration: none;">ABSOLUTION</a>
                <a data-page="lotto" class="nav-link lotto-animated-title" style="text-decoration: none;">LOTTERY</a>
            </div>

            <!-- Mobile Hamburger Button -->
            <button id="mobile-menu-btn"
                    
                    class="x213">
                ☰
            </button>

        </div>
    </nav>

    <!-- ==================== MOBILE MENU (Popup Overlay) ==================== -->
    <!-- NOTE: Tailwind is not loaded on this page, so utility classes do nothing.
         All positioning is done with real CSS below. The overlay is fixed and
         sits ABOVE the nav (z-index 100000> nav's 50); the card is pushed
         below the nav via a dynamic padding-top set in toggleMobileMenu(). -->
    <div id="mobile-menu"
         class="x214">
        
        <div id="mobile-menu-card" class="x215">
            
            <!-- Close Button -->
            <div style="display: flex; justify-content: flex-end; padding: 18px 22px 8px 22px;">
                <button id="mobile-menu-close-btn" 
                        class="x216">
                    ✕
                </button>
            </div>

            <!-- Mobile Navigation Links -->
            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 17px; padding: 12px 20px 40px 20px;">
                
                <a data-page="home" class="nav-link active home-cycling" 
                   style="padding: 16px 20px; border-radius: 14px; background: rgba(255,255,255,0.08); font-weight: 700; text-align: center;">HOME</a>
                
                <a data-page="tokenomics" class="nav-link" 
                   style="padding: 16px 20px; border-radius: 14px; background: rgba(255,255,255,0.04); color: #9ca3af; text-align: center;">TOKENOMICS</a>
                
                <a data-page="lore" class="nav-link" 
                   style="padding: 16px 20px; border-radius: 14px; background: rgba(255,255,255,0.04); color: #c084fc; text-align: center;">LORE</a>
                
                <a data-page="rewards" class="nav-link" 
                   style="padding: 16px 20px; border-radius: 14px; background: rgba(255,255,255,0.04); color: #22c55e; text-align: center;">REWARDS</a>
                
                <a data-page="gallery" class="nav-link" 
                   style="padding: 16px 20px; border-radius: 14px; background: rgba(255,255,255,0.04); color: #ff00ff; text-align: center;">GALLERY</a>
                
                <a data-page="hall" class="nav-link" 
                   style="padding: 16px 20px; border-radius: 14px; background: rgba(255,255,255,0.04); color: #f59e0b; text-align: center;">HALL</a>
                
                <a data-page="wall" class="nav-link" 
                   style="padding: 16px 20px; border-radius: 14px; background: rgba(255,255,255,0.04); color: #ef4444; text-align: center;">WALL</a>
                
                <a data-page="pool" class="nav-link" 
                   style="padding: 16px 20px; border-radius: 14px; background: rgba(255,255,255,0.04); color: #3b82f6; text-align: center;">POOL</a>
                
                <a data-page="absolution" class="nav-link" 
                   style="padding: 16px 20px; border-radius: 14px; background: rgba(255,255,255,0.04); color: #e5e7eb; text-align: center;">ABSOLUTION</a>
                
                <!-- LOTTERY button - Exact same shape & background as others + flashing green/gold text -->
                <a data-page="lotto" class="nav-link x217"
                   >
                    LOTTERY
                </a>
            </div>
        </div>
    </div>

    <!-- ==================== HORIZONTAL CONNECT WALLET BAR (Clean) ==================== -->
    <div id="wallet-connect-bar" 
         class="x218">
        <div class="x219">
            
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span style="color: #f3e8ff; font-weight: 700; margin-right: 8px; font-size: 14px;">Connect Wallet:</span>
                
                <button data-action="connect-wallet" data-wallet="phantom" 
                        class="x220">
                    👻 Phantom
                </button>

                <button data-action="connect-wallet" data-wallet="solflare" 
                        class="x221">
                    🔥 Solflare
                </button>

                <button data-action="connect-wallet" data-wallet="backpack" 
                        class="x222">
                    🎒 Backpack
                </button>
            </div>

            <button data-action="closeWalletConnectBar" 
                    class="x223">
                ✕
            </button>
        </div>
    </div>

    <!-- HOME -->
    <section id="home" class="section active" style="padding-top: 0; padding-bottom: 60px;">

        <!-- Banner with MP4 Video -->
        <div style="position: relative; width: 100%; height: 520px; overflow: hidden; margin-bottom: 40px; border-bottom: 1px solid #374151;">
            <video 
                id="home-banner-video"
                autoplay 
                loop 
                muted 
                playsinline
                webkit-playsinline
                x-webkit-airplay="deny"
                disablePictureInPicture
                controls="false"
                class="x224">
                <source src="https://pub-21b06b5258c545bba385c46094bf8574.r2.dev/_users_a3f033dd-e168-4f64-bdaf-b2d792f555db_generated_6372ba5e-3d8b-4304-b73d-5435231a79d9_generated_video.MP4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.45); z-index: 2;"></div>
            
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; z-index: 3; width: 92%;">
                <h1 class="neon-text hero-title">RUGGY</h1>
                <p class="hero-sub">The Ultimate Anti-Rug Mascot</p>
                
                <button data-action="navigate" data-page="rewards" class="buy-button" style="max-width: 280px; font-size: 17px; padding: 16px 32px;">
                    CLAIM REWARDS
                </button>
            </div>
        </div>


        <div style="max-width: 1100px; margin: 0 auto; padding: 0 20px; text-align: center; width: 100%;">
            
            <div id="home-metrics" style="max-width: 620px; margin: 0 auto 30px; display: none;">
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                        <div>
                            <div class="u5">TOKEN</div>
                            <div id="home-token-name" style="font-size: 26px; font-weight: bold;">Loading...</div>
                        </div>
                        <div style="text-align: right;">
                            <div id="home-price" class="metric">--</div>
                            <div class="muted-sm">USD</div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                        <div>
                            <div class="muted-12">MARKET CAP</div>
                            <div id="home-market-cap" class="u6">--</div>
                        </div>
                        <div>
                            <div class="muted-12">24H VOLUME</div>
                            <div id="home-volume" class="u6">--</div>
                        </div>
                    </div>

                    <div class="mb20">
                        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
                            <span>Bonding Curve</span>
                            <span id="home-progress-text">--</span>
                        </div>
                        <div class="progress-container" style="height: 10px; background: #1f2937; border-radius: 9999px; overflow: hidden;">
                            <div id="home-progress-bar" style="height: 100%; background: linear-gradient(to right, #22c55e, #16a34a); width: 0%; transition: width 0.4s;"></div>
                        </div>
                    </div>

                    <button data-action="buyOnPumpFun" class="buy-button">🚀 BUY ON PUMP.FUN</button>
                </div>
            </div>

            <div id="home-no-ca" style="max-width: 500px; margin: 0 auto; color: #9ca3af;">
                <p>Token metrics will appear here once the CA is set in the <strong class="u102">Developer</strong> panel.</p>
            </div>

            <div style="max-width: 1100px; margin: 70px auto 0; padding: 0 20px; text-align: center;">
                <h2 style="font-size: 28px; margin-bottom: 30px; text-align: center;">Explore Ruggy</h2>
                
                <div class="x225">
                    
                    <div data-action="navigate" data-page="tokenomics" class="card btn-bare">
                        <img decoding="async" width="400" height="260" src="https://i.ibb.co/WvDQ5GLQ/grok-image-f278b401-bd77-42a9-aae8-2dffd2191eb9.jpg" 
                             class="tile-img-sm" loading="lazy">
                        <div class="pad-card">
                            <h3 style="margin: 0 0 8px 0; color: #9ca3af; line-height: 1.25;">Tokenomics</h3>
                            <p class="muted-sm-flat">Transparent fees & anti-rug mechanics</p>
                        </div>
                    </div>

                    <div data-action="navigate" data-page="lore" class="card btn-bare">
                        <img decoding="async" width="400" height="260" src="https://i.ibb.co/Q75M1ybm/IMG-4342.jpg" 
                             class="tile-img-sm" loading="lazy">
                        <div class="pad-card">
                            <h3 style="margin: 0 0 8px 0; color: #c084fc;">The Lore of Ruggy</h3>
                            <p class="muted-sm-flat">The emotional story behind the anti-rug monster</p>
                        </div>
                    </div>

                    <div data-action="navigate" data-page="rewards" class="card btn-bare">
                        <img decoding="async" width="400" height="260" src="https://i.ibb.co/Ps3cKSD8/grok-image-c4d3a07b-3b01-48f0-9d3e-889d8230ba88.jpg" 
                             class="tile-img-sm" loading="lazy">
                        <div class="pad-card">
                            <h3 style="margin: 0 0 8px 0; color: #22c55e;">Rewards</h3>
                            <p class="muted-sm-flat">Check eligibility & claim your rewards</p>
                        </div>
                    </div>

                    <div data-action="navigate" data-page="gallery" class="card btn-bare">
                        <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/YBMXZJrX/grok-image-306bf515-c3d0-441f-a54d-f6a44f9e4fc4.jpg" 
                             class="tile-img-sm">
                        <div class="pad-card">
                            <h3 style="margin: 0 0 8px 0; color: #ff00ff;">Gallery</h3>
                            <p class="muted-sm-flat">All the different faces of Ruggy</p>
                        </div>
                    </div>

                    <div data-action="navigate" data-page="hall" class="card btn-bare">
                        <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/d0ghBvcX/IMG-4341.jpg" 
                             class="tile-img-sm">
                        <div class="pad-card">
                            <h3 style="margin: 0 0 8px 0; color: #f59e0b;">Ruggy's Hall</h3>
                            <p class="muted-sm-flat">Top holders & biggest bagworkers</p>
                        </div>
                    </div>

                    <div data-action="navigate" data-page="wall" class="card u7">
                        <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/G4WXRR25/IMG-4340.jpg" 
                             style="width: 100%; height: 160px; object-fit: cover; object-position: center 40%;">
                        <div class="pad-card">
                            <h3 style="margin: 0 0 8px 0; color: #ef4444;">Ruggy's Wall</h3>
                            <p class="muted-sm-flat">Those who upset Ruggy</p>
                        </div>
                    </div>

                    <div data-action="navigate" data-page="pool" class="card btn-bare">
                        <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/twBcdrpr/IMG-4373.jpg" 
                             class="tile-img-sm">
                        <div class="pad-card">
                            <h3 style="margin: 0 0 8px 0; color: #3b82f6;">Ruggy's Pool</h3>
                            <p class="muted-sm-flat">Live Liquidity & Burns</p>
                        </div>
                    </div>

                    <div data-action="navigate" data-page="absolution" class="card btn-bare">
                        <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/dJHZxvB4/IMG-4374.jpg" 
                             style="width: 100%; height: 160px; object-fit: cover; object-position: center;">
                        <div class="pad-card">
                            <h3 style="margin: 0 0 8px 0; color: white; line-height: 1.25;">Absolution</h3>
                            <p style="font-size: 13px; color: white; margin: 0;">The path to forgiveness</p>
                        </div>
                    </div>

                    <!-- Ruggy's Lottery -->
                    <div data-action="navigate" data-page="lotto" class="card u7">
                        <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/LdFxTN9p/IMG-4431.jpg" 
                             style="width: 100%; height: 160px; object-fit: cover; object-position: center 30%;">
                        <div class="pad-card">
                            <h3 class="lotto-animated-title" style="margin: 0 0 8px 0; line-height: 1.25; font-size: 18px; font-weight: 900;">Ruggy's Lottery</h3>
                            <p class="muted-sm-flat">Daily & Weekly Draws • Win Big!</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>

    <!-- TOKENOMICS -->
    <section id="tokenomics" class="section page-wrap">
        
        <div class="center-mb30">
            <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/WvDQ5GLQ/grok-image-f278b401-bd77-42a9-aae8-2dffd2191eb9.jpg" 
                 class="feature-img">
        </div>

        <h2 class="page-h2 neon-text">TOKENOMICS</h2>
        <p class="u8">
            Transparent fee distribution designed to reward loyalty and punish rugs
        </p>

        <div style="max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start;">
            
            <!-- LEFT COLUMN: Pie Chart + Fee Breakdown + Explanation (Clean Vertical Stack) -->
            <div>
                <!-- Pie Chart Card -->
                <div class="card" style="overflow: visible; padding: 28px 24px 32px 24px; margin-bottom: 20px; height: auto; box-sizing: border-box;">
                    <h3 style="color: #ff00ff; margin-bottom: 8px; text-align: center;">FEE DISTRIBUTION</h3>
                    <p style="text-align:center; font-size:12px; color:#9ca3af; margin-bottom:16px;">Click any slice to learn more</p>
                    
                    <!-- Improved Chart Container -->
                    <div id="chart-container" 
                         class="x226">
                        
                        <div class="chart-loading x227" 
                             >
                            Loading chart...
                        </div>
                        
                        <canvas id="feePieChart" 
                                class="x228"></canvas>
                    </div>
                    
                    <!-- Dynamic Explanation -->
                    <div id="pie-explanation" 
                         class="x229">
                        <div id="pie-explanation-content"></div>
                    </div>
                </div>

                <!-- Fee Breakdown - Directly under the chart -->
                <div class="card" style="padding: 22px 24px;">
                    <h3 style="color: #ff00ff; margin-bottom: 16px;">Fee Breakdown</h3>
                    
                    <div class="row-head">
                        <div class="row-top">
                            <span class="x230"></span>
                            <span class="text-14"><strong>Burn Wallet</strong><br><span class="muted-125">Buybacks & Burns</span></span>
                        </div>
                        <span style="font-weight: bold; color: #ef4444; font-size: 15px; white-space: nowrap; margin-top: 2px;"><span data-m="liquidityPct" data-fmt="pct">40%</span></span>
                    </div>
                    
                    <div class="row-head">
                        <div class="row-top">
                            <span class="x231"></span>
                            <span class="text-14"><strong>Community</strong><br><span class="muted-125">500k+ holders</span></span>
                        </div>
                        <span style="font-weight: bold; color: #fbbf24; font-size: 15px; white-space: nowrap; margin-top: 2px;"><span data-m="communityPct" data-fmt="pct">30%</span></span>
                    </div>
                    
                    <div class="row-head">
                        <div class="row-top">
                            <span class="x232"></span>
                            <span class="text-14"><strong>Anti-Rug</strong><br><span class="muted-125">1M+ holders</span></span>
                        </div>
                        <span style="font-weight: bold; color: #22c55e; font-size: 15px; white-space: nowrap; margin-top: 2px;"><span data-m="antiRugPct" data-fmt="pct">20%</span></span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div class="row-top">
                            <span class="x233"></span>
                            <span class="text-14"><strong>MDR Fund</strong><br><span class="muted-125">Marketing, Development & Research</span></span>
                        </div>
                        <span style="font-weight: bold; color: #a855f7; font-size: 15px; white-space: nowrap; margin-top: 2px;"><span data-m="creatorPct" data-fmt="pct">10%</span></span>
                    </div>
                </div>
            </div>

            <!-- RIGHT COLUMN: Other Important Cards -->
            <div>
                <div class="card" style="margin-bottom: 22px; border: 2px solid #f59e0b;">
                    <h3 class="u9">📡 Distribution Mode</h3>
                    <p style="font-size: 13px; line-height: 1.6; margin: 0;">
                        <strong>Automatic Sending:</strong> Rewards are sent automatically to qualified wallets when the timer ends.<br><br>
                        <strong>After <span data-m="holderShutoff" data-fmt="num">500</span> holders:</strong> Automatic distribution stops, but rewards are <strong>still sent to the community vault every <span data-m="intervalMinutes" data-fmt="raw">30</span> minutes</strong>. They accumulate in the vault for approved wallets to <strong>claim whenever they like</strong> by connecting their wallet on this site.
                    </p>
                </div>

                <div class="card" style="margin-bottom: 22px; border: 2px solid #22c55e;">
                    <h3 class="green-mb15">💰 Take Profit Rules – For True Holders</h3>
                    <div class="text-15">
                        <p><strong>True holders deserve their reward.</strong></p>
                        <p>After every <strong><span data-m="roiTakeProfit" data-fmt="pct">200%</span> ROI</strong>, you can safely take up to <strong><span data-m="roiSafeSellPct" data-fmt="pct">50%</span></strong> of your Ruggy with no ban risk.</p>
                        <p>If you sell more than <span data-m="roiSafeSellPct" data-fmt="pct">50%</span> in that window → <strong>Locked Ban</strong>.</p>
                        <p class="gold">This only applies to your first sell after <span data-m="roiTakeProfit" data-fmt="pct">200%</span> ROI. After using it, your counter resets.</p>
                    </div>
                </div>

                <div class="card">
                    <h3 class="u10">⚠️ Ban Conditions</h3>
                    
                    <div style="margin-bottom: 20px; padding: 16px; background: #3f1f1f; border-radius: 12px; border-left: 5px solid #ef4444;">
                        <h4 class="u11">🔴 Locked Ban</h4>
                        <p class="text-14-flat">
                            Selling <strong><span data-m="lockedBanSellPct" data-fmt="pct">30%</span> or more</strong> of your total holdings at once = <strong>Locked Ban</strong>.<br>
                            You will not receive rewards until you <strong>Absolve yourself</strong> at the <strong>Ruggy Absolution</strong> page.
                        </p>
                    </div>
                    
                    <div style="padding: 16px; background: #3f2a1f; border-radius: 12px; border-left: 5px solid #f59e0b;">
                        <h4 class="u12">🟠 Temporary Ban</h4>
                        <p class="text-14-flat">
                            Holding <strong>more than <span data-m="overholdPct" data-fmt="pct">3%</span></strong> of the total token supply = <strong>Temporary Ban</strong> from rewards until your holdings drop below <span data-m="overholdPct" data-fmt="pct">3%</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- REWARDS -->
    <section id="rewards" class="section" style="padding-top: 110px; padding-bottom: 80px; max-width: 1000px; margin: 0 auto;">
        
        <div class="center-mb30">
            <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/Ps3cKSD8/grok-image-c4d3a07b-3b01-48f0-9d3e-889d8230ba88.jpg" 
                 class="feature-img" loading="lazy">
        </div>

        <h2 style="font-size: clamp(28px, 8vw, 42px); text-align: center; margin-bottom: 8px; line-height: 1.1;" class="neon-text">
            CLAIM YOUR<br>
            REWARDS
        </h2>
        <p class="u8">
            Claim directly from the vault when automatic airdrops aren't possible
        </p>

        <div class="x234">
            <p style="font-size: 13px; color: #fca5a5; margin: 0; line-height: 1.6;">
                <strong>⚠️ Important Notice:</strong> Rewards are generated from trading volume and fees. 
                When volume is low, reward payments may be small or may not distribute. Please take note.
            </p>
        </div>

        <div class="card" style="max-width: 820px; margin: 0 auto 35px; border: 2px solid #22c55e;">
            <h3 style="color: #22c55e; margin-bottom: 16px;">💰 Take Profit Rules – For True Holders</h3>
            
            <div class="fs15">
                <p><strong>True holders deserve their reward.</strong></p>
                <p>After every <strong><span data-m="roiTakeProfit" data-fmt="pct">200%</span> ROI</strong>, you are allowed to take up to <strong><span data-m="roiSafeSellPct" data-fmt="pct">50%</span></strong> of your Ruggy with <strong>no ban consequence</strong>.</p>
                <p>If you sell <strong>more than <span data-m="roiSafeSellPct" data-fmt="pct">50%</span></strong> during this window, you will be placed on <strong>Locked Ban</strong>.</p>
                <p class="gold"><strong>Important:</strong> This Take Profit window only applies to your <strong>first sell</strong> after reaching <span data-m="roiTakeProfit" data-fmt="pct">200%</span> ROI. Once used, your ROI counter resets.</p>
            </div>
        </div>

        <div class="card" style="max-width: 820px; margin: 0 auto 35px; border: 2px solid #3b82f6;">
            <h3 class="u13">📊 Your Live Stats</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div>
                    <div class="muted-sm">CURRENT ROI</div>
                    <div id="user-roi" class="u14">+142%</div>
                </div>
                <div>
                    <div class="muted-sm">% OF SUPPLY HELD</div>
                    <div id="user-held" class="stat-lg">1.8%</div>
                </div>
                <div>
                    <div class="muted-sm">% SOLD THIS CYCLE</div>
                    <div id="user-sold" style="font-size: 28px; font-weight: bold; color: #ef4444;">22%</div>
                </div>
                <div>
                    <div class="muted-sm">TAKE PROFIT STATUS</div>
                    <div id="take-profit-status" style="font-size: 18px; font-weight: bold; color: #22c55e;">Available</div>
                </div>
            </div>
            
            <p style="font-size: 13px; color: #9ca3af; margin-top: 15px;">
                Connect your wallet to see accurate live data. These numbers are simulated for demo purposes.
            </p>
        </div>


        <div class="card" style="max-width: 720px; margin: 0 auto 35px; border: 2px solid #ef4444;">
            <h3 style="color: #ef4444; margin-bottom: 18px;">📜 Rules & Bans Explained</h3>
            
            <div style="display: grid; gap: 18px; font-size: 14px;">
                <div>
                    <strong class="u103">🔴 Locked Ban</strong><br>
                    You sold <strong><span data-m="lockedBanSellPct" data-fmt="pct">30%</span> or more</strong> of your $RUGGY holdings at any point.<br>
                    You will not receive rewards until you <strong>Absolve yourself</strong> at the <strong>Ruggy Absolution</strong> page.
                </div>
                
                <div>
                    <strong class="gold">🟡 Temporary Ban</strong><br>
                    You currently hold <strong>more than <span data-m="overholdPct" data-fmt="pct">3%</span></strong> of the total supply. 
                    Sell down below <span data-m="overholdPct" data-fmt="pct">3%</span> to become eligible again.
                </div>
                
                <div>
                    <strong class="green">How to Get Off the Wall</strong><br>
                    • Temporary Ban → Sell until you hold under <span data-m="overholdPct" data-fmt="pct">3%</span>.<br>
                    • Permanent Ban → Unfortunately, Ruggy does not forgive <span data-m="lockedBanSellPct" data-fmt="pct">30%</span>+ sells.<br>
                    • <strong class="u103">Locked Ban accounts cannot participate in the Lottery</strong> until absolved.
                </div>
            </div>
        </div>

        <div class="card" style="max-width: 720px; margin: 0 auto 35px;">
            <h4 class="u9">How Claiming Works</h4>
            <ul style="font-size: 14px; line-height: 1.7; color: #e5e7eb; padding-left: 20px;">
                <li>Connect your wallet on this page</li>
                <li>Check if you qualify (500k+ for Community or 1M+ for Anti-Rug)</li>
                <li>Click "Claim from Vault" to receive your rewards directly</li>
                <li>Works even if automatic airdrops are paused due to high volume</li>
            </ul>
        </div>

        <div class="card" style="max-width: 700px; margin: 0 auto 35px;">
            <h3 style="margin-bottom: 12px; color: #ff00ff;">Check Your Reward Eligibility</h3>
            <p style="font-size:12px; color:#9ca3af; margin-bottom:8px;">
                Automatic airdrops continue until <strong><span data-m="holderShutoff" data-fmt="num">500</span> holders</strong>. After that, rewards are still sent to the vault every <span data-m="intervalMinutes" data-fmt="raw">30</span> minutes and accumulate for manual claiming.
            </p>
            
            <div id="rewards-ca-display" data-action="copyTokenCA" title="Click to copy"
                 class="x235">
                Token CA: <span id="rewards-token-ca">Not set in Dev Panel</span> 📋
            </div>
            
            <button data-action="checkRewardsEligibility" class="buy-button" style="margin-bottom: 20px; background: linear-gradient(to right, #3b82f6, #2563eb);">
                🔗 Connect Wallet & Check Eligibility
            </button>

            <!-- Populated by checkRewardsEligibility() — hidden until checked -->
            <div id="wallet-info" style="display: none; background: #1f2937; border-radius: 10px; padding: 14px 16px; margin-bottom: 14px; font-size: 14px;">
                <div class="u15">
                    <span class="gray">Wallet</span>
                    <strong id="wallet-address" style="font-family: monospace;"></strong>
                </div>
                <div class="u15">
                    <span class="gray">Balance</span>
                    <strong id="wallet-balance" class="green"></strong>
                </div>
                <div class="row-between">
                    <span class="gray">% of Supply</span>
                    <strong id="supply-percentage" class="gold"></strong>
                </div>
            </div>

            <div id="eligibility-message" class="x236"></div>
        </div>

        <div class="card" style="max-width: 720px; margin: 0 auto 35px; border: 3px solid #22c55e; background: #052e16;">
            <h3 style="color: #22c55e; margin-bottom: 12px; text-align: center;">💰 Claim Directly From Vault</h3>
            
            <p style="text-align: center; font-size: 15px; margin-bottom: 20px; color: #d1fae5;">
                After <strong><span data-m="holderShutoff" data-fmt="num">500</span>+ holders</strong>, automatic distribution stops.<br>
                However, rewards are <strong>still sent to the community vault every 30 minutes</strong> and will accumulate.<br>
                Approved wallets can <strong>claim them whenever they like</strong> by connecting here.
            </p>

            <button data-action="claimFromVault" class="buy-button" style="background: linear-gradient(to right, #22c55e, #16a34a); font-size: 18px; padding: 18px;">
                🏦 CLAIM FROM VAULT
            </button>

            <p style="text-align: center; font-size: 12px; color: #86efac; margin-top: 12px;">
                Connect your wallet → Check eligibility → Claim your share
            </p>
        </div>

        <div class="card" style="max-width: 720px; margin: 0 auto 50px;">
            <h3 style="color: #a855f7; margin-bottom: 15px;">📜 Claim History</h3>
            <p style="font-size: 13px; color: #9ca3af; margin-bottom: 15px;">
                Recent claims from the vault. Connect your wallet to see your personal history.
            </p>

            <div id="claim-history-table" style="max-height: 280px; overflow-y: auto; border: 1px solid #374151; border-radius: 8px;">
                <table class="u104">
                    <thead>
                        <tr style="background: #1f2937;">
                            <th class="cell">Date</th>
                            <th class="cell">Amount</th>
                            <th class="cell">Type</th>
                            <th class="cell">Tx</th>
                        </tr>
                    </thead>
                    <tbody id="claim-history-body">
                    </tbody>
                </table>
            </div>

            <p style="font-size: 11px; color: #6b7280; margin-top: 10px; text-align: center;">
                History updates automatically after successful claims.
            </p>
        </div>

        <div style="max-width: 700px; margin: 0 auto 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="card">
                <h3 style="color: #eab308; margin-bottom: 15px;">Community Airdrops <span style="font-size:12px; color:#fbbf24;">(<span data-m="communityPct" data-fmt="pct">30%</span> of fees)</span></h3>
                <p style="font-size: 14px;">Hold <strong id="airdrop-threshold-display"><span data-m="communityThreshold" data-fmt="num">500,000</span>+</strong> Ruggy to qualify for Community rewards.<br>
                <span class="u16">+30% boost once 50% LP is locked.</span></p>
            </div>
            
            <div class="card" style="border: 2px solid #22c55e;">
                <h3 class="green-mb15">Anti-Rug Rewards</h3>
                <p style="font-size: 14px; line-height: 1.6;">
                    Hold <strong id="antirug-threshold-display"><span data-m="antiRugThreshold" data-fmt="num">1,000,000</span>+</strong> Ruggy to qualify for <strong>both</strong> = <strong><span data-m="bothGroupsPct" data-fmt="pct">50%</span> total</strong> (Community <span data-m="communityPct" data-fmt="pct">30%</span> + Anti-Rug <span data-m="antiRugPct" data-fmt="pct">20%</span>)<br>
                    <span class="u16">+10% boost once 50% LP is locked.</span>
                </p>
            </div>
        </div>

    </section>

    <!-- LORE PAGE -->
    <section id="lore" class="section u17">
        
        <div class="center-mb30">
            <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/Q75M1ybm/IMG-4342.jpg" 
                 class="feature-img" loading="lazy">
        </div>

        <h2 style="font-size: clamp(28px, 8vw, 42px); text-align: center; margin-bottom: 20px; line-height: 1.15;" class="neon-text">
            THE LORE OF<br>
            RUGGY
        </h2>
        
        <div class="card" style="line-height: 1.8; font-size: 15px;">
            <p>
                Once upon a time on the wild and chaotic Solana blockchain, there lived a lonely little monster named <strong>Ruggy</strong>.
            </p>
            <p>
                All Ruggy ever wanted was to be a <strong>successful meme</strong> — loved, shared, and sent to the moon like the greats before him. 
                But everywhere he went, people called him a <strong>"Rug Monster"</strong>. 
                They saw his name and assumed the worst. No one gave him a chance.
            </p>
            <p>
                Day after day, Ruggy watched as rug pulls destroyed communities. He saw good people lose everything because of greed. 
                It broke his heart. The constant betrayal on Solana made him feel <strong>unmarketable</strong>, unwanted, and completely alone.
            </p>
            <p>
                But Ruggy was not like the others.
            </p>
            <p>
                Instead of becoming another rug puller, he made a vow: <strong>"I will never rug. I will protect my friends."</strong>
            </p>
            <p>
                And so, Ruggy created <strong>$RUGGY</strong> — a coin built with powerful <strong>anti-rug mechanics</strong>. 
                Strong tokenomics. Real rewards for holders. Harsh punishments for those who try to betray the community.
            </p>
            <p>
                You see, Ruggy is <strong>very emotional</strong>. He’s been alone for so long that when someone finally shows him love, 
                it means everything to him. But if you abandon him… if you sell too much and hurt the community he tried so hard to build…
            </p>
            <p style="color: #f87171; font-weight: bold;">
                It would take a <strong>Miracle</strong> for Ruggy to forgive you… but you <em>can</em> ask?<br>
                Sometimes he says yes — especially if you <strong>lock Ruggy in the Liquidity Pool</strong> to show your recommitment.
            </p>
            <p>
                Ruggy doesn’t just want holders.<br>
                <strong>He wants friends.</strong>
            </p>
            <p style="text-align: center; font-size: 18px; margin-top: 30px; color: #f59e0b;">
                So please… be Ruggy’s friend.<br>
                Hold strong. Stay loyal.<br>
                <strong>And send him to the Moon.</strong>
            </p>
        </div>
    </section>

    <!-- GALLERY -->
    <section id="gallery" class="section u18">
        
        <div class="center-mb25">
            <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/YBMXZJrX/grok-image-306bf515-c3d0-441f-a54d-f6a44f9e4fc4.jpg" 
                 class="u19" loading="lazy">
        </div>

        <h2 class="page-h2 neon-text">Ruggy's Gallery</h2>
        <p class="u1">
            The many faces of Ruggy
        </p>

        <div id="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; padding: 10px 0;">
            
            <!-- Ruggy Official -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/Dfyk19B8/grok-image-7117a15e-b973-4517-a098-e981cc27fecc.jpg" data-image-title="Ruggy Official">
                <img src="https://i.ibb.co/Dfyk19B8/grok-image-7117a15e-b973-4517-a098-e981cc27fecc.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Ruggy Official</p>
                </div>
            </div>

            <!-- Art Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/YBMXZJrX/grok-image-306bf515-c3d0-441f-a54d-f6a44f9e4fc4.jpg" data-image-title="Art Ruggy">
                <img src="https://i.ibb.co/YBMXZJrX/grok-image-306bf515-c3d0-441f-a54d-f6a44f9e4fc4.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Art Ruggy</p>
                </div>
            </div>

            <!-- Rave Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/Y4WL0Vpn/grok-image-b3877eea-5cd9-418f-8b5e-79766062d1dc.jpg" data-image-title="Rave Ruggy">
                <img src="https://i.ibb.co/Y4WL0Vpn/grok-image-b3877eea-5cd9-418f-8b5e-79766062d1dc.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Rave Ruggy</p>
                </div>
            </div>

            <!-- Gatsby Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/yB5mNQqJ/grok-image-e72d4a15-2ae7-4ef7-bffa-515fc78d7c53.jpg" data-image-title="Gatsby Ruggy">
                <img src="https://i.ibb.co/yB5mNQqJ/grok-image-e72d4a15-2ae7-4ef7-bffa-515fc78d7c53.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Gatsby Ruggy</p>
                </div>
            </div>

            <!-- Lambo Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/Ps3cKSD8/grok-image-c4d3a07b-3b01-48f0-9d3e-889d8230ba88.jpg" data-image-title="Lambo Ruggy">
                <img src="https://i.ibb.co/Ps3cKSD8/grok-image-c4d3a07b-3b01-48f0-9d3e-889d8230ba88.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Lambo Ruggy</p>
                </div>
            </div>

            <!-- Moon Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/WvDQ5GLQ/grok-image-f278b401-bd77-42a9-aae8-2dffd2191eb9.jpg" data-image-title="Moon Ruggy">
                <img src="https://i.ibb.co/WvDQ5GLQ/grok-image-f278b401-bd77-42a9-aae8-2dffd2191eb9.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Moon Ruggy</p>
                </div>
            </div>

            <!-- Beach Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/RGnK0zkw/grok-image-c7fd6f1b-f185-4e12-ad61-bab9055e6eee.jpg" data-image-title="Beach Ruggy">
                <img src="https://i.ibb.co/RGnK0zkw/grok-image-c7fd6f1b-f185-4e12-ad61-bab9055e6eee.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Beach Ruggy</p>
                </div>
            </div>

            <!-- Whale Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/MkvR5XRp/grok-image-8b3b620e-e992-4865-9a66-eb50d2537d5d.jpg" data-image-title="Whale Ruggy">
                <img src="https://i.ibb.co/MkvR5XRp/grok-image-8b3b620e-e992-4865-9a66-eb50d2537d5d.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Whale Ruggy</p>
                </div>
            </div>

            <!-- Golden Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/d0ghBvcX/IMG-4341.jpg" data-image-title="Golden Ruggy">
                <img src="https://i.ibb.co/d0ghBvcX/IMG-4341.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Golden Ruggy</p>
                </div>
            </div>

            <!-- Bookworm Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/Q75M1ybm/IMG-4342.jpg" data-image-title="Bookworm Ruggy">
                <img src="https://i.ibb.co/Q75M1ybm/IMG-4342.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Bookworm Ruggy</p>
                </div>
            </div>

            <!-- Banned Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/G4WXRR25/IMG-4340.jpg" data-image-title="Banned Ruggy">
                <img src="https://i.ibb.co/G4WXRR25/IMG-4340.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Banned Ruggy</p>
                </div>
            </div>

            <!-- Pool Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/twBcdrpr/IMG-4373.jpg" data-image-title="Pool Ruggy">
                <img src="https://i.ibb.co/twBcdrpr/IMG-4373.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Pool Ruggy</p>
                </div>
            </div>

            <!-- Absolution Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/dJHZxvB4/IMG-4374.jpg" data-image-title="Absolution Ruggy">
                <img src="https://i.ibb.co/dJHZxvB4/IMG-4374.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Absolution Ruggy</p>
                </div>
            </div>

            <!-- 404 Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/Pv7VzDWW/IMG-4430.jpg" data-image-title="404 Ruggy">
                <img src="https://i.ibb.co/Pv7VzDWW/IMG-4430.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">404 Ruggy</p>
                </div>
            </div>

            <!-- Lotto Ruggy -->
            <div class="gallery-card tile" data-action="open-image" data-image-src="https://i.ibb.co/LdFxTN9p/IMG-4431.jpg" data-image-title="Lotto Ruggy">
                <img src="https://i.ibb.co/LdFxTN9p/IMG-4431.jpg" 
                     class="tile-img" loading="lazy" decoding="async">
                <div class="tile-caption">
                    <p class="tile-title">Lotto Ruggy</p>
                </div>
            </div>

        </div>

        <p style="text-align: center; color: #6b7280; margin-top: 30px; font-size: 14px;">
            More Ruggy variants coming soon...
        </p>

    </section>

    <!-- RUGGY'S HALL -->
    <section id="hall" class="section u18">
        
        <div class="center-mb25">
            <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/d0ghBvcX/IMG-4341.jpg" 
                 class="u19">
        </div>

        <h2 class="page-h2 neon-text">RUGGY'S HALL</h2>
        <p class="u1">
            Ruggy's Hall of Fame • Honoring the strongest holders and biggest promoters in the community
        </p>

        <div class="card u105" >
            <h3 class="u20">🤖 Automated Hall Monitoring</h3>
            
            <div class="u21">
                <input id="hall-monitor-input" type="text" placeholder="Enter wallet to check holdings..." 
                       class="u22">
                
                <button data-action="scanWalletForHall" class="buy-button u23">
                    Check Wallet
                </button>
                
                <button data-action="runAutomatedHallScan" class="buy-button" style="width: auto; padding: 12px 24px; background: linear-gradient(to right, #22c55e, #16a34a);">
                    Run Automated Scan
                </button>
            </div>
            
            <div id="hall-scan-result" style="margin-top: 15px; padding: 15px; background: #1f2937; border-radius: 10px; display: none;">
            </div>
            
            <p style="font-size: 12px; color: #9ca3af; margin: 10px 0 0 0;">
                Check any wallet's token amount and days held to see Hall eligibility.
            </p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 25px;">
            
            <div class="card">
                <h3 style="color: #facc15; margin-bottom: 20px; text-align: center;">🏆 Top Holders</h3>
                <p class="muted-sm" style="text-align:center; margin:-12px 0 14px;">Showing the top <span data-m="hallTopShown" data-fmt="num">12</span> wallets by balance</p>
                <div class="table-container">
                    <table class="u104">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Wallet</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody id="top-holders-table">
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <h3 style="color: #22c55e; margin-bottom: 20px; text-align: center;">⏳ Longest Holders</h3>
                <p class="muted-sm" style="text-align:center; margin:-12px 0 14px;">Showing the <span data-m="hallLongestShown" data-fmt="num">12</span> longest-held wallets</p>
                <div class="table-container">
                    <table class="u104">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Wallet</th>
                                <th>Days Held</th>
                            </tr>
                        </thead>
                        <tbody id="longest-holders-table">
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <h3 class="u24">🔥 Top <span data-m="hallBagworkersShown" data-fmt="num">5</span> Bagworkers</h3>
                <div class="table-container">
                    <table class="u104">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Wallet / Name</th>
                            </tr>
                        </thead>
                        <tbody id="bagworkers-table">
                        </tbody>
                    </table>
                </div>
                <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #374151; text-align: center;">
                    <p style="font-size: 13px; color: #d1d5db; line-height: 1.6; margin: 0;">
                        The Top 5 are <strong>voted on by the community weekly in Telegram</strong>.<br><br>
                        The Top <span data-m="hallBagworkersShown" data-fmt="num">5</span> Bagworkers of the week receive a <strong>special bonus drop every Sunday</strong> from the Marketing wallet, along with being featured on this page for the week.<br><br>
                        <span class="u102">Thank you for your hard work!</span>
                    </p>
                </div>
            </div>

        </div>
    </section>

    <!-- RUGGY'S WALL -->
    <section id="wall" class="section page-wrap">
        
        <div class="center-mb30">
            <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/G4WXRR25/IMG-4340.jpg" 
                 class="feature-img" loading="lazy">
        </div>

        <h2 class="page-h2 neon-text">RUGGY'S WALL</h2>
        <p style="text-align: center; color: #9ca3af; margin-bottom: 20px; font-size: 15px;">
            Ruggy's Wall of Shame • Those who upset Ruggy by breaking the rules
        </p>
        <p style="text-align: center; margin: -8px 0 20px; font-size: 14px;">
            <span class="gold"><strong>Total wallets banned: <span id="wall-total-banned">0</span></strong></span>
            <span class="muted-sm"> • showing up to <span data-m="wallShown" data-fmt="num">25</span> at a time</span><br>
            <span class="u103" style="font-size:13px;"><strong>⚠ Locked Ban accounts cannot participate in the Lottery.</strong></span>
        </p>

        <div class="card" style="margin-bottom: 30px; border: 2px solid #ef4444;">
            <h3 style="color: #ef4444; margin-bottom: 15px;">📜 Wall Rules – How You End Up Here</h3>
            
            <div style="display: grid; gap: 16px; font-size: 14px;">
                <div>
                    <strong class="u103">Locked Ban (Red)</strong><br>
                    You sold <strong><span data-m="lockedBanSellPct" data-fmt="pct">30%</span> or more</strong> of your $RUGGY holdings at any point.<br>
                    You will not receive rewards until you <strong>Absolve yourself</strong> at the Ruggy Absolution page.
                </div>
                
                <div>
                    <strong class="gold">Temporary Ban (Yellow)</strong><br>
                    You currently hold <strong>more than 3%</strong> of the total $RUGGY supply. 
                    This is seen as hoarding/control. Sell down below <span data-m="overholdPct" data-fmt="pct">3%</span> to become eligible again.
                </div>
                
                <div>
                    <strong class="green">How to Get Off the Wall</strong><br>
                    • If you are on Temporary Ban → Sell tokens until you hold under 3%.<br>
                    • If you are on Locked Ban → You must Absolve yourself at the Ruggy Absolution page.
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-bottom: 25px;">
            <h3 class="u20">🤖 Automated Wall Monitoring</h3>
            
            <div class="u21">
                <input id="monitor-wallet-input" type="text" placeholder="Enter wallet to scan..." 
                       class="u22">
                
                <button data-action="scanWalletForWall" class="buy-button u23">
                    Scan Wallet
                </button>
                
                <button data-action="runAutomatedWallScan" class="buy-button" style="width: auto; padding: 12px 24px; background: linear-gradient(to right, #ef4444, #b91c1c);">
                    Run Automated Scan
                </button>
            </div>
            
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                The system automatically detects violations of the 30% sell rule and 3% holding rule.
            </p>
        </div>

        <div class="card">
            <div class="table-container">
                <table style="width:100%; font-family: monospace; font-size:13px; min-width: 620px;">
                    <thead>
                        <tr>
                            <th>Wallet</th>
                            <th>Reason</th>
                            <th>Type</th>
                            <th>Date Added</th>
                            <th>Admin Action</th>
                        </tr>
                    </thead>
                    <tbody id="banned-table"></tbody>
                </table>
            </div>
        </div>

        <div class="card" style="margin-top: 30px;">
            <h3 class="u10">📜 Wall Rules</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h4 class="u11">🔴 Locked Wall</h4>
                    <p class="text-14-flat">
                        Selling <strong>30% or more</strong> of your holdings in a single transaction.
                    </p>
                </div>
                <div>
                    <h4 class="u12">🟠 Temporary Wall</h4>
                    <p class="text-14-flat">
                        Holding <strong>more than 3%</strong> of the total token supply.
                    </p>
                </div>
            </div>
            
            <p style="margin-top: 20px; font-size: 14px; color: #9ca3af; border-top: 1px solid #374151; padding-top: 15px;">
                Once you're on the Wall, you've upset Ruggy. 
                Fix your behavior to get removed from the temporary list. 
                Permanent offenders stay on the Wall forever.
            </p>
        </div>

        <div class="card" style="max-width: 820px; margin: 40px auto 0; border: 2px solid #22c55e;">
            <h3 class="green-mb15">💰 Take Profit Rules – For True Holders</h3>
            <div class="text-15">
                <p><strong>True holders deserve their reward.</strong></p>
                <p>After every <strong><span data-m="roiTakeProfit" data-fmt="pct">200%</span> ROI</strong>, you can safely take up to <strong><span data-m="roiSafeSellPct" data-fmt="pct">50%</span></strong> of your Ruggy with no ban risk.</p>
                <p>If you sell more than <span data-m="roiSafeSellPct" data-fmt="pct">50%</span> in that window → <strong>Locked Ban</strong>.</p>
                <p class="gold">This only applies to your first sell after <span data-m="roiTakeProfit" data-fmt="pct">200%</span> ROI. After using it, your counter resets.</p>
            </div>
        </div>
    </section>

    <!-- POOL PAGE -->
    <section id="pool" class="section page-wrap">
        
        <div class="center-mb30">
            <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/twBcdrpr/IMG-4373.jpg" 
                 style="max-width: 100%; height: 320px; object-fit: cover; border-radius: 16px; border: 3px solid #6b21a8;">
        </div>

        <h2 style="font-size: 42px; text-align: center; margin-bottom: 8px;" class="neon-text">RUGGY'S POOL</h2>
        <p class="u1">
            Live Liquidity Pool Information • Transparent & Real-time
        </p>

        <div class="card" style="max-width: 900px; margin: 0 auto 40px;">
            <h3 style="color: #3b82f6; margin-bottom: 20px;">💧 Live Liquidity Pool Stats</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
                <div>
                    <div class="muted-sm">Total Liquidity (USD)</div>
                    <div id="pool-liquidity" class="u14">Loading...</div>
                </div>
                <div>
                    <div class="muted-sm">24h Volume</div>
                    <div id="pool-volume" class="stat-lg">Loading...</div>
                </div>
                <div>
                    <div class="muted-sm">Burned / Staked in LP</div>
                    <div id="pool-burned" style="font-size: 28px; font-weight: bold; color: #f59e0b;">Loading...</div>
                </div>
                <div>
                    <div class="muted-sm">LP Token Holders</div>
                    <div id="pool-holders" class="stat-lg">Loading...</div>
                </div>
            </div>

            <p style="margin-top: 25px; font-size: 13px; color: #9ca3af; line-height: 1.6;">
                <strong>Burns = Permanent Staking in Liquidity Pool:</strong> When tokens are burned, they are permanently removed from circulation and added to the liquidity pool. <strong>Once 50% of LP is locked, burns stop</strong> and extra fees go to Community (+30%) and Anti-Rug (+10%). 
                This strengthens price stability and reduces sell pressure over time.
            </p>
        </div>

        <div style="text-align: center; color: #6b7280; font-size: 13px;">
            Data updates live from on-chain sources (Dexscreener / Jupiter).
        </div>

        <div class="card" style="max-width: 1000px; margin: 40px auto 0; border: 2px solid #3b82f6;">
            <h3 style="color: #3b82f6; margin-bottom: 18px;">💧 Single-Sided Staking to the Liquidity Pool</h3>
            
            <div class="text-15">
                <p>
                    <strong>40% of all fees</strong> from the dev wallet are automatically used to provide liquidity and perform buybacks & burns. 
                    This strengthens the chart and reduces sell pressure over time.
                </p>
                
                <p>
                    By <strong>single-sided staking $RUGGY</strong> into the Liquidity Pool, investors can earn a share of trading fees 
                    on top of any price appreciation. <strong>Once 50% of the LP is permanently locked</strong>, burns stop and extra fees are redirected with boosts to Community (+30%) and Anti-Rug (+10%).
                </p>

                <h4 style="color: #ef4444; margin: 20px 0 10px;">⚠️ Risks Involved</h4>
                <ul style="margin-left: 20px; margin-bottom: 15px;">
                    <li><strong>Impermanent Loss (IL):</strong> If the price of $RUGGY moves significantly against the paired asset, you may experience a loss compared to simply holding.</li>
                    <li><strong>Smart Contract Risk:</strong> Although rare, there is always a risk of exploits or bugs in the liquidity protocol.</li>
                </ul>

                <h4 style="color: #22c55e; margin: 15px 0 10px;">🛡️ How to Protect Yourself</h4>
                <ul style="margin-left: 20px;">
                    <li>Only stake what you can afford to hold long-term.</li>
                    <li>Use well-audited protocols (we recommend established Solana DEXs).</li>
                    <li>Monitor your position regularly.</li>
                    <li>Never approve suspicious contracts or click unknown links.</li>
                </ul>
            </div>
        </div>

        <div class="card" style="max-width: 1000px; margin: 30px auto 0; border: 2px solid #22c55e;">
            <h3 style="color: #22c55e; margin-bottom: 18px; text-align: center;">🔒 Stake $RUGGY – Earn from the Pool</h3>
            
            <div style="max-width: 520px; margin: 0 auto;">
                <div style="background: #052e16; padding: 16px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
                    <div class="u25">Rolling 3-Day Average APY</div>
                    <div id="staking-apy" class="u26">18.4%</div>
                    <div style="font-size: 12px; color: #86efac;">(Updating live)</div>
                </div>

                <div style="margin-bottom: 16px;">
                    <label style="font-size: 13px; display: block; margin-bottom: 6px;">Amount to Stake</label>
                    <input id="stake-amount" type="number" placeholder="Enter amount of $RUGGY" 
                           class="x237">
                </div>

                <div class="mb20">
                    <label style="font-size: 13px; display: block; margin-bottom: 8px;">Lock Period</label>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px;" id="lock-period-options">
                        <div data-action="select-lock" class="lock-option stat-box-green" data-days="1" data-multiplier="1.0">
                            <div class="bold">1 Day</div>
                            <div class="hint-green">1.0x</div>
                        </div>
                        <div data-action="select-lock" class="lock-option x238" data-days="3" data-multiplier="1.1"
                             >
                            <div class="bold">3 Day</div>
                            <div style="font-size: 9px; color: #f59e0b;">(Absolution Forgiveness)</div>
                            <div class="hint-green">1.1x</div>
                        </div>
                        <div data-action="select-lock" class="lock-option stat-box-green" data-days="7" data-multiplier="1.25">
                            <div class="bold">1 Week</div>
                            <div class="hint-green">1.25x</div>
                        </div>
                        <div data-action="select-lock" class="lock-option stat-box-green" data-days="30" data-multiplier="1.6">
                            <div class="bold">1 Month</div>
                            <div class="hint-green">1.6x</div>
                        </div>
                        <div data-action="select-lock" class="lock-option stat-box-green" data-days="180" data-multiplier="2.2">
                            <div class="bold">6 Months</div>
                            <div class="hint-green">2.2x</div>
                        </div>
                        <div data-action="select-lock" class="lock-option stat-box-green" data-days="365" data-multiplier="3.0">
                            <div class="bold">1 Year</div>
                            <div class="hint-green">3.0x</div>
                        </div>

                        <!-- Permanent Staking -->
                        <div data-action="select-lock" class="lock-option stat-box-green" data-days="9999" data-multiplier="5.0">
                            <div style="font-weight: bold; color: #fbbf24;">Permanent</div>
                            <div style="font-size: 10px; color: #fbbf24;">5.0x</div>
                        </div>
                    </div>

                    <!-- Permanent Staking Warning -->
                    <div class="x239">
                        ⚠️ <strong>Permanent Staking Warning:</strong> Choosing Permanent locks your $RUGGY forever. 
                        There is <strong>no early unstake option</strong> and no way to withdraw early. 
                        Only select this if you are fully committed for the long term.
                    </div>
                    
                    <input type="hidden" id="stake-days" value="365">
                    <input type="hidden" id="stake-multiplier" value="3.0">
                </div>

                <div id="lock-info" style="background: #052e16; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; color: #d1fae5;">
                    Lock for <strong>1 Year</strong> → <strong class="green">3.0x fee multiplier</strong>. Early unstake penalty: <strong class="u106">10%</strong>
                </div>

                <button data-action="stakeRuggy" class="buy-button" style="background: linear-gradient(to right, #22c55e, #16a34a); width: 100%; font-size: 17px; padding: 16px;">
                    🔒 STAKE $RUGGY
                </button>

                <div style="margin-top: 25px;">
                    <h5 style="color: #86efac; margin-bottom: 10px;">Your Active Stakes</h5>
                    <div id="active-stakes" style="font-size: 13px; color: #d1fae5;">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ABSOLUTION -->
    <section id="absolution" class="section u17">
        
        <div class="center-mb30">
            <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="low" src="https://i.ibb.co/dJHZxvB4/IMG-4374.jpg" 
                 class="feature-img">
        </div>

        <h2 style="font-size: clamp(26px, 7.5vw, 42px); text-align: center; margin-bottom: 8px; color: #f59e0b;" class="neon-text">RUGGY ABSOLUTION</h2>
        <p style="text-align: center; color: #9ca3af; margin-bottom: 30px; font-size: 16px;">
            The path to forgiveness for those on Locked Ban
        </p>

        <div class="card" style="max-width: 820px; margin: 0 auto 40px; border: 2px solid #f59e0b;">
            <h3 style="color: #f59e0b; margin-bottom: 20px;">How to Absolve a Locked Ban</h3>
            
            <div style="margin-bottom: 28px;">
                <p class="fs15">
                    If you are on a <strong>Locked Ban</strong>, you have two paths to forgiveness:
                </p>
                <ul style="margin-top: 14px; margin-bottom: 16px; font-size: 15px; line-height: 1.75;">
                    <li style="margin-bottom: 8px;"><strong>Path 1:</strong> Stake <strong><span data-m="absolutionStakePct" data-fmt="pct">20%</span> of the dollar value</strong> of the Ruggy you pulled, locked for <strong><span data-m="absolutionLockDays" data-fmt="raw">3</span> days</strong>.</li>
                    <li><strong>Path 2:</strong> Submit a formal explanation to a moderator explaining your actions against Ruggy.</li>
                </ul>
                <p class="fs15">
                    Ruggy <strong>might</strong> forgive you. He might not. It depends on your sincerity and recommitment.
                </p>
            </div>

            <div style="background: #1f2937; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                <h4 style="color: #fbbf24; margin-bottom: 12px;">🔍 Detect Locked Ban Status</h4>
                <p style="font-size: 14px; margin-bottom: 15px;">Connect your wallet to check if you are on Locked Ban and see your required donation amount.</p>
                
                <button data-action="checkLockedBanStatus" class="buy-button" style="max-width: 100%; background: linear-gradient(to right, #f59e0b, #d97706);">
                    Check My Status
                </button>
                
                <div id="absolution-status" style="margin-top: 20px; display: none;">
                    <div style="background: #111827; padding: 16px; border-radius: 10px;">
                        <p id="locked-ban-result" style="font-size: 15px; margin: 0;"></p>
                    </div>
                </div>
            </div>

            <div class="u105">
                <h4 style="color: #22c55e; margin-bottom: 12px;">🔒 Stake to Absolve (3 Days)</h4>
                <p style="font-size: 14px; margin-bottom: 12px;">
                    Enter the <strong>dollar value</strong> of Ruggy you originally pulled from the coin. 
                    You must stake <strong><span data-m="absolutionStakePct" data-fmt="pct">20%</span></strong> of that value, locked for <strong><span data-m="absolutionLockDays" data-fmt="raw">3</span> days</strong>.
                </p>
                
                <div class="mb15">
                    <label class="muted-12">Dollar Value You Rugged (USD)</label>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <input id="rugged-amount" type="number" placeholder="e.g. 12500" 
                               class="x240">
                        <button data-action="calculateAbsolutionStake" class="buy-button" style="background: #22c55e; flex: 1; min-width: 160px;">
                            Calculate Requirement
                        </button>
                    </div>
                </div>

                <div id="absolution-stake-breakdown" style="display: none; background: #111827; padding: 16px; border-radius: 10px; margin-bottom: 15px; font-size: 14px;">
                    <div style="display: grid; gap: 8px;">
                        <div class="row-between">
                            <span>Required Stake (20%)</span>
                            <strong id="required-stake" class="green"></strong>
                        </div>
                        <div class="row-between">
                            <span>Already Staked</span>
                            <strong id="already-staked" style="color:#86efac;"></strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-top: 1px solid #374151; padding-top: 8px;">
                            <span><strong>Still Owed</strong></span>
                            <strong id="still-owed" style="color:#ef4444; font-size:15px;"></strong>
                        </div>
                    </div>
                    
                    <div id="stake-warning" class="x241">
                        ⚠️ You still need to stake more to reach the required amount.
                    </div>
                </div>

                <button data-action="submitAbsolutionStake" class="buy-button" style="max-width: 100%; background: linear-gradient(to right, #22c55e, #16a34a);">
                    Stake Remaining Amount & Request Absolution
                </button>
            </div>

            <div style="background: #1f2937; padding: 20px; border-radius: 12px; border: 2px dashed #f59e0b;">
                <h4 style="color: #f59e0b; margin-bottom: 10px;">✉️ Message Portal (Coming Soon)</h4>
                <p class="u5">
                    This section will allow you to send a personal message/explanation to the moderators.<br>
                    It is currently under development.
                </p>
            </div>
        </div>
    </section>

    <!-- RUGGY'S LOTTERY -->
    <section id="lotto" class="section" style="padding-bottom: 80px; max-width: 1200px; margin: 0 auto;">
        
        <!-- Lotto Banner - Lotto Ruggy -->
        <div class="center-mb30">
            <img decoding="async" width="400" height="260" loading="lazy" fetchpriority="high"
                 src="https://i.ibb.co/LdFxTN9p/IMG-4431.jpg" 
                 style="max-width: 100%; height: 280px; object-fit: cover; border-radius: 16px; border: 3px solid #fbbf24;"
                 alt="Lotto Ruggy">
            
            <div style="margin-top: 20px;">
                <h2 id="lotto-title" class="lotto-animated-title" style="font-size: clamp(32px, 8vw, 52px); margin-bottom: 8px;">RUGGY'S LOTTERY</h2>
                <p style="font-size: 18px; color: #f3e8ff; margin-bottom: 0;">The Official Ruggy Lottery • Win Big Every Day & Sunday</p>
            </div>
        </div>

        <!-- Current Jackpot -->
        <div class="card" style="max-width: 900px; margin: 0 auto 40px; text-align: center; border: 3px solid #fbbf24;">
            <div class="mb15">
                <div style="font-size: 16px; color: #fbbf24; font-weight: bold;">CURRENT JACKPOT</div>
                <div id="lotto-jackpot-display" style="font-size: 56px; font-weight: bold; color: #22c55e; line-height: 1;">$124,850</div>
                <div class="u2">Rolling + Growing Every Draw</div>
                <p style="margin: 12px 0 0; font-size: 14px;">
                    <span class="gold">🗓 Daily draw at <strong><span data-m="lotteryDailyTime" data-fmt="raw">8:00 PM UTC</span></strong></span>
                    &nbsp;•&nbsp;
                    <span class="green">Weekly draw every <strong><span data-m="lotteryWeeklyDay" data-fmt="raw">Sunday</span></strong> at <strong><span data-m="lotteryWeeklyTime" data-fmt="raw">8:00 PM UTC</span></strong></span>
                </p>
                <p class="u103" style="margin: 8px 0 0; font-size: 13px;">
                    <strong>⚠ Locked Ban accounts cannot participate in the Lottery</strong> — absolve yourself first.
                </p>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 40px; margin-top: 20px; flex-wrap: wrap;">
                <div>
                    <div class="muted-sm">Next Mini Draw</div>
                    <div class="u27">Today • 8:00 PM UTC</div>
                </div>
                <div>
                    <div class="muted-sm">Next Big Draw</div>
                    <div class="u27">Sunday • 8:00 PM UTC</div>
                </div>
            </div>
        </div>

        <div class="x242">
            
            <!-- Buy Tickets -->
            <div class="card" style="border: 3px solid #fbbf24;">
                <h3 style="color: #fbbf24; margin-bottom: 20px; text-align: center;">Buy Lottery Tickets</h3>
                
                <div class="center-mb25">
                    <div class="u2">Ticket Price</div>
                    <div id="lotto-ticket-price-display" style="font-size: 38px; font-weight: bold; color: #22c55e;">$3 USD</div>
                    <div class="u2">
                        <span id="lotto-sol-price">(~0.015 SOL • live)</span>
                    </div>
                </div>

                <div class="mb20">
                    <label style="font-size: 14px; display: block; margin-bottom: 8px;">Number of Tickets</label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input id="lotto-ticket-amount" type="number" value="5" min="1" max="100" 
                               class="x243">
                        <button data-action="buyLottoTickets" class="buy-button x244" >
                            Buy Tickets
                        </button>
                    </div>
                </div>

                <div style="background: #1f2937; padding: 16px; border-radius: 12px; font-size: 14px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>Total Cost</span>
                        <strong id="lotto-total-cost">$15.00</strong>
                    </div>
                    <div class="muted-12">
                        80% goes to Prize Pool • 10% MDR • 10% Permanent Burn
                    </div>
                </div>
            </div>

            <!-- Daily Free Ticket -->
            <div class="card" style="border: 3px solid #22c55e;">
                <h3 style="color: #22c55e; margin-bottom: 15px; text-align: center;">🎁 Daily Free Ticket</h3>
                
                <p style="font-size: 15px; text-align: center; margin-bottom: 20px;">
                    Stake $RUGGY in the <strong>Pool</strong> and earn <strong>1 free lottery ticket every day</strong> you remain staked.
                </p>

                <div style="background: #052e16; padding: 16px; border-radius: 12px; text-align: center; margin-bottom: 15px;">
                    <div class="u25">Your Current Streak</div>
                    <div class="u26">12 Days</div>
                    <div style="font-size: 14px; color: #86efac;">= 12 Free Tickets Earned</div>
                </div>

                <button data-action="claimDailyFreeTicket" class="buy-button" style="background: linear-gradient(to right, #22c55e, #16a34a);">
                    Claim Your Free Ticket
                </button>
                <p class="muted-sm" style="text-align:center; margin:8px 0 0;">One free ticket every <span data-m="freeTicketCooldownHours" data-fmt="num">24</span> hours of holding</p>
            </div>

            <!-- Prize Breakdown -->
            <div class="card">
                <h3 style="color: #fbbf24; margin-bottom: 18px;">Prize Pool Breakdown</h3>
                
                <div style="display: grid; gap: 12px; font-size: 15px;">
                    <div class="u28">
                        <span><strong>80%</strong> → Main Prize Pool</span>
                        <span style="color: #22c55e; font-weight: bold;">$99,880</span>
                    </div>
                    <div class="u28">
                        <span><strong>10%</strong> → MDR Fund</span>
                        <span style="color: #a855f7;">$12,485</span>
                    </div>
                    <div class="row-between">
                        <span><strong>10%</strong> → Permanent Burn Wallet</span>
                        <span class="u106">$12,485</span>
                    </div>
                </div>
            </div>

            <!-- Consolation Pool -->
            <div class="card" style="border: 3px solid #3b82f6;">
                <h3 class="u13">Consolation Pool (20%)</h3>
                <p class="text-15">
                    If you match <strong>2 or 3 numbers</strong>, you still win from the <strong>20% Consolation Pool</strong>!
                </p>
                <div style="margin-top: 15px; font-size: 14px; color: #9ca3af;">
                    • Match 3 numbers = Bigger consolation share<br>
                    • Match 2 numbers = Smaller consolation share<br>
                    • This pool rolls over if not fully claimed
                </div>
            </div>
        </div>

        <!-- Rollover Info -->
        <div class="card" style="max-width: 900px; margin: 40px auto 0; border: 3px solid #fbbf24;">
            <h3 style="color: #fbbf24; margin-bottom: 15px; text-align: center;">🔄 Rollover Mechanic</h3>
            <p style="font-size: 15px; text-align: center; max-width: 700px; margin: 0 auto;">
                If no one hits the <strong>exact winning numbers</strong> in a draw, the entire prize pool <strong>rolls over</strong> to the next draw. 
                This means jackpots can grow extremely large over time!
            </p>
        </div>

    </section>

    <!-- ADMIN PANEL - Left Sidebar (Appears above everything) -->
    <div id="developer-modal" 
         class="x245">
        
        <!-- Close Button -->
        <button id="close-developer-modal-btn" data-action="closeDeveloperModal"
                class="x246">
            ×
        </button>
        
        <div style="padding: 20px 24px 40px; clear: both;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="color: #f59e0b; margin: 0; font-size: 22px; font-weight: 700;">Ruggy Admin Panel</h3>
                
                <button id="admin-logout-btn" data-action="adminLogout" 
                        class="x247">
                    Logout
                </button>
            </div>
            <p style="text-align: center; color: #9ca3af; font-size: 13px; margin-bottom: 24px;">Developer &amp; Distribution Controls</p>
            
            <!-- Admin access simplified to single button -->
            
            <!-- Developer Panel Content -->
            <div id="dev-panel" class="section">
                <h4 style="color:#22c55e; margin-bottom:16px; text-align:center; font-size:17px;">Developer Settings</h4>

                <!-- Test 404 Button -->
                <div class="x248">
                    <button data-action="navigate" data-page="error-404" 
                            class="x249">
                        🧪 TEST 404 ERROR PAGE
                    </button>
                </div>
                
                <!-- Token CA -->
                <div style="margin-bottom:18px;">
                    <label style="font-size:13px; display:block; margin-bottom:6px; color:#d1d5db;">Token CA (Mint)</label>
                    <input id="dev-ca" type="text" style="width:100%; padding:11px; border-radius:8px; border:2px solid #6b21a8; background:#111827; color:white; font-size:14px;">
                </div>

                <!-- Reward Distribution Splits -->
                <div style="margin-bottom:22px; padding:16px; background:#1f2937; border-radius:10px;">
                    <h5 style="color:#f59e0b; margin-bottom:12px; font-size:14px;">Reward Distribution Splits</h5>
                    
                    <div class="mb10">
                        <label class="label-sm">Liquidity (Burn) <span id="liq-percent">40</span>%</label>
                        <input id="dev-liq-percent" type="range" min="0" max="100" step="1" value="40" class="w-full" data-input-action="updateSplitPercentages">
                    </div>
                    
                    <div class="mb10">
                        <label class="label-sm">Anti-Rug (1M+) <span id="antirug-percent">20</span>%</label>
                        <input id="dev-antirug-percent" type="range" min="0" max="100" step="1" value="20" class="w-full" data-input-action="updateSplitPercentages">
                    </div>
                    
                    <div class="mb10">
                        <label class="label-sm">Community (500k+) <span id="community-percent">30</span>%</label>
                        <input id="dev-community-percent" type="range" min="0" max="100" step="1" value="30" class="w-full" data-input-action="updateSplitPercentages">
                    </div>
                    
                    <div class="mb10">
                        <label class="label-sm">MDR Fund <span id="creator-percent">10</span>%</label>
                        <input id="dev-creator-percent" type="range" min="0" max="100" step="1" value="10" class="w-full" data-input-action="updateSplitPercentages">
                    </div>
                    
                    <div style="font-size:12px; color:#9ca3af; margin-top:8px;">
                        Total: <span id="split-total">100</span>% 
                        <span id="split-warning" style="color:#ef4444; display:none;">(Must = 100%)</span>
                    </div>
                </div>

                <div class="u29">
                    <h5 class="u3">Wallet Addresses</h5>
                    
                    <div class="mb12">
                        <label class="label-xs">Burn Wallet (for buyback burns)</label>
                        <input id="dev-burn-wallet" type="text" placeholder="Enter Burn Wallet Address" 
                               class="dev-input">
                    </div>
                    
                    <div class="mb12">
                        <label class="label-xs">MDR (Marketing Development & Research Wallet)</label>
                        <input id="dev-creator-wallet" type="text" placeholder="Enter MDR Wallet Address" 
                               class="dev-input">
                    </div>

                    <div class="mb12">
                        <label class="label-xs">X (Twitter) Link</label>
                        <input id="dev-x-link" type="text" placeholder="https://x.com/yourhandle" 
                               class="dev-input">
                    </div>
                    <div class="mb12">
                        <label class="label-xs">Telegram Link</label>
                        <input id="dev-telegram-link" type="text" placeholder="https://t.me/yourgroup" 
                               class="dev-input">
                    </div>
                    <div class="mb12">
                        <label class="label-xs">Dexscreener Link</label>
                        <input id="dev-dexscreener-link" type="text" placeholder="https://dexscreener.com/solana/..." 
                               class="dev-input">
                    </div>
                    <div class="mb12">
                        <label class="label-xs">Pump.fun Link</label>
                        <input id="dev-pumpfun-link" type="text" placeholder="https://pump.fun/..." 
                               class="dev-input">
                    </div>
                    
                    <div>
                        <label class="label-xs">Dev Wallet</label>
                        <button id="connect-dev-wallet-home-btn" data-action="connectDevWalletForHome" class="buy-button" style="padding:8px 14px; font-size:12px; background: linear-gradient(to right, #a855f7, #7c3aed);">
                            Connect Dev Wallet
                        </button>
                        <div id="dev-wallet-display" style="margin-top:6px; font-size:11px; color:#9ca3af; font-family: monospace; word-break: break-all;"></div>
                    </div>
                </div>
                
                <div style="border-top: 1px solid #6b21a8; padding-top: 15px; margin-top: 10px;">
                    <h4 class="u3">Reward Distribution</h4>
                    
                    <div class="mb12">
                        <label class="label-xs">Distribution Interval (minutes)</label>
                        <input id="dev-interval" type="number" value="30" class="dev-input">
                    </div>
                    
                    <button id="reset-timer-btn" data-action="resetDistributionTimer" class="buy-button" style="background: #4b5563; color: #d1d5db; margin-bottom: 8px; font-size:12px; border: 1px solid #6b7280;"
                            title="Restarts the live countdown using the interval above">
                        ⏱ Apply Interval &amp; Restart Timer
                    </button>
                    <button id="test-money-rain-btn" data-action="startMoneyRain" class="buy-button" style="background: #14532d; color: #bbf7d0; margin-bottom: 8px; font-size:12px; border: 1px solid #22c55e;"
                            title="Preview the 1-minute money rain that plays when the timer hits 00:00">
                        💵 Test Money Rain
                    </button>
                    
                    <button id="trigger-distribution-btn" data-action="triggerDistribution" class="buy-button" style="background: linear-gradient(to right, #22c55e, #16a34a); margin-bottom: 8px;">
                        🚀 Trigger Reward Distribution
                    </button>
                    
                    <button id="pause-rewards-btn" data-action="toggleRewardsPause" class="buy-button" style="background: #ef4444; margin-top: 4px;">
                        ⏸ Pause Rewards
                    </button>
                </div>

                <div class="u29">
                    <h5 class="u3">Top 5 Bagworkers</h5>
                    <input id="dev-bagworker-1" type="text" placeholder="Bagworker 1" class="dev-input-sm">
                    <input id="dev-bagworker-2" type="text" placeholder="Bagworker 2" class="dev-input-sm">
                    <input id="dev-bagworker-3" type="text" placeholder="Bagworker 3" class="dev-input-sm">
                    <input id="dev-bagworker-4" type="text" placeholder="Bagworker 4" class="dev-input-sm">
                    <input id="dev-bagworker-5" type="text" placeholder="Bagworker 5" style="width:100%; padding:8px; border-radius:6px; border:1px solid #6b21a8; background:#111827; color:white; font-size:13px;">
                </div>
                
                <details class="admin-section">
                    <summary>📊 Rules &amp; Metrics</summary>
                    <div class="admin-section-body">
                        <p class="muted-sm" style="margin:0 0 10px;">Every value here updates ALL mentions across the site (tooltips, pages, rules) and the behaviors tied to it.</p>

                        <h5 class="u3">Distribution</h5>
                        <label class="admin-check"><input id="m-dist-enabled" type="checkbox" checked> Distributions enabled (manual master switch)</label>
                        <label class="label-sm">Auto-distribution shutoff (holders)</label>
                        <input id="m-holder-shutoff" type="number" min="1" class="dev-input" placeholder="500">
                        <label class="label-sm">Community group: tokens required</label>
                        <input id="m-community-threshold" type="number" min="0" class="dev-input" placeholder="500000">
                        <label class="label-sm">Anti-Rug group: tokens required</label>
                        <input id="m-antirug-threshold" type="number" min="0" class="dev-input" placeholder="1000000">

                        <h5 class="u3">Take Profit &amp; Bans</h5>
                        <label class="label-sm">Take-profit unlocks at ROI (%)</label>
                        <input id="m-roi-takeprofit" type="number" min="1" class="dev-input" placeholder="200">
                        <label class="label-sm">Safe sell amount in window (%)</label>
                        <input id="m-roi-safesell" type="number" min="1" max="100" class="dev-input" placeholder="50">
                        <label class="label-sm">Locked Ban: selling ≥ (%) at once</label>
                        <input id="m-lockedban-pct" type="number" min="1" max="100" class="dev-input" placeholder="30">
                        <label class="label-sm">Temporary Ban: holding &gt; (%) of supply</label>
                        <input id="m-overhold-pct" type="number" min="0.1" max="100" step="0.1" class="dev-input" placeholder="3">

                        <h5 class="u3">Hall &amp; Wall</h5>
                        <label class="label-sm">Top Holders shown</label>
                        <input id="m-hall-top" type="number" min="1" max="100" class="dev-input" placeholder="12">
                        <label class="label-sm">Longest Holders shown</label>
                        <input id="m-hall-longest" type="number" min="1" max="100" class="dev-input" placeholder="12">
                        <label class="label-sm">Bagworkers shown</label>
                        <input id="m-hall-bagworkers" type="number" min="1" max="10" class="dev-input" placeholder="5">
                        <label class="label-sm">Wall: wallets shown at a time</label>
                        <input id="m-wall-shown" type="number" min="1" max="500" class="dev-input" placeholder="25">

                        <h5 class="u3">Absolution</h5>
                        <label class="label-sm">Absolution stake (% of pulled value)</label>
                        <input id="m-abs-pct" type="number" min="1" max="100" class="dev-input" placeholder="20">
                        <label class="label-sm">Absolution lock time (days)</label>
                        <input id="m-abs-days" type="number" min="1" class="dev-input" placeholder="3">

                        <h5 class="u3">Lottery Schedule</h5>
                        <label class="label-sm">Daily draw time</label>
                        <input id="m-lotto-daily-time" type="text" class="dev-input" placeholder="8:00 PM UTC">
                        <label class="label-sm">Weekly draw day</label>
                        <input id="m-lotto-weekly-day" type="text" class="dev-input" placeholder="Sunday">
                        <label class="label-sm">Weekly draw time</label>
                        <input id="m-lotto-weekly-time" type="text" class="dev-input" placeholder="8:00 PM UTC">
                        <label class="label-sm">Free ticket hold time (hours)</label>
                        <input id="m-free-ticket-hours" type="number" min="1" class="dev-input" placeholder="24">
                    </div>
                </details>

                <details class="admin-section">
                    <summary>📝 Site Content</summary>
                    <div class="admin-section-body">
                        <label class="label-sm">Hero Title (home page)</label>
                        <input id="content-hero-title" type="text" class="dev-input" placeholder="RUGGY">
                        <label class="label-sm">Hero Subtitle</label>
                        <input id="content-hero-sub" type="text" class="dev-input" placeholder="The Ultimate Anti-Rug Mascot">
                        <label class="label-sm">Lottery Jackpot Display</label>
                        <input id="content-jackpot" type="text" class="dev-input" placeholder="$124,850">
                        <label class="label-sm">Lottery Ticket Price (USD)</label>
                        <input id="content-ticket-price" type="number" min="1" class="dev-input" placeholder="3">
                    </div>
                </details>

                <details class="admin-section">
                    <summary>🎨 Appearance &amp; Effects</summary>
                    <div class="admin-section-body">
                        <label class="label-sm">Neon Intensity</label>
                        <select id="ui-neon-level" class="dev-input">
                            <option value="soft">Soft</option>
                            <option value="normal" selected>Normal</option>
                            <option value="max">Maximum</option>
                        </select>
                        <label class="admin-check"><input id="ui-breathe" type="checkbox" checked> Page titles breathe (pulse)</label>
                        <label class="admin-check"><input id="ui-rain-on-zero" type="checkbox" checked> 💵 Money rain when timer hits 00:00</label>
                        <label class="label-sm">Rain Duration (seconds)</label>
                        <input id="ui-rain-duration" type="number" min="5" max="600" class="dev-input" placeholder="60">
                        <label class="label-sm">Max Bills On Screen</label>
                        <input id="ui-rain-max" type="number" min="5" max="120" class="dev-input" placeholder="40">
                        <label class="label-sm">Bill Width (px)</label>
                        <input id="ui-rain-width" type="number" min="40" max="320" class="dev-input" placeholder="124">
                        <label class="label-sm">Bill Image URL (blank = default)</label>
                        <input id="ui-rain-image" type="text" class="dev-input" placeholder="https://i.ibb.co/...jpg">
                    </div>
                </details>

                <details class="admin-section">
                    <summary>⛓ Chain (devnet/mainnet)</summary>
                    <div class="admin-section-body">
                        <label class="admin-check"><input id="chain-enabled" type="checkbox"> Connect site to on-chain program</label>
                        <label class="label-sm">RPC URL</label>
                        <input id="chain-rpc" type="text" class="dev-input" placeholder="https://api.devnet.solana.com">
                        <label class="label-sm">Program ID (from anchor deploy)</label>
                        <input id="chain-program" type="text" class="dev-input" placeholder="Your program ID">
                        <label class="label-sm">Token Mint (CA)</label>
                        <input id="chain-mint" type="text" class="dev-input" placeholder="Your token mint">
                        <p class="muted-sm" style="margin:6px 0 0;">When enabled: countdown + jackpot read live chain state every 30s.</p>
                    </div>
                </details>

                <details class="admin-section">
                    <summary>🧰 Maintenance</summary>
                    <div class="admin-section-body">
                        <p class="muted-sm" style="margin: 0 0 10px;">Settings live in <em>this browser's</em> storage. Export to back up or move them to another device.</p>
                        <button data-action="exportSiteConfig" class="buy-button admin-tool-btn">⬇ Export Settings (JSON)</button>
                        <label class="buy-button admin-tool-btn" style="display:block; text-align:center; cursor:pointer;">
                            ⬆ Import Settings
                            <input id="import-config-file" type="file" accept=".json,application/json" style="display:none;">
                        </label>
                        <button data-action="resetSiteData" class="buy-button admin-tool-btn" style="background:#7f1d1d; border:1px solid #ef4444; color:#fecaca;">🗑 Reset All Site Data</button>
                    </div>
                </details>

                <button id="save-dev-settings-btn" data-action="saveDeveloperSettings" class="buy-button" style="background: linear-gradient(to right, #22c55e, #16a34a); margin-bottom: 12px; width: 100%;">Save Settings</button>
                
            </div>
        </div>
    </div>


    <!-- Smart Text Wrapping Logic -->

    <!-- Image Zoom Modal -->
    <div id="image-modal" class="modal section" >
        <div class="modal-content" style="max-width: 90%; max-height: 90vh; background: #111827; border: 2px solid #6b21a8; padding: 20px; text-align: center;">
            <img decoding="async" id="modal-image" style="max-width: 100%; max-height: 75vh; border-radius: 12px; object-fit: contain;">
            <p id="modal-image-title" style="margin-top: 15px; font-size: 18px; color: #f3e8ff;"></p>
            <button id="close-image-modal-btn" data-action="closeImageModal" class="buy-button" style="max-width: 200px; margin-top: 15px; background: #374151;">Close</button>
        </div>
    </div>

    <!-- Wallet Selection Modal -->
    <div id="wallet-modal" class="modal section" >
        <div class="modal-content" style="max-width: 460px; border: 3px solid #a855f7; box-shadow: 0 0 50px rgba(168, 85, 247, 0.4);">
            <h3 class="u24">Connect Wallet</h3>
            
            <div style="display: grid; gap: 10px;">
                <button id="select-phantom-btn" data-action="select-wallet" data-wallet="phantom" class="wallet-option u30">
                    👻 Phantom
                </button>

                <button id="select-fomo-btn" data-action="select-wallet" data-wallet="fomo" class="wallet-option"
                        style="--w1: #ff8a80; --w2: #e53935; --wshadow: rgba(229, 57, 53, 0.4); --wshadow-h: rgba(229, 57, 53, 0.5);">
                    👀 FOMO Wallet
                </button>

                <button id="select-solflare-btn" data-action="select-wallet" data-wallet="solflare" class="wallet-option"
                        style="--w1: #fbbf24; --w2: #d97706; --wshadow: rgba(217, 119, 6, 0.4); --wshadow-h: rgba(217, 119, 6, 0.5);">
                    🔥 Solflare
                </button>

                <button id="select-backpack-btn" data-action="select-wallet" data-wallet="backpack" class="wallet-option"
                        style="--w1: #4ade80; --w2: #16a34a; --wshadow: rgba(22, 163, 74, 0.4); --wshadow-h: rgba(22, 163, 74, 0.5);">
                    🎒 Backpack
                </button>

                <button id="select-glow-btn" data-action="select-wallet" data-wallet="glow" class="wallet-option"
                        style="--w1: #f9a8d4; --w2: #db2777; --wshadow: rgba(219, 39, 119, 0.4); --wshadow-h: rgba(219, 39, 119, 0.5);">
                    ✨ Glow
                </button>

                <button data-action="select-wallet" data-wallet="slope" class="wallet-option u30">
                    ⛰️ Slope
                </button>

                <button data-action="select-wallet" data-wallet="sollet" class="wallet-option"
                        style="--w1: #93c5fd; --w2: #2563eb; --wshadow: rgba(37, 99, 235, 0.4); --wshadow-h: rgba(37, 99, 235, 0.5);">
                    🪙 Sollet
                </button>

                <button data-action="select-wallet" data-wallet="trust" class="wallet-option"
                        style="--w1: #60a5fa; --w2: #1e40af; --wshadow: rgba(30, 64, 175, 0.4); --wshadow-h: rgba(30, 64, 175, 0.5);">
                    🛡️ Trust Wallet
                </button>

                <button data-action="select-wallet" data-wallet="coinbase" class="wallet-option"
                        style="--w1: #3b82f6; --w2: #1e3a8a; --wshadow: rgba(30, 58, 138, 0.4); --wshadow-h: rgba(30, 58, 138, 0.5);">
                    🔵 Coinbase Wallet
                </button>

                <button data-action="select-wallet" data-wallet="exodus" class="wallet-option"
                        style="--w1: #a78bfa; --w2: #5b21b6; --wshadow: rgba(91, 33, 182, 0.4); --wshadow-h: rgba(91, 33, 182, 0.5);">
                    🦊 Exodus
                </button>

                <button data-action="select-wallet" data-wallet="ledger" class="wallet-option"
                        style="--w1: #374151; --w2: #111827; --wshadow: rgba(17, 24, 39, 0.6); --wshadow-h: rgba(17, 24, 39, 0.7);">
                    🔐 Ledger
                </button>
            </div>

            <button id="close-wallet-modal" class="buy-button" style="background: #374151; margin-top: 15px; font-size: 13px;">
                Cancel
            </button>
        </div>
    </div>

    <!-- ==================== FLOATING SCROLL TO TOP BUTTON ==================== -->
    <button id="scroll-to-top-btn"
            data-action="scrollToTop"
            class="x250">
        ↑
    </button>

    <!-- ==================== TOAST NOTIFICATION CONTAINER ==================== -->
    <div id="toast-container" 
         class="x251">
    </div>

    <div class="x252">
        ⚠️ <strong>This is not financial advice.</strong><br>
        Ruggy is a meme and he doesn't exist in reality. Please do your own research.<br><br>
        <span class="gray">Rewards are generated from trading volume and fees. When volume is low, payments may be small or may not distribute.</span>
    </div>


    <!-- ==================== 404 ERROR PAGE ==================== -->
    <section id="error-404" class="section" style="min-height: 100vh; padding: 80px 20px; background: #0f172a;">
        <div class="x253">
            
            <!-- Funny Ruggy 404 Image -->
            <img src="https://i.ibb.co/Pv7VzDWW/IMG-4430.jpg" 
                 alt="Ruggy looking confused at a 404 error on his computer" 
                 style="width: 100%; max-width: 420px; border-radius: 16px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            
            <h1 style="font-size: 42px; color: #ef4444; margin-bottom: 12px; font-family: 'Press Start 2P', system-ui;">404 - PAGE NOT FOUND</h1>
            
            <p style="font-size: 20px; color: #f1f5f9; margin-bottom: 10px;">
                Ruggy tried his best…
            </p>
            
            <p style="font-size: 17px; color: #cbd5e1; line-height: 1.6; margin-bottom: 30px;">
                He’s an incredible anti-rug mascot…<br>
                but frontend development? Not exactly his strongest suit.
            </p>

            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button data-action="navigate" data-page="home" 
                        class="x254">
                    🏠 Take Me Home
                </button>
            </div>
            
            <p style="margin-top: 30px; font-size: 13px; color: #64748b;">
                (This page exists because Ruggy is still learning how to code)
            </p>
        </div>
    </section>

</body>
</html>
