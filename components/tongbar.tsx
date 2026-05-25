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
 * Tongbar — 桌面宠物（v7：PNG 多帧叠层 + 交叉淡入）
 *
 * 2026-05-25 Claire 改造：
 *   - 形象保持原 PNG（painterly 风格 100% 还原），不再手绘 SVG。
 *   - 持续动画通过多帧 PNG 叠层 + opacity 交叉淡入实现：
 *     · idle.png 为基底
 *     · smile.png 透明度脉冲 → 自然眨眼
 *     · glare.png 偶发淡入 → 偶尔斜眼
 *   - 三张 PNG 身体姿态完全一致，仅面部不同，叠加无错位。
 *   - state 控制基底（peek 探头 · happy 跟随 · wiggle 拖拽）。
 *   - 默认 peek：半个身子藏在屏幕边缘后面 → 点击 → 探出 + 气泡轮播
 *   - 拖动 → 跟着指针，松手吸附到最近的边，位置存 localStorage
 *   - 25s 闲置自动缩回 peek
 */

type Edge = 'left' | 'right' | 'bottom';
type CatState = 'peek' | 'happy' | 'wiggle';

/* ──────────────────────────────────────────────────────────────────────────
 * Frame catalog —— 每张 PNG 在 /public/tongbar/ 的路径，单一来源。
 * 想接入新帧：先把 PNG 丢进 /public/tongbar/，再在这里 uncomment 一行。
 *
 * 命名约定：tongbar_<动作>.png（snake_case，全小写）。
 * AI 出图 prompt 见 README / DESIGN 中的角色 prompt 模板。
 * ────────────────────────────────────────────────────────────────────────── */
const FRAMES = {
  // ── 同 idle 身体姿态（可作 happy 的 overlay 叠层）──
  idle: '/tongbar/tongbar_idle.png',
  smile: '/tongbar/tongbar_smile.png', // 眨眼
  glare: '/tongbar/tongbar_glare.png', // 斜眼
  wink: '/tongbar/tongbar_wink.png', // 单眼眨
  // ── peek 系列（3 边各一张专用图）──
  peek_bottom: '/tongbar/tongbar_peek_new.png', // 底部探头
  peek_left: '/tongbar/tongbar_peek_left.png', // 左边探半身
  peek_right: '/tongbar/tongbar_peek_right.png', // 右边探半身
  // ── 其他独立姿态帧（作 base 用）──
  meow: '/tongbar/tongbar_meow.png', // 张嘴喵
  excited: '/tongbar/tongbar_excited.png', // 兴奋
  tilt: '/tongbar/tongbar_tilt.png', // 歪头
  paw: '/tongbar/tongbar_paw.png', // 抬爪
  stretch: '/tongbar/tongbar_stretch.png', // 伸懒腰
  loaf: '/tongbar/tongbar_loaf.png', // 猫盒
  sleep: '/tongbar/tongbar_sleep.png', // 蜷睡
  // tongbar_peek_old.png 保留在磁盘上作参考，不接入代码。
} as const;

type FrameKey = keyof typeof FRAMES;

