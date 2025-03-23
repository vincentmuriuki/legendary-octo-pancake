'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface MoodData {
  month: string;
  score: number;
}

export function MoodTimeline({ userId }: { userId: string }) {
  const [data, setData] = useState<MoodData[]>([]);

  useEffect(() => {
    fetch(`/api/summary/mood?userId=${userId}`)
      .then((res) => res.json())
      .then(setData);
  }, [userId]);

  const getMoodLabel = (score: number) => {
    if (score > 0.3) return 'Very Happy';
    if (score > 0) return 'Happy';
    if (score < -0.3) return 'Very Sad';
    if (score < 0) return 'Sad';
    return 'Neutral';
  };

  const getMoodColor = (score: number) => {
    if (score > 0.3) return '#4CAF50'; // Green
    if (score > 0) return '#8BC34A'; // Light Green
    if (score < -0.3) return '#F44336'; // Red
    if (score < 0) return '#FF9800'; // Orange
    return '#9E9E9E'; // Grey
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const score = payload[0].value;
      return (
        <div className='bg-white p-2 border rounded shadow'>
          <p className='font-medium'>{payload[0].payload.month}</p>
          <p className='text-sm'>
            Mood: {getMoodLabel(score)}
            <br />
            Score: {score.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='h-64'>
      <h3 className='text-lg font-semibold mb-4'>Mood Timeline</h3>
      <ResponsiveContainer
        width='100%'
        height='80%'
      >
        <BarChart data={data}>
          <XAxis dataKey='month' />
          <YAxis domain={[-1, 1]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey='score'
            fill='#82ca9d'
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getMoodColor(entry.score)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className='mt-2 text-sm text-gray-600 text-center'>
        <span className='inline-block w-3 h-3 rounded-full bg-[#4CAF50] mr-1'></span>
        Very Happy
        <span className='inline-block w-3 h-3 rounded-full bg-[#8BC34A] mx-1'></span>
        Happy
        <span className='inline-block w-3 h-3 rounded-full bg-[#9E9E9E] mx-1'></span>
        Neutral
        <span className='inline-block w-3 h-3 rounded-full bg-[#FF9800] mx-1'></span>
        Sad
        <span className='inline-block w-3 h-3 rounded-full bg-[#F44336] ml-1'></span>
        Very Sad
      </div>
    </div>
  );
}
