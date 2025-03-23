declare module 'react-calendar-heatmap' {
  interface HeatmapData {
    date: string;
    count: number;
  }

  interface CalendarHeatmapProps {
    values: HeatmapData[];
    classForValue?: (value: HeatmapData) => string;
    showWeekdayLabels?: boolean;
    startDate?: Date;
    endDate?: Date;
    onMouseOver?: (event: React.MouseEvent<SVGRectElement>, value: HeatmapData) => void;
    onMouseOut?: () => void;
  }

  const CalendarHeatmap: React.FC<CalendarHeatmapProps>;
  export default CalendarHeatmap;
} 