/* ──────────────────────────────────────────────────────────────────────────
 * 可选的 image-to-video 动画（WebM with alpha）。一旦某帧有 motion，
 * 渲染时优先 <video> autoplay loop，否则 fallback 到 PNG 静帧。
 *
 * 文件命名：tongbar_<动作>.webm，与 PNG 同名同目录。
 * 编码要求：VP9 + alpha，建议 24fps，2–4s 可循环片段，<1MB。
 *
 * Image-to-video 工具推荐（按一致性 / 性价比）：
 *   - Runway Gen-3 Alpha Turbo —— 角色一致性好，单段 5s ≈ ¥3
 *   - Kling 1.6 / 1.5 Pro —— 国产，painterly 风格保留好，单段 5s ≈ ¥2
 *   - Hailuo / 即梦视频 —— 免费额度可试水
 *   - Sora / Pika —— 也行，看可用性
 *
 * Prompt 通用模板（基于现有 PNG 出 image-to-video）：
 *   "The cream-colored fluffy cat character stays in place with subtle natural
 *    motion: gentle breathing rise and fall, occasional ear twitches, soft
 *    blink every 2-3 seconds, tail tip swaying slowly. Camera completely
 *    static. Background remains pure white / transparent throughout. No
 *    new elements appear. Loop-friendly start and end. Painterly 3D render
 *    style preserved exactly. Duration: 3 seconds, 24fps."
 *
 * 不同帧的运动建议（替换 prompt 第一句）：
 *   - idle:    "stays sitting, gentle breathing + occasional blink + tail sway"
 *   - smile:   "eyes already closed in smile, tiny head bob + happy ear wiggle"
 *   - glare:   "half-lidded eyes slowly drift left-right, tail flicks once"
 *   - wink:    "right eye stays winked, slight playful head tilt back-and-forth"
 *   - meow:    "mouth opens-closes once in a quick mrrow, tail flicks up"
 *   - tilt:    "head tilts gently left-right with curiosity, ears swivel"
 *   - paw:     "raised paw waves slowly side-to-side"
 *   - stretch: "extends front paws forward, arches back, returns to sit"
 *   - loaf:    "blinks slowly, tiny breathing motion in compact loaf pose"
 *   - excited: "eyes sparkle with subtle scale pulse, ears perk forward"
 *   - sleep:   "slow rhythmic breathing of curled body, tail tip twitches"
 *   - peek_*:  "blinks once, tiny head adjustment to peer, ears twitch"
 *
 * 拿到 WebM 后：
 *   1. 丢进 /public/tongbar/，文件名同 FRAMES 的 PNG 但扩展名 .webm
 *   2. 在下面 MOTIONS 里 uncomment 对应那一行
 *   3. 该帧自动从 PNG 升级到 video，无需改其他代码
 * ────────────────────────────────────────────────────────────────────────── */
const MOTIONS: Partial<Record<FrameKey, string>> = {
  // idle: '/tongbar/tongbar_idle.webm',
  // smile: '/tongbar/tongbar_smile.webm',
  // glare: '/tongbar/tongbar_glare.webm',
  // wink: '/tongbar/tongbar_wink.webm',
  // meow: '/tongbar/tongbar_meow.webm',
  // tilt: '/tongbar/tongbar_tilt.webm',
  // paw: '/tongbar/tongbar_paw.webm',
  // stretch: '/tongbar/tongbar_stretch.webm',
  // loaf: '/tongbar/tongbar_loaf.webm',
  // excited: '/tongbar/tongbar_excited.webm',
  // sleep: '/tongbar/tongbar_sleep.webm',
  // peek_bottom: '/tongbar/tongbar_peek_new.webm',
  // peek_left: '/tongbar/tongbar_peek_left.webm',
  // peek_right: '/tongbar/tongbar_peek_right.webm',
};

/* ──────────────────────────────────────────────────────────────────────────
 * State → 主帧映射。要新增一个非 peek 的状态：
 *   1. 把 key 加到 CatState union
 *   2. 在这里加一行 STATE_BASE[新state]
 *   3. 在主组件里加上触发该 state 的逻辑（hover / 长闲置 / 时间点 …）
 *
 * peek 由 PEEK_BY_EDGE 按吸附边选三张专用图。
 * ────────────────────────────────────────────────────────────────────────── */
const STATE_BASE: Record<Exclude<CatState, 'peek'>, FrameKey> = {
  happy: 'idle', // 跟随 / 闲置主帧
  wiggle: 'glare', // 拖拽中
};

const PEEK_BY_EDGE: Record<Edge, FrameKey> = {
  bottom: 'peek_bottom',
  left: 'peek_left',
  right: 'peek_right',
};

