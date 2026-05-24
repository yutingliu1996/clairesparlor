'use client';

import Link from 'next/link';
import PageHeader from '@/components/page-header';
import type { Chapter } from '@/lib/content';
import { useLang } from '@/components/lang-context';

// Halo color is now driven by MainTheme based on path (/studio/lN);
// chapter-client only needs to choose sub-orb glyphs.

const SUB_ORBS_BY_LEVEL: Record<string, string[]> = {
  l1: ['📊', '📐'],
  l2: ['🌳', '📈'],
  l3: ['🖼️', '🎨'],
  l4: ['💬', '✨'],
  l5: ['📚', '🛠️'],
  l6: ['💼', '💰'],
  aside: ['❄️', '🤝'],
};

const EPISODE_BY_LEVEL_ZH: Record<string, string> = {
  l1: 'S01·E01 · The One About 地基',
  l2: 'S01·E02 · The One About 经典 ML',
  l3: 'S01·E03 · The One About 神经网络',
  l4: 'S01·E04 · The One About 大模型',
  l5: 'S01·E05 · The One About 落地',
  l6: 'S01·E06 · The One About 卖钱',
  aside: 'S01 · BONUS · The One About 推荐算法',
};

const EPISODE_BY_LEVEL_EN: Record<string, string> = {
  l1: 'S01·E01 · The One About the Foundation',
  l2: 'S01·E02 · The One About Classical ML',
  l3: 'S01·E03 · The One About Neural Nets',
  l4: 'S01·E04 · The One About LLMs',
  l5: 'S01·E05 · The One About Shipping',
  l6: 'S01·E06 · The One About Making Money',
  aside: 'S01 · BONUS · The One About Recommenders',
};

export default function ChapterClient({
  slug,
  ch,
  prev,
  next,
}: {
  slug: string;
  ch: Chapter;
  prev: Chapter | null;
  next: Chapter | null;
}) {
  const { lang, t } = useLang();
  const episode = lang === 'zh' ? EPISODE_BY_LEVEL_ZH[slug] : EPISODE_BY_LEVEL_EN[slug];

  return (
    <>
      <PageHeader
        eyebrow={episode}
        glyph={ch.glyph}
        subOrbs={SUB_ORBS_BY_LEVEL[slug]}
        title={
          <>
            {lang === 'zh' ? ch.name : ch.nameEn}
            <br />
            <span className="title-sub text-[0.62em] font-normal">{lang === 'zh' ? ch.era : ch.eraEn}</span>
          </>
        }
        lede={lang === 'zh' ? ch.tagline : ch.taglineEn}
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
                <div className="text-[12px] uppercase tracking-eyebrow text-ink-3">
                  {lang === 'zh' ? g.label : g.labelEn}
                </div>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {(lang === 'zh' ? g.tags : g.tagsEn).map((tag) => (
                  <li
                    key={tag}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      // First group typically holds the headline terms — bold them.
                      i === 0
                        ? 'bg-ink text-surface'
                        : 'border border-hairline bg-paper text-ink-2'
                    }`}
                  >
                    {tag}
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
            <div className="eyebrow">💡 {lang === 'zh' ? ch.secondary.label : ch.secondary.labelEn}</div>
            <p className="mt-5 font-rounded text-2xl font-medium leading-snug md:text-3xl">
              {lang === 'zh' ? ch.secondary.text : ch.secondary.textEn}
            </p>
          </div>
        </section>
      )}

      {/* Examples · 对照你的工作 */}
      <section className="wrap-narrow reveal pb-16">
        <div className="eyebrow mb-6">
          {t({ zh: '💼 对照你的工作', en: '💼 Map it to your work' })}
        </div>
        <ul className="space-y-4">
          {(lang === 'zh' ? ch.examples : ch.examplesEn).map((ex, i) => (
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
              <span className="eyebrow">
                {t({ zh: '← 上一章 · ', en: '← Previous · ' })}{prev.num}
              </span>
              <span className="mt-2 font-rounded text-lg font-semibold">
                {lang === 'zh' ? prev.name : prev.nameEn}
              </span>
            </Link>
          ) : (
            <Link
              href="/studio"
              className="group flex flex-col rounded-2xl border border-hairline bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="eyebrow">
                {t({ zh: '← 回工作台目录', en: '← Back to Studio contents' })}
              </span>
              <span className="mt-2 font-rounded text-lg font-semibold">
                {t({ zh: '六层金字塔', en: 'The six-layer stack' })}
              </span>
            </Link>
          )}
          {next ? (
            <Link
              href={`/studio/${next.level}`}
              className="group flex flex-col items-end rounded-2xl border border-hairline bg-surface p-5 text-right transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="eyebrow">
                {t({ zh: '下一章 · ', en: 'Next · ' })}{next.num} →
              </span>
              <span className="mt-2 font-rounded text-lg font-semibold">
                {lang === 'zh' ? next.name : next.nameEn}
              </span>
            </Link>
          ) : (
            <Link
              href="/studio#chapters"
              className="group flex flex-col items-end rounded-2xl border border-hairline bg-surface p-5 text-right transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="eyebrow">
                {t({ zh: '阅读路线 →', en: 'Reading order →' })}
              </span>
              <span className="mt-2 font-rounded text-lg font-semibold">
                {t({ zh: '该怎么读？', en: 'How to read this?' })}
              </span>
            </Link>
          )}
        </div>

        <Link href="/studio" className="mt-10 inline-flex text-sm text-ink-3 hover:text-ink">
          {t({ zh: '← 回工作台', en: '← Back to Studio' })}
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
