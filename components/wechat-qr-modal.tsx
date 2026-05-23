'use client';

import { useState } from 'react';
import { useLang } from './lang-context';

/**
 * 微信扫码卡片 + 二维码弹窗
 * 用法：<WechatQrModal />
 *
 * 二维码图片需要 Claire 自己存到 public/wechat-qr.png（任何浏览器扫描可用尺寸）。
 */
export default function WechatQrModal() {
  const [open, setOpen] = useState(false);
  const { lang, t } = useLang();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="thiings-card group flex w-full items-center gap-6 p-7 text-left"
      >
        <span className="thiings-object" style={{ fontSize: 60 }} aria-hidden="true">
          💬
        </span>
        <div>
          <div className="font-rounded text-xl font-semibold">
            {t({ zh: '微信 · WeChat', en: 'WeChat' })}
          </div>
          <div className="mt-1 text-sm text-ink-3">
            {t({ zh: '点击扫码 → 直接加我', en: 'Tap to scan → add me directly' })}
          </div>
        </div>
        <span
          aria-hidden="true"
          className="ml-auto text-2xl text-ink-4 transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'zh' ? '微信二维码' : 'WeChat QR code'}
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
                {t({ zh: '扫码加我', en: 'Scan to add me' })}
              </div>
              <div className="mt-1 text-sm text-ink-3">
                {t({ zh: 'Claire · 5.23 线下课', en: 'Claire · 5.23 in-person session' })}
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/wechat-qr.jpg"
              alt={lang === 'zh' ? '微信二维码' : 'WeChat QR code'}
              className="mx-auto block w-full max-w-xs rounded-2xl"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                const fallback = document.getElementById('wechat-qr-fallback');
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div
              id="wechat-qr-fallback"
              style={{ display: 'none' }}
              className="mt-4 rounded-xl bg-paper p-4 text-center text-sm text-ink-3"
            >
              {lang === 'zh' ? (
                <>二维码图片还没准备好<br />请把 wechat-qr.png 放到 public/ 目录</>
              ) : (
                <>QR code image not ready yet<br />Place wechat-qr.png in the public/ folder</>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
