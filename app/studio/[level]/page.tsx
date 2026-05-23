import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/page-header';
import { CHAPTERS, type Chapter } from '@/lib/content';

const ALL_SLUGS = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'aside'] as const;
type Slug = (typeof ALL_SLUGS)[number];

export function generateStaticParams() {
  return ALL_SLUGS.map((level) => ({ level }));
}

const HALO_BY_LEVEL: Record<string, 'peach' | 'sky' | 'sage' | 'cream'> = {
  l1: 'sky',
  l2: 'sage',
  l3: 'peach',
  l4: 'cream',
  l5: 'sage',
  l6: 'sky',
  aside: 'peach',
};

const SUB_ORBS_BY_LEVEL: Record<string, string[]> = {
  l1: ['📊', '📐'],
  l2: ['🌳', '📈'],
  l3: ['🖼️', '🎨'],
  l4: ['💬', '✨'],
  l5: ['📚', '🤖'],
  l6: ['💼', '💰'],
  aside: ['❄️', '🤝'],
};

const EPISODE_BY_LEVEL: Record<string, string> = {
  l1: 'S01·E01 · The One About 地基',
  l2: 'S01·E02 · The One About 经典 ML',
  l3: 'S01·E03 · The One About 神经网络',
  l4: 'S01·E04 · The One About 大模型',
  l5: 'S01·E05 · The One About 落地',
  l6: 'S01·E06 · The One About 卖钱',
  aside: 'S01 · BONUS · The One About 推荐算法',
};

const ASIDE_CHAPTER = {
  level: 'aside' as const,
  num: '§',
  name: '旁支 · 推荐系统',
  era: '不在主线 · 但你天天打交道',
  glyph: '🎲',
  tagline:
    '它不在主线上，但小红书 For You、B站首页、小宇宙发现页全靠它。技术上是 L2 + L3 的混搭，近年开始嵌 L4。',
  keys: ['推荐系统架构', '推荐算法', '冷启动', '协同过滤'],
  keywordGroups: [
    { emoji: '🏷️', label: '落在这层的词', tags: ['推荐系统架构', '推荐算法', '冷启动', '协同过滤'] },
  ],
  examples: [
    '冷启动：你新发的第一条笔记，平台不知道推给谁——这就是冷启动问题',
    '协同过滤：经典推荐算法的灵魂——"喜欢 A 的人也喜欢 B"',
  ],
  secondary: {
    label: '为什么单独列',
    text: '它不在主线上，但小红书 For You、B站首页、小宇宙发现页全靠它。',
  },
} satisfies Chapter;

export default function ChapterPage({ params }: { params: { level: string } }) {
  const slug = params.level as Slug;
  if (!ALL_SLUGS.includes(slug)) notFound();

  const ch: Chapter =
    slug === 'aside' ? ASIDE_CHAPTER : (CHAPTERS.find((c) => c.level === slug) as Chapter);

  // Prev / next within main chapters (top→bottom: L6 → L1, then aside)
  const idx = slug === 'aside' ? -1 : CHAPTERS.findIndex((c) => c.level === slug);
  const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
  const next = idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;

  return (
    <>
      <PageHeader
        eyebrow={EPISODE_BY_LEVEL[slug]}
        glyph={ch.glyph}
        subOrbs={SUB_ORBS_BY_LEVEL[slug]}
        halo={HALO_BY_LEVEL[slug]}
        title={
          <>
            {ch.name}
            <br />
            <span className="title-sub text-[0.62em] font-normal">{ch.era}</span>
          </>
        }
        lede={ch.tagline}
      />

      {/* Keyword groups — each section as a card */}
      <section className="wrap reveal pb-16">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {ch.keywordGroups.map((g, i) => (
            <article
              key={g.label}
              className="rounded-3xl border border-hairline bg-surface p-7 md:p-9"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {g.emoji}
                </span>
                <div className="text-[12px] uppercase tracking-eyebrow text-ink-3">{g.label}</div>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.tags.map((t) => (
                  <li
                    key={t}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      // First group typically holds the headline terms — bold them.
                      i === 0
                        ? 'bg-ink text-surface'
                        : 'border border-hairline bg-paper text-ink-2'
                    }`}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Secondary callout (e.g. L3 "和 L2 的区别") */}
      {ch.secondary && (
        <section className="wrap-narrow reveal pb-16">
          <div className="rounded-3xl border border-hairline bg-surface p-8 md:p-12">
            <div className="eyebrow">💡 {ch.secondary.label}</div>
            <p className="mt-5 font-rounded text-2xl font-medium leading-snug md:text-3xl">
              {ch.secondary.text}
            </p>
          </div>
        </section>
      )}

      {/* Examples · 对照你的工作 */}
      <section className="wrap-narrow reveal pb-16">
        <div className="eyebrow mb-6">💼 对照你的工作</div>
        <ul className="space-y-4">
          {ch.examples.map((ex, i) => (
            <li
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-hairline bg-surface p-5 md:p-6"
            >
              <span
                className="font-mono text-xs font-bold text-ink-3"
                style={{ minWidth: '2ch' }}
                aria-hidden="true"
              >
                →
              </span>
              <p
                className="text-base leading-relaxed text-ink-2 md:text-lg"
                dangerouslySetInnerHTML={{ __html: highlight(ex) }}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Prev / Next */}
      <section className="wrap-narrow reveal pb-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {prev ? (
            <Link
              href={`/studio/${prev.level}`}
              className="group flex flex-col rounded-2xl border border-hairline bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="eyebrow">← 上一章 · {prev.num}</span>
              <span className="mt-2 font-rounded text-lg font-semibold">{prev.name}</span>
            </Link>
          ) : (
            <Link
              href="/studio"
              className="group flex flex-col rounded-2xl border border-hairline bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="eyebrow">← 回工作台目录</span>
              <span className="mt-2 font-rounded text-lg font-semibold">六层金字塔</span>
            </Link>
          )}
          {next ? (
            <Link
              href={`/studio/${next.level}`}
              className="group flex flex-col items-end rounded-2xl border border-hairline bg-surface p-5 text-right transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="eyebrow">下一章 · {next.num} →</span>
              <span className="mt-2 font-rounded text-lg font-semibold">{next.name}</span>
            </Link>
          ) : (
            <Link
              href="/studio#chapters"
              className="group flex flex-col items-end rounded-2xl border border-hairline bg-surface p-5 text-right transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="eyebrow">阅读路线 →</span>
              <span className="mt-2 font-rounded text-lg font-semibold">该怎么读？</span>
            </Link>
          )}
        </div>

        <Link href="/studio" className="mt-10 inline-flex text-sm text-ink-3 hover:text-ink">
          ← 回工作台
        </Link>
      </section>
    </>
  );
}

/**
 * Bold quoted phrases — cheap inline highlight for the examples.
 */
function highlight(text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.replace(/("[^"]+"|"[^"]+")/g, '<strong class="text-ink">$1</strong>');
}
