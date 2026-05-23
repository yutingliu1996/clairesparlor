import PageHeader from '@/components/page-header';
import SectionTitle from '@/components/section-title';
import { GUESTS, HANGOUTS, PLATFORMS } from '@/lib/content';

/**
 * /parlor — Meet the world.
 * Three blocks: guests · hangouts · find me.
 */
export default function ParlorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Room · 01"
        glyph="🛋️"
        subOrbs={['🎙️', '☕']}
        halo="peach"
        title={<>会客厅。<br /><span className="title-sub">跟世界打交道的地方。</span></>}
        lede={
          <>
            听众变朋友、读者变共读者。这间客厅<strong className="text-ink">永远开着门</strong>——
            播客嘉宾在这录、社群在这聚、合作邀约在这接。
          </>
        }
      />

      {/* GUESTS */}
      <section className="wrap reveal pb-24">
        <SectionTitle
          eyebrow="🎙️ Guest Room · 嘉宾席"
          title={<>这间客厅<br />正在邀请 6 位</>}
          sub="每期播客一位嘉宾——AI Founder、Builder、投资人、咨询顾问、女性管理者、reader 朋友。这些卡片是占位，等真人来了就替换成她/他的脸。"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GUESTS.map((g) => (
            <article
              key={g.ep}
              className="thiings-card overflow-hidden p-7"
            >
              <div className="flex items-center justify-between">
                <span className="eyebrow">{g.ep}</span>
                <span className="rounded-full border border-hairline px-2 py-0.5 text-[11px] text-ink-3">
                  {g.role}
                </span>
              </div>
              <div className="mt-8 flex h-24 items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-paper text-3xl font-rounded font-semibold text-ink-3">
                  {g.role.charAt(0)}
                </div>
              </div>
              <p className="mt-6 text-base text-ink-2">{g.topic}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hairline bg-surface px-6 py-5">
          <div className="text-sm text-ink-2">
            想<strong className="text-ink">推荐嘉宾</strong>或<strong className="text-ink">毛遂自荐</strong>？
          </div>
          <a
            href="mailto:yutingliu1996@gmail.com?subject=推荐嘉宾"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink"
          >
            写信给我 <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* HANGOUTS */}
      <section className="wrap reveal pb-24">
        <SectionTitle
          eyebrow="🍵 Hangouts · 客厅小聚"
          title={<>不止听播客<br />来客厅小聚</>}
          sub="会客厅不是单向广播——是双向客厅。听友群、书友共读、答疑小屋，都在筹备中。"
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {HANGOUTS.map((h) => (
            <article key={h.name} className="thiings-card flex flex-col p-7">
              <div className="flex items-center justify-between">
                <span className="thiings-object" style={{ fontSize: 56 }} aria-hidden="true">
                  {h.glyph}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] ${h.tag === '免费' ? 'bg-sage text-ink-2' : 'bg-accent-soft text-accent-deep'}`}>
                  {h.tag}
                </span>
              </div>
              <h3 className="mt-8 font-rounded text-2xl font-semibold">{h.name}</h3>
              <div className="text-sm text-ink-3">{h.en}</div>
              <p className="mt-4 flex-1 text-sm text-ink-2">{h.pitch}</p>
              <ul className="mt-5 flex flex-wrap gap-2 text-[12px] text-ink-3">
                {h.meta.map((m) => (
                  <li key={m} className="rounded-full bg-paper px-2.5 py-1">
                    {m}
                  </li>
                ))}
              </ul>
              <a
                href={h.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink"
              >
                候补登记 <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* FIND ME */}
      <section className="wrap reveal pb-24">
        <SectionTitle
          eyebrow="🤝 Find me · 在哪里找我"
          title={<>想聊聊？<br />来这些地方找我</>}
          sub="海外平台 handle 已锁 @clairesparlor。反馈、合作、闲聊、骂我都可以——哪个平台舒服哪个来。"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORMS.map((p) => (
            <a
              key={p.key}
              href={p.href}
              target={p.href.startsWith('http') ? '_blank' : undefined}
              rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-4 rounded-2xl border border-hairline bg-surface px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-paper text-2xl"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.06))' }}
              >
                {p.glyph}
              </span>
              <div className="min-w-0">
                <div className="font-rounded text-[15px] font-semibold leading-tight">
                  {p.zh} <span className="text-ink-3">· {p.en}</span>
                </div>
                <div className="mt-1 truncate text-xs text-ink-3">{p.handle}</div>
              </div>
              <span aria-hidden="true" className="ml-auto text-ink-4 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
