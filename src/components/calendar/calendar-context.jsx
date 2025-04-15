
import { createContext } from 'react';

// Calendar context
export const CalendarContext = createContext({
  locale: 'en-US',
  startDay: 0,
});

export const CalendarProvider = ({ locale = 'en-US', startDay = 0, children, className }) => (
  <CalendarContext.Provider value={{ locale, startDay }}>
    <div className={`flex flex-col ${className || ''}`}>{children}</div>
  </CalendarContext.Provider>
);
