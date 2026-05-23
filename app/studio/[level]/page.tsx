import { notFound } from 'next/navigation';
import { CHAPTERS, type Chapter } from '@/lib/content';
import ChapterClient from './chapter-client';

const ALL_SLUGS = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'aside'] as const;
type Slug = (typeof ALL_SLUGS)[number];

export function generateStaticParams() {
  return ALL_SLUGS.map((level) => ({ level }));
}

const ASIDE_CHAPTER = {
  level: 'aside' as const,
  num: '§',
  name: '旁支 · 推荐系统',
  nameEn: 'Side branch · Recommender Systems',
  era: '不在主线 · 但你天天打交道',
  eraEn: 'Off the main line — but you touch it daily',
  glyph: '🎲',
  tagline:
    '它不在主线上，但小红书 For You、B站首页、小宇宙发现页全靠它。技术上是 L2 + L3 的混搭，近年开始嵌 L4。',
  taglineEn:
    "Not on the main path, but Xiaohongshu For You, Bilibili home, Xiaoyuzhou discover all run on this. Technically an L2 + L3 mashup, with L4 sneaking in lately.",
  keys: ['推荐系统架构', '推荐算法', '冷启动', '协同过滤'],
  keysEn: ['Recommender architecture', 'Recommendation algorithms', 'Cold start', 'Collaborative filtering'],
  keywordGroups: [
    {
      emoji: '🏷️',
      label: '落在这层的词',
      labelEn: 'Terms that live here',
      tags: ['推荐系统架构', '推荐算法', '冷启动', '协同过滤'],
      tagsEn: ['Recommender architecture', 'Recommendation algorithms', 'Cold start', 'Collaborative filtering'],
    },
  ],
  examples: [
    '冷启动：你新发的第一条笔记，平台不知道推给谁——这就是冷启动问题',
    '协同过滤：经典推荐算法的灵魂——"喜欢 A 的人也喜欢 B"',
  ],
  examplesEn: [
    'Cold start: your very first post — the platform doesn\'t know who to show it to. That\'s the cold-start problem.',
    'Collaborative filtering: the soul of classic recommenders — "people who liked A also liked B".',
  ],
  secondary: {
    label: '为什么单独列',
    labelEn: 'Why it gets its own page',
    text: '它不在主线上，但小红书 For You、B站首页、小宇宙发现页全靠它。',
    textEn: 'It\'s off the main line, but Xiaohongshu For You, Bilibili home, and Xiaoyuzhou discover all run on it.',
  },
} satisfies Chapter;

export default function ChapterPage({ params }: { params: { level: string } }) {
  const slug = params.level as Slug;
  if (!ALL_SLUGS.includes(slug)) notFound();

  const ch: Chapter =
    slug === 'aside' ? ASIDE_CHAPTER : (CHAPTERS.find((c) => c.level === slug) as Chapter);

  // Prev / next within main chapters (top→bottom: L6 → L1, then aside)
  const idx = slug === 'aside' ? -1 : CHAPTERS.findIndex((c) => c.level === slug);
  const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
  const next = idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;

  return <ChapterClient slug={slug} ch={ch} prev={prev} next={next} />;
}
