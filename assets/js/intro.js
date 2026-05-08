/* HomeFood — Cinematic Intro
 * Pure CSS/SVG animation, no React/Babel needed.
 * Total duration: ~3.6s
 */
(function () {
  'use strict';

  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  // Skip intro if user has visited recently (last 6 hours) — nicer UX
  let skipIntro = false;
  try {
    const last = sessionStorage.getItem('hf_intro_seen');
    if (last && (Date.now() - parseInt(last, 10)) < 6 * 60 * 60 * 1000) {
      skipIntro = true;
    }
  } catch (_) { /* sessionStorage may be blocked */ }

  if (skipIntro) {
    overlay.style.display = 'none';
    document.body.classList.remove('loading');
    return;
  }

  // Trigger animation start
  requestAnimationFrame(() => {
    overlay.classList.add('is-playing');
  });

  // Hide after animation ends (3.6s of animation + 0.4s fade = 4s total)
  const TOTAL_DURATION = 3600;
  const FADE_DURATION = 500;

  setTimeout(() => {
    overlay.classList.add('is-hidden');
    document.body.classList.remove('loading');
    try { sessionStorage.setItem('hf_intro_seen', String(Date.now())); } catch (_) {}
  }, TOTAL_DURATION);

  setTimeout(() => {
    overlay.style.display = 'none';
  }, TOTAL_DURATION + FADE_DURATION);

  // Allow click-to-skip
  overlay.addEventListener('click', () => {
    overlay.classList.add('is-hidden');
    document.body.classList.remove('loading');
    setTimeout(() => { overlay.style.display = 'none'; }, FADE_DURATION);
    try { sessionStorage.setItem('hf_intro_seen', String(Date.now())); } catch (_) {}
  });
})();
