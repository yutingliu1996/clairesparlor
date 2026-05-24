'use client';

import Image from 'next/image';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { TONGBAR_MESSAGES } from '@/lib/content';
import { useLang } from './lang-context';

/**
 * Tongbar — 桌面宠物（v5：躲猫猫 / paper-craft SVG / 拖拽版）
 *
 * 2026-05-24 Claire 改造：
 *   - 形象：自绘 SVG，参考《纪念碑谷》的 paper-craft 几何柔和。
 *     乳白英长 + 铜琥珀眼 + 长毛脸颊 + 粉鼻 + 微腮红，无黑线稿全靠渐变。
 *   - 默认 peek：半个身子藏在屏幕边缘后面
 *   - 点击 → 探出 + 气泡轮播
 *   - 拖动 → 跟着指针，松手吸附到最近的边，位置存 localStorage
 *   - 25s 闲置自动缩回 peek
 */

type Edge = 'left' | 'right' | 'bottom';
type CatState = 'peek' | 'happy' | 'wiggle';

interface Anchor {
  edge: Edge;
  /** 沿边位置 0..1（左/右是顶→底；下是左→右）*/
  offset: number;
}

const STORAGE_KEY = 'tongbar:anchor:v1';
const DEFAULT_ANCHOR: Anchor = { edge: 'left', offset: 0.78 };
const MOUNT_DELAY_MS = 800;
const ROTATE_MS = 6500;
const RETRACT_MS = 25_000;
const PEEK_HIDE_RATIO = 0.42; // 藏在边后的比例
const CAT_W = 130;
const CAT_H = 130;
const EDGE_GAP = 14; // 探出时离边的距离
const MARGIN = 12;
const DRAG_THRESHOLD = 8;
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const CAT_SRC: Record<CatState, string> = {
  peek: '/tongbar/tongbar_peek.png',
  happy: '/tongbar/tongbar_idle.png',
  wiggle: '/tongbar/tongbar_glare.png',
};

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

function snapToEdge(p: { x: number; y: number }, win: { w: number; h: number }): Anchor {
  const dLeft = p.x;
  const dRight = win.w - p.x;
  const dBottom = win.h - p.y;
  const min = Math.min(dLeft, dRight, dBottom);
  if (min === dLeft) return { edge: 'left', offset: clamp(p.y / win.h, 0.06, 0.94) };
  if (min === dRight) return { edge: 'right', offset: clamp(p.y / win.h, 0.06, 0.94) };
  return { edge: 'bottom', offset: clamp(p.x / win.w, 0.06, 0.94) };
}

