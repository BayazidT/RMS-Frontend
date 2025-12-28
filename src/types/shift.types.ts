// Represents a single shift entry
export interface Shift {
    id: string;
    name: string;
    shiftDate: string;        
    startTime: string;        
    endTime: string;          
    startTimeLocal: string;   
    endTimeLocal: string;     
  }
  
  export interface ShiftRequest {
    shiftDate: string;        
    startTime: string;        
    endTime: string;       
  }

  export interface ShiftResponse {
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    first: boolean;
    last: boolean;
    content: Shift[];
  }
  