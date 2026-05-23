import type { Config } from 'tailwindcss';

/**
 * Design tokens — Apple-minimal × thiings.co
 *
 * Surfaces stay near-white. Accent color appears only at focus points
 * (active link, primary CTA, "live" pill). Type stack defaults to SF Pro
 * via system fonts.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAFA',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#0A0A0A',
          2: '#3D3D3D',
          3: '#737373',
          4: '#A3A3A3',
          5: '#D4D4D4',
        },
        hairline: 'rgba(0,0,0,0.08)',
        accent: {
          DEFAULT: '#FF5733',     // warm orange-red — brand accent (2026-05-24 改橙红)
          soft: '#FFE0DC',        // light orange-red tint — bg-accent-soft
          deep: '#C24A1E',        // deep terracotta — high-contrast text
        },
        cream: '#F4EFE6',
        sage: '#E6EEE5',
        sky2: '#E2E8F4',
        peach: '#F8E4DC',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Helvetica Neue"',
          'system-ui',
          'sans-serif',
        ],
        rounded: [
          'ui-rounded',
          '"SF Pro Rounded"',
          '-apple-system',
          '"PingFang SC"',
          'system-ui',
          'sans-serif',
        ],
        serif: ['"New York"', '"Times New Roman"', '"Songti SC"', 'serif'],
        mono: ['ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Apple-style display scale
        'display-xl': ['clamp(3.5rem, 8vw, 6rem)', { lineHeight: '1.02', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.75rem, 6vw, 4.25rem)', { lineHeight: '1.05', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      },
      letterSpacing: {
        eyebrow: '0.18em',
      },
      boxShadow: {
        // thiings-style soft floating shadows
        thiings: '0 1px 2px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(0,0,0,0.12), 0 24px 48px -20px rgba(0,0,0,0.10)',
        'thiings-hover': '0 2px 4px rgba(0,0,0,0.05), 0 24px 48px -10px rgba(0,0,0,0.18), 0 40px 80px -24px rgba(0,0,0,0.14)',
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 6px 16px -4px rgba(0,0,0,0.08)',
        hairline: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
      },
      maxWidth: {
        prose: '68ch',
        page: '1120px',
        narrow: '720px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
