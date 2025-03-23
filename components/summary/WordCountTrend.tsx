'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState, useEffect } from 'react';

export function WordCountTrend({ userId }: { userId: string }) {
  const [data, setData] = useState<{ week: string; count: number }[]>([]);

  useEffect(() => {
    fetch(`/api/summary/wordcount?userId=${userId}`)
      .then((res) => res.json())
      .then(setData);
  }, [userId]);

  return (
    <div className='h-64'>
      <h3 className='text-lg font-semibold mb-4'>Word Count Trend</h3>
      <ResponsiveContainer
        width='100%'
        height='80%'
      >
        <LineChart data={data}>
          <XAxis dataKey='week' />
          <YAxis />
          <Tooltip />
          <Line
            type='monotone'
            dataKey='count'
            stroke='#8884d8'
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
