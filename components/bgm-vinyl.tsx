'use client';

import { useState } from 'react';

/**
 * 右下角 BGM 唱片浮窗（仿网易云）
 * - vinyl 持续旋转
 * - 点击：展开/收起网易云 player iframe（含 play/pause 控制）
 * - autoplay=1 浏览器允许时自动播放（不允许就要用户进 iframe 点）
 *
 * 默认歌单：7247223624 (Claire's Parlor BGM)
 * Claire 想换芭蕾歌单 → 把网易云歌单 URL 里的 id 改这里即可
 */
const PLAYLIST_ID = '7247223624';

export default function BgmVinyl() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && (
        <iframe
          title="BGM player"
          src={`https://music.163.com/outchain/player?type=0&id=${PLAYLIST_ID}&auto=1&height=66`}
          width="330"
          height="86"
          frameBorder="0"
          allow="autoplay"
          className="rounded-2xl shadow-2xl"
        />
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close BGM' : 'Open BGM'}
        className="relative h-14 w-14 overflow-hidden rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform hover:scale-105"
        style={{
          background:
            'radial-gradient(circle, #2a2a2a 0%, #0a0a0a 28%, #1a1a1a 35%, #0a0a0a 65%, #2a2a2a 100%)',
          animation: 'vinyl-spin 6s linear infinite',
        }}
      >
        {/* 唱片中心标贴 */}
        <span
          className="absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px]"
          style={{ background: '#FF5733' }}
        >
          🎵
        </span>
        {/* 唱片中心针孔 */}
        <span
          className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper"
        />
      </button>

      <style jsx>{`
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
