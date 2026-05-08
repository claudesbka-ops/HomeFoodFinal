/* HomeFood — Cinematic Intro
 * Pure CSS/SVG animation, no React/Babel needed.
 * Total duration: ~3.6s
 */
(function () {
  'use strict';

  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;


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
  }, TOTAL_DURATION);

  setTimeout(() => {
    overlay.style.display = 'none';
  }, TOTAL_DURATION + FADE_DURATION);

  // Allow click-to-skip
  overlay.addEventListener('click', () => {
    overlay.classList.add('is-hidden');
    document.body.classList.remove('loading');
    setTimeout(() => { overlay.style.display = 'none'; }, FADE_DURATION);
  });
})();
