'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './logo';

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

type Lang = 'zh' | 'en';
type Theme = 'light' | 'dark';

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<Lang>('zh');
  const [theme, setTheme] = useState<Theme>('light');

  // scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // hydrate lang + theme from localStorage
  useEffect(() => {
    try {
      const savedLang = window.localStorage.getItem('claire-lang');
      if (savedLang === 'zh' || savedLang === 'en') setLang(savedLang);
      const savedTheme = window.localStorage.getItem('claire-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === 'zh' ? 'en' : 'zh';
    setLang(next);
    try {
      window.localStorage.setItem('claire-lang', next);
    } catch {}
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  };

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      window.localStorage.setItem('claire-theme', next);
    } catch {}
    document.documentElement.setAttribute('data-theme', next);
  };

  const brand = lang === 'zh' ? 'Claire 的会客厅' : "Claire's Parlor";

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-paper/75 backdrop-blur-xl shadow-[0_6px_28px_-18px_rgba(0,0,0,0.18)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="wrap flex h-16 items-center justify-between gap-3">
        {/* BRAND */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-rounded text-[15px] font-semibold tracking-tight"
        >
          <span className="transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
            <Logo size={32} />
          </span>
          <span>{brand}</span>
        </Link>

        {/* LINKS + TOGGLES */}
        <div className="flex items-center gap-2 md:gap-3">
          <ul className="flex items-center gap-0.5 md:gap-1">
            {links.map((l) => {
              const active =
                pathname === l.href || pathname?.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`relative inline-block rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-all duration-300 ${
                      active
                        ? 'bg-ink/[0.07] text-ink'
                        : 'text-ink-2 hover:bg-ink/[0.04] hover:text-ink'
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
            className="inline-flex h-8 w-9 items-center justify-center rounded-full border border-hairline bg-surface/70 text-[11px] font-semibold tracking-wider text-ink-2 backdrop-blur-sm transition-colors hover:bg-ink/[0.05] hover:text-ink"
          >
            {lang === 'zh' ? 'EN' : 'CN'}
          </button>

          {/* THEME TOGGLE — 单按钮，显当前可切到的目标 */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? '切换到夜间模式' : 'Switch to day mode'}
            className="inline-flex h-8 w-9 items-center justify-center rounded-full border border-hairline bg-surface/70 text-[13px] backdrop-blur-sm transition-colors hover:bg-ink/[0.05]"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>
    </header>
  );
}
