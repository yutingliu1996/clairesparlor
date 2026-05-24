'use client';

import { useEffect, useState } from 'react';
import { useLang } from './lang-context';

/**
 * "Right now" rotating status — direct port of the original site's pill,
 * cleaned up. Pauses on hover.
 */
const MESSAGES = [
  { glyph: '🎙️', zh: 'Vol.04 EP·02 录制中', en: 'Vol.04 EP·02 in recording' },
  { glyph: '📱', zh: 'Workshop · 自媒体方向 · 5/30–31 开放报名', en: 'Workshop · creator track · sign-ups open 5/30–31' },
  { glyph: '🤝', zh: '全球开源黑客松 · 找 AI Founder 组队', en: 'Global open-source hackathon · looking for AI founder teammates' },
  { glyph: '🔐', zh: '在准备一场上海高管闭门会', en: 'Prepping an exec closed-door in Shanghai' },
  { glyph: '🔥', zh: '在参加科技火人节', en: 'At a tech burning-man festival' },
  { glyph: '☕', zh: '在举办 Coffee Chat', en: 'Hosting a coffee chat' },
];

export default function LiveStatus() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const { lang } = useLang();

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  const m = MESSAGES[idx];
  return (
    <span
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="live-status-pill inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-xs text-surface shadow-[0_4px_12px_-4px_rgba(0,0,0,0.25)]"
    >
      {/* 红点呼吸 REC — inline 因为 pill class 不再用 */}
      <span
        aria-hidden="true"
        className="inline-block h-[7px] w-[7px] shrink-0 rounded-full"
        style={{
          background: '#FF3B30',
          boxShadow: '0 0 0 3px rgba(255, 59, 48, 0.25)',
          animation: 'breathe 2.4s ease-in-out infinite',
        }}
      />
      <span aria-hidden="true" className="text-sm leading-none">
        {m.glyph}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-eyebrow text-surface/90">
        {lang === 'zh' ? m.zh : m.en}
      </span>
    </span>
  );
}