export default function Tongbar() {
  const [mounted, setMounted] = useState(false);
  const [anchor, setAnchor] = useState<Anchor>(DEFAULT_ANCHOR);
  const [popped, setPopped] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragXY, setDragXY] = useState<{ x: number; y: number } | null>(null);
  const [idx, setIdx] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [win, setWin] = useState({ w: 0, h: 0 });

  const downXY = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  const retractTimer = useRef<number | null>(null);
  const rotateTimer = useRef<number | null>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();

  // Mount + restore anchor
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), MOUNT_DELAY_MS);
    setWin({ w: window.innerWidth, h: window.innerHeight });
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Anchor;
        if (
          p &&
          (p.edge === 'left' || p.edge === 'right' || p.edge === 'bottom') &&
          typeof p.offset === 'number'
        ) {
          setAnchor({ edge: p.edge, offset: clamp(p.offset, 0.06, 0.94) });
        }
      }
    } catch {}
    const onResize = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Persist anchor
  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(anchor));
    } catch {}
  }, [anchor, mounted]);

  // Speech rotation
  useEffect(() => {
    if (!mounted || !popped) return;
    rotateTimer.current = window.setInterval(() => {
      setBubbleVisible(false);
      window.setTimeout(() => {
        setIdx((i) => (i + 1) % TONGBAR_MESSAGES.length);
        setBubbleVisible(true);
      }, 280);
    }, ROTATE_MS);
    return () => {
      if (rotateTimer.current) window.clearInterval(rotateTimer.current);
    };
  }, [mounted, popped]);

  // Auto-retract after idle
  useEffect(() => {
    if (!popped) {
      if (retractTimer.current) window.clearTimeout(retractTimer.current);
      return;
    }
    if (retractTimer.current) window.clearTimeout(retractTimer.current);
    retractTimer.current = window.setTimeout(() => setPopped(false), RETRACT_MS);
    return () => {
      if (retractTimer.current) window.clearTimeout(retractTimer.current);
    };
  }, [popped]);

  // Pointer handlers — click vs drag distinguished by movement threshold
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    downXY.current = { x: e.clientX, y: e.clientY };
    moved.current = false;
    if (retractTimer.current) window.clearTimeout(retractTimer.current);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!downXY.current) return;
    const dx = e.clientX - downXY.current.x;
    const dy = e.clientY - downXY.current.y;
    if (!moved.current && Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) {
      moved.current = true;
      setDragging(true);
    }
    if (moved.current) setDragXY({ x: e.clientX, y: e.clientY });
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (!downXY.current) return;
    if (moved.current && dragXY) {
      setAnchor(snapToEdge(dragXY, win));
    } else {
      setPopped((v) => !v);
    }
    downXY.current = null;
    moved.current = false;
    setDragging(false);
    setDragXY(null);
  };

  if (!mounted) return null;

  // Cat container position
  const catStyle: CSSProperties = (() => {
    if (dragging && dragXY) {
      return { left: dragXY.x - CAT_W / 2, top: dragXY.y - CAT_H / 2 };
    }
    const { edge, offset } = anchor;
    if (edge === 'left' || edge === 'right') {
      const sideOff = popped ? EDGE_GAP : -CAT_W * PEEK_HIDE_RATIO;
      const top = clamp(
        offset * win.h - CAT_H / 2,
        MARGIN,
        Math.max(MARGIN, win.h - CAT_H - MARGIN),
      );
      return edge === 'left' ? { left: sideOff, top } : { right: sideOff, top };
    }
    const bottomOff = popped ? EDGE_GAP : -CAT_H * PEEK_HIDE_RATIO;
    const left = clamp(
      offset * win.w - CAT_W / 2,
      MARGIN,
      Math.max(MARGIN, win.w - CAT_W - MARGIN),
    );
    return { bottom: bottomOff, left };
  })();

  // Bubble position
  const showBubble = popped && !dragging;
  const bubbleStyle: CSSProperties = (() => {
    if (!showBubble) return { display: 'none' };
    const { edge, offset } = anchor;
    const W_BUBBLE = 240;
    // 气泡距离猫的间隙：要兼容 bob 上下浮动 + PNG 顶部 padding，给足余量
    const BUBBLE_GAP = 26;
    if (edge === 'left' || edge === 'right') {
      const top = clamp(
        offset * win.h - CAT_H / 2,
        MARGIN,
        Math.max(MARGIN, win.h - CAT_H - MARGIN),
      );
      const headTop = top + CAT_H * 0.16;
      const horiz = EDGE_GAP + CAT_W + BUBBLE_GAP;
      return edge === 'left' ? { left: horiz, top: headTop } : { right: horiz, top: headTop };
    }
    const left = clamp(
      offset * win.w - CAT_W / 2,
      MARGIN,
      Math.max(MARGIN, win.w - CAT_W - MARGIN),
    );
    return {
      left: clamp(
        left + CAT_W / 2 - W_BUBBLE / 2,
        MARGIN,
        Math.max(MARGIN, win.w - W_BUBBLE - MARGIN),
      ),
      bottom: EDGE_GAP + CAT_H + BUBBLE_GAP,
    };
  })();

  const facing: 1 | -1 = anchor.edge === 'right' ? -1 : 1;
  const message = TONGBAR_MESSAGES[idx];
  const text = lang === 'zh' ? message.zh : message.en;
  const state: CatState = dragging ? 'wiggle' : popped ? 'happy' : 'peek';

  const ariaLabel = dragging
    ? lang === 'zh'
      ? '拖动铜板儿'
      : 'Dragging Tongbar'
    : popped
    ? lang === 'zh'
      ? '把铜板儿藏回去'
      : 'Tuck Tongbar away'
    : lang === 'zh'
    ? '叫铜板儿出来'
    : 'Coax Tongbar out';

  return (
    <>
      <div
        ref={catRef}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setPopped((v) => !v);
          }
        }}
        className={`fixed z-50 select-none touch-none ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          ...catStyle,
          width: CAT_W,
          height: CAT_H,
          transition: dragging
            ? 'none'
            : `left 0.55s ${SPRING}, right 0.55s ${SPRING}, top 0.55s ${SPRING}, bottom 0.55s ${SPRING}`,
          willChange: 'left, right, top, bottom',
        }}
      >
        {/* Soft halo behind */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-30%',
            background:
              'radial-gradient(closest-side, rgba(255, 200, 170, 0.45), transparent 70%)',
            filter: 'blur(2px)',
            pointerEvents: 'none',
            animation: 'tongbar-halo 6s ease-in-out infinite',
          }}
        />
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scaleX(${facing})`,
            position: 'relative',
            animation:
              state === 'wiggle'
                ? 'tongbar-wiggle 0.55s ease-in-out infinite'
                : state === 'peek'
                ? 'tongbar-breathe 4.4s ease-in-out infinite'
                : 'tongbar-bob 3.2s ease-in-out infinite',
            transformOrigin: '50% 60%',
            filter: 'drop-shadow(0 14px 20px rgba(80, 50, 22, 0.22))',
          }}
        >
          <Image
            src={CAT_SRC[state]}
            alt=""
            width={CAT_W}
            height={CAT_H}
            priority
            draggable={false}
            unoptimized
            style={{ width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none' }}
          />
        </div>
      </div>

      {showBubble && (
        <div
          aria-live="polite"
          className={`pointer-events-none fixed z-50 max-w-[240px] rounded-2xl bg-surface px-4 py-3 text-sm text-ink-2 shadow-thiings transition-all duration-300 ${
            bubbleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
          style={bubbleStyle}
        >
          {text}
          <span
            aria-hidden="true"
            className={`absolute h-3 w-3 rotate-45 bg-surface ${
              anchor.edge === 'left'
                ? '-left-1.5 top-5'
                : anchor.edge === 'right'
                ? '-right-1.5 top-5'
                : 'bottom-[-6px] left-1/2 -translate-x-1/2'
            }`}
            style={{ boxShadow: '-2px 2px 0 rgba(0,0,0,0.04)' }}
          />
        </div>
      )}
    </>
  );
}
