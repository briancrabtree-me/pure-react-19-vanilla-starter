let heroLcpReady = false;

// Fade out the static shell once React's hero image has painted.
const dropShell = () => {
  const shell = document.querySelector<HTMLElement>('.prerender-shell');
  if (!shell) return;
  // Hide in place — removing the node caused measurable CLS on the hero h1.
  shell.style.visibility = 'hidden';
  shell.style.pointerEvents = 'none';
};

const scheduleDropShell = () => {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(dropShell, { timeout: 1200 });
  } else {
    window.setTimeout(dropShell, 400);
  }
};

export function markHeroLcpReady() {
  if (heroLcpReady) return;
  heroLcpReady = true;
  document.documentElement.classList.add('app-rendered');
  // Two frames so layout from the hydrated hero settles before we remove the shell.
  requestAnimationFrame(() => requestAnimationFrame(scheduleDropShell));
}

export function scheduleHeroLcpFallback(timeoutMs = 5000) {
  window.setTimeout(() => markHeroLcpReady(), timeoutMs);
}
