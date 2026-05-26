'use client';

import PageHeader from '@/components/page-header';
import { MANIFESTO } from '@/lib/content';
import { useLang } from '@/components/lang-context';

/**
 * /manifesto — 6 personal beliefs.
 */
export default function ManifestoPage() {
  const { lang, t } = useLang();
  return (
    <>
      <PageHeader
        eyebrow={lang === 'zh' ? '✊ Manifesto · 我的主张' : '✊ Manifesto · My Beliefs'}
        glyph="🌱"
        subOrbs={['🔥', '🌍']}
        title={
          lang === 'zh'
            ? '别被职场磨平 ——'
            : 'Don\'t let work flatten you ——'
        }
        titleSub={
          lang === 'zh'
            ? <em className="accent-display">向上长，无界长。</em>
            : <em className="accent-display">Grow up, no limits.</em>
        }
        lede={lang === 'zh' ? '别被职场磨平。向上长，无界长。' : "Don't get flattened. Grow up. No limits."}
      />

      <section className="wrap reveal pb-24">
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {MANIFESTO.map((m, i) => (
            <li
              key={m.num}
              className="reveal thiings-card flex items-start gap-5 p-7"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span aria-hidden="true" className="text-4xl" style={{ filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.10))' }}>
                {m.glyph}
              </span>
              <div className="flex-1">
                <div className="font-mono text-[11px] tracking-widest text-ink-3">{m.num}</div>
                <p className="mt-2 font-rounded text-lg font-semibold leading-relaxed md:text-xl">
                  {lang === 'zh' ? m.text : m.textEn}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap-narrow reveal pb-24">
        <div className="rounded-3xl border border-hairline bg-surface p-10 text-center">
          <div className="text-4xl" aria-hidden="true">☕</div>
          <p className="mt-6 font-rounded text-2xl italic">&ldquo;I&apos;ll be there for you.&rdquo;</p>
          <p className="mt-4 text-sm text-ink-3">
            {t({
              zh: '想一起搞点事——推荐嘉宾、毛遂自荐、投稿、合作、社群共建。别害羞，把信发过来。',
              en: "Want to make something together — suggest a guest, pitch yourself, submit work, collab, or co-build the community. Don't be shy, send a note.",
            })}
          </p>
          <a
            href="mailto:yutingliu1996@gmail.com?subject=Hi%20Claire"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-surface transition-transform duration-300 hover:-translate-y-0.5"
          >
            {t({ zh: '☕ 来我的小客厅坐坐', en: '☕ Come sit in my parlor' })} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </>
  );
}
