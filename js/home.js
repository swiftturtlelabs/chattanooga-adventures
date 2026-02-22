/**
 * Creates a tap tracker that fires a callback after a threshold
 * of rapid consecutive clicks within a time window.
 * @param {number} threshold - Number of taps required
 * @param {number} timeWindowMs - Maximum time between first and last tap
 * @param {function} onActivate - Callback fired when threshold is reached
 * @returns {function} Click/tap event handler
 */
export function createTapTracker(threshold, timeWindowMs, onActivate) {
  let tapCount = 0;
  let firstTapTime = 0;

  return function handleTap() {
    const now = Date.now();

    if (tapCount === 0 || now - firstTapTime > timeWindowMs) {
      tapCount = 1;
      firstTapTime = now;
      return;
    }

    tapCount += 1;

    if (tapCount >= threshold) {
      tapCount = 0;
      onActivate();
    }
  };
}

function animateTitle(titleElement) {
  if (!titleElement) return;

  const text = titleElement.textContent;
  const words = text.split(/\s+/);
  titleElement.innerHTML = words
    .map(
      (word, i) => `<span class="hero__word" style="animation-delay: ${0.15 * i}s">${word}</span>`,
    )
    .join(' ');
}

function init() {
  const heroTitle = document.querySelector('.hero__title');
  animateTitle(heroTitle);

  const siteTitle = document.getElementById('site-title');
  if (siteTitle) {
    const tracker = createTapTracker(7, 3000, () => {
      siteTitle.classList.add('easter-egg-flash');
      setTimeout(() => {
        window.location.href = '/adventures';
      }, 400);
    });
    siteTitle.addEventListener('click', tracker);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
