declare module 'react-heatmap' {
  interface CalendarProps {
    values: Array<{
      date: string;
      count: number;
    }>;
    classForValue?: (value: { count: number }) => string;
    showWeekdayLabels?: boolean;
  }

  const Calendar: React.FC<CalendarProps>;
  export default Calendar;
} 