'use client';

import { usePathname } from 'next/navigation';
import type { Halo } from './page-header';

/**
 * MainTheme — sets per-route accent CSS variables on <main>.
 *
 * Each room owns a halo color, and the accent text / marker stroke /
 * subtitle color all derive from that halo. This is what gives the
 * site its "every page is its own color world" feel without changing
 * any page code.
 */

type Theme = {
  text: string;        // accent text color on light bg
  stroke: string;      // marker stroke at the edges
  strokeMid: string;   // marker stroke at the center
  textDark: string;    // accent text color on dark bg
  strokeDark: string;  // marker stroke on dark bg
  pill: string;        // soft bg for nav active pill / status badge
  dot: string;         // saturated dot color (live indicator on nav)
};

const THEMES: Record<Halo, Theme> = {
  mint: {
    text: '#1F7A57',
    stroke: 'rgba(155,220,185,0.92)',
    strokeMid: 'rgba(135,215,170,1)',
    textDark: '#7FE0AC',
    strokeDark: 'rgba(110,210,170,0.55)',
    pill: '#DCEFE3',
    dot: '#3DA67A',
  },
  // 2026-05-24 Claire: workshop / manifesto 从绿换成《老友记》紫
  // 符合双原则：底色仍极简白，紫色只在焦点处（标题/active pill/光晕）跳脱出来
  sage: {
    text: '#5B47B3',
    stroke: 'rgba(210,195,250,0.92)',
    strokeMid: 'rgba(185,165,245,1)',
    textDark: '#C9B8FF',
    strokeDark: 'rgba(170,145,230,0.55)',
    pill: '#E8DFFC',
    dot: '#8B6FE8',
  },
  peach: {
    text: '#C2502E',
    stroke: 'rgba(255,205,180,0.95)',
    strokeMid: 'rgba(255,180,145,1)',
    textDark: '#FFB89C',
    strokeDark: 'rgba(255,150,115,0.55)',
    pill: '#FFE5D8',
    dot: '#E07A50',
  },
  sky: {
    text: '#1E5BA8',
    stroke: 'rgba(195,220,250,0.92)',
    strokeMid: 'rgba(160,200,240,1)',
    textDark: '#B6D5F2',
    strokeDark: 'rgba(120,170,225,0.55)',
    pill: '#DDE9F8',
    dot: '#4F8FCF',
  },
  cream: {
    text: '#8C6A1F',
    stroke: 'rgba(248,228,180,0.95)',
    strokeMid: 'rgba(232,205,150,1)',
    textDark: '#F0DBA8',
    strokeDark: 'rgba(220,195,140,0.55)',
    pill: '#F8EFD5',
    dot: '#C9A435',
  },
};

/** Map a pathname to a halo theme. Falls back to mint (brand). */
function pathToHalo(path: string | null): Halo {
  if (!path) return 'mint';

  // chapter detail pages — each layer has its own color
  const chMatch = path.match(/^\/studio\/(l[1-6]|aside)\/?$/);
  if (chMatch) {
    const map: Record<string, Halo> = {
      l1: 'sky',
      l2: 'sage',
      l3: 'peach',
      l4: 'cream',
      l5: 'sage',
      l6: 'sky',
      aside: 'peach',
    };
    return map[chMatch[1]];
  }

  if (path.startsWith('/studio/ip')) return 'cream';
  if (path.startsWith('/studio')) return 'sky';
  if (path.startsWith('/parlor')) return 'peach';
  if (path.startsWith('/workshop')) return 'sage';
  if (path.startsWith('/cooperate')) return 'cream';
  if (path.startsWith('/manifesto')) return 'sage';
  if (path.startsWith('/bar')) return 'mint';
  return 'mint';
}

export default function MainTheme({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const halo = pathToHalo(pathname);
  const t = THEMES[halo];

  // Wraps the whole page (nav + main + footer + tongbar) with
  // display:contents so the wrapper itself doesn't affect layout but
  // its CSS custom properties cascade to all descendants — including
  // the sibling Nav and Footer that need the per-page accent.
  return (
    <div
      data-halo={halo}
      className="contents"
      style={
        {
          '--accent-text': t.text,
          '--accent-stroke': t.stroke,
          '--accent-stroke-mid': t.strokeMid,
          '--accent-text-dark': t.textDark,
          '--accent-stroke-dark': t.strokeDark,
          '--accent-pill': t.pill,
          '--accent-dot': t.dot,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
