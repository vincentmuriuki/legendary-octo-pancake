'use client';

import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { SentimentBadge } from '@/components/journal/SentimentBadge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function EntryList({ entries: initialEntries }: { entries: any[] }) {
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  const [entries, setEntries] = useState(initialEntries);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  const handleDelete = async (entryId: string) => {
    setDeletingId(entryId);
    const originalEntries = [...entries];
    console.log('entteyeyy id', entryId);

    try {
      // Optimistic update
      setEntries((prev) => prev.filter((entry) => entry.id !== entryId));

      const response = await fetch(`/api/entries/${entryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      router.refresh();
    } catch (error) {
      setEntries(originalEntries);
      console.error('Delete failed:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {entries.map((entry) => (
          <Card
            key={entry.id}
            className={`hover:shadow-lg transition-shadow h-full flex flex-col ${
              deletingId === entry.id ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <CardHeader>
              <CardTitle className='text-lg'>
                <div
                  className='line-clamp-1'
                  title={entry.title}
                >
                  {entry.title}
                </div>
              </CardTitle>
              <div className='text-sm text-gray-500'>
                {formatDate(entry.date)}
              </div>
            </CardHeader>

            <CardContent className='flex-1 space-y-2'>
              <p className='line-clamp-3 text-gray-600 mb-4'>{entry.content}</p>
              <div className='flex flex-wrap gap-2'>
                {entry.categories?.map((category: any) => (
                  <span
                    key={category.id}
                    className='px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground'
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter className='flex justify-between items-center gap-2'>
              <SentimentBadge score={entry.sentiment?.score} />
              <div className='flex gap-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0'
                    >
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => setSelectedEntry(entry)}>
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/journal/${entry.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='text-destructive'
                      onSelect={(e) => e.preventDefault()}
                    >
                      <AlertDialog>
                        <AlertDialogTrigger className='w-full text-left'>
                          Delete
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this entry? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className='bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white'
                              onClick={() => handleDelete(entry.id)}
                              disabled={deletingId === entry.id}
                            >
                              {deletingId === entry.id
                                ? 'Deleting...'
                                : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!selectedEntry}
        onOpenChange={() => setSelectedEntry(null)}
      >
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl'>
              {selectedEntry?.title}
            </DialogTitle>
            <div className='text-sm text-gray-500'>
              {selectedEntry && formatDate(selectedEntry.date)}
            </div>
          </DialogHeader>

          {selectedEntry && (
            <div className='space-y-4'>
              <div className='whitespace-pre-line text-gray-700'>
                {selectedEntry.content}
              </div>
              <SentimentBadge score={selectedEntry.sentiment?.score} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