function baseFor(state: CatState, edge: Edge): FrameKey {
  return state === 'peek' ? PEEK_BY_EDGE[edge] : STATE_BASE[state];
}

/* ──────────────────────────────────────────────────────────────────────────
 * happy 状态下随机轮播的"小表情/姿态"。每个 variant 持续 VARIANT_HOLD_MS 后回主帧。
 * 任意时刻只有一张帧的 opacity = 1，切换走交叉淡入淡出（FADE_MS）。
 * ──────────────────────────────────────────────────────────────────────── */
// loaf 不参与变体轮播：猫盒姿与 idle 坐姿身体高占比相差 26%，
// scale 也补不回。仅作为未来"超长闲置"业态跨状态切换使用。
const HAPPY_VARIANTS: FrameKey[] = ['smile', 'wink', 'glare', 'tilt', 'paw'];
const VARIANT_HOLD_MS = 5000; // 小表情"站稳"的时长（不含进/出淡入淡出）
const VARIANT_INTERVAL_RANGE: [number, number] = [5000, 10000]; // calm 主帧至少停留 5s
const FADE_MS = 360; // 帧间交叉淡入淡出时长，与 CSS 中的 keyframe 同步

/* 各帧中猫本体占画布高度差异较大（AI 出图剧本不一致）。以 idle 的 83.7% 为基准，
 * 渲染时给每个帧 scale 一个补偿值，让跳帧时猫不变大变小。
 * peek 三张不缩放（它们在边缘上，缩起来会出屏）。
 *
 * 重新出图后如何校准：把下面这段贴进浏览器 console 跑，console.table 输出的
 * scale / leftPad_px130 / rightPad_px130 / bottomPad_px130 直接抄进
 * FRAME_SCALE 和 PEEK_EDGE_COMPENSATION 即可。
 *
 * ```js
 * (async () => {
 *   const r = await Promise.all(Object.entries({
 *     idle: '/tongbar/tongbar_idle.png',
 *     smile: '/tongbar/tongbar_smile.png',
 *     glare: '/tongbar/tongbar_glare.png',
 *     wink: '/tongbar/tongbar_wink.png',
 *     peek_bottom: '/tongbar/tongbar_peek_new.png',
 *     peek_left: '/tongbar/tongbar_peek_left.png',
 *     peek_right: '/tongbar/tongbar_peek_right.png',
 *     meow: '/tongbar/tongbar_meow.png',
 *     excited: '/tongbar/tongbar_excited.png',
 *     tilt: '/tongbar/tongbar_tilt.png',
 *     paw: '/tongbar/tongbar_paw.png',
 *     stretch: '/tongbar/tongbar_stretch.png',
 *     loaf: '/tongbar/tongbar_loaf.png',
 *     sleep: '/tongbar/tongbar_sleep.png',
 *   }).map(([k, src]) => new Promise(res => {
 *     const im = new Image();
 *     im.onload = () => {
 *       const c = document.createElement('canvas');
 *       c.width = im.width; c.height = im.height;
 *       const ctx = c.getContext('2d');
 *       ctx.drawImage(im, 0, 0);
 *       const d = ctx.getImageData(0, 0, im.width, im.height).data;
 *       let l = im.width, rr = 0, t = im.height, b = 0;
 *       for (let y = 0; y < im.height; y++)
 *         for (let x = 0; x < im.width; x++)
 *           if (d[(y * im.width + x) * 4 + 3] > 20) {
 *             if (x < l) l = x; if (x > rr) rr = x;
 *             if (y < t) t = y; if (y > b) b = y;
 *           }
 *       res({ k, catH: (b - t) / im.height,
 *             leftPad: l / im.width, rightPad: (im.width - rr) / im.width,
 *             bottomPad: (im.height - b) / im.height });
 *     };
 *     im.src = src;
 *   })));
 *   const idleH = r.find(x => x.k === 'idle').catH;
 *   console.table(r.map(x => ({
 *     frame: x.k,
 *     catH: (x.catH * 100).toFixed(1) + '%',
 *     scale: (idleH / x.catH).toFixed(2),
 *     leftPad_px130: Math.round(-x.leftPad * 130),
 *     rightPad_px130: Math.round(-x.rightPad * 130),
 *     bottomPad_px130: Math.round(-x.bottomPad * 130),
 *   })));
 * })();
 * ```
 */
