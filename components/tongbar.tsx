'use client';

import { useEffect, useRef, useState } from 'react';
import { TONGBAR_MESSAGES } from '@/lib/content';
import { useLang } from './lang-context';

const SESSION_DELAY_MS = 800;
const ROTATE_MS = 6500;

/**
 * Tongbar — 左下角桌面宠物
 *
 * 2026-05-24 Claire 改造：
 *   - 点 ✕ 只关气泡（铜板儿留着，并轻轻晃动暗示"被嫌弃了"）
 *   - 再点铜板儿 = 气泡回来 + 继续轮播
 *   - ✕ 改成柔和的小圆点（半透明，hover 才显眼）
 */
export default function Tongbar() {
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);
  const [bubbleOpen, setBubbleOpen] = useState(true); // 气泡显隐（独立于 visible）
  const [bubbleVisible, setBubbleVisible] = useState(true); // 轮播切换时的淡入淡出
  const timer = useRef<number | null>(null);
  const { lang } = useLang();

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), SESSION_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible || !bubbleOpen) return;
    timer.current = window.setInterval(() => {
      setBubbleVisible(false);
      window.setTimeout(() => {
        setIdx((i) => (i + 1) % TONGBAR_MESSAGES.length);
        setBubbleVisible(true);
      }, 300);
    }, ROTATE_MS);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [visible, bubbleOpen]);

  if (!visible) return null;

  const message = TONGBAR_MESSAGES[idx];
  const text = lang === 'zh' ? message.zh : message.en;

  const toggleBubble = () => setBubbleOpen((v) => !v);
  const closeBubble = () => setBubbleOpen(false);

  return (
    <div
      className="pointer-events-none fixed bottom-5 left-5 z-50 flex flex-row-reverse items-end gap-3"
      aria-live="polite"
    >
      {/* 气泡：只在 bubbleOpen 时 render，平滑淡入淡出 */}
      {bubbleOpen && (
        <div
          className={`pointer-events-auto relative max-w-[240px] rounded-2xl bg-surface px-4 py-3 text-sm text-ink-2 shadow-thiings transition-all duration-300 ${
            bubbleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
        >
          <span aria-hidden="true">{text}</span>
          {/* Tail pointing left toward cat */}
          <span
            aria-hidden="true"
            className="absolute -left-1.5 bottom-4 h-3 w-3 rotate-45 bg-surface"
            style={{ boxShadow: '-2px 2px 0 rgba(0,0,0,0.04)' }}
          />
          {/* 柔和关闭点：半透明小灰圈 + hover 才明显 */}
          <button
            type="button"
            onClick={closeBubble}
            aria-label={lang === 'zh' ? '让铜板儿安静一下' : 'Shush Tongbar'}
            className="absolute -top-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink-4/30 text-[9px] text-surface opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
            style={{ opacity: 0.35 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.35')}
          >
            −
          </button>
        </div>
      )}

      {/* 铜板儿：永远显示，点击 toggle 气泡 */}
      <button
        type="button"
        onClick={toggleBubble}
        aria-label={
          bubbleOpen
            ? (lang === 'zh' ? '收起气泡' : 'Tuck bubble away')
            : (lang === 'zh' ? '叫铜板儿说话' : 'Wake Tongbar')
        }
        className="pointer-events-auto flex h-14 w-14 select-none items-center justify-center rounded-full bg-cream/70 shadow-thiings transition-transform hover:scale-105"
        style={{
          animation: 'float-y 4s ease-in-out infinite',
        }}
      >
        <span style={{ fontSize: 32, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.18))' }}>
          🐱
        </span>
      </button>
    </div>
  );
}
