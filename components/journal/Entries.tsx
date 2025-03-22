'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EntryList } from '@/components/journal/EntryList';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface Filters {
  search: string;
  category: string;
  dateRange: DateRange | undefined;
}

export default function JournalPage({ user }: { user: any }) {
  const [entries, setEntries] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    dateRange: undefined,
  });
  const [categories, setCategories] = useState<any[]>([]);

  const loadEntries = async (loadCursor?: string | null, reset = false) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        userId: user.id,
        cursor: loadCursor || '',
        search: filters.search,
        category: filters.category === 'all' ? '' : filters.category,
        startDate: filters.dateRange?.from?.toISOString() || '',
        endDate: filters.dateRange?.to?.toISOString() || '',
      });

      const url = `/api/entries?${params}`;
      const res = await fetch(url);
      const { data, nextCursor } = await res.json();

      setEntries((prev) => (reset ? data : [...prev, ...data]));
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) {
      loadEntries(undefined, true);
      fetch(`/api/categories?userId=${user.id}`)
        .then((res) => res.json())
        .then(setCategories);
    }
  }, [user, filters]);

  return (
    <div className='p-4 md:p-8 max-w-7xl mx-auto'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
        <h1 className='text-2xl font-bold'>Journal Entries</h1>
        <Link
          href='/journal/new'
          className='w-full md:w-auto'
        >
          <Button className='w-full md:w-auto'>New Entry</Button>
        </Link>
      </div>

      <div className='mb-8 space-y-4'>
        <Input
          placeholder='Search entries...'
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />

        <div className='flex flex-col md:flex-row gap-4'>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className='w-full md:w-[200px]'>
              <SelectValue placeholder='Filter by category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full md:w-[280px] justify-start text-left font-normal',
                  !filters.dateRange?.from && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, 'LLL dd, y')} -{' '}
                      {format(filters.dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(filters.dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Filter by date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='range'
                selected={filters.dateRange}
                onSelect={(range) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: range,
                  }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {isLoading ? (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {[...Array(9)].map((_, i) => (
            <Skeleton
              key={i}
              className='h-32 rounded-lg'
            />
          ))}
        </div>
      ) : (
        <>
          <EntryList entries={entries} />
          {hasMore && (
            <div className='mt-8 flex justify-center'>
              <Button
                onClick={() => loadEntries(cursor)}
                variant='outline'
                className='w-full md:w-auto'
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
