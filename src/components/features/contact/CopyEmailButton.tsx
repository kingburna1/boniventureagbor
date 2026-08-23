'use client';

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Button } from '@/components/ui/Button';

export interface CopyEmailButtonProps {
  email: string;
}

export const CopyEmailButton: React.FC<CopyEmailButtonProps> = ({ email }) => {
  const { isCopied, copy } = useCopyToClipboard();

  return (
    <Button
      variant="secondary"
      onClick={() => copy(email)}
      icon={isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    >
      {isCopied ? 'Email Copied!' : email}
    </Button>
  );
};
