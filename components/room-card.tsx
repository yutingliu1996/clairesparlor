import Link from 'next/link';
import type { Room } from '@/lib/content';

/**
 * The thiings-style room tile.
 *
 * Visual update (2026-05-24 by Claire request):
 *   • 去掉硬切的 "top half tint" + 顶部小光圈
 *   • 改成一个柔和 radial gradient 光晕：中心落在卡片中部（emoji 区），
 *     向四周柔和淡出。每张卡用自己的色调（peach / sky / sage / lemon-cream）。
 */

const SUB_ORBS: Record<string, string[]> = {
  parlor: ['🎙️', '☕'],
  studio: ['📚', '🎧'],
  workshop: ['🪄', '⚡'],
  cooperate: ['✉️', '💼'],
};

// 每张卡的光晕色（取自 tailwind.config.ts 的 cream/peach/sage/sky2 hex 值，提到 .85 透明度让它在白底上柔和）
const GLOW_COLOR: Record<string, string> = {
  parlor: 'rgba(248, 228, 220, 0.85)',     // peach
  studio: 'rgba(226, 232, 244, 0.85)',     // sky2
  workshop: 'rgba(230, 238, 229, 0.85)',   // sage
  cooperate: 'rgba(244, 239, 230, 0.85)',  // cream
};

export default function RoomCard({ room }: { room: Room }) {
  const orbs = SUB_ORBS[room.slug] ?? [];
  return (
    <Link
      href={`/${room.slug}`}
      className="tilt-card group block aspect-[4/5] sm:aspect-square md:aspect-[4/5]"
    >
      <div className="thiings-card tilt-card-inner h-full overflow-hidden p-7 md:p-9">
        {/* 柔和 radial 光晕：中心落在卡片中部（emoji 区域），向四周柔和淡出 */}
        <div
          className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse 70% 55% at 50% 45%, ${GLOW_COLOR[room.slug] ?? 'rgba(244, 239, 230, 0.85)'} 0%, transparent 75%)`,
            opacity: 0.95,
          }}
          aria-hidden="true"
        />

        <div className="relative flex h-full flex-col items-center justify-between text-center">
          <div className="flex w-full items-center justify-between">
            <div className="eyebrow">{room.en}</div>
            <span
              className="text-[11px] text-ink-3 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              ↗
            </span>
          </div>

          {/* Hero object + floating sub-orbs */}
          <div className="relative my-2 flex h-[60%] w-full items-center justify-center">
            <span className="thiings-object float-y" aria-hidden="true">
              {room.glyph}
            </span>
            {orbs[0] && (
              <span
                className="sub-orb float-tilt"
                style={{ top: '8%', left: '12%' }}
                aria-hidden="true"
              >
                {orbs[0]}
              </span>
            )}
            {orbs[1] && (
              <span
                className="sub-orb float-y"
                style={{ bottom: '10%', right: '10%', animationDelay: '1.5s' }}
                aria-hidden="true"
              >
                {orbs[1]}
              </span>
            )}
          </div>

          <div>
            <div className="font-rounded text-[28px] font-semibold tracking-tight md:text-[32px]">
              {room.zh}
            </div>
            <div className="mt-1 text-sm text-ink-3">{room.taglineZh}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
