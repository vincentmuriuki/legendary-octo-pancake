'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { parse, eachDayOfInterval, format, subDays } from 'date-fns'
import '@/styles/calendar-heatmap.css'

interface HeatmapData {
  date: string;
  count: number;
}

interface TooltipData {
  date: string;
  count: number;
  x: number;
  y: number;
}

// Dynamically import the Calendar component with SSR disabled
const CalendarHeatmap = dynamic(() => import('react-calendar-heatmap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading calendar...</div>
    </div>
  ),
})

export function CalendarHeatmapComponent({ userId, dateRange }: { userId: string, dateRange: any }) {
  const [heatmap, setHeatmap] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/summary/heatmap?userId=${userId}&year=${currentYear}`)
      .then(res => res.json())
      .then(data => {
        setHeatmap(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching heatmap data:', error)
        setIsLoading(false)
      })
  }, [userId, currentYear])

  const startDate = subDays(new Date(), 365)
  const endDate = new Date()
  const dates = eachDayOfInterval({ start: startDate, end: endDate })

  const data: HeatmapData[] = dates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return {
      date: dateStr,
      count: Number(heatmap[dateStr]) || 0
    }
  })

  if (isLoading) {
    return (
      <div className="p-4 bg-background rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Writing Frequency</h3>
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-background rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Writing Frequency</h3>
      <div className="relative min-h-[400px] flex items-center justify-center">
        <div className="w-full">
          <CalendarHeatmap
            values={data}
            classForValue={(value: HeatmapData) => {
              if (!value || typeof value.count !== 'number') return 'color-empty'
              return `color-scale-${Math.min(value.count, 4)}`
            }}
            showWeekdayLabels
            startDate={startDate}
            endDate={endDate}
            onMouseOver={(event: React.MouseEvent<SVGRectElement>, value: HeatmapData) => {
              setTooltip({
                date: value.date,
                count: value.count,
                x: event.clientX,
                y: event.clientY
              })
            }}
            onMouseOut={() => {
              setTooltip(null)
            }}
          />
        </div>
        {tooltip && (
          <div className="fixed bg-black text-white px-3 py-2 rounded-lg text-sm z-10 shadow-lg"
               style={{
                 left: `${tooltip.x}px`,
                 top: `${tooltip.y}px`,
                 transform: 'translate(-50%, -100%)',
                 marginTop: '-8px'
               }}>
            {format(new Date(tooltip.date), 'MMM d, yyyy')}: {tooltip.count} entries
          </div>
        )}
      </div>
      <div className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-2">
          <div className="w-4 h-4 rounded bg-[#ebedf0]"></div>
          <div className="w-4 h-4 rounded bg-[#9be9a8]"></div>
          <div className="w-4 h-4 rounded bg-[#40c463]"></div>
          <div className="w-4 h-4 rounded bg-[#30a14e]"></div>
          <div className="w-4 h-4 rounded bg-[#216e39]"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  )
}