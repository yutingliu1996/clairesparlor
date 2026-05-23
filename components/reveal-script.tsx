'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Reveal-on-scroll for any element with class="reveal".
 *
 * Re-observes on every route change — the root layout doesn't remount
 * during client-side navigation in App Router, so without this the
 * new page's .reveal elements would stay hidden until a hard refresh.
 */
export default function RevealScript() {
  const pathname = usePathname();

  useEffect(() => {
    // Only observe elements that haven't already been revealed.
    const els = document.querySelectorAll<HTMLElement>('.reveal:not(.in)');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' },
    );
    els.forEach((el) => io.observe(el));

    // Safety net: if anything is still hidden after a beat (e.g.
    // observer didn't fire because layout shifted), reveal them.
    const fallback = window.setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add('in');
      });
    }, 600);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [pathname]);

  return null;
}
