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
