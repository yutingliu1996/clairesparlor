'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 右下角 BGM 唱片机
 * - 默认：唱针停在右上方，唱片不转
 * - 点击：唱针落到唱片外圈 → 唱片旋转 → 飘出音符 → 音乐响起
 * - 再点：唱针抬回 rest → 唱片停 → 音乐停
 * - 一首结束自动切下一首，整个歌单循环播放
 *
 * 歌单：网易云 ID 7247223624（Claire's Parlor BGM · 芭蕾基训音乐）
 *   通过 outer URL 拿单首 mp3 流：
 *   https://music.163.com/song/media/outer/url?id={SONG_ID}.mp3
 *
 * 换歌单：用 curl 抓 https://music.163.com/api/playlist/detail?id=XXX 拿 tracks 数组，
 *   把 id/name 填到下面 PLAYLIST。注意要选公开/非 VIP 歌，否则 outer URL 会重定向到 /404。
 */
const PLAYLIST = [
  { id: '1318249120', name: 'Battements tendus — Don Giovanni · La ci darem la mano' },
  { id: '1318248535', name: 'Battements jetés — Le Nozze di Figaro · Non so più' },
  { id: '1302041977', name: 'Battement Tendu Simple · 2/4' },
  { id: '1315751736', name: 'Pavana-Capricho, Op. 12' },
  { id: '1318226674', name: 'Pas Balancé — Someday My Prince Will Come' },
  { id: '1318201041', name: 'Ronds de jambe par terre 2' },
  { id: '1303322481', name: 'Battement relevé lent / développée · 3/4' },
  { id: '1307891951', name: 'Tutus and Ballet Shoes · 4/4' },
  { id: '1315752761', name: 'La Esmeralda, Act 1: Esmeralda Variation' },
  { id: '1302023499', name: 'Grand battement · 2/4' },
];

// 飘出的音符 — 每颗各自的位置/延迟/时长，循环播放
const NOTES = [
  { char: '♪', left: -10, delay: '0s',   dur: '3.2s' },
  { char: '♫', left: 18,  delay: '0.6s', dur: '3.6s' },
  { char: '♩', left: 42,  delay: '1.2s', dur: '3.0s' },
  { char: '♬', left: 6,   delay: '1.8s', dur: '3.4s' },
  { char: '♪', left: 30,  delay: '2.4s', dur: '3.8s' },
];

export default function BgmVinyl() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);

  const track = PLAYLIST[trackIdx];
  const songUrl = `https://music.163.com/song/media/outer/url?id=${track.id}.mp3`;

  // 切歌后如果还在播放，自动续播下一首；初始挂载时 playing=false，不会误触发
  useEffect(() => {
    if (playing && audioRef.current) {
      audioRef.current.play().catch((err) => {
        // eslint-disable-next-line no-console
        console.warn('[bgm] play after track change failed:', err);
      });
    }
    // playing 不放进依赖：暂停/继续走 toggle，这里只关心切歌
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      // 在用户点击的同步上下文里调 play()，绕过浏览器 autoplay 限制
      audio
        .play()
        .then(() => setPlaying(true))
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.warn('[bgm] play failed:', err);
        });
    }
  };

  const handleEnded = () => {
    setTrackIdx((i) => (i + 1) % PLAYLIST.length);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* 真音频元素 — 始终挂载，preload=none 不浪费首屏带宽
         注意：不要加 crossOrigin，否则浏览器会因 netease 不返回 CORS 头而拒绝播放 */}
      <audio ref={audioRef} src={songUrl} preload="none" onEnded={handleEnded} />

      {/* 飘出的音符 — 仅 playing 时渲染 */}
      {playing && (
        <div className="pointer-events-none absolute bottom-16 right-2 h-32 w-24">
          {NOTES.map((n, i) => (
            <span
              key={i}
              className="absolute bottom-0 text-lg"
              style={{
                left: `${n.left}px`,
                color: '#FF5733',
                animation: `bgm-note-float ${n.dur} ease-in ${n.delay} infinite`,
              }}
            >
              {n.char}
            </span>
          ))}
        </div>
      )}

      {/* 唱片机：vinyl + tonearm 一体，整块按钮 */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause: ${track.name}` : `Play: ${track.name}`}
        title={track.name}
        aria-pressed={playing}
        className="relative block h-20 w-20 transition-transform hover:scale-105"
      >
        {/* 唱片 — 右下角 56x56
            class `bgm-vinyl-disc` 用作 dark 模式的钩子（globals.css 里加亮 groove + 银色边） */}
        <span
          className="bgm-vinyl-disc absolute bottom-0 right-0 block h-14 w-14 overflow-hidden rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          style={{
            background:
              'radial-gradient(circle, #2a2a2a 0%, #0a0a0a 28%, #1a1a1a 35%, #0a0a0a 65%, #2a2a2a 100%)',
            animation: playing ? 'vinyl-spin 6s linear infinite' : 'none',
          }}
        >
          {/* 唱片中心标贴 */}
          <span
            className="absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px]"
            style={{ background: '#FF5733' }}
          >
            🎵
          </span>
          {/* 唱片中心针孔 — class `bgm-vinyl-pin` 让 dark 模式下保留白点（不被 bg-paper 全局深色覆盖） */}
          <span className="bgm-vinyl-pin absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper" />
        </span>

        {/* 唱针 — 仿网易云风格：纯白扁平、轻微 drop-shadow、臂身略带弯折
            CSS rotate 顺时针为正：原始 stylus 矢量在 pivot 的"下方稍偏左"，
            所以负角度把唱头甩向 vinyl 右侧（自然的右落臂方向） */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute"
          width="32"
          height="64"
          viewBox="0 0 32 64"
          style={{
            top: 0,
            right: 4,
            transformOrigin: '16px 9px',
            transform: playing ? 'rotate(-25deg)' : 'rotate(-42deg)',
            transition: 'transform 0.75s cubic-bezier(.7,.05,.3,1)',
            overflow: 'visible',
          }}
        >
          <defs>
            <filter id="bgmShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1.2" stdDeviation="0.9" floodColor="#000" floodOpacity="0.28" />
            </filter>
          </defs>

          {/* 支点圆 — 主轴 */}
          <circle cx="16" cy="9" r="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" filter="url(#bgmShadow)" />
          {/* 支点中心黑孔 */}
          <circle cx="16" cy="9" r="1.6" fill="#1f1f23" />

          {/* 臂身 — 白色管，从支点垂直向下，中间略弯折再倾斜到唱头 */}
          <path
            d="M 16 15.5 L 16 24 Q 16 27 14.6 29.5 L 9 55"
            stroke="#ffffff"
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
            filter="url(#bgmShadow)"
          />

          {/* 唱头 — 白色小盒，简洁机械风 */}
          <g transform="translate(9 55)">
            <rect
              x="-5"
              y="0"
              width="10"
              height="6"
              rx="1.6"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="0.4"
              filter="url(#bgmShadow)"
            />
            {/* 唱头中线（机械分缝） */}
            <rect x="-3.6" y="1.7" width="7.2" height="0.6" fill="#94a3b8" opacity="0.45" />
            {/* 针尖 */}
            <path d="M -1 6 L 1 6 L 0 8 Z" fill="#1f1f23" />
          </g>
        </svg>
      </button>

      <style jsx>{`
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes bgm-note-float {
          0%   { transform: translate(0, 0)        rotate(-8deg); opacity: 0; }
          15%  { opacity: 1; }
          50%  { transform: translate(-14px, -60px)  rotate(6deg);  opacity: 0.9; }
          100% { transform: translate(-26px, -120px) rotate(-4deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
