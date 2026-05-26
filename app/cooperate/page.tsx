'use client';

import PageHeader from '@/components/page-header';
import SectionTitle from '@/components/section-title';
import WechatQrModal from '@/components/wechat-qr-modal';
import { useLang } from '@/components/lang-context';

/**
 * /cooperate — Clients & investors.
 */
export default function CooperatePage() {
  const { lang, t } = useLang();
  return (
    <>
      <PageHeader
        eyebrow="Room · 04"
        glyph="🤝"
        subOrbs={['💼', '✉️']}
        title={
          lang === 'zh'
            ? '客户 / 投资人。'
            : 'Clients / Investors.'
        }
        titleSub={
          lang === 'zh'
            ? <span className="title-sub italic">金主爸爸。</span>
            : <span className="title-sub italic">Show me the money.</span>
        }
        lede={
          lang === 'zh' ? (
            <>
              想跟我做点事——<strong className="text-ink">内容定制 / 品牌合作 / KOL 投放 / AI 咨询</strong>，
              或者你是<strong className="text-ink"> 投资人 / 金主</strong>，想跟我们一起孵化 AI 项目——
              直接联系，国内外都可以。
            </>
          ) : (
            <>
              Want to make something together — <strong className="text-ink">content commissions / brand collabs / KOL placements / AI consulting</strong>,
              or you&apos;re an <strong className="text-ink">investor / patron</strong> looking to incubate AI projects with us —
              reach out directly. Domestic or global, both work.
            </>
          )
        }
      />

      {/* DIRECT CONTACT */}
      <section className="wrap reveal pb-16">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <a
            href="mailto:yutingliu1996@gmail.com?subject=合作咨询"
            className="thiings-card group flex items-center gap-6 p-7"
          >
            <span className="thiings-object" style={{ fontSize: 60 }} aria-hidden="true">
              📩
            </span>
            <div>
              <div className="font-rounded text-xl font-semibold">
                {t({ zh: '邮箱（最稳）', en: 'Email (most reliable)' })}
              </div>
              <div className="mt-1 text-sm text-ink-3">yutingliu1996@gmail.com</div>
            </div>
            <span aria-hidden="true" className="ml-auto text-2xl text-ink-4 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
          <WechatQrModal />
        </div>
      </section>

      {/* AUDIENCE CARDS */}
      <section className="wrap reveal pb-24">
        <SectionTitle
          eyebrow={t({ zh: '👥 Two audiences', en: '👥 Two audiences' })}
          title={
            lang === 'zh'
              ? <>两类对象<br />两种节奏</>
              : <>Two audiences,<br />two paces</>
          }
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-hairline bg-surface p-8 md:p-10">
            <div className="eyebrow">
              {t({ zh: 'For Clients · 给品牌方 / 客户', en: 'For Clients · brands & customers' })}
            </div>
            <h3 className="mt-3 font-rounded text-2xl font-semibold">
              {t({ zh: '想跟我做内容', en: 'Make content with me' })}
            </h3>
            <ul className="mt-6 space-y-3 text-sm text-ink-2 md:text-base">
              {lang === 'zh' ? (
                <>
                  <li>📝 <strong className="text-ink">内容定制</strong>：播客 / 视频 / 图文 / 长文</li>
                  <li>📱 <strong className="text-ink">品牌 KOL 合作</strong>：小红书 + B 站 + 视频号 多平台</li>
                  <li>🧠 <strong className="text-ink">AI 解决方案咨询</strong>：基于 5 年 PM + AI 实战经验</li>
                  <li>🏢 <strong className="text-ink">企业内训定制</strong>：高管闭门 / 全员通识</li>
                </>
              ) : (
                <>
                  <li>📝 <strong className="text-ink">Custom content</strong>: podcasts, video, posts, longreads</li>
                  <li>📱 <strong className="text-ink">Brand KOL collabs</strong>: Xiaohongshu + Bilibili + WeChat Channels</li>
                  <li>🧠 <strong className="text-ink">AI solution consulting</strong>: backed by 5 years PM + AI in production</li>
                  <li>🏢 <strong className="text-ink">In-house training</strong>: exec closed-door or company-wide</li>
                </>
              )}
            </ul>
          </article>

          <article className="rounded-3xl border border-hairline bg-surface p-8 md:p-10">
            <div className="eyebrow">
              {t({ zh: 'For Investors · 给投资人 / 金主', en: 'For Investors · LPs & patrons' })}
            </div>
            <h3 className="mt-3 font-rounded text-2xl font-semibold">
              {t({ zh: '想孵化 AI 项目', en: 'Incubate AI projects' })}
            </h3>
            <ul className="mt-6 space-y-3 text-sm text-ink-2 md:text-base">
              {lang === 'zh' ? (
                <>
                  <li>💰 <strong className="text-ink">上游基金资金规模</strong>：~ 10 亿元</li>
                  <li>🎯 <strong className="text-ink">投资方向</strong>：AI 应用 / SaaS to B / 企业数字化转型</li>
                  <li>🚪 <strong className="text-ink">项目来源</strong>：Workshop · AI 创业方向 + 黑客松</li>
                  <li>👤 <strong className="text-ink">偏好背景</strong>：国央企 / B 端 PM 想 turn Founder</li>
                </>
              ) : (
                <>
                  <li>💰 <strong className="text-ink">Upstream fund size</strong>: ~1B RMB</li>
                  <li>🎯 <strong className="text-ink">Focus</strong>: AI apps / B2B SaaS / enterprise digitization</li>
                  <li>🚪 <strong className="text-ink">Deal flow</strong>: AI startup workshop + hackathons</li>
                  <li>👤 <strong className="text-ink">Founder fit</strong>: SOE / B2B PMs ready to flip founder</li>
                </>
              )}
            </ul>
          </article>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="wrap reveal pb-12">
        <div className="dark-shimmer rounded-3xl px-8 py-16 text-surface md:px-16 md:py-20">
          <div className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-eyebrow text-white/95">
            <span className="text-xl leading-none" aria-hidden="true">☕</span>
            <span>Central Perk</span>
          </div>
          <p className="mt-4 max-w-2xl font-rounded text-display-md font-semibold leading-tight">
            {lang === 'zh' ? (
              <>想一起<br />搞点事吗？</>
            ) : (
              <>Want to build<br />something together?</>
            )}
          </p>
          <p className="mt-6 max-w-prose text-base text-ink-5 md:text-lg">
            {lang === 'zh' ? (
              <>
                推荐嘉宾、毛遂自荐上播客、投稿、合作、社群共建——别害羞，把信发过来。
                <strong className="text-surface">这频道是共建的，不是我演你看。</strong>
              </>
            ) : (
              <>
                Suggest guests, pitch yourself for the show, submit work, collab, or co-build the community — don&apos;t be shy, send a note.
                <strong className="text-surface"> This channel is co-built, not a one-person show.</strong>
              </>
            )}
          </p>
          <a
            href="mailto:yutingliu1996@gmail.com?subject=Hi%20Claire"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5"
          >
            {t({ zh: '☕ 来我的小客厅坐坐', en: '☕ Come sit in my parlor' })} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </>
  );
}
