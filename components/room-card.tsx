import Link from 'next/link';
import type { Room } from '@/lib/content';

/**
 * The thiings-style room tile, beefed up:
 * - bigger hero glyph with gentle float animation
 * - 2 small "sub-orbs" floating around it (thiings collection feel)
 * - subtle 3D tilt on hover
 * - bigger card, deeper shadow, color tint visible on top half
 */

const SUB_ORBS: Record<string, string[]> = {
  parlor: ['🎙️', '☕'],
  studio: ['📚', '🎧'],
  workshop: ['🪄', '⚡'],
  cooperate: ['✉️', '💼'],
};

export default function RoomCard({ room }: { room: Room }) {
  const orbs = SUB_ORBS[room.slug] ?? [];
  return (
    <Link
      href={`/${room.slug}`}
      className="tilt-card group block aspect-[4/5] sm:aspect-square md:aspect-[4/5]"
    >
      <div className="thiings-card tilt-card-inner h-full overflow-hidden p-7 md:p-9">
        {/* Top half tint */}
        <div
          className={`absolute inset-x-0 top-0 h-[62%] ${room.tint} opacity-80 transition-opacity duration-500 group-hover:opacity-100`}
          aria-hidden="true"
        />
        {/* Subtle radial highlight at top — Apple-style */}
        <div
          className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-white/60 blur-2xl"
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
