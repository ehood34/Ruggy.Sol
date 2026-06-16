/* Part of the Ruggy Rewards app. Files load in numeric order via
   <script defer> tags in index.html; execution order matters for
   the decorator chain and error-boundary application. */

/* =====================================================================
   SECTION 2 — BANNER VIDEO
   ===================================================================== */
setTimeout(() => {
        const bannerVideo = document.getElementById('home-banner-video');
        const fallback = document.getElementById('home-banner-fallback');
        if (bannerVideo) {
            bannerVideo.addEventListener('click', e => e.preventDefault(), { passive: false });
            bannerVideo.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
            bannerVideo.addEventListener('touchend', e => e.preventDefault(), { passive: false });
            bannerVideo.addEventListener('contextmenu', e => e.preventDefault());

            // If the video fails to load/play, reveal the still image so the hero
            // never shows a black box. (poster covers the loading gap; this covers
            // total failure — bad network, blocked R2, codec issues.)
            const showFallback = () => { if (fallback) fallback.style.display = 'block'; };
            bannerVideo.addEventListener('error', showFallback);
            const srcEl = bannerVideo.querySelector('source');
            if (srcEl) srcEl.addEventListener('error', showFallback);
            // If after 6s the video still hasn't produced a frame, fall back.
            setTimeout(() => {
                if (bannerVideo.readyState < 2) showFallback();
            }, 6000);

            document.addEventListener('touchstart', () => {
                if (bannerVideo.paused) bannerVideo.play().catch(() => {});
            }, { once: true });
        }
    }, 800);
