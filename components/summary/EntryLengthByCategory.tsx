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

export function EntryLengthByCategory({ userId }: { userId: string }) {
  const [data, setData] = useState<{ name: string; average: number }[]>([]);

  useEffect(() => {
    fetch(`/api/summary/length-by-category?userId=${userId}`)
      .then((res) => res.json())
      .then(setData);
  }, [userId]);

  return (
    <div className='h-64'>
      <h3 className='text-lg font-semibold mb-4'>Entry Length by Category</h3>
      <ResponsiveContainer
        width='100%'
        height='80%'
      >
        <BarChart data={data}>
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey='average'
            fill='#82ca9d'
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
