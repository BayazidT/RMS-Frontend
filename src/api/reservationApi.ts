// src/api/reservationApi.ts
import api from './axiosInstance';
import type { Reservation, CreateReservationRequest, ReservationStatus } from '@/types/reservation.types';

export const getReservations = async (): Promise<Reservation[]> => {
  const res = await api.get('/v1/private/reservations');
  return res.data;
};

export const createReservation = async (data: CreateReservationRequest): Promise<Reservation> => {
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