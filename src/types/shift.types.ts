// Represents a single shift entry
export interface Shift {
    id: string;
    name: string;
    shiftDate: string;        // ISO date string: YYYY-MM-DD
    startTime: string;        // ISO datetime string (UTC)
    endTime: string;          // ISO datetime string (UTC)
    startTimeLocal: string;   // Local time: HH:mm:ss
    endTimeLocal: string;     // Local time: HH:mm:ss
  }
  
  // Represents the paginated response wrapper
  export interface ShiftResponse {
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    first: boolean;
    last: boolean;
    content: Shift[];
  }
  