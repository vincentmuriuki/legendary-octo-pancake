'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant='ghost'
      onClick={() => router.back()}
      className='gap-1 pl-0 hover:bg-transparent'
    >
      <ArrowLeft className='h-4 w-4' />
      <span className='hidden sm:inline'>Back</span>
    </Button>
  );
}
