'use client';

import Link from 'next/link';
import RoomCard from '@/components/room-card';
import ThingsGrid from '@/components/things-grid';
import LiveStatus from '@/components/live-status';
import StatsStrip from '@/components/stats-strip';
import FeaturedPodcast from '@/components/featured-podcast';
import FittedHeroTitle from '@/components/fitted-hero-title';
import { ROOMS, MANIFESTO } from '@/lib/content';
import { useLang } from '@/components/lang-context';

/**
 * Home — apple × thiings.
 *
 * Sections (alternating white / cream / ink to give visual variety):
 *  1. HERO — live pill + giant statement + subhead
 *  2. THINGS WALL — 24 floating objects from her world (cream)
 *  3. FOUR ROOMS — 4 big tilt-cards (white)
 *  4. FEATURED PODCAST — Apple-Music-like media tile (white)
 *  5. STATS — 4 big numbers (cream)
 *  6. HOST — about-me block (white)
 *  7. MANIFESTO — black callout with all 6 beliefs in one shot (ink)
 */
export default function HomePage() {
  const { lang, t } = useLang();
  return (
    <>
      {/* ============== 1 · HERO — two-column, mirrors PageHeader ============== */}
      <section className="wrap pt-16 pb-10 sm:pt-20 sm:pb-12 md:pt-32 md:pb-16">
        <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[1fr_220px] sm:gap-10 md:grid-cols-[1fr_280px] md:gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          {/* LEFT — title + lede + CTAs */}
          <div>
            <div className="reveal in">
              <LiveStatus />
            </div>

            <FittedHeroTitle
              className="reveal in mt-6 max-w-[20ch] font-semibold tracking-tight sm:mt-8"
              reserveMobileGlyph
              glyphReserveMaxWidth={639.98}
            >
              <span className="flex items-center justify-between gap-3 sm:block">
                <span className="min-w-0 flex-1 sm:block">
                  <span data-title-line className="block whitespace-nowrap">
                    {lang === 'zh' ? '一个空间。' : 'One space.'}
                  </span>
                  <span data-title-line className="block whitespace-nowrap">
                    <span className="accent-display">
                      {lang === 'zh' ? '四个房间。' : 'Four rooms.'}
                    </span>
                  </span>
                </span>
                {/* Compact orbital — mobile only. Keeps all 4 corner orbs
                    so the "one space, four rooms" story survives at mobile. */}
                <span className="relative block aspect-square w-[88px] shrink-0 sm:hidden" aria-hidden="true">
                  {/* halo (same color stops as the desktop big orbital) */}
                  <span
                    className="halo-pulse pointer-events-none absolute inset-[-14%]"
                    style={{
                      background: `radial-gradient(closest-side at 50% 50%,
                        color-mix(in srgb, var(--accent-stroke-mid, rgba(125,220,175,1)) 62%, transparent) 0%,
                        color-mix(in srgb, var(--accent-stroke-mid, rgba(125,220,175,1)) 36%, transparent) 26%,
                        color-mix(in srgb, var(--accent-stroke-mid, rgba(125,220,175,1)) 16%, transparent) 50%,
                        color-mix(in srgb, var(--accent-stroke-mid, rgba(125,220,175,1)) 4%, transparent) 70%,
                        transparent 82%)`,
                    }}
                  />
                  {/* core */}
                  <span
                    className="pointer-events-none absolute inset-0 m-auto"
                    style={{
                      width: '46%',
                      height: '46%',
                      background:
                        'radial-gradient(circle, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0) 72%)',
                      filter: 'blur(6px)',
                    }}
                  />
                  {/* center coffee */}
                  <span
                    className="float-y absolute inset-0 flex items-center justify-center"
                    style={{
                      fontSize: '38px',
                      lineHeight: 1,
                      filter:
                        'drop-shadow(0 8px 16px rgba(0,0,0,0.14)) drop-shadow(0 2px 4px rgba(0,0,0,0.10))',
                    }}
                  >
                    ☕
                  </span>
                  {/* 4 corners — same mapping as desktop big orbital. */}
                  <span className="sub-orb float-tilt" style={{ top: '2%', left: '2%', fontSize: '16px' }}>
                    🛋️
                  </span>
                  <span className="sub-orb float-y" style={{ top: '2%', right: '2%', fontSize: '16px', animationDelay: '0.8s' }}>
                    💻
                  </span>
                  <span className="sub-orb float-tilt" style={{ bottom: '2%', left: '2%', fontSize: '15px', animationDelay: '1.6s' }}>
                    🪄
                  </span>
                  <span className="sub-orb float-y" style={{ bottom: '2%', right: '2%', fontSize: '15px', animationDelay: '2.4s' }}>
                    🤝
                  </span>
                </span>
              </span>
            </FittedHeroTitle>

            <p className="reveal in mt-6 max-w-prose text-base text-ink-2 sm:mt-8 sm:text-lg md:text-xl">
              {lang === 'zh' ? (
                <>
                  看你想做的事，挑一扇门走进来 ——
                  <span className="bg-accent-soft px-1.5 py-0.5">
                    听播客 · 翻笔记 · 报 workshop · 找合作
                  </span>
                  ，一站搞定。
                </>
              ) : (
                <>
                  Pick a door based on what you want to do —
                  <span className="bg-accent-soft px-1.5 py-0.5">
                    listen to the pod · flip the notes · join a workshop · pitch a collab
                  </span>
                  , all in one place.
                </>
              )}
            </p>

            <div className="reveal in mt-6 flex flex-wrap gap-3 sm:mt-8">
              <Link
                href="/parlor"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-surface transition-transform duration-300 hover:-translate-y-0.5"
              >
                {t({ zh: '先听一期', en: 'Hear an episode' })} <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-5 py-2.5 text-sm font-medium text-ink-2 transition-colors hover:text-ink"
              >
                {t({ zh: '翻笔记', en: 'Flip the notes' })}
              </Link>
            </div>
          </div>

          {/* RIGHT — ☕ at center, 4 room glyphs orbiting at compass points,
              wrapped in mint halo. Tells the "one space, four rooms" story
              visually in a single tile. Hidden on mobile because the title
              already carries a compact inline glyph (mirrors PageHeader). */}
          <div className="reveal in hidden sm:block">
            <div className="relative flex aspect-square w-full max-w-[200px] sm:mx-auto sm:max-w-[220px] md:max-w-[280px] lg:max-w-[320px] items-center justify-center">
              {/* Outer halo — color follows the active page theme via
                  --accent-stroke-mid (set on <main> by MainTheme).
                  color-mix gives us "this color at X% opacity" without
                  hardcoding the RGB triplet. */}
              <div
                aria-hidden="true"
                className="halo-pulse pointer-events-none absolute inset-[-14%]"
                style={{
                  background: `radial-gradient(closest-side at 50% 50%,
                    color-mix(in srgb, var(--accent-stroke-mid, rgba(125,220,175,1)) 62%, transparent) 0%,
                    color-mix(in srgb, var(--accent-stroke-mid, rgba(125,220,175,1)) 36%, transparent) 26%,
                    color-mix(in srgb, var(--accent-stroke-mid, rgba(125,220,175,1)) 16%, transparent) 50%,
                    color-mix(in srgb, var(--accent-stroke-mid, rgba(125,220,175,1)) 4%, transparent) 70%,
                    transparent 82%)`,
                }}
              />
              {/* Inner soft white core */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{
                  width: '46%',
                  height: '46%',
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0) 72%)',
                  filter: 'blur(6px)',
                }}
              />
              {/* Center: ☕ — the brand signature */}
              <span
                className="float-y relative"
                style={{
                  fontSize: 'clamp(80px, 9.5vw, 110px)',
                  lineHeight: 1,
                  filter:
                    'drop-shadow(0 14px 24px rgba(0,0,0,0.14)) drop-shadow(0 4px 8px rgba(0,0,0,0.10))',
                }}
                aria-hidden="true"
              >
                ☕
              </span>
              {/* Four room glyphs at NW / NE / SW / SE corners — mapped to the
                  4 rooms (Parlor / Studio / Workshop / Cooperate). Staggered
                  animation delays so they breathe out of sync. */}
              <span
                className="sub-orb float-tilt"
                style={{ top: '4%', left: '4%', fontSize: '28px' }}
                aria-hidden="true"
              >
                🛋️
              </span>
              <span
                className="sub-orb float-y"
                style={{ top: '4%', right: '4%', fontSize: '28px', animationDelay: '0.8s' }}
                aria-hidden="true"
              >
                💻
              </span>
              <span
                className="sub-orb float-tilt"
                style={{ bottom: '4%', left: '4%', fontSize: '26px', animationDelay: '1.6s' }}
                aria-hidden="true"
              >
                🪄
              </span>
              <span
                className="sub-orb float-y"
                style={{ bottom: '4%', right: '4%', fontSize: '26px', animationDelay: '2.4s' }}
                aria-hidden="true"
              >
                🤝
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============== 2 · THINGS WALL ============== */}
      <section className="reveal mt-4 overflow-hidden">
        <div className="paper-grain bg-cream/35 py-20 md:py-28">
          <div className="wrap">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="eyebrow">
                  {t({ zh: 'The Collection · 客厅里的物件', en: 'The Collection · things in the parlor' })}
                </div>
                <h2 className="mt-3 max-w-2xl text-display-md font-semibold tracking-tight">
                  {lang === 'zh' ? (
                    <>把这间客厅<br />揉成 <em className="accent">24 件物</em></>
                  ) : (
                    <>This whole parlor,<br />folded into <em className="accent">24 little things</em></>
                  )}
                </h2>
              </div>
              <p className="max-w-sm text-sm text-ink-2 md:text-base">
                {t({
                  zh: '每一件都对应一段内容、一层笔记、一个产品入口。Hover 任何一件看是什么。',
                  en: 'Each one points to a piece of content, a notes layer, or a product. Hover any object to see what it is.',
                })}
              </p>
            </div>
            <ThingsGrid />
          </div>
        </div>
      </section>

      {/* ============== 3 · FOUR ROOMS ============== */}
      <section className="wrap pt-24 pb-24 md:pt-32 md:pb-32">
        <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow">
              {t({ zh: 'Pick a door · 挑扇门', en: 'Pick a door' })}
            </div>
            <h2 className="mt-3 max-w-2xl text-display-md font-semibold">
              {lang === 'zh' ? (
                <>
                  一个空间，<br />
                  <span className="text-ink-3">四扇门各自通向不同的我。</span>
                </>
              ) : (
                <>
                  One space,<br />
                  <span className="text-ink-3">four doors that each open onto a different me.</span>
                </>
              )}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {ROOMS.map((r, i) => (
            <div key={r.slug} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <RoomCard room={r} />
            </div>
          ))}
        </div>
      </section>

      {/* ============== 4 · FEATURED PODCAST ============== */}
      <section className="wrap reveal pb-24 md:pb-32">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">
              {t({ zh: '🎙️ Now playing · 这期在播', en: '🎙️ Now playing' })}
            </div>
            <h2 className="mt-3 max-w-2xl text-display-md font-semibold">
              {lang === 'zh' ? (
                <>Vol.01 · <br />给内容创作者的 AI 全景</>
              ) : (
                <>Vol.01 · <br />The AI panorama for creators</>
              )}
            </h2>
          </div>
          <Link href="/parlor" className="inline-flex items-center gap-2 text-sm font-medium text-ink-2 hover:text-ink">
            {t({ zh: '全部 episode', en: 'All episodes' })} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <FeaturedPodcast />
      </section>

      {/* ============== 5 · STATS ============== */}
      <section className="reveal">
        <div className="paper-grain bg-cream/35 py-20 md:py-28">
          <div className="wrap">
            <div className="mb-12">
              <div className="eyebrow">
                {t({ zh: 'By the numbers · 一些数', en: 'By the numbers' })}
              </div>
              <h2 className="mt-3 max-w-2xl text-display-md font-semibold">
                {lang === 'zh' ? (
                  <>
                    这就是 <em className="accent">Y1</em>
                    <br />
                    <span className="text-ink-3">的样子。</span>
                  </>
                ) : (
                  <>
                    This is what <em className="accent">Y1</em>
                    <br />
                    <span className="text-ink-3">looks like.</span>
                  </>
                )}
              </h2>
            </div>
            <StatsStrip />
          </div>
        </div>
      </section>

      {/* ============== 6 · HOST ============== */}
      <section className="wrap reveal pt-24 pb-24 md:pt-32">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[320px_1fr]">
          <div className="thiings-card flex aspect-square items-center justify-center bg-gradient-to-br from-cream/60 via-peach/40 to-sky2/40 paper-grain p-10">
            <div className="thiings-object-xl float-y" aria-hidden="true">
              👩‍💻
            </div>
          </div>
          <div>
            <div className="eyebrow">
              {t({ zh: 'Hi from the editor · 写在前面', en: 'Hi from the editor' })}
            </div>
            <h2 className="mt-3 text-display-md font-semibold">
              {lang === 'zh' ? (
                <>
                  我是 <span className="accent">刘玉婷</span>
                  <span className="text-ink-3"> · Claire</span>。
                </>
              ) : (
                <>
                  I&apos;m <span className="accent">Liu Yuting</span>
                  <span className="text-ink-3"> · Claire</span>.
                </>
              )}
            </h2>
            <div className="mt-6 space-y-4 text-base text-ink-2 md:text-lg">
              {lang === 'zh' ? (
                <>
                  <p>
                    5 年 PM 出身，今年 ALL IN 做自己的内容生意——
                    <strong className="text-ink">小红书 / B站 / 小宇宙 / YouTube / X</strong>{' '}
                    五条线并行，主线是<strong className="text-ink">播客</strong>。
                  </p>
                  <p>
                    我自己也是 AI 小白。但做内容必须用 AI，所以决定<strong className="text-ink">边学边把笔记整理出来</strong>——这就是工作台里的 Vol.01。
                  </p>
                  <p className="font-rounded text-xl text-ink md:text-2xl">
                    <strong>这频道是共建的，<br />不是我演你看。</strong>
                  </p>
                </>
              ) : (
                <>
                  <p>
                    5 years as a PM, now ALL IN on my own content business —
                    five parallel tracks on{' '}
                    <strong className="text-ink">Xiaohongshu / Bilibili / Xiaoyuzhou / YouTube / X</strong>,
                    with <strong className="text-ink">podcasting</strong> as the main line.
                  </p>
                  <p>
                    I&apos;m a beginner with AI too. But you can&apos;t make content without it now, so I decided to{' '}
                    <strong className="text-ink">learn out loud and ship the notes as I go</strong> — that&apos;s Vol.01 over in the Studio.
                  </p>
                  <p className="font-rounded text-xl text-ink md:text-2xl">
                    <strong>This channel is co-built,<br />not a one-person show.</strong>
                  </p>
                </>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {(lang === 'zh'
                ? ['ENTP', '5 yr PM', '播客主理人', '内容创业 #Y1', '向上长']
                : ['ENTP', '5-yr PM', 'Podcast host', 'Creator · Y1', 'Grow upward']
              ).map((tag) => (
                <span key={tag} className="pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== 7 · MANIFESTO (DARK BLOCK) ============== */}
      <section className="reveal">
        <div className="paper-grain bg-ink py-24 text-surface md:py-32">
          <div className="wrap">
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-4">
              {t({ zh: '✊ Manifesto · 我的主张', en: '✊ Manifesto · My Beliefs' })}
            </div>
            <h2 className="mt-4 max-w-3xl text-display-lg font-semibold leading-[1.05]">
              {lang === 'zh' ? (
                <>
                  别被职场磨平 ——
                  <br />
                  <span className="accent-display on-dark">向上长，无界长。</span>
                </>
              ) : (
                <>
                  Don&apos;t let work flatten you ——
                  <br />
                  <span className="accent-display on-dark">Grow upward. No limits.</span>
                </>
              )}
            </h2>
            <p className="mt-4 text-ink-4">
              {t({
                zh: "Don't get flattened. Grow up. No limits.",
                en: 'Don\'t get flattened. Grow up. No limits.',
              })}
            </p>

            {/* All 6 manifesto items as a quick read — no need to navigate */}
            <ol className="mt-12 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
              {MANIFESTO.map((m) => (
                <li key={m.num} className="flex items-start gap-4 border-t border-white/15 pt-5">
                  <span className="text-2xl" aria-hidden="true">
                    {m.glyph}
                  </span>
                  <div>
                    <div className="font-mono text-[10px] tracking-widest text-ink-4">{m.num}</div>
                    <div className="mt-1 font-rounded text-base font-medium leading-snug md:text-lg">
                      {lang === 'zh' ? m.text : m.textEn}
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-14 flex flex-wrap items-center gap-4">
              <Link
                href="/manifesto"
                className="inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5"
              >
                {t({ zh: '展开看完整版', en: 'Read the full version' })} <span aria-hidden="true">→</span>
              </Link>
              <a
                href="mailto:yutingliu1996@gmail.com?subject=Hi%20Claire"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-white/10"
              >
                {t({ zh: '☕ 来我的小客厅坐坐', en: '☕ Come sit in my parlor' })}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
