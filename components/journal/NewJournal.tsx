'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EntryForm } from '@/components/journal/EntryForm';
import { useEffect, useState } from 'react';

export default function NewEntryPage({ user }: { user: any }) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/categories`)
        .then((res) => res.json())
        .then(setCategories)
        .catch(console.error);
    }
  }, [user]);

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        router.push('/journal');
      }
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className='p-8 max-w-3xl mx-auto'>
      <div className='mb-8'>
        <Link
          href='/journal'
          className='text-gray-600 hover:text-gray-900'
        >
          &larr; Back to Journal
        </Link>
      </div>
      <h1 className='text-2xl font-bold mb-8'>New Journal Entry</h1>
      <EntryForm
        categories={categories}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
