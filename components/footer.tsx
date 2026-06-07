'use client';

import Link from 'next/link';
import { useLang } from './lang-context';

const REPO_URL = 'https://github.com/yutingliu1996/clairesparlor';

type ColophonItem = {
  label: string;
  value: string;
  href?: string;
  ariaLabel?: string;
};

/**
 * Magazine-style colophon footer — keeps the "Vol.01" magazine moment
 * from the original site, but in a much quieter Apple-style block.
 */
export default function Footer() {
  const { lang, t } = useLang();
  const colophon: ColophonItem[] = lang === 'zh'
    ? [
        { label: 'Issue', value: 'Vol. 01 · 会客厅' },
        { label: 'Editor', value: '刘玉婷 · Claire' },
        { label: 'Published', value: '2026 · 05 · 15' },
        { label: 'Built with', value: 'Next.js · TypeScript' },
        {
          label: 'Source',
          value: 'GitHub 仓库 ↗',
          href: REPO_URL,
          ariaLabel: "打开 Claire's Parlor GitHub 仓库",
        },
        { label: 'Co-author', value: '我 + Claude' },
        { label: 'Next', value: '写着写着就有' },
      ]
    : [
        { label: 'Issue', value: 'Vol. 01 · The Parlor' },
        { label: 'Editor', value: 'Liu Yuting · Claire' },
        { label: 'Published', value: '2026 · 05 · 15' },
        { label: 'Built with', value: 'Next.js · TypeScript' },
        {
          label: 'Source',
          value: 'GitHub repo ↗',
          href: REPO_URL,
          ariaLabel: "Open Claire's Parlor GitHub repository",
        },
        { label: 'Co-author', value: 'Me + Claude' },
        { label: 'Next', value: "It'll write itself" },
      ];

  return (
    <footer className="mt-32 border-t border-hairline pb-20 pt-16">
      <div className="wrap grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr]">
        <div>
          <div className="eyebrow mb-3">§ Colophon</div>
          <div className="font-rounded text-[28px] font-semibold leading-tight">
            Claire&apos;s Parlor
            <br />
            <span className="text-ink-3">Vol. 01</span>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm md:grid-cols-3">
          {colophon.map((item) => (
            <div key={item.label}>
              <dt className="eyebrow mb-1">{item.label}</dt>
              <dd className="text-ink-2">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.ariaLabel}
                    className="quiet-link"
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="wrap mt-16 flex flex-col items-start justify-between gap-4 text-sm text-ink-3 md:flex-row md:items-center">
        <p className="max-w-prose">
          {lang === 'zh' ? (
            <>☕ <em>Central Perk · 玉婷的小客厅</em> — I&apos;ll be there for you, when the rain starts to pour.</>
          ) : (
            <>☕ <em>Central Perk · Yuting&apos;s little parlor</em> — I&apos;ll be there for you, when the rain starts to pour.</>
          )}
        </p>
        <Link href="/" className="quiet-link">
          {t({ zh: '回开头 ↑', en: 'Back to top ↑' })}
        </Link>
      </div>
    </footer>
  );
}