const FRAME_SCALE: Record<FrameKey, number> = {
  idle: 1.0,
  smile: 1.13,
  glare: 1.12,
  wink: 1.08,
  tilt: 1.09,
  paw: 1.1,
  meow: 1.11,
  excited: 1.02,
  stretch: 1.0,
  loaf: 1.35,
  sleep: 1.44,
  peek_bottom: 1.0,
  peek_left: 1.0,
  peek_right: 1.0,
};

/** 瞬态覆盖：某些事件触发后强制某一帧，覆盖 variant/calm。
 *  统一最少 5s ——「拖出来后每张图至少站 5 秒」的规则。
 *  meow 以前绑在“换文案”事件上，现与 bubble rotation 冲突太频繁，暂不接入。
 *  以后可绑其他事件（首访问 / 双击 / 收到通知等）。 */
const TRANSIENT_HOLD_MS: Partial<Record<FrameKey, number>> = {
  stretch: 5000, // 醒过来伸个懒腰
};

/** sleep.png 是卷在地上的侧面姿，贴在屏边看起来很怌，
 *  需要为它单调一个状态（如超长闲置后从 peek 跳到屏幕下调跳 sleep + Z 飘字），
 *  现阶段暂不接入，保留在 FRAMES 里供后续使用。 */

/** 单帧可见的 PNG cat —— 同一时刻最多只有一张帧 fully opaque。
 *  状态/帧切换走交叉淡入淡出（旧帧 fade out 同时新帧 fade in）。
 *
 *  优先级：forcedFrame > variant > calmFrame。覆盖期间暂停 variant 调度。 */
function TongbarCat({
  state,
  edge,
  forcedFrame,
}: {
  state: CatState;
  edge: Edge;
  forcedFrame: FrameKey | null;
}) {
  const calmFrame = baseFor(state, edge);

  // happy 状态下定时插入随机小表情，其他状态或 forcedFrame 期间暂停
  const [variant, setVariant] = useState<FrameKey | null>(null);
  useEffect(() => {
    if (state !== 'happy' || forcedFrame) {
      setVariant(null);
      return;
    }
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      if (!alive) return;
      const [min, max] = VARIANT_INTERVAL_RANGE;
      const delay = min + Math.random() * (max - min);
      timer = setTimeout(() => {
        if (!alive) return;
        const v = HAPPY_VARIANTS[Math.floor(Math.random() * HAPPY_VARIANTS.length)];
        setVariant(v);
        timer = setTimeout(() => {
          if (!alive) return;
          setVariant(null);
          schedule();
        }, VARIANT_HOLD_MS);
      }, delay);
    };
    schedule();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [state, forcedFrame]);

  const targetFrame: FrameKey = forcedFrame ?? variant ?? calmFrame;

  // 双槽交叉过渡：active = 当前要显示的帧；exiting = 刚被替换、正在淡出的帧
  const [active, setActive] = useState<FrameKey>(targetFrame);
  const [exiting, setExiting] = useState<FrameKey | null>(null);
  useEffect(() => {
    if (active === targetFrame) return;
    setExiting(active);
    setActive(targetFrame);
    const t = setTimeout(() => setExiting(null), FADE_MS);
    return () => clearTimeout(t);
  }, [targetFrame, active]);

  const layerStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    userSelect: 'none',
    pointerEvents: 'none',
  };
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {exiting && (
        <FrameLayer frame={exiting} className="tongbar-frame-exit" layerStyle={layerStyle} />
      )}
      <FrameLayer
        frame={active}
        className="tongbar-frame-enter"
        layerStyle={layerStyle}
        priority
      />
    </div>
  );
}

