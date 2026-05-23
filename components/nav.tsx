'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './logo';

/**
 * Top navigation — frosted-glass sticky bar, no hard border.
 *
 * Design notes:
 *   • At y=0 the bar is fully transparent, letting the page color bleed
 *     into the brand area (cohesive, no harsh seam).
 *   • Once the user scrolls past 8px, a subtle frost + soft drop-shadow
 *     fade in instead of a hairline.
 *   • Active link gets a filled mint pill (matches new accent palette);
 *     hover state gets a soft paper pill — both feel tactile.
 *   • Brand has a tiny breathing mint dot to suggest "live podcast".
 */
const links = [
  { href: '/parlor', zh: '会客厅', en: 'Parlor' },
  { href: '/studio', zh: '工作台', en: 'Studio' },
  { href: '/workshop', zh: '工坊', en: 'Workshop' },
  { href: '/cooperate', zh: '合作', en: 'Cooperate' },
  { href: '/manifesto', zh: '主张', en: 'Manifesto' },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-paper/75 backdrop-blur-xl shadow-[0_6px_28px_-18px_rgba(0,0,0,0.18)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="wrap flex h-16 items-center justify-between">
        {/* BRAND */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-rounded text-[15px] font-semibold tracking-tight"
        >
          <span className="transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
            <Logo size={32} />
          </span>
          {/* 2026-05-24 Claire: brand 跟 nav 链接同步切中英（桌面中文、移动英文） */}
          <span className="hidden sm:inline">Claire 的会客厅</span>
          <span className="sm:hidden">Claire&apos;s Parlor</span>
        </Link>

        {/* LINKS */}
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
                  /* 2026-05-24 Claire: 去掉 active pill 跟主题色变化，统一极淡黑底 + 黑字 */
                >
                  <span className="hidden sm:inline">{l.zh}</span>
                  <span className="sm:hidden">{l.en}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
