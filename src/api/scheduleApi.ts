import { WeeklyScheduleResponse } from '@/types/schedule.types';
import api from './axiosInstance';

interface GetScheduleParams {
  page?: number;
  size?: number;
  // status?: string;
}

export const getScheduleByUserID = async (userId: string): Promise<WeeklyScheduleResponse> =>{
  const res = await api.get<WeeklyScheduleResponse>(`/v1/private/schedule/${userId}/weekly-schedule`);
  return res.data;
}

