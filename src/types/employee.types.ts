// src/types/employee.types.ts
export type EmployeeRole = 'ADMIN' | 'MANAGER' | 'STAFF';

export interface Employee {
  id: string;
  username: string;
  name: number;
  email: string; 
}

export interface EmployeeRequest {
  username: string;
  name: string;
  email: string;
  password: string;
}