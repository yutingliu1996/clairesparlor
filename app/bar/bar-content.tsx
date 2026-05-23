'use client';

import BarForm from './bar-form';
import { useLang } from '@/components/lang-context';

export default function BarContent() {
  const { lang, t } = useLang();
  return (
    <section className="wrap-narrow pt-32 pb-32 md:pt-44">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-accent-deep font-bold">
        MEMBERS ONLY
      </div>
      <h1 className="mt-4 max-w-2xl text-display-lg font-semibold tracking-tight">
        {lang === 'zh' ? (
          <>来 <span className="accent-display">吧台</span> 坐坐</>
        ) : (
          <>Pull up to the <span className="accent-display">bar</span></>
        )}
      </h1>
      <p className="mt-6 max-w-prose text-lg text-ink-2 md:text-xl">
        {t({
          zh: '想法随手扔进来，吧台在合适的时候递一张给你做。',
          en: 'Drop ideas in as they hit. The bar slides one back to you when the moment is right.',
        })}
      </p>

      <div className="mt-12 thiings-card paper-grain bg-gradient-to-br from-cream/60 via-surface to-sky2/30 p-8 md:p-12">
        <div className="flex items-center gap-3">
          <span className="thiings-object" style={{ fontSize: 56 }} aria-hidden="true">
            🍸
          </span>
          <div>
            <div className="eyebrow">
              {t({ zh: '用邮箱进入', en: 'Sign in with email' })}
            </div>
            <h2 className="mt-1 font-rounded text-2xl font-semibold">
              {t({
                zh: '仅 Claire 与受邀团队可用',
                en: 'Claire & invited collaborators only',
              })}
            </h2>
          </div>
        </div>
        <p className="mt-6 text-sm text-ink-2 md:text-base">
          {lang === 'zh' ? (
            <>我们会发一条<strong className="text-ink">一次性登录链接</strong>到你的邮箱。</>
          ) : (
            <>We&apos;ll email you a <strong className="text-ink">one-time login link</strong>.</>
          )}
        </p>

        <BarForm />
      </div>

      <p className="mt-10 text-xs text-ink-3">
        {lang === 'zh' ? (
          <>非邀请用户请先回到 <a href="/" className="quiet-link underline">Parlor 主页</a>。</>
        ) : (
          <>Not on the invite list? Head back to the <a href="/" className="quiet-link underline">Parlor home</a>.</>
        )}
      </p>
    </section>
  );
}
