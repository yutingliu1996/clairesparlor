'use client';

import { useEffect, useState } from 'react';
import { useLang } from './lang-context';

/**
 * EasterEggs — 两枚低调小彩蛋，只融入 Claire 的三个心头好：
 *   ① 纪念碑谷 (Monument Valley)：错位几何 / 不可能空间 / paper-craft
 *   ② 原神 (Genshin Impact)：抽卡星级 / 元素 / 奇幻语气
 *   ③ 老友记 (Friends)：Central Perk / "I'll be there for you"
 *
 * 1. Console signature — 一次/会话，DevTools 用户才看得到，不干扰普通访客。
 * 2. Konami code (↑↑↓↓←→←→) → 第五扇门浮窗，融合三个出处。
 *
 * 设计原则：
 *   - 默认完全静默，不影响布局 / 性能 / accessibility
 *   - 普通访客零感知，主动探索的人才会撞到
 *   - 浮窗只能用户主动关闭：点 × / 点遮罩 / Esc，不自动消失
 *   - 输入框聚焦时不触发，避免和真正的方向键导航打架
 */

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
const SESSION_KEY = 'claire:console-signature:fired';

export default function EasterEggs() {
  const { lang } = useLang();
  const [fifthOpen, setFifthOpen] = useState(false);

  // ---- 1. Console signature (once per session) ----
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === '1') return;
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // sessionStorage 不可用就直接打，无所谓
    }

    // 用 %c 给 console 加样式。
    // 注：title + subtitle 必须合成 ONE 个 styled chunk，否则 DevTools 在窄控制台
    // 下会把第二段换行 → 拼接的 pill 胶囊被切成两块、背景断开。
      const greet = '%c☕ Claire\'s Parlor · Central Perk · 玉婷的小客厅%c';
    const quote = '"I\'ll be there for you, when the rain starts to pour."';
    const blueprint =
      '%c\n\n  三块拼图 / The three blueprints behind this place:\n' +
      '    🏛  Monument Valley · 错位几何 / paper-craft\n' +
      '    ⭐  Genshin Impact   · 元素与奇幻\n' +
      '    🛋  Friends          · 一杯咖啡的温度\n';
    const hint = '%c\n  ✦ 翻一翻每个房间，会有一些藏起来的小东西。\n    Try the Konami code somewhere on the page.\n\n';

    /* eslint-disable no-console */
    console.log(
      greet + '\n' + quote + blueprint + hint,
      'font:600 14px -apple-system,system-ui,sans-serif;color:#0a0a0a;background:#FFE9C7;padding:6px 14px;border-radius:999px;',
      'font:italic 13px Georgia,serif;color:#C24A1E;',
      'font:12px ui-monospace,SFMono-Regular,monospace;color:#5a5a5a;line-height:1.7;',
      'font:600 12px -apple-system,system-ui,sans-serif;color:#FF5733;line-height:1.7;',
    );
    /* eslint-enable no-console */
  }, []);

  // ---- 2. Konami listener ----
  useEffect(() => {
    let buf: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      // 在输入框 / contenteditable 里不触发，避免和真实方向键打架
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        (t && t.isContentEditable)
      ) {
        buf = [];
        return;
      }
      if (e.key === 'Escape' && fifthOpen) {
        setFifthOpen(false);
        return;
      }
      // 只把箭头键塞进 buffer，其他键打断序列
      if (!e.key.startsWith('Arrow')) {
        buf = [];
        return;
      }
      buf.push(e.key);
      if (buf.length > KONAMI.length) buf.shift();
      if (buf.length === KONAMI.length && buf.every((k, i) => k === KONAMI[i])) {
        buf = [];
        setFifthOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fifthOpen]);

  return <FifthDoor open={fifthOpen} onClose={() => setFifthOpen(false)} lang={lang} />;
}

/* ============================================================
   第五扇门 · The Fifth Room
   - paper-craft 浮窗：三块灵感各占一个视觉锚点
   - Penrose 三角（纪念碑谷）+ ★★★★★（原神祈愿）+ ☕ I'll be there for you（老友记）
   ============================================================ */
