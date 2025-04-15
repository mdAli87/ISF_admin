
import { create } from "zustand";

// Calendar state management with zustand
export const useCalendar = create((set) => ({
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  setMonth: (month) => set({ month }),
  setYear: (year) => set({ year }),
}));
