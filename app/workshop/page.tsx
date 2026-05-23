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
  const { lang, t } = useLang();

  const sessions = lang === 'zh'
    ? [
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
      ]
    : [
        {
          status: 'Open',
          statusTone: 'bg-accent-soft text-accent-deep',
          date: 'Topic TBD',
          name: 'Session 01 · Workshop for creators',
          who: 'Creators · podcast-curious · want to use AI but unsure where to begin',
          meta: ['📍 Shanghai', '⏱️ 1 day', '👥 8–12 seats', '💸 TBD'],
          href: 'mailto:yutingliu1996@gmail.com?subject=工作坊报名',
          cta: 'Apply by email',
        },
        {
          status: 'Coming soon',
          statusTone: 'bg-sky2 text-ink-2',
          date: 'Topic TBD',
          name: 'Session 02 · Topic in the works',
          who: 'Tell me what you most want to learn so I can shape it.',
          meta: ['📍 Shanghai', '⏱️ Half / full day', '👥 ≤ 12'],
          href: 'mailto:yutingliu1996@gmail.com?subject=工作坊意向',
          cta: 'Cast a vote',
        },
        {
          status: 'TBA',
          statusTone: 'bg-paper text-ink-3',
          date: 'Your city?',
          name: 'Next stop · Anywhere',
          who: 'If 5+ people in your city want to meet, tell me and I\'ll set it up.',
          meta: ['🌏 Anywhere', '🎯 On-demand', '📨 Self-nominate'],
          href: 'mailto:yutingliu1996@gmail.com?subject=工作坊到我的城市',
          cta: 'Pitch your city',
        },
      ];

  const moments = lang === 'zh'
    ? ['📸 第一场<br/>等你来', '🪧 现场<br/>白板', '☕ 歇脚<br/>咖啡', '🎤 圆桌<br/>讨论', '📝 大家的<br/>笔记', '📷 大合影']
    : ['📸 First session<br/>see you there', '🪧 On-site<br/>whiteboard', '☕ Coffee<br/>break', '🎤 Round<br/>table', '📝 Everyone&apos;s<br/>notes', '📷 Group<br/>photo'];

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
          eyebrow={t({ zh: '🛠️ Tracks · 三个方向', en: '🛠️ Tracks' })}
          title={
            lang === 'zh'
              ? <>三条线<br />各自带着漏斗</>
              : <>Three tracks,<br />each with its own funnel</>
          }
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {WORKSHOP_TRACKS.map((tr) => (
            <article key={tr.direction} className="thiings-card flex flex-col p-7">
              <span className="thiings-object" style={{ fontSize: 64 }} aria-hidden="true">
                {tr.glyph}
              </span>
              <div className="mt-6 text-[11px] uppercase tracking-eyebrow text-ink-3">{lang === 'zh' ? tr.eyebrow : tr.eyebrowEn}</div>
              <h3 className="mt-2 font-rounded text-2xl font-semibold leading-tight">{lang === 'zh' ? tr.title : tr.titleEn}</h3>
              <p className="mt-4 flex-1 text-sm text-ink-2">{lang === 'zh' ? tr.desc : tr.descEn}</p>
              <a
                href={tr.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink"
              >
                {lang === 'zh' ? tr.cta : tr.ctaEn} <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* SESSIONS */}
      <section className="wrap reveal pb-20">
        <SectionTitle
          eyebrow={t({ zh: '📅 Sessions · 已开场次', en: '📅 Sessions' })}
          title={t({ zh: '正在开放的场次', en: 'Sessions taking sign-ups' })}
          sub={t({
            zh: '不是先到先得，是配对最好——写信告诉我你做什么、为什么想来、想带走什么。',
            en: 'Not first-come-first-served — best-fit wins. Write me what you do, why you want in, and what you want to leave with.',
          })}
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {sessions.map((s) => (
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
          eyebrow={t({ zh: '📚 Prerequisites · 学员预习', en: '📚 Prerequisites' })}
          title={
            lang === 'zh'
              ? <>来之前<br />先翻翻这 6 章</>
              : <>Before you come,<br />flip through these 6 chapters</>
          }
          sub={
            lang === 'zh' ? (
              <>工作坊不讲名词解释——但要保证大家在<strong className="text-ink">同一个水位</strong>。来之前请把 L4 + L5 + L6 至少看一遍。</>
            ) : (
              <>No glossary in the workshop — but everyone needs to be at <strong className="text-ink">the same water level</strong>. Read L4 + L5 + L6 at least once before you come.</>
            )
          }
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
              <div className="mt-1 text-sm font-medium leading-tight">{lang === 'zh' ? c.name : c.nameEn}</div>
              <span className="mt-3 text-xs text-ink-3 transition-transform duration-300 group-hover:translate-x-1">
                {t({ zh: '推门进 →', en: 'Open the door →' })}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* MOMENTS placeholder */}
      <section className="wrap reveal pb-24">
        <SectionTitle
          eyebrow={t({ zh: '📸 Moments · 现场', en: '📸 Moments' })}
          title={t({ zh: '线下是真的会见面', en: 'We really do meet in person' })}
          sub={t({
            zh: '首场还没开——这墙先空着。第一期结束就把现场照片、白板涂鸦、合影全摊上来。不修图、不摆拍，就是那个味道。',
            en: 'First session hasn\'t happened yet — wall stays empty for now. After it wraps, photos, whiteboard scribbles, group shots all go up. No retouching, no posing.',
          })}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {moments.map((m, i) => (
            <div
              key={i}
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-dashed border-ink-4 bg-paper text-center text-xs leading-relaxed text-ink-3"
            >
              {/* 2026-05-24 把 /public/moments/moment-1.jpg ~ moment-6.jpg 放进去就自动显示 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/moments/moment-${i + 1}.jpg`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.style.display = 'none';
                  const fb = img.nextElementSibling as HTMLElement | null;
                  if (fb) fb.style.display = 'flex';
                }}
              />
              <div
                className="relative hidden h-full w-full items-center justify-center"
                dangerouslySetInnerHTML={{ __html: m }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
