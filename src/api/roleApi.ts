// src/api/reservationApi.ts
import { Role } from '@/types/role.types';
import api from './axiosInstance';


export const getRoles = async (): Promise<Role[]> => {
  const res = await api.get<Role[]>('v1/private/roles');
  return res.data;
};

