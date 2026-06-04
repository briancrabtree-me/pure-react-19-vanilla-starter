import { useEffect } from 'react';

// Defer non-critical work until the browser is idle (or ~600ms without rIC).
export function useIdleEffect(
  cb: () => void | (() => void),
  deps: unknown[] = [],
  timeout = 9000,
) {
  useEffect(() => {
    let cleanup: void | (() => void);
    const w = window as Window & {
      requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const run = () => {
      cleanup = cb();
    };
    const handle =
      typeof w.requestIdleCallback === 'function'
        ? w.requestIdleCallback(run, { timeout })
        : window.setTimeout(run, 600);
    return () => {
      if (typeof w.cancelIdleCallback === 'function') {
        w.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle);
      }
      if (typeof cleanup === 'function') cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
