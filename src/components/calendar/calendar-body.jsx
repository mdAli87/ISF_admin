
import React from 'react';
import { cn } from "@/lib/utils";
import { getDay, getDaysInMonth, isSameDay } from "date-fns";
import { useCalendar } from "./calendar-store";
import { useContext } from 'react';
import { CalendarContext } from "./calendar-context";

// Out of bounds day component
export const OutOfBoundsDay = ({ day }) => (
  <div className="p-1 text-muted-foreground text-xs opacity-50">
    {day}
  </div>
);

// Calendar Item component
export const CalendarItem = ({ training }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer" key={training.id}>
      <div className={`h-2 w-2 shrink-0 rounded-full bg-${training.category === 'fire' ? 'chart-orange' : training.category === 'road' ? 'oxford-blue' : 'cambridge-blue'}`} />
      <span className="truncate text-xs">{training.title}</span>
    </div>
  );
};

// Calendar Body component
const CalendarBody = ({ trainings = [], onDateClick, selectedDate }) => {
  const { month, year } = useCalendar();
  const { startDay = 0 } = useContext(CalendarContext);
  const daysInMonth = getDaysInMonth(new Date(year, month, 1));
  const firstDay = (getDay(new Date(year, month, 1)) - startDay + 7) % 7;
  const days = [];

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1));

  // Previous month days
  for (let i = 0; i < firstDay; i++) {
    const day = prevMonthDays - firstDay + i + 1;
    days.push(<OutOfBoundsDay key={`prev-${i}`} day={day} />);
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const trainingsForDay = trainings.filter(training => {
      try {
        const trainingDate = training.date ? new Date(training.date) : null;
        return trainingDate && isSameDay(trainingDate, currentDate);
      } catch (error) {
        console.error("Error comparing dates:", error);
        return false;
      }
    });

    const isSelected = selectedDate && isSameDay(selectedDate, currentDate);

    days.push(
      <div
        key={`current-${day}`}
        className={cn(
          "min-h-24 p-1 border border-border/20 hover:bg-muted/10 transition-colors",
          isSelected && "bg-muted/20"
        )}
        onClick={() => onDateClick && onDateClick(currentDate)}
      >
        <div className="text-xs mb-1">{day}</div>
        <div className="space-y-1">
          {trainingsForDay.slice(0, 3).map((training) => (
            <CalendarItem key={training.id} training={training} />
          ))}
          {trainingsForDay.length > 3 && (
            <span className="block text-muted-foreground text-xs mt-1">
              +{trainingsForDay.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  }

  // Next month days
  const nextMonthDaysNeeded = 42 - (firstDay + daysInMonth); // Always show 6 weeks (42 days)
  
  for (let i = 1; i <= nextMonthDaysNeeded; i++) {
    days.push(<OutOfBoundsDay key={`next-${i}`} day={i} />);
  }

  return (
    <div className="grid grid-cols-7 auto-rows-fr gap-1">
      {days}
    </div>
  );
};

export default CalendarBody;
