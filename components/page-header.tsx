/**
 * Standard page hero — oversized type on the left, a single glyph
 * floating in a colored radial halo on the right.
 *
 * Design notes
 *  • No card frame, no paper grain, no white blur. Just an emoji at
 *    native Apple-emoji raster (≤128 px → no upscale, stays sharp)
 *    sitting in a soft colored cloud that radiates outward.
 *  • The halo gently pulses so the glow feels alive without competing
 *    with the float-y bob on the glyph itself.
 *  • A faint white core highlight inside the halo gives the emoji a
 *    backdrop without enclosing it in a box.
 */

export type Halo = 'peach' | 'sky' | 'sage' | 'cream' | 'mint' | 'leaf';

const HALO_RGB: Record<Halo, string> = {
  peach: '255, 220, 100', // 温暖明亮的 sunshine yellow — Parlor
  sky: '170, 220, 250',   // baby blue — Studio
  sage: '185, 165, 245',  // 老友记紫 — Workshop
  cream: '252, 230, 130', // 嫩鹅黄 — Cooperate / IP
  mint: '255, 150, 120',  // 橙红 — accent / brand / home
  leaf: '140, 225, 180',  // 嫩绿 — Manifesto (2026-05-24 Claire：跟主张主题绿色嫩芽呼应)
};

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  glyph?: string;
  /** Optional floating sub-objects around the hero glyph. */
  subOrbs?: string[];
  /** Halo color theme. */
  halo?: Halo;
};

export default function PageHeader({
  eyebrow,
  title,
  lede,
  glyph,
  subOrbs = [],
  halo = 'cream',
}: Props) {
  const rgb = HALO_RGB[halo];
  return (
    <header className="wrap pt-16 pb-12 sm:pt-20 sm:pb-16 md:pt-28 md:pb-20">
      <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[1fr_200px] sm:gap-10 md:grid-cols-[1fr_240px] md:gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
        <div className="reveal in">
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="mt-4 max-w-3xl text-display-lg font-semibold tracking-tight">
            {title}
          </h1>
          {lede && (
            <p className="mt-6 max-w-prose text-lg text-ink-2 md:text-xl">{lede}</p>
          )}
        </div>

        {glyph && (
          <div className="reveal in order-first sm:order-none">
            <div className="relative flex aspect-square w-full max-w-[180px] sm:mx-auto sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] items-center justify-center">
              {/* Outer halo — 2026-05-24 Claire 反馈：再亮一点 + dark 有灵光乍现感
                  light 模式提 alpha + 扩大半径；dark 模式 .halo-glow class 在 globals.css 加 brightness */}
              <div
                aria-hidden="true"
                className="halo-pulse halo-glow pointer-events-none absolute inset-[-22%]"
                style={{
                  background: `radial-gradient(closest-side at 50% 50%,
                    rgba(${rgb}, 0.85) 0%,
                    rgba(${rgb}, 0.55) 22%,
                    rgba(${rgb}, 0.28) 45%,
                    rgba(${rgb}, 0.10) 68%,
                    transparent 85%)`,
                }}
              />
              {/* Inner soft white core — gives the glyph a quiet backdrop */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute halo-core"
                style={{
                  width: '50%',
                  height: '50%',
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 72%)',
                  filter: 'blur(8px)',
                }}
              />

              {/* Main emoji — kept inside Apple emoji raster sweet spot */}
              <span
                className="float-y relative"
                style={{
                  fontSize: 'clamp(92px, 10.5vw, 122px)',
                  lineHeight: 1,
                  filter:
                    'drop-shadow(0 14px 24px rgba(0,0,0,0.14)) drop-shadow(0 4px 8px rgba(0,0,0,0.10))',
                }}
                aria-hidden="true"
              >
                {glyph}
              </span>

              {subOrbs[0] && (
                <span
                  className="sub-orb float-tilt"
                  style={{ top: '4%', left: '4%', fontSize: '30px' }}
                  aria-hidden="true"
                >
                  {subOrbs[0]}
                </span>
              )}
              {subOrbs[1] && (
                <span
                  className="sub-orb float-y"
                  style={{ bottom: '4%', right: '2%', fontSize: '28px', animationDelay: '1.5s' }}
                  aria-hidden="true"
                >
                  {subOrbs[1]}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