function FifthDoor({ open, onClose, lang }: { open: boolean; onClose: () => void; lang: 'zh' | 'en' }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label={lang === 'zh' ? '第五扇门' : 'The Fifth Room'}
      aria-modal="false"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.32), rgba(10,10,10,0.55))',
        backdropFilter: 'blur(6px) saturate(120%)',
        WebkitBackdropFilter: 'blur(6px) saturate(120%)',
        animation: 'fifth-fade-in 320ms ease-out both',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="liquid-card relative w-full max-w-[420px] rounded-[28px] px-8 py-9 text-center"
        style={{ animation: 'fifth-pop-in 540ms cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
      >
        {/* ★★★★★ — 原神 5 星祈愿配色（金色） */}
        <div
          className="font-mono text-[11px] uppercase"
          style={{ color: '#C99A2E', letterSpacing: '0.22em' }}
        >
          ★★★★★ &nbsp;Adventure Rank · 5
        </div>

        {/* Penrose 三角 — 纪念碑谷不可能几何，三段分别用 peach / cream / sage，
            和站点配色保持一致 */}
        <div className="mt-5 flex justify-center">
          <PenroseTriangle />
        </div>

        {/* 主标题 */}
        <h2 className="mt-5 font-rounded text-[28px] font-semibold leading-tight tracking-tight">
          {lang === 'zh' ? (
            <>
              第五扇门 <span className="text-ink-3">/</span>{' '}
              <span className="text-ink-3">The Fifth Room</span>
            </>
          ) : (
            <>The Fifth Room</>
          )}
        </h2>

        {/* 说明 */}
        <p className="mt-3 text-sm leading-relaxed text-ink-2">
          {lang === 'zh'
            ? '四间房围出第五间。它没有门牌，只是回声。'
            : 'Four rooms outline a fifth. No door — just an echo.'}
        </p>

        {/* 老友记落款 */}
        <div className="mt-6 border-t border-hairline pt-5 text-xs text-ink-3">
          <div aria-hidden="true" className="mb-1 text-base">
            ☕
          </div>
          <em>I&apos;ll be there for you, when the rain starts to pour.</em>
        </div>

        {/* 关闭按钮 — 右上角
            注：globals.css 里 `.liquid-card > * { position: relative; z-index: 1 }` 会盖掉
            Tailwind 的 .absolute（同 specificity，后定义胜出）。所以这里走 inline style
            强制 position:absolute，确保能贴右上角。 */}
        <button
          type="button"
          onClick={onClose}
          aria-label={lang === 'zh' ? '关闭' : 'Close'}
          style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-ink-3 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          ×
        </button>
      </div>

      <style jsx>{`
        @keyframes fifth-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fifth-pop-in {
          from { opacity: 0; transform: translateY(12px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

/**
 * Penrose 三角 — 简化扁平版本，三段用 peach / sage / sky2 的"低饱和柔色"。
 * 重点是视觉印象上"接不上但又接上了"的纪念碑谷感，不追求严格的不可能几何。
 */
function PenroseTriangle() {
  return (
    <svg
      viewBox="-60 -55 120 105"
      width="112"
      height="98"
      aria-hidden="true"
      style={{
        filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.10))',
      }}
    >
      {/* 左侧斜杆 — peach */}
      <path
        d="M -50 38 L -10 -32 L 4 -32 L -36 38 Z"
        fill="#FFB291"
        stroke="#1f1f1f"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.92"
      />
      {/* 右侧斜杆 — sage（淡紫薄荷，原神 anemo 灵感） */}
      <path
        d="M -10 -32 L 30 38 L 16 38 L -24 -32 Z"
        fill="#B9A5F5"
        stroke="#1f1f1f"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.88"
      />
      {/* 底部横杆 — cream/sky2，错位制造不可能视觉 */}
      <path
        d="M -50 38 L 30 38 L 30 24 L -36 24 Z"
        fill="#F4DCA5"
        stroke="#1f1f1f"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.95"
      />
      {/* 错位点 — 一个小亮点提示这里"接不上"，paper-craft 折角感 */}
      <circle cx="-36" cy="24" r="2" fill="#1f1f1f" opacity="0.6" />
      <circle cx="16" cy="38" r="2" fill="#1f1f1f" opacity="0.6" />
    </svg>
  );
}
