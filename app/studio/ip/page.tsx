import Link from 'next/link';
import PageHeader from '@/components/page-header';
import SectionTitle from '@/components/section-title';
import { MASCOTS, MERCH, PROMPTS } from '@/lib/content';
import CopyPromptButton from './copy-button';

/**
 * /studio/ip — IP 化妆间
 * 玉婷 × 铜板儿 mascot system: roles · signature scene · personality cards · merch · AI prompts.
 */
export default function StudioIPPage() {
  return (
    <>
      <PageHeader
        eyebrow="🎨 STUDIO · IP"
        glyph="🎭"
        subOrbs={['🐱', '🎹']}
        halo="cream"
        title={
          <>
            玉婷 <span className="accent">×</span> 铜板儿
            <br />
            <span className="title-sub">= 本期主理人</span>
          </>
        }
        lede={
          <>
            这一页是 <strong className="text-ink">STUDIO 的 IP 化妆间</strong>——
            把你和铜板儿做成一对 mascot，配色、性格、招牌动作、周边样图 + AI 生成 prompt 都在这里。
            Phoebe 唱 Smelly Cat，你弹钢琴 + 铜板儿踩键。<em>就是这个画面。</em>
          </>
        }
      />

      {/* TWO ROLES */}
      <section className="wrap reveal pb-20">
        <SectionTitle
          eyebrow="👋 Meet the hosts · 主理人 + 联合主理人"
          title={<>两个角色<br />一对搭子</>}
          sub="V0.1 · 你定稿后我再细化。"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {MASCOTS.map((m) => (
            <article
              key={m.role}
              className="thiings-card overflow-hidden p-8 md:p-10"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-3">
                  {m.roleLabel}
                </span>
              </div>
              <div className="mt-8 flex h-40 items-center justify-center">
                <span className="thiings-object-xl float-y" aria-hidden="true">
                  {m.glyph}
                </span>
              </div>
              <h3 className="mt-8 font-rounded text-3xl font-semibold tracking-tight">{m.name}</h3>
              <p className="mt-4 font-serif text-lg italic text-ink-2">{m.quote}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {m.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-hairline bg-paper px-3 py-1 text-xs text-ink-2"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* SIGNATURE SCENE */}
      <section className="reveal">
        <div className="paper-grain bg-cream/35 py-20 md:py-28">
          <div className="wrap-wide">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="eyebrow">🎹 The signature scene · 写好的剧本</div>
                <h2 className="mt-3 max-w-2xl text-display-md font-semibold">
                  玉婷弹琴<br />
                  <span className="text-ink-3">·</span> 铜板儿踩键
                </h2>
              </div>
              <p className="max-w-md text-sm text-ink-2 md:text-base">
                Phoebe 弹吉他唱 Smelly Cat，你弹钢琴 + 铜板儿踩键 ——
                这个画面会成为<strong className="text-ink">播客封面、贴纸、毛绒玩具姿势、社群头像</strong>的统一视觉锚点。
              </p>
            </div>

            <div className="thiings-card relative aspect-[16/8] bg-gradient-to-br from-cream/60 via-peach/30 to-sky2/30 paper-grain p-12">
              <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-3">
                YAMAHA ♪ ♫ ♩ ♪ ♫ ♪
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-8">
                <span className="thiings-object-xl float-y" aria-hidden="true">
                  👩‍🎤
                </span>
                <span
                  className="thiings-object-xl"
                  style={{ fontSize: 'clamp(80px, 10vw, 140px)' }}
                  aria-hidden="true"
                >
                  🎹
                </span>
                <span className="thiings-object-xl float-tilt" aria-hidden="true">
                  🐱
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONALITY CARDS */}
      <section className="wrap reveal py-24 md:py-32">
        <SectionTitle
          eyebrow="🎭 Personality · 性格设定"
          title={<>两个人的<br />性格说明书</>}
          sub="这是文案库 · 后续脚本 / 字幕 / 标语都从这调用。"
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {MASCOTS.map((m) => (
            <article
              key={m.role}
              className="rounded-3xl border border-hairline bg-surface p-8 md:p-10"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {m.glyph}
                </span>
                <div>
                  <div className="font-rounded text-2xl font-semibold">{m.name.split(' · ')[0]}</div>
                  <div className="text-xs uppercase tracking-eyebrow text-ink-3">
                    {m.role === 'host' ? '主理人 · THE HOST' : '联合主理人 · THE CO-HOST'}
                  </div>
                </div>
              </div>
              <ul className="mt-6 space-y-4">
                {m.personality.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 text-xl shrink-0" aria-hidden="true">
                      {p.emoji}
                    </span>
                    <span className="text-base leading-relaxed text-ink-2">{p.text}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* MERCH MOCKUPS */}
      <section className="reveal">
        <div className="bg-paper py-24 md:py-32">
          <div className="wrap-wide">
            <SectionTitle
              eyebrow="🎁 Merch mockups · 周边样图"
              title={<>周边长这样<br />（先看 6 个）</>}
              sub="CSS 画的概念图 · 真实样品要去工厂打样。"
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {MERCH.map((m, i) => (
                <article
                  key={m.name}
                  className="thiings-card overflow-hidden p-7"
                  style={{
                    animation: `float-y ${5 + (i % 3)}s ease-in-out ${i * 0.18}s infinite`,
                  }}
                >
                  <div className="flex h-32 items-center justify-center">
                    <span className="thiings-object" style={{ fontSize: 84 }} aria-hidden="true">
                      {m.glyph}
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-rounded text-xl font-semibold tracking-tight">{m.name}</h3>
                    <div className="mt-1 text-xs uppercase tracking-eyebrow text-ink-3">{m.sub}</div>
                    <p className="mt-4 text-sm text-ink-2">{m.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI PROMPTS */}
      <section className="reveal">
        <div className="paper-grain bg-ink py-24 text-surface md:py-32">
          <div className="wrap-wide">
            <div className="mb-12">
              <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-4">
                🤖 AI Prompt Library · 真图生成器
              </div>
              <h2 className="mt-3 max-w-2xl text-display-md font-semibold leading-tight">
                CSS 画到这里<br />
                <span className="accent-display on-dark">真实图找 AI</span>
              </h2>
              <p className="mt-4 max-w-prose text-sm text-ink-4 md:text-base">
                Midjourney · Sora · DALL-E · Recraft · Ideogram 通用。上面的 CSS mockup 是概念稿——
                拿去找毛绒厂、贴纸厂打样还不够。下面 6 段 prompt 直接复制到 Midjourney / Sora 里，
                会生成<strong className="text-surface">高分辨率、可印刷、可打样</strong>的真实图。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {PROMPTS.map((p) => (
                <article
                  key={p.n}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">
                        {p.glyph}
                      </span>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-4">
                          PROMPT · {p.n}
                        </div>
                        <h3 className="mt-1 font-rounded text-base font-semibold">{p.name}</h3>
                      </div>
                    </div>
                    <CopyPromptButton text={p.text} />
                  </div>
                  <p className="mt-5 max-h-32 overflow-y-auto rounded-xl bg-black/30 p-4 font-mono text-[12px] leading-relaxed text-ink-4">
                    {p.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wrap reveal py-16">
        <Link href="/studio" className="text-sm text-ink-3 hover:text-ink">
          ← 回工作台
        </Link>
      </section>
    </>
  );
}
