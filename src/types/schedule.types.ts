export interface DaySchedule {
  dayOfWeek: number;
  dayNameGerman: string;
  startTime: string | null;
  endTime: string | null;
  isOff: boolean;
  displayText: string;
}

export interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface WeeklyScheduleResponse {
  schedule: WeeklySchedule;
}

export type WeekDayKey = keyof WeeklySchedule;
