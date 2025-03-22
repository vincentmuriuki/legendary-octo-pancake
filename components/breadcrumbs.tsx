'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <nav className='flex items-center text-sm font-medium text-muted-foreground'>
      <Link
        href='/'
        className='hover:text-foreground transition-colors'
      >
        <Home className='h-4 w-4' />
      </Link>
      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <div
            key={segment}
            className='flex items-center'
          >
            <ChevronRight className='mx-2 h-4 w-4' />
            {isLast ? (
              <span className='text-foreground'>{formatSegment(segment)}</span>
            ) : (
              <Link
                href={href}
                className='hover:text-foreground transition-colors'
              >
                {formatSegment(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function formatSegment(segment: string) {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
