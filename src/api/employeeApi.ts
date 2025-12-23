// src/api/reservationApi.ts
import api from './axiosInstance';

interface GetEmployeeParams {
  page?: number;
  size?: number;
  // status?: string;
}

import type { EmployeePage, EmployeeRequest, Employee } from '@/types/employee.types';

export const getEmployees = async (
  params: GetEmployeeParams = {}
): Promise<EmployeePage> => {
  const res = await api.get<EmployeePage>('/v1/private/users', {params});
  return res.data;
};

export const createEmployee = async (data: EmployeeRequest): Promise<Employee> => {
  const res = await api.post('/v1/private/users', data);
  return res.data;
};
export const getEmployeeById = async (id: string): Promise<Employee> => {
  const res =  await api.get(`/v1/private/users/${id}`);
  return res.data;
}

export const deleteEmployee = async (id: string):Promise<string> => {
  const res = await api.delete<string>(`/v1/private/users/${id}`)
  return res.data;
}
