import BarForm from './bar-form';

export const metadata = {
  title: 'Idea Bar · Claire\'s Parlor',
};

/**
 * /bar — Members-only Idea Bar.
 * Magic-link email gate (UI only — backend wiring lives elsewhere).
 */
export default function BarPage() {
  return (
    <section className="wrap-narrow pt-32 pb-32 md:pt-44">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-accent-deep font-bold">
        MEMBERS ONLY
      </div>
      <h1 className="mt-4 max-w-2xl text-display-lg font-semibold tracking-tight">
        来 <span className="accent-display">吧台</span> 坐坐
      </h1>
      <p className="mt-6 max-w-prose text-lg text-ink-2 md:text-xl">
        想法随手扔进来，吧台在合适的时候递一张给你做。
      </p>

      <div className="mt-12 thiings-card paper-grain bg-gradient-to-br from-cream/60 via-surface to-sky2/30 p-8 md:p-12">
        <div className="flex items-center gap-3">
          <span className="thiings-object" style={{ fontSize: 56 }} aria-hidden="true">
            🍸
          </span>
          <div>
            <div className="eyebrow">用邮箱进入</div>
            <h2 className="mt-1 font-rounded text-2xl font-semibold">仅 Claire 与受邀团队可用</h2>
          </div>
        </div>
        <p className="mt-6 text-sm text-ink-2 md:text-base">
          我们会发一条<strong className="text-ink">一次性登录链接</strong>到你的邮箱。
        </p>

        <BarForm />
      </div>

      <p className="mt-10 text-xs text-ink-3">
        非邀请用户请先回到 <a href="/" className="quiet-link underline">Parlor 主页</a>。
      </p>
    </section>
  );
}
