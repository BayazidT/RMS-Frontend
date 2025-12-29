// src/api/reservationApi.ts
import api from './axiosInstance';
import type { Reservation, ReservationPage, ReservationRequest, ReservationStatus } from '@/types/reservation.types';

// export const getReservations = async (): Promise<Reservation[]> => {
//   const res = await api.get('/v1/private/reservations');
//   return res.data;
// };

// src/api/reservationApi.ts

interface GetReservationsParams {
  page?: number;
  size?: number;
  status?: string;
  reservationDate?: string;
  search?: string;
  sort?: string; // e.g., "reservationDate,desc"
}

export const getReservations = async (
  params: GetReservationsParams = {}
): Promise<ReservationPage> => {
  const res = await api.get<ReservationPage>('/v1/private/reservations', { params });
  return res.data;
};
export const createReservation = async (data: ReservationRequest): Promise<Reservation> => {
  const res = await api.post('/v1/private/reservations', data);
  return res.data;
};

export const updateReservationStatus = async (id: string, status: ReservationStatus): Promise<Reservation> => {
  const res = await api.patch(`/v1/private/reservations/${id}/status`, { status });
  return res.data;
};

export const deleteReservation = async (id: string): Promise<void> => {
  await api.delete(`/v1/private/reservations/${id}`);
};