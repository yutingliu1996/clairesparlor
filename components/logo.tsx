/**
 * Logo · Claire's Parlor brand mark
 *
 * Concept
 *   • A bold geometric "C" — initial of Claire / Coffee / 客厅
 *   • A small breathing dot tucked into the C's gap, sized so it
 *     reads simultaneously as:
 *       1. a live-indicator (always-on host),
 *       2. the apostrophe-period of "Claire's",
 *       3. a coffee bean inside the cup (read top-down).
 *   • Dot color is bound to the page's accent (--accent-dot), so the
 *     mark itself signals which "room" you're currently in.
 *
 * The mark is drawn as a single SVG that scales perfectly from
 * 16 px (favicon) to 64 px (page hero).
 */

type Props = {
  /** Outer square size in pixels. Default 32 (nav). */
  size?: number;
  /** Disable the breathing animation (e.g. on hover). */
  static?: boolean;
};

export default function Logo({ size = 32, static: isStatic = false }: Props) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-xl bg-ink text-surface"
      style={{
        width: size,
        height: size,
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.06), 0 8px 16px -6px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: 'block' }}
      >
        {/* Bold "C" letterform — open on the right */}
        <path
          d="M22.5 11.4 C 20.6 9.5 18.4 8.6 16 8.6 C 11.6 8.6 8.4 12 8.4 16 C 8.4 20 11.6 23.4 16 23.4 C 18.4 23.4 20.6 22.5 22.5 20.6"
          strokeWidth="2.7"
        />
        {/* Accent dot — sits at the C's opening; color follows page */}
        <circle
          cx="22.6"
          cy="16"
          r="2.2"
          fill="var(--accent-dot, #3DA67A)"
          stroke="none"
          style={
            isStatic
              ? undefined
              : ({ animation: 'breathe 2.4s ease-in-out infinite' } as React.CSSProperties)
          }
        />
      </svg>
    </span>
  );
}
