import Link from 'next/link';
import PageHeader from '@/components/page-header';
import SectionTitle from '@/components/section-title';

/**
 * /studio/tunes — 客厅音乐
 */
const TUNES = [
  { platform: '网易云音乐 · NetEase', name: "Claire's Parlor · 主歌单", note: '播客开头结尾的背景音乐 + 我自己循环最多的几首。主战场。', glyph: '🎧', href: 'https://music.163.com/playlist?id=7247223624', live: true },
  { platform: 'QQ 音乐 · QQ Music', name: "Claire's Parlor · 通勤版", note: '车上、走路、地铁。版权偶尔比网易云全一点。', glyph: '🎼', href: '#', live: false },
  { platform: 'Apple Music', name: "Claire's Parlor · 海外版", note: '海外朋友用。歌单还在搬。', glyph: '🍎', href: '#', live: false },
  { platform: 'Spotify', name: "Claire's Parlor · Global", note: '挂梯子的朋友直接听。歌单 sync 中。', glyph: '🟢', href: '#', live: false },
];

export default function TunesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Studio · 客厅音乐"
        glyph="🎵"
        title={<>在我客厅里<br />循环播放</>}
        lede={
          <>
            我是一个<strong className="text-ink">被音乐喂大的人</strong>。播客录制的暖场、写代码到深夜、车上单曲循环——都在这里。
            <em>这间客厅永远有 BGM</em>。
          </>
        }
      />

      <section className="wrap reveal pb-20">
        <SectionTitle eyebrow="🎧 Now Playing · 网易云外链" title="主歌单" />
        <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
          <iframe
            src="//music.163.com/outchain/player?type=0&id=7247223624&auto=0&height=430"
            width="100%"
            height="450"
            frameBorder="no"
            marginWidth={0}
            marginHeight={0}
            loading="lazy"
            title="Claire's Parlor BGM · 网易云歌单"
          />
        </div>
      </section>

      <section className="wrap reveal pb-24">
        <SectionTitle eyebrow="🎼 Across Platforms · 4 个平台" title="想从哪听" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {TUNES.map((t) => (
            <a
              key={t.platform}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`thiings-card group block p-7 ${!t.live ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start justify-between">
                <span className="thiings-object" style={{ fontSize: 56 }} aria-hidden="true">
                  {t.glyph}
                </span>
                {t.live ? (
                  <span className="pill pill-live text-[10px]">LIVE</span>
                ) : (
                  <span className="rounded-full border border-hairline px-2.5 py-0.5 text-[11px] text-ink-3">SOON</span>
                )}
              </div>
              <div className="mt-8">
                <div className="text-xs uppercase tracking-eyebrow text-ink-3">{t.platform}</div>
                <div className="mt-1 font-rounded text-xl font-semibold">{t.name}</div>
                <p className="mt-3 text-sm text-ink-2">{t.note}</p>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink">
                {t.live ? '打开' : 'Coming'} <span aria-hidden="true">→</span>
              </div>
            </a>
          ))}
        </div>

        <Link href="/studio" className="mt-12 inline-flex text-sm text-ink-3 hover:text-ink">
          ← 回工作台
        </Link>
      </section>
    </>
  );
}
