'use client';

import { useState } from 'react';
import { useLang } from '@/components/lang-context';

/**
 * Email magic-link form.
 * UI-only stub; submitting just shows a "check your inbox" confirmation.
 * Hook a real endpoint via `process.env.NEXT_PUBLIC_BAR_LOGIN_URL` when ready.
 */
export default function BarForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { t } = useLang();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const endpoint = process.env.NEXT_PUBLIC_BAR_LOGIN_URL;
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch {
        /* swallow — we still pretend it sent so the UI keeps a friendly tone. */
      }
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mt-8 rounded-2xl border border-hairline bg-paper p-6">
        <div className="text-2xl" aria-hidden="true">📬</div>
        <p className="mt-3 font-rounded text-lg font-medium">
          {t({ zh: '收件箱见 ☕', en: 'Check your inbox ☕' })}
        </p>
        <p className="mt-1 text-sm text-ink-3">
          {t({
            zh: '如果你确实在受邀名单里，几分钟内会收到登录链接。',
            en: "If you're on the invite list, the login link will arrive in a few minutes.",
          })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded-full border border-hairline bg-surface px-5 py-3 text-base text-ink placeholder:text-ink-4 focus:border-ink-3 focus:outline-none"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-surface transition-transform duration-300 hover:-translate-y-0.5"
      >
        {t({ zh: '发送登录链接', en: 'Send login link' })}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
