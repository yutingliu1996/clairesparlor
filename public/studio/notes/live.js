(() => {
  'use strict';

  const id = document.querySelector('meta[name="learning-note-id"]')?.content;
  const revision = document.querySelector('meta[name="learning-note-revision"]')?.content;
  if (!id || !/^[a-f0-9]{64}$/.test(revision || '') || typeof window.fetch !== 'function') return;

  const positionKey = `learning-note-position:${id}`;
  const currentPath = `${window.location.pathname}${window.location.search}`;
  let banner = null;
  let offeredRevision = null;
  let inFlight = false;
  let reloading = false;

  // Only the explicit reload button writes this transient position. It is
  // consumed once; no analytics, history, or reading activity is recorded.
  try {
    const raw = window.sessionStorage.getItem(positionKey);
    window.sessionStorage.removeItem(positionKey);
    const saved = raw ? JSON.parse(raw) : null;
    if (saved && saved.path === currentPath && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
      const restore = () => window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        const root = document.documentElement;
        const previousBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo(Math.max(0, saved.x), Math.max(0, saved.y));
        root.style.scrollBehavior = previousBehavior;
      }));
      if (document.readyState === 'complete') restore();
      else window.addEventListener('load', restore, { once: true });
    }
  } catch (_) {
    // Storage may be unavailable. Browser-native reload scroll restoration
    // remains available; this must never prevent reading the document.
  }

  function offerUpdate(nextRevision) {
    offeredRevision = nextRevision;
    if (banner || reloading || !document.body) return;

    banner = document.createElement('div');
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-atomic', 'true');
    banner.setAttribute('data-learning-update', '');
    banner.style.cssText = 'position:fixed;z-index:2147483000;left:16px;right:16px;bottom:16px;width:fit-content;max-width:calc(100vw - 32px);box-sizing:border-box;margin:0 auto;padding:12px 16px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px 16px;border:1px solid #c5cfde;border-radius:8px;background:var(--paper,#fff);color:var(--ink,#162437);box-shadow:0 5px 24px rgba(22,36,55,.16);font:500 14px/1.5 system-ui,sans-serif;';
    const message = document.createElement('span');
    message.textContent = '这篇笔记有更新';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '查看新版';
    button.style.cssText = 'appearance:none;box-sizing:border-box;min-height:40px;border:0;border-radius:5px;padding:8px 14px;background:var(--blue,#2456d6);color:#fff;font:inherit;cursor:pointer;outline-offset:3px;';
    button.addEventListener('click', () => {
      if (reloading) return;
      reloading = true;
      try {
        window.sessionStorage.setItem(positionKey, JSON.stringify({
          path: currentPath,
          x: window.scrollX,
          y: window.scrollY,
        }));
      } catch (_) {
        // A blocked/full storage area must not block the requested reload.
      }
      button.disabled = true;
      button.textContent = '正在打开…';
      window.location.reload();
    });
    banner.append(message, button);
    document.body.append(banner);
    // No animation or smooth scrolling, including with reduced motion enabled.
  }

  async function check() {
    if (document.visibilityState !== 'visible' || inFlight || reloading) return;
    inFlight = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await window.fetch('/studio/notes/updates.json', {
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      if (!response.ok) return;
      const data = await response.json();
      if (!data?.notes || typeof data.notes !== 'object' || !Object.prototype.hasOwnProperty.call(data.notes, id)) return;
      const nextRevision = data.notes[id]?.revision;
      if (typeof nextRevision !== 'string' || !/^[a-f0-9]{64}$/.test(nextRevision)) return;
      // Ignore the overall version: editing another note or Hub metadata is
      // not a reason to interrupt this reader.
      if (nextRevision !== revision) {
        if (nextRevision !== offeredRevision) offerUpdate(nextRevision);
      } else if (banner && !reloading) {
        banner.remove();
        banner = null;
        offeredRevision = null;
      }
    } catch (_) {
      // Offline, invalid responses, or deployment races leave the page intact.
    } finally {
      window.clearTimeout(timeout);
      inFlight = false;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void check();
  });
  window.setInterval(() => { void check(); }, 60000);
  void check();
})();
