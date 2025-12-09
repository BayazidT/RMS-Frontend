// src/types/reservation.types.ts
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'SEATED' | 'NO_SHOW';

export interface Reservation {
  id: string;
  userId: string;
  username: string;
  tableNumber: number;
  guestCount: number;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:mm:ss
  status: ReservationStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specialRequests: string | null;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
}

export interface CreateReservationRequest {
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  status: 'PENDING';
  tableNumber: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specialRequests?: string;
}