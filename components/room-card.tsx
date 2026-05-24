'use client';

import Link from 'next/link';
import type { Room } from '@/lib/content';
import { useLang } from './lang-context';

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

// 2026-05-24 Claire 收官：4 张卡共用一种嫩鹅黄光晕，去边框，光晕大于卡片
const GLOW = 'rgba(255, 240, 150, 0.85)'; // 嫩鹅黄

export default function RoomCard({ room }: { room: Room }) {
  const { lang } = useLang();
  const orbs = SUB_ORBS[room.slug] ?? [];
  return (
    <Link
      href={`/${room.slug}`}
      className="tilt-card group relative block aspect-[4/5] sm:aspect-square md:aspect-[4/5]"
    >
      {/* 外溢光晕：默认隐藏，hover 时柔和淡入（900ms ease-out） */}
      <div
        className="pointer-events-none absolute -inset-[20%] opacity-0 transition-opacity duration-[900ms] ease-out group-hover:opacity-75"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${GLOW} 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />
      <div className="tilt-card-inner relative h-full overflow-visible p-7 md:p-9">

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
              {lang === 'zh' ? room.zh : room.en}
            </div>
            <div className="mt-1 text-sm text-ink-3">{lang === 'zh' ? room.taglineZh : room.taglineEn}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
