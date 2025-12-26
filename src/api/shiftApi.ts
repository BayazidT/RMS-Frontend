// src/api/reservationApi.ts
import { ShiftResponse } from '@/types/shift.types';
import api from './axiosInstance';

interface GetShiftParams {
  page?: number;
  size?: number;
  // status?: string;
}

interface GetShiftByUserIdParams {
  page?: number;
  size?: number;
  fromDate?: string;
  toDate?: string
}


export const getShifts = async (
  params: GetShiftParams = {}
): Promise<ShiftResponse> => {
  const res = await api.get<ShiftResponse>('/v1/private/shift/list', {params});
  return res.data;
};

export const getShiftsByUserId = async (id: string,
  params: GetShiftByUserIdParams = {}
): Promise<ShiftResponse> => {
  const res = await api.get<ShiftResponse>(`/v1/private/shift/range/${id}`, {params});
  return res.data;
};

