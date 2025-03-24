'use client';

import { useSession } from 'next-auth/react';
import { CalendarHeatmapComponent } from '@/components/summary/CalendarHeatmap';
import { CategoryDistribution } from '@/components/summary/CategoryDistribution';
import { WordCountTrend } from '@/components/summary/WordCountTrend';
import { MoodTimeline } from '@/components/summary/MoodTimeline';
import { TimeOfDayAnalysis } from '@/components/summary/TimeOfDayAnalysis';
import { EntryLengthByCategory } from '@/components/summary/EntryLengthByCategory';
import { WordCloudComponent } from '@/components/summary/WordCloud';
import { SentimentRadar } from '@/components/summary/SentimentRadar';
import { WritingStreaks } from '@/components/summary/WritingStreaks';
import { TimePeriodSelector } from '@/components/summary/TimePeriodSelector'
import { useState } from 'react';
import { endOfWeek, startOfWeek } from 'date-fns';

export default function AnalyticsPage() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date())
  })

  return (
    <div className='p-6 max-w-7xl mx-auto space-y-8'>
      <h1 className='text-3xl font-bold'>Journal Insights</h1>
      <TimePeriodSelector 
          onDateChange={(range) => setDateRange(range)}
        />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-card p-6 rounded-xl shadow-sm'>
          <CalendarHeatmapComponent userId={session.user.id || ''} dateRange={dateRange} />
        </div>

        <div className='bg-card p-6 rounded-xl shadow-sm'>
          <h3 className='text-lg font-semibold mb-4'>Category Distribution</h3>
          <CategoryDistribution userId={session.user.id || ''} />
        </div>

        <div className='bg-card p-6 rounded-xl shadow-sm'>
          <WordCountTrend userId={session.user.id || ''} />
        </div>

        <div className='bg-card p-6 rounded-xl shadow-sm'>
          <MoodTimeline userId={session.user.id || ''} />
        </div> 

        <div className='bg-card p-6 rounded-xl shadow-sm'>
          <TimeOfDayAnalysis userId={session.user.id || ''} />
        </div> 

        <div className='bg-card p-6 rounded-xl shadow-sm'>
          <EntryLengthByCategory userId={session.user.id || ''} />
        </div> 

        <div className='bg-card p-6 rounded-xl shadow-sm'>
          <SentimentRadar userId={session.user.id || ''} />
        </div> 

        <div className='bg-card p-6 rounded-xl shadow-sm'>
          <WritingStreaks userId={session.user.id || ''} />
        </div> 
      </div>
    </div>
  );
}
