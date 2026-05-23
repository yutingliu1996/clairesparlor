'use client';

import Link from 'next/link';
import PageHeader from '@/components/page-header';
import SectionTitle from '@/components/section-title';
import { READING_BOOKS, FINISHED_BOOKS } from '@/lib/content';
import { useLang } from '@/components/lang-context';

/**
 * /studio/bookshelf — 书房 · From My WeRead
 */
export default function BookshelfPage() {
  const { lang, t } = useLang();

  const stats = lang === 'zh'
    ? [
        { n: '41', l: '书架在册' },
        { n: '6', l: '已读完' },
        { n: '35', l: '在读 / 待读' },
      ]
    : [
        { n: '41', l: 'On the shelf' },
        { n: '6', l: 'Finished' },
        { n: '35', l: 'Reading / queued' },
      ];

  const themes = lang === 'zh'
    ? ['📊 投资思想（Dalio · 段永平 · Munger）', '✍️ 内容创作 & IP', '🇨🇳 中国社会观察', '🪞 主体性 · 个人哲学', '🧠 认知 · 顶级表现', '📖 东方哲学 · 散文']
    : ['📊 Investing minds (Dalio · Duan Yongping · Munger)', '✍️ Content & personal IP', '🇨🇳 China up close', '🪞 Agency · personal philosophy', '🧠 Cognition · peak performance', '📖 Eastern philosophy · essays'];

  return (
    <>
      <PageHeader
        eyebrow={t({ zh: 'Studio · 书房', en: 'Studio · Bookshelf' })}
        glyph="📚"
        title={
          lang === 'zh'
            ? <>最近在啃<br />这些书</>
            : <>What I&apos;m<br />reading right now</>
        }
        lede={
          lang === 'zh' ? (
            <>
              我相信"<strong className="text-ink">你读什么，就成为什么</strong>"。所以把书架摊给你看——
              比"我推荐 100 本"更真实，这是我<em>正在</em>读的，不是装作读过的。
            </>
          ) : (
            <>
              I believe <strong className="text-ink">you become what you read</strong>. So the whole shelf is on display —
              more honest than a "100 books I recommend" list. This is what I&apos;m <em>actually</em> reading, not what I pretend to have read.
            </>
          )
        }
      />

      {/* STATS */}
      <section className="wrap reveal pb-12">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.l} className="rounded-2xl border border-hairline bg-surface px-6 py-8 text-center">
              <div className="font-rounded text-5xl font-semibold tracking-tight">{s.n}</div>
              <div className="mt-2 text-xs text-ink-3">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CURRENTLY READING */}
      <section className="wrap reveal pb-20">
        <SectionTitle
          eyebrow={t({ zh: '📖 Currently Reading · 最近在读', en: '📖 Currently Reading' })}
          title={t({ zh: '正在啃', en: 'Working through' })}
        />
        <BookGrid books={READING_BOOKS} lang={lang} />
      </section>

      {/* JUST FINISHED */}
      <section className="wrap reveal pb-20">
        <SectionTitle
          eyebrow={t({ zh: '✅ Just Finished · 最近读完', en: '✅ Just Finished' })}
          title={t({ zh: '刚翻完', en: 'Just closed' })}
        />
        <BookGrid books={FINISHED_BOOKS} lang={lang} dim />
      </section>

      {/* THEMES */}
      <section className="wrap reveal pb-24">
        <SectionTitle
          eyebrow={t({ zh: '🎯 Themes · 我在啃什么', en: '🎯 Themes' })}
          title={t({ zh: '围绕这些主题', en: 'Threads I keep pulling on' })}
        />
        <div className="flex flex-wrap gap-2">
          {themes.map((th) => (
            <span key={th} className="rounded-full border border-hairline bg-surface px-4 py-2 text-sm">
              {th}
            </span>
          ))}
        </div>

        <Link href="/studio" className="mt-12 inline-flex text-sm text-ink-3 hover:text-ink">
          {t({ zh: '← 回工作台', en: '← Back to Studio' })}
        </Link>
      </section>
    </>
  );
}

type BookItem = {
  cat: string;
  catEn: string;
  title: string;
  author: string;
  cover: string;
};

function BookGrid({ books, dim, lang }: { books: BookItem[]; dim?: boolean; lang: 'zh' | 'en' }) {
  return (
    <div className={`grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6 ${dim ? 'opacity-80' : ''}`}>
      {books.map((b) => (
        <article key={b.title} className="group">
          <div
            className="aspect-[2/3] w-full rounded-xl bg-paper shadow-soft transition-transform duration-300 group-hover:-translate-y-1"
            style={{ backgroundImage: `url(${b.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="mt-3">
            <div className="text-[11px] uppercase tracking-eyebrow text-ink-3">{lang === 'zh' ? b.cat : b.catEn}</div>
            <div className="mt-1 line-clamp-2 text-sm font-medium leading-snug">{b.title}</div>
            <div className="mt-1 text-xs text-ink-3">{b.author}</div>
          </div>
        </article>
      ))}
    </div>
  );
}
