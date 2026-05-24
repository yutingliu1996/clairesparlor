'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLang } from './lang-context';

/**
 * "Right now" rotating status — single-line pill.
 *
 * Behavior:
 * - Each message renders on a single line (no wrap).
 * - If the text fits the available width, it stays for `STATIC_HOLD_MS`
 *   then crossfades to the next.
 * - If the text overflows, it pauses briefly, slides horizontally to
 *   reveal the rest, pauses again, then advances to the next message.
 * - Hovering pauses the rotation.
 * - Powered by motion.dev (`motion/react`).
 */
const MESSAGES = [
  { glyph: '🎙️', zh: 'Vol.04 EP·02 录制中', en: 'Vol.04 EP·02 in recording' },
  { glyph: '📱', zh: 'Workshop · 自媒体方向 · 5/30–31 开放报名', en: 'Workshop · creator track · sign-ups open 5/30–31' },
  { glyph: '🤝', zh: '全球开源黑客松 · 找 AI Founder 组队', en: 'Global open-source hackathon · looking for AI founder teammates' },
  { glyph: '🔐', zh: '在准备一场上海高管闭门会', en: 'Prepping an exec closed-door in Shanghai' },
  { glyph: '🔥', zh: '在参加科技火人节', en: 'At muShanghai pop-up city · the AI Burning Man' },
  { glyph: '☕', zh: '在举办 Coffee Chat', en: 'Hosting a coffee chat' },
];

// Timing constants (ms)
const STATIC_HOLD_MS = 4000;     // hold time when text fits
const EDGE_HOLD_MS = 900;        // hold at start/end of marquee
const SCROLL_PX_PER_SEC = 60;    // marquee speed

// Easing curve used across pill transitions (Apple-y "smooth out").
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
const SWAP_MS = 360;       // crossfade duration between messages
const LAYOUT_MS = 520;     // pill width morph duration

export default function LiveStatus() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [overflow, setOverflow] = useState(0); // px the content exceeds the viewport
  const viewportRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null); // hidden, always-mounted shadow of current content
  const { lang } = useLang();

  const m = MESSAGES[idx];
  const text = lang === 'zh' ? m.zh : m.en;

  // Measure overflow against the always-present shadow element so the value
  // is always in sync with the *new* message — no stale ref during AnimatePresence swaps.
  useLayoutEffect(() => {
    const measure = () => {
      const v = viewportRef.current;
      const t = measureRef.current;
      if (!v || !t) return;
      const diff = t.scrollWidth - v.clientWidth;
      setOverflow(Math.max(0, Math.ceil(diff)));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [idx, lang]);

  // Compute one full cycle duration for the current message.
  const scrollMs = overflow > 0 ? (overflow / SCROLL_PX_PER_SEC) * 1000 : 0;
  const cycleMs = overflow > 0 ? EDGE_HOLD_MS + scrollMs + EDGE_HOLD_MS : STATIC_HOLD_MS;

  // Auto-advance after one full cycle (unless paused).
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, cycleMs);
    return () => clearTimeout(timer);
  }, [idx, lang, paused, cycleMs]);

  return (
    <motion.span
      layout
      transition={{ layout: { duration: LAYOUT_MS / 1000, ease: EASE_OUT_EXPO } }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="live-status-pill inline-flex max-w-full items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-xs text-surface shadow-[0_4px_12px_-4px_rgba(0,0,0,0.25)]"
    >
      {/* 红点呼吸 REC */}
      <span
        aria-hidden="true"
        className="inline-block h-[7px] w-[7px] shrink-0 rounded-full"
        style={{
          background: '#FF3B30',
          boxShadow: '0 0 0 3px rgba(255, 59, 48, 0.25)',
          animation: 'breathe 2.4s ease-in-out infinite',
        }}
      />
      {/* Text viewport — sizes to the always-present sizer (so the pill's `layout`
          animation always has a stable width to morph between, even during the
          mode="wait" gap). overflow-hidden clips the marquee. */}
      <span
        ref={viewportRef}
        className="relative inline-flex min-w-0 max-w-full items-center overflow-hidden align-middle"
      >
        {/* Sizer — invisible, in-flow, mirrors the current message. Provides the
            viewport's natural width so `layout` smooths size changes between messages. */}
        <span
          ref={measureRef}
          aria-hidden="true"
          className="invisible inline-flex items-center gap-2 whitespace-nowrap"
        >
          <span className="text-sm leading-none">{m.glyph}</span>
          <span className="font-mono text-[11px] uppercase tracking-eyebrow">{text}</span>
        </span>

        {/* Animated visible content, layered on top (absolute) so it doesn't
            affect the viewport's width. mode="wait" gives a clean vertical wipe:
            old slides up & fades out, then new rises up & fades in. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={`${idx}-${lang}`}
            className="absolute inset-y-0 left-0 flex items-center gap-2 whitespace-nowrap will-change-transform"
            initial={{ opacity: 0, y: 10 }}
            animate={
              overflow > 0 && !paused
                ? {
                    opacity: 1,
                    y: 0,
                    x: [0, 0, -overflow, -overflow],
                  }
                : { opacity: 1, y: 0, x: 0 }
            }
            exit={{ opacity: 0, y: -10 }}
            transition={
              overflow > 0 && !paused
                ? {
                    x: {
                      duration: cycleMs / 1000,
                      times: [
                        0,
                        EDGE_HOLD_MS / cycleMs,
                        (EDGE_HOLD_MS + scrollMs) / cycleMs,
                        1,
                      ],
                      ease: 'linear',
                    },
                    opacity: { duration: SWAP_MS / 1000, ease: EASE_OUT_EXPO },
                    y: { duration: SWAP_MS / 1000, ease: EASE_OUT_EXPO },
                  }
                : { duration: SWAP_MS / 1000, ease: EASE_OUT_EXPO }
            }
          >
            <span aria-hidden="true" className="shrink-0 text-sm leading-none">
              {m.glyph}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-surface/90">
              {text}
            </span>
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.span>
  );
}
