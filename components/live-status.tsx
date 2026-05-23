'use client';

import { useEffect, useState } from 'react';

/**
 * "Right now" rotating status — direct port of the original site's pill,
 * cleaned up. Pauses on hover.
 */
const MESSAGES = [
  { glyph: '🎙️', text: 'Vol.04 EP·02 录制中' },
  { glyph: '📱', text: 'Workshop · 自媒体方向 · 5/30–31 开放报名' },
  { glyph: '🤝', text: '全球开源黑客松 · 找 AI Founder 组队' },
  { glyph: '🔐', text: '在准备一场上海高管闭门会' },
  { glyph: '🔥', text: '在参加科技火人节' },
  { glyph: '☕', text: '在举办 Coffee Chat' },
];

export default function LiveStatus() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  const m = MESSAGES[idx];
  return (
    <span
      className="pill pill-live"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span aria-hidden="true" className="text-sm">
        {m.glyph}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-2">
        {m.text}
      </span>
    </span>
  );
}
