'use client';

import Link from 'next/link';
import PageHeader from '@/components/page-header';
import SectionTitle from '@/components/section-title';
import { WORKSHOP_TRACKS, CHAPTERS } from '@/lib/content';
import { useLang } from '@/components/lang-context';

/**
 * /workshop — Teach a hand.
 * Three tracks · Sessions · Prerequisites.
 */
export default function WorkshopPage() {
  const { lang } = useLang();
  return (
    <>
      <PageHeader
        eyebrow="Room · 03"
        glyph="🪄"
        subOrbs={['⚡', '🚀']}
        halo="sage"
        title={
          lang === 'zh'
            ? <>来工坊<br /><span className="title-sub">学一手。</span></>
            : <>The Workshop.<br /><span className="title-sub">Learn a craft.</span></>
        }
        lede={
          lang === 'zh' ? (
            <>
              <strong className="text-ink">能写出来 ≠ 真的会教</strong>。
              把这些年趟过的坑分三条线——自媒体起号 / AI 创业 / 黑客松——你选自己想走的那条。
              优秀的可签 MCN，可拿投资。
            </>
          ) : (
            <>
              <strong className="text-ink">Writing it ≠ teaching it</strong>.
              I split the lessons I&apos;ve learned into three tracks — creator launch / AI startup / hackathon — pick the one for you.
              Top picks can get MCN signing or investor intros.
            </>
          )
        }
      />

      {/* TRACKS */}
      <section className="wrap reveal pb-20">
        <SectionTitle
          eyebrow="🛠️ Tracks · 三个方向"
          title={<>三条线<br />各自带着漏斗</>}
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {WORKSHOP_TRACKS.map((t) => (
            <article key={t.direction} className="thiings-card flex flex-col p-7">
              <span className="thiings-object" style={{ fontSize: 64 }} aria-hidden="true">
                {t.glyph}
              </span>
              <div className="mt-6 text-[11px] uppercase tracking-eyebrow text-ink-3">{t.eyebrow}</div>
              <h3 className="mt-2 font-rounded text-2xl font-semibold leading-tight">{t.title}</h3>
              <p className="mt-4 flex-1 text-sm text-ink-2">{t.desc}</p>
              <a
                href={t.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink"
              >
                {t.cta} <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* SESSIONS */}
      <section className="wrap reveal pb-20">
        <SectionTitle
          eyebrow="📅 Sessions · 已开场次"
          title="正在开放的场次"
          sub="不是先到先得，是配对最好——写信告诉我你做什么、为什么想来、想带走什么。"
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              status: '报名中',
              statusTone: 'bg-accent-soft text-accent-deep',
              date: '主题待定',
              name: '首场 · 给内容创作者的工作坊',
              who: '内容创作者 · 想做播客的人 · 想用 AI 但不知道从哪开始',
              meta: ['📍 上海', '⏱️ 1 天', '👥 8-12 人', '💸 待定'],
              href: 'mailto:yutingliu1996@gmail.com?subject=工作坊报名',
              cta: '写信报名',
            },
            {
              status: '即将开放',
              statusTone: 'bg-sky2 text-ink-2',
              date: '主题待定',
              name: '第二场 · 主题更新中',
              who: '先收意向——告诉我你最想学什么',
              meta: ['📍 上海', '⏱️ 半日 / 整日', '👥 ≤ 12'],
              href: 'mailto:yutingliu1996@gmail.com?subject=工作坊意向',
              cta: '投我一票',
            },
            {
              status: 'TBA',
              statusTone: 'bg-paper text-ink-3',
              date: '你的城市？',
              name: '下一站 · Anywhere',
              who: '你所在的城市如果有 5+ 人想见，告诉我，我们安排',
              meta: ['🌏 全国', '🎯 攒局制', '📨 自荐'],
              href: 'mailto:yutingliu1996@gmail.com?subject=工作坊到我的城市',
              cta: '毛遂自荐',
            },
          ].map((s) => (
            <article key={s.name} className="rounded-2xl border border-hairline bg-surface p-7">
              <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${s.statusTone}`}>
                {s.status}
              </span>
              <div className="mt-5 font-mono text-xs text-ink-3">{s.date}</div>
              <h3 className="mt-2 font-rounded text-xl font-semibold leading-snug">{s.name}</h3>
              <p className="mt-3 text-sm text-ink-2">{s.who}</p>
              <ul className="mt-5 flex flex-wrap gap-2 text-[12px] text-ink-3">
                {s.meta.map((m) => (
                  <li key={m} className="rounded-full bg-paper px-2.5 py-1">
                    {m}
                  </li>
                ))}
              </ul>
              <a
                href={s.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink"
              >
                {s.cta} <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* PREREQUISITES — links to studio chapters, no duplication */}
      <section className="wrap reveal pb-24">
        <SectionTitle
          eyebrow="📚 Prerequisites · 学员预习"
          title={<>来之前<br />先翻翻这 6 章</>}
          sub={<>工作坊不讲名词解释——但要保证大家在<strong className="text-ink">同一个水位</strong>。来之前请把 L4 + L5 + L6 至少看一遍。</>}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CHAPTERS.map((c) => (
            <Link
              key={c.level}
              href={`/studio/${c.level}`}
              className="group flex flex-col items-center rounded-2xl border border-hairline bg-surface px-4 py-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="text-3xl" aria-hidden="true">{c.glyph}</span>
              <div className="mt-3 font-mono text-[11px] tracking-widest text-ink-3">{c.num}</div>
              <div className="mt-1 text-sm font-medium leading-tight">{c.name}</div>
              <span className="mt-3 text-xs text-ink-3 transition-transform duration-300 group-hover:translate-x-1">推门进 →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* MOMENTS placeholder */}
      <section className="wrap reveal pb-24">
        <SectionTitle
          eyebrow="📸 Moments · 现场"
          title="线下是真的会见面"
          sub="首场还没开——这墙先空着。第一期结束就把现场照片、白板涂鸦、合影全摊上来。不修图、不摆拍，就是那个味道。"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {['📸 第一场<br/>等你来', '🪧 现场<br/>白板', '☕ 歇脚<br/>咖啡', '🎤 圆桌<br/>讨论', '📝 大家的<br/>笔记', '📷 大合影'].map((m, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-ink-4 bg-paper text-center text-xs leading-relaxed text-ink-3"
              dangerouslySetInnerHTML={{ __html: m }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
