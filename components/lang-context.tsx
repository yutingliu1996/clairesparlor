'use client';

/**
 * LangContext — 全站语言切换的单一真源。
 *
 * 2026-05-24 重建：之前在 nav.tsx 用 local useState 只控制 nav 自己；
 * 现在提到 Context，所有 page / 组件用 useLang() 同步切换。
 *
 * 用法：
 *   const { lang, t } = useLang();
 *   <h1>{t({ zh: '一个空间。', en: 'One space.' })}</h1>
 */

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type Lang = 'zh' | 'en';
export type Localized = { zh: string; en: string };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (entry: Localized) => string;
};

const LangContext = createContext<Ctx | null>(null);
const KEY = 'claire-lang';

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === 'zh' || saved === 'en') setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { window.localStorage.setItem(KEY, l); } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
    }
  };

  const toggle = () => setLang(lang === 'zh' ? 'en' : 'zh');
  const t = (entry: Localized) => entry[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    return {
      lang: 'zh' as Lang,
      setLang: () => {},
      toggle: () => {},
      t: (entry: Localized) => entry.zh,
    };
  }
  return ctx;
}
