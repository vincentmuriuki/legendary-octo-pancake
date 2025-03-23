'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function SentimentBadge({ score }: { score?: number }) {
  if (!score) return null;

  const getSentiment = (score: number) => {
    if (score > 0.3) return { label: 'Positive', color: 'bg-green-500' };
    if (score < -0.3) return { label: 'Negative', color: 'bg-red-500' };
    return { label: 'Neutral', color: 'bg-gray-500' };
  };

  const { label, color } = getSentiment(score);

  return (
    <Badge className={cn('text-white', color)}>
      {label} ({score.toFixed(2)})
    </Badge>
  );
}
