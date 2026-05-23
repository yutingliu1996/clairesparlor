'use client';

/**
 * ThingsGrid — the signature thiings.co wall, but populated with
 * objects from Claire's content world. Each tile is a tiny floating
 * white card with a single 3D-ish emoji, soft shadow, hover-tilt.
 *
 * The grid is decorative; mousing over any object reveals its caption.
 */
const THINGS = [
  { glyph: '☕', label: '会客厅', tone: 'bg-cream/40' },
  { glyph: '🎙️', label: '播客', tone: 'bg-peach/40' },
  { glyph: '📚', label: '书房', tone: 'bg-sage/40' },
  { glyph: '🎧', label: '客厅 BGM', tone: 'bg-sky2/40' },
  { glyph: '💻', label: '工作台', tone: 'bg-cream/40' },
  { glyph: '🪐', label: 'Vol.01', tone: 'bg-peach/40' },
  { glyph: '🧊', label: 'L1 数学', tone: 'bg-sky2/40' },
  { glyph: '🎯', label: 'L2 ML', tone: 'bg-sage/40' },
  { glyph: '🧠', label: 'L3 深度学习', tone: 'bg-peach/40' },
  { glyph: '🤖', label: 'L4 大模型', tone: 'bg-cream/40' },
  { glyph: '🧰', label: 'L5 应用层', tone: 'bg-sage/40' },
  { glyph: '🗺️', label: 'L6 行业', tone: 'bg-sky2/40' },
  { glyph: '🎲', label: '推荐系统', tone: 'bg-peach/40' },
  { glyph: '🌱', label: '向上长', tone: 'bg-sage/40' },
  { glyph: '🔥', label: '说出来', tone: 'bg-peach/40' },
  { glyph: '📡', label: '诚实播报', tone: 'bg-sky2/40' },
  { glyph: '🌍', label: '无界', tone: 'bg-sage/40' },
  { glyph: '🪄', label: '工坊', tone: 'bg-cream/40' },
  { glyph: '🚀', label: 'AI 创业', tone: 'bg-peach/40' },
  { glyph: '⚡', label: '黑客松', tone: 'bg-sky2/40' },
  { glyph: '🤝', label: '合作', tone: 'bg-cream/40' },
  { glyph: '✉️', label: '写信', tone: 'bg-sage/40' },
  { glyph: '🍵', label: '客厅小聚', tone: 'bg-peach/40' },
  { glyph: '✨', label: '从 0 到 1', tone: 'bg-sky2/40' },
];

export default function ThingsGrid() {
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
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
}
