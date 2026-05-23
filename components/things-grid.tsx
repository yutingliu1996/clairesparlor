'use client';

import { useLang } from './lang-context';

/**
 * ThingsGrid — the signature thiings.co wall, but populated with
 * objects from Claire's content world. Each tile is a tiny floating
 * white card with a single 3D-ish emoji, soft shadow, hover-tilt.
 *
 * The grid is decorative; mousing over any object reveals its caption.
 */
const THINGS = [
  { glyph: '☕', label: '会客厅', labelEn: 'The parlor', tone: 'bg-cream/40' },
  { glyph: '🎙️', label: '播客', labelEn: 'Podcast', tone: 'bg-peach/40' },
  { glyph: '📚', label: '书房', labelEn: 'Bookshelf', tone: 'bg-sage/40' },
  { glyph: '🎧', label: '客厅 BGM', labelEn: 'Parlor BGM', tone: 'bg-sky2/40' },
  { glyph: '💻', label: '工作台', labelEn: 'Studio', tone: 'bg-cream/40' },
  { glyph: '🪐', label: 'Vol.01', labelEn: 'Vol.01', tone: 'bg-peach/40' },
  { glyph: '🧊', label: 'L1 数学', labelEn: 'L1 Math', tone: 'bg-sky2/40' },
  { glyph: '🎯', label: 'L2 ML', labelEn: 'L2 ML', tone: 'bg-sage/40' },
  { glyph: '🧠', label: 'L3 深度学习', labelEn: 'L3 Deep learning', tone: 'bg-peach/40' },
  { glyph: '💬', label: 'L4 大模型', labelEn: 'L4 LLMs', tone: 'bg-cream/40' },
  { glyph: '🧰', label: 'L5 应用层', labelEn: 'L5 Apps', tone: 'bg-sage/40' },
  { glyph: '🗺️', label: 'L6 行业', labelEn: 'L6 Industry', tone: 'bg-sky2/40' },
  { glyph: '🎲', label: '推荐系统', labelEn: 'Recommenders', tone: 'bg-peach/40' },
  { glyph: '🌱', label: '向上长', labelEn: 'Grow upward', tone: 'bg-sage/40' },
  { glyph: '🔥', label: '说出来', labelEn: 'Speak up', tone: 'bg-peach/40' },
  { glyph: '📡', label: '诚实播报', labelEn: 'Honest broadcast', tone: 'bg-sky2/40' },
  { glyph: '🌍', label: '无界', labelEn: 'No limits', tone: 'bg-sage/40' },
  { glyph: '🪄', label: '工坊', labelEn: 'Workshop', tone: 'bg-cream/40' },
  { glyph: '🚀', label: 'AI 创业', labelEn: 'AI startups', tone: 'bg-peach/40' },
  { glyph: '⚡', label: '黑客松', labelEn: 'Hackathon', tone: 'bg-sky2/40' },
  { glyph: '🤝', label: '合作', labelEn: 'Cooperate', tone: 'bg-cream/40' },
  { glyph: '✉️', label: '写信', labelEn: 'Write me', tone: 'bg-sage/40' },
  { glyph: '🍵', label: '客厅小聚', labelEn: 'Hangouts', tone: 'bg-peach/40' },
  { glyph: '✨', label: '从 0 到 1', labelEn: 'Zero to one', tone: 'bg-sky2/40' },
];

export default function ThingsGrid() {
  const { lang } = useLang();
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 sm:gap-4 md:grid-cols-8 lg:grid-cols-12">
      {THINGS.map((t, i) => (
        <div
          key={i}
          className={`thiings-mini ${t.tone} group`}
          style={{
            // Stagger floating animation so the grid breathes in waves
            animation: `float-y ${5 + (i % 4)}s ease-in-out ${i * 0.13}s infinite`,
          }}
        >
          <span className="thiings-mini-glyph" aria-hidden="true">
            {t.glyph}
          </span>
          {/* caption on hover */}
          <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium text-surface opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {lang === 'zh' ? t.label : t.labelEn}
          </span>
        </div>
      ))}
    </div>
  );
}
