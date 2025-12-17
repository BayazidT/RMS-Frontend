// src/types/reservation.types.ts

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'SEATED' | 'NO_SHOW';

export const RESERVATION_STATUSES: ReservationStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SEATED',
  'CANCELLED',
  'NO_SHOW',
];

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SEATED: 'Seated',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
};

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

export interface ReservationPage {
  content: Reservation[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  first: boolean;
  last: boolean;
  numberOfElements: number; // optional, current page size
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