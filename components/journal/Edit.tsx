'use client';

import { useParams, useRouter } from 'next/navigation';
import { EntryForm } from '@/components/journal/EntryForm';
import { useEffect, useState } from 'react';

export default function EditEntryPage({ user }: { user: any }) {
  const { id } = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/entries/${id}`).then((res) => res.json()),
      fetch(`/api/entries/single`).then((res) => res.json()),
    ]).then(([entryData, categoriesData]) => {
      setEntry(entryData);
      setCategories(categoriesData);
    });
  }, [id]);

  const handleSubmit = async (data: any) => {
    const response = await fetch(`/api/entries/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push('/journal');
    }
  };

  if (!entry) return <div>Loading...</div>;

  return (
    <div className='p-8 max-w-3xl mx-auto'>
      <div className='mb-8'>
        <button
          onClick={() => router.back()}
          className='text-gray-600 hover:text-gray-900'
        >
          &larr; Back to Journal
        </button>
      </div>

      <h1 className='text-2xl font-bold mb-8'>Edit Journal Entry</h1>
      <EntryForm
        categories={categories}
        initialData={entry}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
