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
  // 2026-05-24 Claire: 纯红太刺，换橙红（warm orange-red，更接近 brand 风格）
  mint: {
    text: '#C24A1E',
    stroke: 'rgba(255,205,178,0.95)',
    strokeMid: 'rgba(255,150,120,1)',
    textDark: '#FFC4A8',
    strokeDark: 'rgba(255,140,110,0.55)',
    pill: '#FFE0DC',
    dot: '#FF5733',
  },
  // 2026-05-24 Claire: workshop / manifesto 从绿换成《老友记》紫
  // 符合双原则：底色仍极简白，紫色只在焦点处（标题/active pill/光晕）跳脱出来
  sage: {
    text: '#4A2DB5',
    stroke: 'rgba(210,195,250,0.95)',
    strokeMid: 'rgba(175,150,240,1)',
    textDark: '#C9B8FF',
    strokeDark: 'rgba(155,130,225,0.6)',
    pill: '#E8DFFC',
    dot: '#9676FF',
  },
  // 2026-05-24 Claire: /parlor 黄色再亮再暖一档（从 mustard 换成 sunshine + warm amber）
  peach: {
    text: '#B57F0E',
    stroke: 'rgba(255,228,120,0.95)',
    strokeMid: 'rgba(255,200,60,1)',
    textDark: '#FFE891',
    strokeDark: 'rgba(245,195,60,0.6)',
    pill: '#FFF4B8',
    dot: '#FFC42E',
  },
  // 2026-05-24 Claire: studio baby blue + 提饱和度让渐变明显
  sky: {
    text: '#1F6FCA',
    stroke: 'rgba(200,228,250,0.95)',
    strokeMid: 'rgba(150,205,245,1)',
    textDark: '#C5E4F8',
    strokeDark: 'rgba(110,180,235,0.6)',
    pill: '#D5EAFC',
    dot: '#5AB0F0',
  },
  // 2026-05-24 Claire: cooperate 鹅黄 + 拉大渐变对比
  cream: {
    text: '#6F540C',
    stroke: 'rgba(255,238,150,0.95)',
    strokeMid: 'rgba(250,215,90,1)',
    textDark: '#FFE891',
    strokeDark: 'rgba(235,200,90,0.6)',
    pill: '#FFEDA0',
    dot: '#FFCC2E',
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
