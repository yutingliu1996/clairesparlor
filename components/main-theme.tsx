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
  // 2026-05-24 Claire: brand mint 从绿全换大红
  mint: {
    text: '#C72F2F',
    stroke: 'rgba(255,200,195,0.95)',
    strokeMid: 'rgba(255,140,130,1)',
    textDark: '#FFB4A8',
    strokeDark: 'rgba(255,110,100,0.55)',
    pill: '#FEE2E2',
    dot: '#EF3D3D',
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
  // 2026-05-24 Claire: /parlor 黄色再亮再暖一档（从 mustard 换成 sunshine + warm amber）
  peach: {
    text: '#D4A024',
    stroke: 'rgba(255,228,120,0.95)',
    strokeMid: 'rgba(255,210,80,1)',
    textDark: '#FFE891',
    strokeDark: 'rgba(245,205,80,0.55)',
    pill: '#FFF4B8',
    dot: '#FFD340',
  },
  // 2026-05-24 Claire: studio 从深 royal blue 换成 baby blue（之前太暗）
  sky: {
    text: '#3A8FD9',
    stroke: 'rgba(200,228,250,0.95)',
    strokeMid: 'rgba(165,210,245,1)',
    textDark: '#C5E4F8',
    strokeDark: 'rgba(130,195,240,0.55)',
    pill: '#DAEEFC',
    dot: '#6BB6E8',
  },
  // 2026-05-24 Claire: cooperate 鹅黄 + 修对比度（text 加深 + pill 加饱和让 nav "合作" 文字可读）
  cream: {
    text: '#8B6A1A',
    stroke: 'rgba(255,238,150,0.95)',
    strokeMid: 'rgba(252,222,110,1)',
    textDark: '#FFE891',
    strokeDark: 'rgba(240,210,110,0.55)',
    pill: '#FFEDA0',
    dot: '#F4C842',
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
  if (path.startsWith('/manifesto')) return 'mint';  // 2026-05-24 Claire: manifesto 改活力橙
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
