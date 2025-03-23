'use client';

import { useSession } from 'next-auth/react';
import { BackButton } from './back-button';
import { Breadcrumbs } from './breadcrumbs';
import { UserAccountNav } from './user-account-nav';

export function MainNav() {
  const { data: session } = useSession();

  return (
    <div className='flex items-center justify-between border-b px-4 h-16'>
      <div className='flex items-center gap-4'>
        <BackButton />
        <Breadcrumbs />
      </div>

      {session?.user && session?.user?.email && (
        <div className='flex items-center gap-4'>
          <UserAccountNav user={{ email: session.user.email }} />
        </div>
      )}
    </div>
  );
}
