'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

interface AuthRequiredProps {
  loginHref: string;
  message: string;
  loginLabel: string;
  className?: string;
}

export function AuthRequired({ loginHref, message, loginLabel, className }: AuthRequiredProps) {
  return (
    <div className={`flex min-h-[60vh] items-center justify-center px-4 ${className ?? ''}`}>
      <EmptyState
        tone="brand"
        icon={<Lock className="h-7 w-7" />}
        title={message}
        action={
          <Link href={loginHref}>
            <Button>{loginLabel}</Button>
          </Link>
        }
      />
    </div>
  );
}
