'use client';

import { useEffect, useRef, useState } from 'react';
import { measureLineStats, prepareWithSegments } from '@chenglou/pretext';

type Props = {
  children: React.ReactNode;
  className?: string;
  reserveMobileGlyph?: boolean;
};

const DISPLAY_MIN = 44;
const DISPLAY_MAX = 68;
const MOBILE_MIN = 22;
const INLINE_GLYPH_RESERVE = 104;
const HERO_FONT_FAMILY = '"SF Pro Display", "SF Pro Text", "PingFang SC", "Hiragino Sans GB", "Helvetica Neue", Arial, sans-serif';

function defaultDisplaySize() {
  return Math.min(DISPLAY_MAX, Math.max(DISPLAY_MIN, window.innerWidth * 0.06));
}

function normaliseLineText(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function measureFits(lines: string[], width: number, fontSize: number, letterSpacing: number, reserveInlineGlyph: boolean) {
  const font = `800 ${fontSize}px ${HERO_FONT_FAMILY}`;

  return lines.every((line) => {
    const availableWidth = reserveInlineGlyph
      ? width - INLINE_GLYPH_RESERVE
      : width;

    if (availableWidth <= 0) return false;

    const prepared = prepareWithSegments(line, font, { letterSpacing });
    return measureLineStats(prepared, availableWidth).lineCount <= 1;
  });
}

export default function FittedHeroTitle({ children, className = '', reserveMobileGlyph = false }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const fontSizeRef = useRef<number | null>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);

  useEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) return;

    let frame = 0;
    let lastWidth = 0;
    let lastSignature = '';

    const fit = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const width = titleElement.clientWidth;
        if (width <= 0) return;
        const lines = Array.from(titleElement.querySelectorAll<HTMLElement>('[data-title-line]'))
          .map((line) => normaliseLineText(line.textContent ?? ''))
          .filter(Boolean);

        if (!lines.length) return;

        const isInlineGlyphVisible = window.matchMedia('(max-width: 1023.98px)').matches;
        const lineSignature = `${lines.join('\n')}|${isInlineGlyphVisible ? 'inline' : 'side'}`;
        if (Math.abs(width - lastWidth) < 0.5 && lineSignature === lastSignature && fontSizeRef.current !== null) return;
        lastWidth = width;
        lastSignature = lineSignature;

        const computed = window.getComputedStyle(titleElement);
        const letterSpacing = Number.parseFloat(computed.letterSpacing);
        const resolvedLetterSpacing = Number.isFinite(letterSpacing) ? letterSpacing : 0;
        const isMobile = window.matchMedia('(max-width: 639.98px)').matches;
        const maxSize = defaultDisplaySize();
        const minSize = isMobile ? MOBILE_MIN : DISPLAY_MIN;
        const shouldReserveGlyph = isInlineGlyphVisible && reserveMobileGlyph;

        if (measureFits(lines, width, maxSize, resolvedLetterSpacing, shouldReserveGlyph)) {
          fontSizeRef.current = maxSize;
          setFontSize(maxSize);
          return;
        }

        let low = minSize;
        let high = maxSize;

        for (let step = 0; step < 8; step += 1) {
          const mid = (low + high) / 2;
          if (measureFits(lines, width, mid, resolvedLetterSpacing, shouldReserveGlyph)) {
            low = mid;
          } else {
            high = mid;
          }
        }

        const nextSize = Math.round(low * 10) / 10;
        fontSizeRef.current = nextSize;
        setFontSize(nextSize);
      });
    };

    fit();

    const resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(titleElement);
    window.addEventListener('resize', fit);
    document.fonts?.ready.then(fit).catch(() => undefined);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [children, reserveMobileGlyph]);

  return (
    <h1
      ref={titleRef}
      className={className}
      style={{
        fontSize: fontSize === null ? 'clamp(2.75rem, 6vw, 4.25rem)' : `${fontSize}px`,
        lineHeight: 1.05,
      }}
    >
      {children}
    </h1>
  );
}
