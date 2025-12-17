// src/types/employee.types.ts
export type EmployeeRole = 'ADMIN' | 'MANAGER' | 'STAFF';

export interface Employee {
  id: string;
  username: string;
  name: number;
  email: string; 
}

export interface EmployeePage {
  content: Employee[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  first: boolean;
  last: boolean;
  numberOfElements: number; 
}

export interface EmployeeRequest {
  username: string;
  name: string;
  email: string;
  password: string;
}