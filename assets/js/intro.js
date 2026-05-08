/* HomeFood — Cinematic Intro
 * Pure CSS/SVG animation, no React/Babel needed.
 * Total duration: ~5.6s
 */
(function () {
  'use strict';

  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;


  // Trigger animation start
  requestAnimationFrame(() => {
    overlay.classList.add('is-playing');
  });

  // Hide after animation ends (5.6s of animation + 0.5s fade = 6.1s total)
  const TOTAL_DURATION = 5600;
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
