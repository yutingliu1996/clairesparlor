'use client';

import { useState } from 'react';

/**
 * Copy-to-clipboard button used in the IP prompt library.
 */
export default function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked — silent */
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-surface transition-colors hover:bg-white/15"
    >
      {copied ? '✓ 已复制' : '复制 prompt'}
    </button>
  );
}
