'use client';

import { useState } from 'react';

export function useCopyToClipboard(resetDelay: number = 2000) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), resetDelay);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setIsCopied(false);
      return false;
    }
  };

  return { isCopied, copy };
}