/** 单层渲染：MOTIONS 中有 .webm → <video> autoplay loop；否则 fallback 到 PNG。 */
function FrameLayer({
  frame,
  className,
  layerStyle,
  priority = false,
}: {
  frame: FrameKey;
  className: string;
  layerStyle: CSSProperties;
  priority?: boolean;
}) {
  const motion = MOTIONS[frame];
  const style: CSSProperties = {
    ...layerStyle,
    transform: `scale(${FRAME_SCALE[frame]})`,
  };
  if (motion) {
    return (
      <video
        key={`${className}-${frame}`}
        src={motion}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={className}
        style={style}
      />
    );
  }
  return (
    <Image
      key={`${className}-${frame}`}
      src={FRAMES[frame]}
      alt=""
      fill
      sizes="130px"
      priority={priority}
      draggable={false}
      unoptimized
      className={className}
      style={style}
    />
  );
}

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
const CAT_W = 130;
const CAT_H = 130;
const EDGE_GAP = 14; // 探出（happy）时离边的距离
const MARGIN = 12;
const DRAG_THRESHOLD = 8;
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

// peek 三张专用图的"边缘留白"补偿。AI 出图很难做到 0 透明 margin，
// 这里按测量到的 alpha bounds 把 box 推出 viewport 让猫真正贴边。
// 数值由 alpha-scan 得出（see commit message）；如果重新生成图后 padding 不同，
// 在浏览器 console 跑一次 measure() 函数刷新这三个值即可。
const PEEK_EDGE_COMPENSATION: Record<Edge, number> = {
  left: -17, // peek_left.png 左留白约 13%
  right: -34, // peek_right.png 右留白约 26%（构图偏中，建议重生时强调 flush）
  bottom: 0, // peek_new.png 已贴底
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
  const [transient, setTransient] = useState<FrameKey | null>(null);

  const downXY = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  const retractTimer = useRef<number | null>(null);
  const rotateTimer = useRef<number | null>(null);
  const transientTimer = useRef<number | null>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();

  // 触发一段瞬态覆盖帧（meow / stretch / …），到时自动清除
  const triggerTransient = (frame: FrameKey) => {
    setTransient(frame);
    if (transientTimer.current) window.clearTimeout(transientTimer.current);
    transientTimer.current = window.setTimeout(() => {
      setTransient(null);
    }, TRANSIENT_HOLD_MS[frame] ?? 600);
  };

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

  // peek → happy 醒来时伸个懒腰
  useEffect(() => {
    if (popped) triggerTransient('stretch');
  }, [popped]);

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
      const sideOff = popped ? EDGE_GAP : PEEK_EDGE_COMPENSATION[edge];
      const top = clamp(
        offset * win.h - CAT_H / 2,
        MARGIN,
        Math.max(MARGIN, win.h - CAT_H - MARGIN),
      );
      return edge === 'left' ? { left: sideOff, top } : { right: sideOff, top };
    }
    const bottomOff = popped ? EDGE_GAP : PEEK_EDGE_COMPENSATION.bottom;
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

  const message = TONGBAR_MESSAGES[idx];
  const text = lang === 'zh' ? message.zh : message.en;
  const state: CatState = dragging ? 'wiggle' : popped ? 'happy' : 'peek';

  // forcedFrame：happy 状态下事件触发的瞬态覆盖（meow / stretch 等）。
  // 不走 hover “兴奋”状态了——鼠标进出带来的闪烁代价太大。
  const forcedFrame: FrameKey | null = state === 'happy' ? transient ?? null : null;

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
        {/* 姿态动画层 —— wiggle/breathe/bob。三张 peek 专用图各按边缘构图，不需要镜像。 */}
        <div
          style={{
            width: '100%',
            height: '100%',
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
          <TongbarCat state={state} edge={anchor.edge} forcedFrame={forcedFrame} />
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
