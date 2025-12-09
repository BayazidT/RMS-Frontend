// src/app/routes/reservations/ReservationsPage.tsx
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Calendar, Clock, Users, Phone, Mail,
  Trash2, Plus, AlertCircle
} from 'lucide-react';

import {
  getReservations,
  createReservation,
  updateReservationStatus,
  deleteReservation
} from '@/api/reservationApi';
import type { Reservation, CreateReservationRequest } from '@/types/reservation.types';
import Card from '@/components/ui/Card';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateReservationRequest>({
    reservationDate: '',
        reservationTime: '',
        guestCount: 2,
        tableNumber: 1,
        customerName: '',
        status:'PENDING',
        customerPhone: '',
        customerEmail: '',
        specialRequests: '',
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (err) {
      alert('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReservation(formData);
      setShowForm(false);
      setFormData({
        reservationDate: '',
        reservationTime: '',
        guestCount: 2,
        tableNumber: 1,
        customerName: '',
        status:'PENDING',
        customerPhone: '',
        customerEmail: '',
        specialRequests: '',
      });
      fetchReservations();
    } catch (err) {
      alert('Failed to create reservation');
    }
  };

  const handleStatusChange = async (id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'SEATED' | 'NO_SHOW') => {
    try {
      await updateReservationStatus(id, status);
      fetchReservations();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reservation?')) return;
    try {
      await deleteReservation(id);
      fetchReservations();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':    return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':  return 'bg-green-100 text-green-800';
      case 'CANCELLED':  return 'bg-red-100 text-red-800';
      case 'SEATED':     return 'bg-sky-100 text-sky-800';
      case 'NO_SHOW':    return 'bg-gray-100 text-gray-800';
      default:           return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading reservations...</div>;
  }

  return (
    <div className="space-y-8">

      {/* Header + New Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition shadow-md"
        >
          <Plus className="w-5 h-5" />
          New Reservation
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Reservation</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="date" required value={formData.reservationDate} onChange={e => setFormData({ ...formData, reservationDate: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
            <input type="time" required value={formData.reservationTime} onChange={e => setFormData({ ...formData, reservationTime: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
            <input type="number" min="1" required placeholder="Number of Guests" value={formData.guestCount} onChange={e => setFormData({ ...formData, guestCount: +e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" />
            <input type="number" min="1" required placeholder="Table Number" value={formData.tableNumber} onChange={e => setFormData({ ...formData, tableNumber: +e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" />
            <input type="text" required placeholder="Customer Name" value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" />
            <input type="tel" required placeholder="Phone" value={formData.customerPhone} onChange={e => setFormData({ ...formData, customerPhone: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" />
            <input type="email" required placeholder="Email" value={formData.customerEmail} onChange={e => setFormData({ ...formData, customerEmail: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" />
            <input type="text" placeholder="Special Requests (optional)" value={formData.specialRequests} onChange={e => setFormData({ ...formData, specialRequests: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none md:col-span-2" />

            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="bg-sky-600 text-white px-8 py-3 rounded-lg hover:bg-sky-700 transition font-medium">
                Create Reservation
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition">
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      


      {/* Reservations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {reservations.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-16 text-lg">No reservations found</p>
        ) : (
          reservations.map((res) => (
            <Card key={res.id} className="overflow-hidden">
              {/* Card Header - Sky Blue */}
              <div className="bg-sky-600 text-white p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">{res.customerName}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(res.status)}`}>
                    {res.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sky-600" />
                    <span className="font-medium">{format(new Date(res.reservationDate), 'dd MMM yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-600" />
                    <span>{res.reservationTime.slice(0, 5)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-sky-600" />
                    <span>{res.guestCount} guests</span>
                  </div>
                  <div className="text-lg font-bold text-sky-700">
                    Table {res.tableNumber}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{res.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{res.customerEmail}</span>
                  </div>
                </div>

                {res.specialRequests && (
                  <div className="bg-sky-50 border border-sky-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-sky-600 mt-0.5" />
                      <p className="text-sm text-gray-700">{res.specialRequests}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <select
                    value={res.status}
                    onChange={(e) => handleStatusChange(res.id, e.target.value as any)}
                    className="text-sm border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SEATED">Seated</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="NO_SHOW">No Show</option>
                  </select>

                  <button
                    onClick={() => handleDelete(res.id)}
                    className="text-red-600 hover:bg-red-50 p-3 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}