// src/api/reservationApi.ts
import { ShiftRequest, ShiftResponse } from '@/types/shift.types';
import api from './axiosInstance';

interface GetShiftParams {
  page?: number;
  size?: number;
  search?: string;
  shiftDate?: string;
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

export const createSingleShift = async (id: string, data: any): Promise<ShiftResponse> =>{
  const res = await api.post(`/v1/private/shift/single/${id}`, data)
  return res.data;
}

export const createFullShifts =  async (data: any): Promise<any> =>{
  const res = await api.post('/v1/private/shift/create', data);
  return res;
}

export const getShiftsByUserId = async (id: string,
  params: GetShiftByUserIdParams = {}
): Promise<ShiftResponse> => {
  const res = await api.get<ShiftResponse>(`/v1/private/shift/range/${id}`, {params});
  return res.data;
};

