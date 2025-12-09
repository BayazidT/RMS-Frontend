// src/api/reservationApi.ts
import api from './axiosInstance';

import type { Employee, EmployeeRequest } from '@/types/employee.types';

export const getEmployees = async (): Promise<Employee[]> => {
  const res = await api.get('/v1/private/users');
  return res.data;
};

export const createEmployee = async (data: EmployeeRequest): Promise<Employee> => {
  const res = await api.post('/v1/private/users', data);
  return res.data;
};
