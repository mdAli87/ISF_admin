
import React, { useContext } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendar } from "./calendar-store";
import { CalendarContext } from "./calendar-context";
import Combobox from "./combobox";
import { monthsForLocale, daysForLocale, cn } from "./utils";
import CalendarBody from "./calendar-body";

// Out of bounds day component
export const OutOfBoundsDay = ({ day }) => (
  <div className="p-1 text-muted-foreground text-xs">
    {day}
  </div>
);

// Calendar components
export const CalendarDatePicker = ({ className, children }) => (
  <div className={cn('flex items-center gap-1', className)}>{children}</div>
);

export const CalendarMonthPicker = ({ className }) => {
  const { month, setMonth } = useCalendar();
  const { locale } = useContext(CalendarContext);

  return (
    <Combobox
      className={className}
      value={month.toString()}
      setValue={(value) => setMonth(Number.parseInt(value))}
      data={monthsForLocale(locale).map((month, index) => ({
        value: index.toString(),
        label: month,
      }))}
      labels={{
        button: 'Select month',
        empty: 'No month found',
        search: 'Search month',
      }}
    />
  );
};

export const CalendarYearPicker = ({ className, start, end }) => {
  const { year, setYear } = useCalendar();

  return (
    <Combobox
      className={className}
      value={year.toString()}
      setValue={(value) => setYear(Number.parseInt(value))}
      data={Array.from({ length: end - start + 1 }, (_, i) => ({
        value: (start + i).toString(),
        label: (start + i).toString(),
      }))}
      labels={{
        button: 'Select year',
        empty: 'No year found',
        search: 'Search year',
      }}
    />
  );
};

export const CalendarDatePagination = ({ className }) => {
  const { month, year, setMonth, setYear } = useCalendar();

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button onClick={() => handlePreviousMonth()} variant="ghost" size="icon">
        <ChevronLeft size={16} />
      </Button>
      <Button onClick={() => handleNextMonth()} variant="ghost" size="icon">
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export const CalendarDate = ({ children }) => (
  <div className="flex items-center justify-between p-3">{children}</div>
);

export const CalendarHeader = ({ className }) => {
  const { locale, startDay } = useContext(CalendarContext);

  return (
    <div className={cn('grid grid-cols-7 gap-1', className)}>
      {daysForLocale(locale, startDay).map((day) => (
        <div key={day} className="p-3 text-center text-muted-foreground text-xs font-medium">
          {day}
        </div>
      ))}
    </div>
  );
};

export const CalendarItem = ({ training, className }) => {
  return (
    <div className={cn('flex items-center gap-2 cursor-pointer', className)} key={training.id}>
      <div className="h-2 w-2 shrink-0 rounded-full bg-vibrant-green" />
      <span className="truncate text-xs">{training.title}</span>
    </div>
  );
};

export { CalendarBody };
