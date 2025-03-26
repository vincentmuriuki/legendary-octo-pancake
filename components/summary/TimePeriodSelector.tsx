'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { CalendarIcon } from 'lucide-react';

const PRESET_RANGES = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
  custom: 'Custom',
};

export function TimePeriodSelector({
  onDateChange,
}: {
  onDateChange: (range: { start: Date; end: Date }) => void;
}) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedPreset, setSelectedPreset] = useState<string>('week');

  const handlePresetSelect = (preset: keyof typeof PRESET_RANGES) => {
    const today = new Date();
    let range: DateRange = { from: today, to: today };

    switch (preset) {
      case 'today':
        range = { from: today, to: today };
        break;
      case 'week':
        range = { from: startOfWeek(today), to: endOfWeek(today) };
        break;
      case 'month':
        range = { from: startOfMonth(today), to: endOfMonth(today) };
        break;
    }

    setDateRange(range);
    setSelectedPreset(preset);
    onDateChange({ start: range.from!, end: range.to! });
  };

  return (
    <div className='flex flex-col md:flex-row gap-4 items-center'>
      <div className='flex gap-2'>
        {Object.entries(PRESET_RANGES).map(([key, label]) => (
          <Button
            key={key}
            variant={selectedPreset === key ? 'default' : 'outline'}
            onClick={() =>
              handlePresetSelect(key as keyof typeof PRESET_RANGES)
            }
          >
            {label}
          </Button>
        ))}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='range'
            selected={dateRange}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setDateRange(range);
                setSelectedPreset('custom');
                onDateChange({ start: range.from, end: range.to });
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
