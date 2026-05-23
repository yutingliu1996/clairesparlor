'use client';

import { useLang } from './lang-context';

/**
 * Featured podcast card — embeds the latest episode from XiaoYuZhou,
 * styled as an Apple Music-like big media tile.
 */
export default function FeaturedPodcast() {
  const { lang, t } = useLang();
  return (
    <article className="thiings-card overflow-hidden p-0">
      <div className="grid grid-cols-1 gap-0 md:grid-cols-[1.1fr_1fr]">
        {/* Cover side */}
        <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-peach/60 via-cream/40 to-sky2/40 paper-grain md:aspect-auto">
          <div className="absolute left-5 top-5">
            <span className="pill pill-live text-[10px]">
              {t({ zh: '最新一期 · NEW', en: 'NEW · latest episode' })}
            </span>
          </div>
          <div className="thiings-object-xl float-tilt" aria-hidden="true">
            🪐
          </div>
          <div className="absolute bottom-5 left-5">
            <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-3">
              Claire&apos;s Parlor
            </div>
            <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-3">
              {t({
                zh: 'S01 · Vol.01 · 给内容创作者的 AI 全景框架',
                en: 'S01 · Vol.01 · An AI panorama for creators',
              })}
            </div>
          </div>
        </div>

        {/* Detail side */}
        <div className="flex flex-col justify-between p-7 md:p-10">
          <div>
            <div className="eyebrow">
              {t({ zh: '🎙️ Featured · 这期在播', en: '🎙️ Featured · now playing' })}
            </div>
            <h3 className="mt-3 font-rounded text-2xl font-semibold leading-tight md:text-3xl">
              {lang === 'zh' ? (
                <>一份永远在更新的<br /><span className="accent-display">AI 全景草稿</span></>
              ) : (
                <>A forever-updating<br /><span className="accent-display">AI panorama draft</span></>
              )}
            </h3>
            <p className="mt-4 text-sm text-ink-2 md:text-base">
              {t({
                zh: '不是按顺序读的教程——是边做内容创作边整理的私人 wiki。Transformer / Agent / RAG / MCP / Vibe Coding，回来速查就好。',
                en: 'Not a linear tutorial — a private wiki I keep while making content. Transformer / Agent / RAG / MCP / Vibe Coding, come back and look them up.',
              })}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {(lang === 'zh'
                ? ['6 层金字塔', '+ 1 条旁支', '15 分钟翻完']
                : ['6-layer stack', '+ 1 side branch', '15 min to flip through']
              ).map((k) => (
                <li
                  key={k}
                  className="rounded-full border border-hairline bg-paper px-2.5 py-1 text-[12px] text-ink-2"
                >
                  {k}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://www.xiaoyuzhoufm.com/podcast/69e4c6803a001fce5f9c48a2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-surface transition-transform duration-300 hover:-translate-y-0.5"
            >
              {t({ zh: '小宇宙收听', en: 'Listen on Xiaoyuzhou' })} <span aria-hidden="true">→</span>
            </a>
            <a
              href="/studio"
              className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-5 py-2.5 text-sm font-medium text-ink-2 transition-colors hover:text-ink"
            >
              {t({ zh: '翻笔记', en: 'Flip the notes' })}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
