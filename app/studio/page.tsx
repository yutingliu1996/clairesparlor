'use client';

import Link from 'next/link';
import PageHeader from '@/components/page-header';
import SectionTitle from '@/components/section-title';
import { CHAPTERS } from '@/lib/content';
import { useLang } from '@/components/lang-context';

/**
 * /studio — Head down, building.
 * Four sub-rooms: AI Notes (6 chapters) · IP 化妆间 · Bookshelf · Tunes.
 */
export default function StudioPage() {
  const { lang, t } = useLang();
  const subRooms = [
    {
      href: '/studio#chapters',
      glyph: '📝',
      name: t({ zh: 'AI 笔记', en: 'AI Notes' }),
      sub: t({ zh: '6 层金字塔 + 1 条旁支', en: '6-layer stack + 1 side branch' }),
      tint: 'bg-peach/40',
    },
    {
      href: '/studio/ip',
      glyph: '🎨',
      name: t({ zh: 'IP 化妆间', en: 'IP Dressing Room' }),
      sub: t({ zh: '玉婷 × 铜板儿 mascot', en: 'Yuting × Tongbar mascot' }),
      tint: 'bg-cream/60',
    },
    {
      href: '/studio/bookshelf',
      glyph: '📚',
      name: t({ zh: '书房', en: 'Bookshelf' }),
      sub: t({ zh: '从微信读书直连', en: 'Synced from WeRead' }),
      tint: 'bg-sage/50',
    },
    {
      href: '/studio/tunes',
      glyph: '🎧',
      name: t({ zh: '客厅音乐', en: 'Parlor Tunes' }),
      sub: t({ zh: '在我客厅里循环播放', en: 'On loop in the parlor' }),
      tint: 'bg-sky2/50',
    },
  ];

  const readingOrder = lang === 'zh'
    ? [
        { n: '01', t: 'L6（产品视角）+ L4（大模型本身）', why: '先建立体感，先看到全局' },
        { n: '02', t: 'L5（RAG / Agent）', why: '你最有可能直接落地的部分' },
        { n: '03', t: 'L2 的"三大问题"', why: '概念懂了就行，算法可以跳' },
        { n: '04', t: 'L3 的 CNN / RNN', why: '知道是干嘛的就行，不必深究' },
        { n: '05', t: '旁支 · 推荐系统', why: '跟你的分发业务直接相关' },
        { n: '06', t: 'L2 的具体算法（KNN / SVM / K-means）', why: '能跳就跳，除非你要写代码', dim: true },
        { n: '07', t: 'L1 数学', why: '不用专门学，要用再回头查', dim: true },
      ]
    : [
        { n: '01', t: 'L6 (product lens) + L4 (the model itself)', why: 'Build a feel for it, then zoom in.' },
        { n: '02', t: 'L5 (RAG / Agent)', why: 'The part you\'re most likely to actually ship.' },
        { n: '03', t: 'L2 — the three core problems', why: 'Grasp the concepts; skip the algorithms.' },
        { n: '04', t: 'L3 — CNN / RNN', why: 'Just know what they\'re for. No need to go deep.' },
        { n: '05', t: 'Side branch · Recommender systems', why: 'Directly tied to how your content gets distributed.' },
        { n: '06', t: 'L2 algorithms (KNN / SVM / K-means)', why: 'Skip unless you\'re writing code.', dim: true },
        { n: '07', t: 'L1 math', why: 'Don\'t pre-study — look it up when you need it.', dim: true },
      ];

  return (
    <>
      <PageHeader
        eyebrow="Room · 02"
        glyph="💻"
        subOrbs={['🪐', '🧠']}
        title={
          lang === 'zh'
            ? <>工作台。<br /><span className="title-sub">自己埋头做事的地方。</span></>
            : <>The Studio.<br /><span className="title-sub">Where I head down and build.</span></>
        }
        lede={
          lang === 'zh' ? (
            <>
              遇到 Transformer / Agent / RAG / MCP / Vibe Coding 这些名词，
              回来速查就好——这里不是教程，是一份<em>永远在更新的草稿</em>。
            </>
          ) : (
            <>
              When you hit terms like Transformer / Agent / RAG / MCP / Vibe Coding,
              come back and look them up — not a tutorial, just a <em>forever-updating draft</em>.
            </>
          )
        }
      />

      {/* SUB-ROOMS */}
      <section className="wrap reveal pb-20">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {subRooms.map((s) => (
            <Link key={s.href} href={s.href} className="thiings-card group block aspect-square overflow-hidden p-6">
              <div className={`absolute inset-x-0 top-0 h-3/5 ${s.tint} opacity-70 transition-opacity duration-500 group-hover:opacity-100`} aria-hidden="true" />
              <div className="relative flex h-full flex-col items-center justify-between text-center">
                <div className="thiings-object" style={{ fontSize: 64 }} aria-hidden="true">
                  {s.glyph}
                </div>
                <div>
                  <div className="font-rounded text-xl font-semibold tracking-tight">{s.name}</div>
                  <div className="mt-1 text-xs text-ink-3">{s.sub}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CHAPTERS · 6 layers */}
      <section id="chapters" className="wrap reveal pb-24 scroll-mt-20">
        <SectionTitle
          eyebrow={t({ zh: '📑 Contents · 完整目录', en: '📑 Contents' })}
          title={
            lang === 'zh'
              ? <>六层金字塔<br />＋ 一条旁支</>
              : <>A six-layer stack<br />+ one side branch</>
          }
          sub={t({
            zh: '不是按顺序读的教程。如果你是 PM / 创业者，建议从 L6 + L4 看起，再往下补。',
            en: 'Not a linear textbook. If you\'re a PM or founder, start at L6 + L4 and backfill from there.',
          })}
        />
        <div className="space-y-4">
          {CHAPTERS.map((c) => (
            <Link
              key={c.level}
              href={`/studio/${c.level}`}
              className="group flex items-stretch gap-6 rounded-2xl border border-hairline bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft md:p-8"
            >
              <div className="flex flex-col items-center justify-center gap-1 px-2">
                <span className="text-3xl md:text-4xl" aria-hidden="true">{c.glyph}</span>
                <span className="font-mono text-[11px] tracking-widest text-ink-3">{c.num}</span>
              </div>
              <div className="flex-1 border-l border-hairline pl-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-rounded text-2xl font-semibold">{lang === 'zh' ? c.name : c.nameEn}</h3>
                  <span className="text-xs text-ink-3">{lang === 'zh' ? c.era : c.eraEn}</span>
                </div>
                <p className="mt-2 text-sm text-ink-2 md:text-base">{lang === 'zh' ? c.tagline : c.taglineEn}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {(lang === 'zh' ? c.keys : c.keysEn).map((k) => (
                    <li key={k} className="rounded-full bg-paper px-2.5 py-1 text-[12px] text-ink-2">
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center pl-2 text-ink-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                →
              </div>
            </Link>
          ))}
        </div>

        {/* Aside */}
        <Link
          href="/studio/aside"
          className="mt-8 flex items-center gap-4 rounded-2xl border border-dashed border-ink-4 bg-paper p-6 transition-all duration-300 hover:border-ink-3"
        >
          <span className="text-3xl" aria-hidden="true">🎲</span>
          <div className="flex-1">
            <div className="eyebrow">{t({ zh: 'Aside · 旁支', en: 'Aside · side branch' })}</div>
            <div className="mt-1 text-base">
              {lang === 'zh' ? (
                <><strong>推荐系统</strong> — 小红书 For You / B站首页 / 小宇宙发现页全靠它，你天天打交道。</>
              ) : (
                <><strong>Recommender systems</strong> — Xiaohongshu For You, Bilibili home, Xiaoyuzhou discover all run on this. You&apos;re using it every day.</>
              )}
            </div>
          </div>
          <span aria-hidden="true" className="text-ink-4">→</span>
        </Link>
      </section>

      {/* READING ORDER */}
      <section className="wrap reveal pb-24">
        <SectionTitle
          eyebrow={t({ zh: '🧭 Reading Order · 阅读路线', en: '🧭 Reading Order' })}
          title={
            lang === 'zh'
              ? <>该怎么读？<br />这样读最快</>
              : <>How to read this?<br />The fastest path</>
          }
          sub={
            lang === 'zh' ? (
              <>不要从 L1 往上爬，<strong className="text-ink">太磨人</strong>。按"5 年 PM、计算机本科、自媒体"的画像，顺序应该是：</>
            ) : (
              <>Don&apos;t climb up from L1 — <strong className="text-ink">too painful</strong>. For a "5-yr PM, CS undergrad, creator" persona, the order is:</>
            )
          }
        />
        <ol className="space-y-3">
          {readingOrder.map((s) => (
            <li
              key={s.n}
              className={`flex items-center gap-5 rounded-xl border border-hairline bg-surface px-5 py-4 ${s.dim ? 'opacity-50' : ''}`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper font-mono text-sm font-bold">
                {s.n}
              </div>
              <div className="flex-1">
                <div className="font-medium">{s.t}</div>
                <div className="mt-0.5 text-sm text-ink-3">{s.why}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
