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
