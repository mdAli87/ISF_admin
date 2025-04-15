
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarProvider } from "./calendar-context";
import { 
  CalendarDate,
  CalendarDatePicker,
  CalendarMonthPicker,
  CalendarYearPicker,
  CalendarDatePagination,
  CalendarHeader,
  CalendarBody
} from "./calendar-components";

const Calendar = ({ trainings, onDateClick, selectedDate }) => {
  return (
    <Card className="bg-white shadow-sm border-0 mb-6">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-xl font-semibold">
          Training Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <CalendarProvider>
          <CalendarDate>
            <CalendarDatePicker>
              <CalendarMonthPicker />
              <CalendarYearPicker start={2020} end={2030} />
            </CalendarDatePicker>
            <CalendarDatePagination />
          </CalendarDate>
          <CalendarHeader />
          <CalendarBody 
            trainings={trainings} 
            onDateClick={onDateClick} 
            selectedDate={selectedDate}
          />
        </CalendarProvider>
      </CardContent>
    </Card>
  );
};

export default Calendar;
