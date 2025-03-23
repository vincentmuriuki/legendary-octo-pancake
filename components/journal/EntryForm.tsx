'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { CategorySelect } from '@/components/journal/CategorySelect';
import { z } from 'zod';

const entrySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  date: z.date(),
  categoryIds: z.array(z.string()),
});

export function EntryForm({
  initialData,
  onSubmit,
  categories,
}: {
  initialData?: Partial<z.infer<typeof entrySchema>>;
  onSubmit: (data: z.infer<typeof entrySchema>) => Promise<void>;
  categories: { id: string; name: string }[];
}) {
  const form = useForm<z.infer<typeof entrySchema>>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      date: initialData?.date || new Date(),
      categoryIds: initialData?.categoryIds || [],
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-6 max-w-3xl mx-auto'
    >
      <div className='space-y-2'>
        <Label htmlFor='title'>Title</Label>
        <Input
          {...form.register('title')}
          id='title'
          placeholder='Journal entry title'
        />
        {form.formState.errors.title && (
          <p className='text-sm text-red-500'>
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label>Date</Label>
        <Calendar
          mode='single'
          selected={form.watch('date')}
          onSelect={(date) => form.setValue('date', date || new Date())}
        />
      </div>

      <div className='space-y-2'>
        <Label>Categories</Label>
        <CategorySelect
          categories={categories}
          selectedIds={form.watch('categoryIds')}
          onSelect={(ids) => form.setValue('categoryIds', ids)}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='content'>Content</Label>
        <Textarea
          {...form.register('content')}
          id='content'
          rows={8}
          placeholder='Write your journal entry here...'
        />
        {form.formState.errors.content && (
          <p className='text-sm text-red-500'>
            {form.formState.errors.content.message}
          </p>
        )}
      </div>

      <Button
        type='submit'
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? 'Saving...' : 'Save Entry'}
      </Button>
    </form>
  );
}
