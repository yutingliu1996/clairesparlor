'use client';

import { useState, type ReactNode } from 'react';
import { useLang } from './lang-context';

/**
 * 通用二维码弹窗 — 用于 find-me / cooperate 等场景
 * 点击 children 卡 → 弹 QR modal
 */
export default function QrCardModal({
  qrSrc,
  titleZh,
  titleEn,
  subZh,
  subEn,
  children,
}: {
  qrSrc: string;
  titleZh: string;
  titleEn: string;
  subZh?: string;
  subEn?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="block w-full text-left">
        {children}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="thiings-card relative max-w-md p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={lang === 'zh' ? '关闭' : 'Close'}
              className="absolute right-4 top-4 text-2xl text-ink-3 hover:text-ink"
            >
              ×
            </button>
            <div className="mb-4 text-center">
              <div className="font-rounded text-xl font-semibold">
                {lang === 'zh' ? titleZh : titleEn}
              </div>
              {(subZh || subEn) && (
                <div className="mt-1 text-sm text-ink-3">
                  {lang === 'zh' ? subZh : subEn}
                </div>
              )}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSrc}
              alt={lang === 'zh' ? titleZh : titleEn}
              className="mx-auto block w-full max-w-xs rounded-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
