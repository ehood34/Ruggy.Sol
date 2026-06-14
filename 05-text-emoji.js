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
