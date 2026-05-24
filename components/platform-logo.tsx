/**
 * PlatformLogo — renders the official iOS App Store icon for each
 * social platform.
 *
 * Icons under public/logos/{key}.png are the platform's own published
 * 512×512 app artwork, fetched once via iTunes Search API and
 * committed to the repo. No third-party icon packages, no hand-drawn
 * approximations — what users see is exactly what they see on their
 * phone home screen.
 */

type Props = {
  platform: string;
  size?: number;
};

const ALT: Record<string, string> = {
  rednote: '小红书',
  bili: '哔哩哔哩',
  douyin: '抖音',
  xyz: '小宇宙',
  netease: '网易云音乐',
  wechat: '微信',
  channels: '微信视频号',
  jike: '即刻',
  yt: 'YouTube',
  x: 'X',
  substack: 'Substack',
  reddit: 'Reddit',
  mail: 'Gmail',
};

// 2026-05-24 视频号官方 logo（白色 SVG + 品牌橙→红渐变背景），
// 走特例渲染，不走 /logos/{key}.png 的通用路径
function ChannelsLogo({ size }: { size: number }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl"
      style={{
        width: size,
        height: size,
        background:
          'linear-gradient(135deg, #FFB849 0%, #FE7A3B 50%, #FE4F38 100%)',
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.06), 0 4px 10px -4px rgba(0,0,0,0.10)',
      }}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/channels.svg"
        alt="微信视频号"
        loading="lazy"
        decoding="async"
        style={{ width: size * 0.62, height: size * 0.62 }}
      />
    </span>
  );
}

export default function PlatformLogo({ platform, size = 48 }: Props) {
  if (platform === 'channels') return <ChannelsLogo size={size} />;
  const key = platform in ALT ? platform : 'mail';
  return (
    <span
      className="relative flex shrink-0 overflow-hidden rounded-xl"
      style={{
        width: size,
        height: size,
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.06), 0 4px 10px -4px rgba(0,0,0,0.10)',
      }}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/logos/${key}.png`}
        alt={ALT[key]}
        width={size * 2}
        height={size * 2}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </span>
  );
}
