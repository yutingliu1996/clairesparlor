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
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggle: toggleLang } = useLang();

  // scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

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
  const menuLabel = lang === 'zh' ? '打开导航菜单' : 'Open navigation menu';
  const closeMenuLabel = lang === 'zh' ? '关闭导航菜单' : 'Close navigation menu';

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        mobileOpen
          ? 'bg-transparent'
          : scrolled
          ? 'bg-paper/75 backdrop-blur-xl shadow-[0_6px_28px_-18px_rgba(0,0,0,0.18)] dark:bg-[#0a0a0a]/75 dark:shadow-[0_6px_28px_-18px_rgba(0,0,0,0.6)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="relative z-10 mx-auto flex h-16 w-full max-w-page items-center justify-between gap-3 px-4 sm:px-6 md:px-10">
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

        <ul className="hidden min-w-0 items-center gap-0 sm:flex md:gap-1">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative inline-block whitespace-nowrap rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-all duration-300 ${
                    active
                      ? 'bg-ink/[0.07] text-ink dark:bg-white/[0.10]'
                      : 'text-ink-2 hover:bg-ink/[0.04] hover:text-ink dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {lang === 'zh' ? link.zh : link.en}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          {/* LANG TOGGLE — 单按钮显当前可切到的目标 */}
          <button
            type="button"
            onClick={toggleLang}
            aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
            className="inline-flex h-8 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface/70 text-[11px] font-semibold tracking-wider text-ink-2 backdrop-blur-sm transition-colors hover:bg-ink/[0.05] hover:text-ink dark:bg-white/[0.06] dark:hover:bg-white/[0.12]"
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
            className="inline-flex h-8 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface/70 text-[13px] backdrop-blur-sm transition-colors hover:bg-ink/[0.05] dark:bg-white/[0.06] dark:hover:bg-white/[0.12]"
          >
            {MODE_ICON[mode]}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? closeMenuLabel : menuLabel}
            aria-controls="mobile-nav-menu"
            aria-expanded={mobileOpen}
            className="inline-flex h-8 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface/70 text-ink-2 backdrop-blur-sm transition-colors hover:bg-ink/[0.05] hover:text-ink dark:bg-white/[0.06] dark:hover:bg-white/[0.12] sm:hidden"
          >
            <span className="sr-only">{mobileOpen ? closeMenuLabel : menuLabel}</span>
            <span className="relative h-3.5 w-4" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ${
                  mobileOpen ? 'translate-y-[6px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[6px] h-0.5 w-4 rounded-full bg-current transition-opacity duration-300 ${
                  mobileOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 top-3 h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ${
                  mobileOpen ? '-translate-y-[6px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav-menu"
        aria-hidden={!mobileOpen}
        className={`absolute left-2 right-2 top-2 z-0 transition-[opacity,transform] duration-300 sm:hidden ${
          mobileOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <ul
          className={`grid w-full grid-cols-2 gap-1.5 overflow-hidden rounded-[24px] bg-surface/90 shadow-[0_18px_36px_-22px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-[max-height,padding] duration-300 dark:bg-white/[0.08] dark:shadow-[0_18px_36px_-22px_rgba(0,0,0,0.7)] ${
            mobileOpen ? 'max-h-[min(74vh,520px)] px-2 pb-2 pt-16' : 'max-h-0 px-0 pb-0 pt-16'
          }`}
        >
          {links.map((link) => {
            const active =
              pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  tabIndex={mobileOpen ? undefined : -1}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-2xl px-4 py-3 text-[14px] font-medium transition-colors ${
                    active
                      ? 'bg-ink/[0.07] text-ink dark:bg-white/[0.12]'
                      : 'text-ink-2 hover:bg-surface hover:text-ink dark:hover:bg-white/[0.12]'
                  }`}
                >
                  {lang === 'zh' ? link.zh : link.en}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
