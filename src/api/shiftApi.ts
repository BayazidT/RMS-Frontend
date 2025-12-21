// src/api/reservationApi.ts
import { ShiftResponse } from '@/types/shift.types';
import api from './axiosInstance';

interface GetShiftParams {
  page?: number;
  size?: number;
  // status?: string;
}


export const getShifts = async (
  params: GetShiftParams = {}
): Promise<ShiftResponse> => {
  const res = await api.get<ShiftResponse>('/v1/private/shift/list', {params});
  return res.data;
};

