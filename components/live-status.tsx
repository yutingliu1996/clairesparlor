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
      className="pill pill-live"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span aria-hidden="true" className="text-sm">
        {m.glyph}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-2">
        {lang === 'zh' ? m.zh : m.en}
      </span>
    </span>
  );
}
