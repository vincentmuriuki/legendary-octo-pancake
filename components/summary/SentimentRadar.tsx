'use client';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { useState, useEffect } from 'react';

export function SentimentRadar({ userId }: { userId: string }) {
  const [data, setData] = useState<{ name: string; score: number }[]>([]);

  useEffect(() => {
    fetch(`/api/summary/sentiment-categories?userId=${userId}`)
      .then((res) => res.json())
      .then(setData);
  }, [userId]);

  return (
    <div className='h-96 p-4 bg-card rounded-lg'>
      <h3 className='text-lg font-semibold mb-4'>Sentiment by Category</h3>
      <ResponsiveContainer
        width='100%'
        height='80%'
      >
        <RadarChart
          outerRadius='80%'
          data={data}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey='name' />
          <Radar
            name='Sentiment'
            dataKey='score'
            stroke='#8884d8'
            fill='#8884d8'
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
