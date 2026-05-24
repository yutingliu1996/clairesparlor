'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './logo';
import { useLang } from './lang-context';

/**
 * Top navigation — frosted-glass sticky bar.
 *
 * 2026-05-24 Claire 升级：
 *   • brand + 链接的中英文走 lang state（点击右上 CN/EN 按钮切换）
 *   • 加日间/夜间 toggle（🌙/☀️）
 *   • 两个 toggle 都是单按钮（只显当前可切到的目标）
 *   • 修翻译：工坊 → 工作坊
 */
const links = [
  { href: '/parlor', zh: '会客厅', en: 'Parlor' },
  { href: '/studio', zh: '工作台', en: 'Studio' },
  { href: '/workshop', zh: '工作坊', en: 'Workshop' },
  { href: '/cooperate', zh: '合作', en: 'Cooperate' },
  { href: '/manifesto', zh: '主张', en: 'Manifesto' },
];

type Mode = 'auto' | 'light' | 'dark';
type Resolved = 'light' | 'dark';

const MODE_ICON: Record<Mode, string> = {
  auto: '🌗',
  light: '☀️',
  dark: '🌙',
};
const MODE_LABEL_ZH: Record<Mode, string> = {
  auto: '跟随系统',
  light: '亮色模式',
  dark: '暗色模式',
};
const NEXT_LABEL_ZH: Record<Mode, string> = {
  auto: '点击切亮色',
  light: '点击切暗色',
  dark: '点击跟随系统',
};
const MODE_LABEL_EN: Record<Mode, string> = {
  auto: 'follows system',
  light: 'light mode',
  dark: 'dark mode',
};
const NEXT_LABEL_EN: Record<Mode, string> = {
  auto: 'click for light',
  light: 'click for dark',
  dark: 'click for auto',
};

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mode, setMode] = useState<Mode>('auto');
  const { lang, toggle: toggleLang } = useLang();

  // scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 1. Read saved mode once on mount (bootstrap script already painted
  //    the resolved theme; here we just sync React state with what the
  //    user previously chose).
  useEffect(() => {
    try {
      const v = window.localStorage.getItem('claire-theme');
      if (v === 'light' || v === 'dark') setMode(v);
      // anything else (null / 'auto' / unknown) → stay 'auto'
    } catch {
      /* ignore */
    }
  }, []);

  // 2. Apply mode + subscribe to OS changes when in auto. Re-runs when
  //    the user toggles, so the matchMedia listener is added/removed
  //    according to whether 'auto' is active.
  useEffect(() => {
    const apply = (m: Mode) => {
      const resolved: Resolved =
        m === 'auto'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : m;
      document.documentElement.setAttribute('data-theme', resolved);
    };
    apply(mode);

    if (mode !== 'auto') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply('auto');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mode]);

  // Cycle: auto → light → dark → auto.
  // 'auto' is encoded as "no localStorage entry", so picking auto removes the key.
  const cycleTheme = () => {
    const next: Mode = mode === 'auto' ? 'light' : mode === 'light' ? 'dark' : 'auto';
    setMode(next);
    try {
      if (next === 'auto') window.localStorage.removeItem('claire-theme');
      else window.localStorage.setItem('claire-theme', next);
    } catch {
      /* ignore */
    }
  };

  const brand = lang === 'zh' ? 'Claire 的会客厅' : "Claire's Parlor";

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-paper/75 backdrop-blur-xl shadow-[0_6px_28px_-18px_rgba(0,0,0,0.18)] dark:bg-[#0a0a0a]/75 dark:shadow-[0_6px_28px_-18px_rgba(0,0,0,0.6)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="wrap flex h-16 items-center justify-between gap-3">
        {/* BRAND — H5 只显 logo，桌面显 logo + 文字 */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 font-rounded text-[15px] font-semibold tracking-tight"
        >
          <span className="transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
            <Logo size={32} />
          </span>
          <span className="hidden sm:inline">{brand}</span>
        </Link>

        {/* LINKS + TOGGLES */}
        <div className="flex items-center gap-2 md:gap-3">
          <ul className="flex items-center gap-0 md:gap-1">
            {links.map((l) => {
              const active =
                pathname === l.href || pathname?.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`relative inline-block whitespace-nowrap rounded-full px-2 py-1.5 text-[12px] font-medium transition-all duration-300 sm:px-3.5 sm:text-[14px] ${
                      active
                        ? 'bg-ink/[0.07] text-ink dark:bg-white/[0.10]'
                        : 'text-ink-2 hover:bg-ink/[0.04] hover:text-ink dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    {lang === 'zh' ? l.zh : l.en}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* LANG TOGGLE — 单按钮显当前可切到的目标 */}
          <button
            type="button"
            onClick={toggleLang}
            aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
            className="inline-flex h-8 w-9 items-center justify-center rounded-full border border-hairline bg-surface/70 text-[11px] font-semibold tracking-wider text-ink-2 backdrop-blur-sm transition-colors hover:bg-ink/[0.05] hover:text-ink dark:bg-white/[0.06] dark:hover:bg-white/[0.12]"
          >
            {lang === 'zh' ? 'EN' : 'CN'}
          </button>

          {/* THEME TOGGLE — 3 态循环：跟随系统 → 亮色 → 暗色 → 跟随 */}
          <button
            type="button"
            onClick={cycleTheme}
            title={
              lang === 'zh'
                ? `当前${MODE_LABEL_ZH[mode]} · ${NEXT_LABEL_ZH[mode]}`
                : `Currently ${MODE_LABEL_EN[mode]} · ${NEXT_LABEL_EN[mode]}`
            }
            aria-label={
              lang === 'zh'
                ? `当前${MODE_LABEL_ZH[mode]}，${NEXT_LABEL_ZH[mode]}`
                : `Currently ${MODE_LABEL_EN[mode]}, ${NEXT_LABEL_EN[mode]}`
            }
            className="inline-flex h-8 w-9 items-center justify-center rounded-full border border-hairline bg-surface/70 text-[13px] backdrop-blur-sm transition-colors hover:bg-ink/[0.05] dark:bg-white/[0.06] dark:hover:bg-white/[0.12]"
          >
            {MODE_ICON[mode]}
          </button>
        </div>
      </nav>
    </header>
  );
}
