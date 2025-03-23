'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState, useEffect } from 'react';

export function TimeOfDayAnalysis({ userId }: { userId: string }) {
  const [data, setData] = useState<{ hour: number; count: number }[]>([]);

  useEffect(() => {
    fetch(`/api/summary/time-of-day?userId=${userId}`)
      .then((res) => res.json())
      .then(setData);
  }, [userId]);

  return (
    <div className='h-64'>
      <h3 className='text-lg font-semibold mb-4'>Writing Time Patterns</h3>
      <ResponsiveContainer
        width='100%'
        height='80%'
      >
        <BarChart data={data}>
          <XAxis
            dataKey='hour'
            tickFormatter={(hour) => `${hour}:00`}
          />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey='count'
            fill='#8884d8'
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
