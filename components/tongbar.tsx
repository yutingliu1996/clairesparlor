'use client';

import { useEffect, useRef, useState } from 'react';
import { TONGBAR_MESSAGES } from '@/lib/content';

const STORAGE_KEY = 'cp-tongbar-dismissed';
const SESSION_DELAY_MS = 800;
const ROTATE_MS = 6500;

/**
 * Tongbar — the desktop pet from the live site.
 * Floats bottom-right, cycles speech bubble lines, dismissable per session.
 */
export default function Tongbar() {
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    // Stay dismissed for the rest of this tab session.
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return;
    const t = window.setTimeout(() => setVisible(true), SESSION_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    timer.current = window.setInterval(() => {
      setBubbleVisible(false);
      window.setTimeout(() => {
        setIdx((i) => (i + 1) % TONGBAR_MESSAGES.length);
        setBubbleVisible(true);
      }, 300);
    }, ROTATE_MS);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [visible]);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-5 z-50 flex items-end gap-3"
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto relative max-w-[240px] rounded-2xl bg-surface px-4 py-3 text-sm text-ink-2 shadow-thiings transition-all duration-300 ${
          bubbleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
        }`}
      >
        <span aria-hidden="true">{TONGBAR_MESSAGES[idx]}</span>
        {/* Tail pointing right */}
        <span
          aria-hidden="true"
          className="absolute -right-1.5 bottom-4 h-3 w-3 rotate-45 bg-surface"
          style={{ boxShadow: '2px -2px 0 rgba(0,0,0,0.04)' }}
        />
        <button
          type="button"
          onClick={dismiss}
          aria-label="把铜板儿哄走"
          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border border-hairline bg-paper text-[10px] text-ink-3 transition-colors hover:text-ink"
        >
          ✕
        </button>
      </div>
      <div
        className="pointer-events-auto flex h-14 w-14 select-none items-center justify-center rounded-full bg-cream/70 shadow-thiings"
        style={{
          animation: 'float-y 4s ease-in-out infinite',
        }}
        aria-hidden="true"
      >
        <span style={{ fontSize: 32, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.18))' }}>
          🐱
        </span>
      </div>
    </div>
  );
}
