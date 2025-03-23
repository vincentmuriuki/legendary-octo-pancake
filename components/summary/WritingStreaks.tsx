'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

export function WritingStreaks({ userId }: { userId: string }) {
  const [streaks, setStreaks] = useState<{
    current: number;
    longest: number;
  }>();

  useEffect(() => {
    fetch(`/api/summary/streaks?userId=${userId}`)
      .then((res) => res.json())
      .then(setStreaks);
  }, [userId]);

  if (!streaks) return null;

  return (
    <div className='p-4 bg-card rounded-lg'>
      <h3 className='text-lg font-semibold mb-4'>Writing Streaks</h3>
      <div className='flex gap-4'>
        <div className='text-center'>
          <div className='text-2xl font-bold'>{streaks.current}</div>
          <div className='text-sm text-muted-foreground'>Current Streak</div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold'>{streaks.longest}</div>
          <div className='text-sm text-muted-foreground'>Longest Streak</div>
        </div>
      </div>
    </div>
  );
}
