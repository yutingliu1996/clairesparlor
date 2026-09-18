"use client";

import Link from 'next/link';
import { useLang } from '@/components/lang-context';
import { PRODUCTS } from '@/lib/content';

export default function ProductsPage() {
  const { lang, t } = useLang();
  return (
    <div className="wrap pb-24 pt-10 md:pt-14">
      <Link href="/studio/" className="inline-flex min-h-11 items-center text-sm text-ink-2 hover:text-ink">
        ← {t({ zh: '回工作台', en: 'Back to the studio' })}
      </Link>
      <header className="mb-9 mt-5 max-w-4xl">
        <p className="eyebrow">Studio · {t({ zh: '做出来的东西', en: 'Things I make' })}</p>
        <h1 className="mt-4 text-display-md font-semibold tracking-tight">{lang === 'zh' ? PRODUCTS.title : PRODUCTS.titleEn}{lang === 'zh' ? '。' : '.'}</h1>
        <p className="title-sub mt-5 text-xl leading-relaxed md:text-2xl">{lang === 'zh' ? PRODUCTS.intro : PRODUCTS.introEn}</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        {PRODUCTS.items.map((product) => (
          // Standalone products use full navigation rather than the Next.js router.
          <a key={product.id} href={product.href} className="thiings-card group flex flex-col overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.preview} alt={lang === 'zh' ? product.title + '预览' : product.titleEn + ' preview'} width="1200" height="760" className="aspect-[30/19] w-full object-cover object-top" />
            <div className="flex flex-1 flex-col p-6 md:p-8">
              <p className="text-sm" style={{ color: 'var(--accent-text)' }}>{lang === 'zh' ? product.status : product.statusEn}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">{lang === 'zh' ? product.title : product.titleEn}</h2>
              <p className="mt-3 text-base leading-relaxed text-ink-2">{lang === 'zh' ? product.description : product.descriptionEn}</p>
              <div className="mt-5 flex flex-wrap gap-2">{(lang === 'zh' ? product.tags : product.tagsEn).map((tag) => <span key={tag} className="rounded-full bg-paper px-3 py-1 text-sm text-ink-2">{tag}</span>)}</div>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6 text-sm">
                <span className="text-ink-2">{t({ zh: '更新于', en: 'Updated' })} <time dateTime={product.updatedAt}>{product.updatedAt.replaceAll('-', '.')}</time></span>
                <span className="font-medium" style={{ color: 'var(--accent-text)' }}>{lang === 'zh' ? PRODUCTS.openLabel : PRODUCTS.openLabelEn} <span aria-hidden="true">→</span></span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
