import Link from 'next/link';
import PageHeader from '@/components/page-header';
import SectionTitle from '@/components/section-title';
import { READING_BOOKS, FINISHED_BOOKS } from '@/lib/content';

/**
 * /studio/bookshelf — 书房 · From My WeRead
 */
export default function BookshelfPage() {
  return (
    <>
      <PageHeader
        eyebrow="Studio · 书房"
        glyph="📚"
        title={<>最近在啃<br />这些书</>}
        lede={
          <>
            我相信"<strong className="text-ink">你读什么，就成为什么</strong>"。所以把书架摊给你看——
            比"我推荐 100 本"更真实，这是我<em>正在</em>读的，不是装作读过的。
          </>
        }
      />

      {/* STATS */}
      <section className="wrap reveal pb-12">
        <div className="grid grid-cols-3 gap-4">
          {[
            { n: '41', l: '书架在册' },
            { n: '6', l: '已读完' },
            { n: '35', l: '在读 / 待读' },
          ].map((s) => (
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
          eyebrow="📖 Currently Reading · 最近在读"
          title="正在啃"
        />
        <BookGrid books={READING_BOOKS} />
      </section>

      {/* JUST FINISHED */}
      <section className="wrap reveal pb-20">
        <SectionTitle
          eyebrow="✅ Just Finished · 最近读完"
          title="刚翻完"
        />
        <BookGrid books={FINISHED_BOOKS} dim />
      </section>

      {/* THEMES */}
      <section className="wrap reveal pb-24">
        <SectionTitle eyebrow="🎯 Themes · 我在啃什么" title="围绕这些主题" />
        <div className="flex flex-wrap gap-2">
          {['📊 投资思想（Dalio · 段永平 · Munger）', '✍️ 内容创作 & IP', '🇨🇳 中国社会观察', '🪞 主体性 · 个人哲学', '🧠 认知 · 顶级表现', '📖 东方哲学 · 散文'].map((t) => (
            <span key={t} className="rounded-full border border-hairline bg-surface px-4 py-2 text-sm">
              {t}
            </span>
          ))}
        </div>

        <Link href="/studio" className="mt-12 inline-flex text-sm text-ink-3 hover:text-ink">
          ← 回工作台
        </Link>
      </section>
    </>
  );
}

function BookGrid({ books, dim }: { books: typeof READING_BOOKS; dim?: boolean }) {
  return (
    <div className={`grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6 ${dim ? 'opacity-80' : ''}`}>
      {books.map((b) => (
        <article key={b.title} className="group">
          <div
            className="aspect-[2/3] w-full rounded-xl bg-paper shadow-soft transition-transform duration-300 group-hover:-translate-y-1"
            style={{ backgroundImage: `url(${b.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="mt-3">
            <div className="text-[11px] uppercase tracking-eyebrow text-ink-3">{b.cat}</div>
            <div className="mt-1 line-clamp-2 text-sm font-medium leading-snug">{b.title}</div>
            <div className="mt-1 text-xs text-ink-3">{b.author}</div>
          </div>
        </article>
      ))}
    </div>
  );
}
