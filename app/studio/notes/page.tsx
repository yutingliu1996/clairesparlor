'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLang } from '@/components/lang-context';
import { LEARNING_NOTES } from '@/lib/content';
import versions from '@/lib/learning-note-versions.json';

export default function LearningNotesPage() {
  const { lang, t } = useLang();
  const [category, setCategory] = useState('all');
  const [hasUpdate, setHasUpdate] = useState(false);
  const notes = [...LEARNING_NOTES.items]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .filter((note) => category === 'all' || note.kind === category);
  const currentCategory = LEARNING_NOTES.categories.find((item) => item.id === category);

  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();
    const check = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const response = await fetch('/studio/notes/updates.json', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) return;
        const latest = await response.json();
        if (!disposed && typeof latest.version === 'string' && latest.version !== versions.version) setHasUpdate(true);
      } catch { /* The current notes remain readable when offline. */ }
    };
    void check();
    const timer = window.setInterval(check, 60_000);
    document.addEventListener('visibilitychange', check);
    return () => {
      disposed = true;
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);

  return (
    <div className="wrap pb-24 pt-10 md:pt-14">
      <Link href="/studio/" className="inline-flex min-h-11 items-center text-sm text-ink-2 hover:text-ink">
        ← {t({ zh: '回工作台', en: 'Back to the studio' })}
      </Link>
      <header className="mb-9 mt-5 max-w-4xl">
        <p className="eyebrow">Learning notes · {t({ zh: '学习记录', en: 'A growing collection' })}</p>
        <h1 className="mt-4 text-display-md font-semibold tracking-tight">{lang === 'zh' ? LEARNING_NOTES.title : LEARNING_NOTES.titleEn}{lang === 'zh' ? '。' : '.'}</h1>
        <p className="title-sub mt-5 text-xl leading-relaxed md:text-2xl">{lang === 'zh' ? LEARNING_NOTES.intro : LEARNING_NOTES.introEn}</p>
        <p className="mt-4 text-sm leading-relaxed text-ink-2">{t({ zh: '每篇笔记有固定网址，后续补充会更新在原页面。', en: 'Each note keeps the same address as new material is added.' })}</p>
      </header>

      {hasUpdate && (
        <div role="status" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface p-4 shadow-soft">
          <span>{t({ zh: '有新笔记或新内容可以看了。', en: 'New notes or updates are available.' })}</span>
          <button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-full bg-paper px-5 font-medium" style={{ color: 'var(--accent-text)' }}>
            {t({ zh: '查看更新', en: 'View updates' })}
          </button>
        </div>
      )}

      <div role="group" aria-label={t({ zh: '按笔记类型筛选', en: 'Filter notes by type' })} className="mb-8 flex flex-wrap gap-2">
        {[{ id: 'all', name: '全部', nameEn: 'All notes' }, ...LEARNING_NOTES.categories].map((item) => {
          const count = item.id === 'all' ? LEARNING_NOTES.items.length : LEARNING_NOTES.items.filter((note) => note.kind === item.id).length;
          return (
            <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors"
              style={category === item.id ? { color: 'var(--accent-text)', background: 'var(--accent-pill)' } : undefined}>
              {lang === 'zh' ? item.name : item.nameEn}<span className="text-xs text-ink-2">{count}</span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite" aria-atomic="true" className="mb-5 text-sm text-ink-2">
        {t({ zh: `${notes.length} 篇已公开笔记`, en: `${notes.length} published ${notes.length === 1 ? 'note' : 'notes'}` })}
      </div>
      {notes.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {notes.map((note) => {
            const kind = LEARNING_NOTES.categories.find((item) => item.id === note.kind);
            return (
              <a key={note.id} href={note.href} className="thiings-card group flex flex-col p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span style={{ color: 'var(--accent-text)' }}>{lang === 'zh' ? kind?.name : kind?.nameEn}</span>
                  <span className="text-ink-2">{lang === 'zh' ? note.status : note.statusEn}</span>
                </div>
                <h2 className="mt-5 text-xl font-semibold leading-relaxed tracking-tight md:text-2xl">{lang === 'zh' ? note.title : note.titleEn}</h2>
                <p className="mt-3 text-base leading-relaxed text-ink-2">{lang === 'zh' ? note.description : note.descriptionEn}</p>
                <div className="mt-5 flex flex-wrap gap-2">{(lang === 'zh' ? note.tags : note.tagsEn).map((tag) => <span key={tag} className="rounded-full bg-paper px-3 py-1 text-sm text-ink-2">{tag}</span>)}</div>
                <p className="mt-5 text-sm text-ink-2">{lang === 'zh' ? note.updateNote : note.updateNoteEn}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6 text-sm">
                  <span className="text-ink-2">{t({ zh: '更新于', en: 'Updated' })} <time dateTime={note.updatedAt}>{note.updatedAt.replaceAll('-', '.')}</time></span>
                  <span className="font-medium" style={{ color: 'var(--accent-text)' }}>{lang === 'zh' ? LEARNING_NOTES.readLabel : LEARNING_NOTES.readLabelEn} <span aria-hidden="true">→</span></span>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl bg-surface px-7 py-12 shadow-soft">
          <h2 className="text-xl font-semibold">{t({ zh: '这类笔记还没有公开。', en: 'No published notes here yet.' })}</h2>
          <p className="mt-3 text-base text-ink-2">{lang === 'zh' ? `${currentCategory?.name ?? '这类'}的笔记，整理好后会放到这里。` : `Notes from ${currentCategory?.nameEn.toLowerCase() ?? 'this category'} will appear here when ready.`}</p>
          <button type="button" onClick={() => setCategory('all')} className="mt-5 min-h-11 text-sm font-medium" style={{ color: 'var(--accent-text)' }}>{t({ zh: '先看已有笔记 →', en: 'Browse the published notes →' })}</button>
        </div>
      )}
    </div>
  );
}
