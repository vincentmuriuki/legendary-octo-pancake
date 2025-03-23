'use client';

import { useSession } from 'next-auth/react';

export function AdminPanel() {
  const { data: session } = useSession();

  if (session?.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className='p-6 border rounded-lg'>
      <h2 className='text-xl font-bold mb-4'>Admin Dashboard</h2>
    </div>
  );
}
