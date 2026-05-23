'use client';

import Link from 'next/link';
import PageHeader from '@/components/page-header';
import SectionTitle from '@/components/section-title';
import { useLang } from '@/components/lang-context';

/**
 * /studio/tunes — 客厅音乐
 */
type Tune = {
  platform: string;
  platformEn: string;
  name: string;
  nameEn: string;
  note: string;
  noteEn: string;
  glyph: string;
  href: string;
  live: boolean;
};

const TUNES: Tune[] = [
  {
    platform: '网易云音乐 · NetEase',
    platformEn: 'NetEase Music',
    name: "Claire's Parlor · 主歌单",
    nameEn: "Claire's Parlor · Main playlist",
    note: '播客开头结尾的背景音乐 + 我自己循环最多的几首。主战场。',
    noteEn: 'Podcast intros/outros + the tracks I loop the most. The main stage.',
    glyph: '🎧',
    href: 'https://music.163.com/playlist?id=7247223624',
    live: true,
  },
  {
    platform: 'QQ 音乐 · QQ Music',
    platformEn: 'QQ Music',
    name: "Claire's Parlor · 通勤版",
    nameEn: "Claire's Parlor · Commute edition",
    note: '车上、走路、地铁。版权偶尔比网易云全一点。',
    noteEn: 'In the car, walking, on the metro. Licensing is sometimes a touch wider than NetEase.',
    glyph: '🎼',
    href: '#',
    live: false,
  },
  {
    platform: 'Apple Music',
    platformEn: 'Apple Music',
    name: "Claire's Parlor · 海外版",
    nameEn: "Claire's Parlor · Global",
    note: '海外朋友用。歌单还在搬。',
    noteEn: 'For friends abroad. Playlist still migrating.',
    glyph: '🍎',
    href: '#',
    live: false,
  },
  {
    platform: 'Spotify',
    platformEn: 'Spotify',
    name: "Claire's Parlor · Global",
    nameEn: "Claire's Parlor · Global",
    note: '挂梯子的朋友直接听。歌单 sync 中。',
    noteEn: 'For friends on a VPN. Playlist syncing.',
    glyph: '🟢',
    href: '#',
    live: false,
  },
];

export default function TunesPage() {
  const { lang, t } = useLang();
  return (
    <>
      <PageHeader
        eyebrow={t({ zh: 'Studio · 客厅音乐', en: 'Studio · Parlor Tunes' })}
        glyph="🎵"
        title={
          lang === 'zh'
            ? <>在我客厅里<br />循环播放</>
            : <>On loop<br />in the parlor</>
        }
        lede={
          lang === 'zh' ? (
            <>
              我是一个<strong className="text-ink">被音乐喂大的人</strong>。播客录制的暖场、写代码到深夜、车上单曲循环——都在这里。
              <em>这间客厅永远有 BGM</em>。
            </>
          ) : (
            <>
              I&apos;m <strong className="text-ink">someone music raised</strong>. Pre-recording warm-ups, late-night coding sessions, in-car loops — they all live here.
              <em> The parlor always has a soundtrack.</em>
            </>
          )
        }
      />

      <section className="wrap reveal pb-20">
        <SectionTitle
          eyebrow={t({ zh: '🎧 Now Playing · 网易云外链', en: '🎧 Now Playing · NetEase embed' })}
          title={t({ zh: '主歌单', en: 'Main playlist' })}
        />
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
        <SectionTitle
          eyebrow={t({ zh: '🎼 Across Platforms · 4 个平台', en: '🎼 Across Platforms' })}
          title={t({ zh: '想从哪听', en: 'Pick your platform' })}
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {TUNES.map((tune) => (
            <a
              key={tune.platform}
              href={tune.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`thiings-card group block p-7 ${!tune.live ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start justify-between">
                <span className="thiings-object" style={{ fontSize: 56 }} aria-hidden="true">
                  {tune.glyph}
                </span>
                {tune.live ? (
                  <span className="pill pill-live text-[10px]">LIVE</span>
                ) : (
                  <span className="rounded-full border border-hairline px-2.5 py-0.5 text-[11px] text-ink-3">SOON</span>
                )}
              </div>
              <div className="mt-8">
                <div className="text-xs uppercase tracking-eyebrow text-ink-3">{lang === 'zh' ? tune.platform : tune.platformEn}</div>
                <div className="mt-1 font-rounded text-xl font-semibold">{lang === 'zh' ? tune.name : tune.nameEn}</div>
                <p className="mt-3 text-sm text-ink-2">{lang === 'zh' ? tune.note : tune.noteEn}</p>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink">
                {tune.live ? t({ zh: '打开', en: 'Open' }) : t({ zh: 'Coming', en: 'Coming' })} <span aria-hidden="true">→</span>
              </div>
            </a>
          ))}
        </div>

        <Link href="/studio" className="mt-12 inline-flex text-sm text-ink-3 hover:text-ink">
          {t({ zh: '← 回工作台', en: '← Back to Studio' })}
        </Link>
      </section>
    </>
  );
}
