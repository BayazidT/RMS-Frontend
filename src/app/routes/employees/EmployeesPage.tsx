// src/app/routes/reservations/ReservationsPage.tsx
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Users, Phone, Mail, Edit3, Trash2, Plus, AlertCircle } from 'lucide-react';
import { getReservations, createReservation, updateReservationStatus, deleteReservation } from '@/api/reservationApi';
import type { Reservation, CreateReservationRequest, ReservationStatus } from '@/types/reservation.types';
import { getEmployees, createEmployee } from '@/api/employeeApi';
import { Employee, EmployeeRequest } from '@/types/employee.types';
export default function EmployeesPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [userData, setUserData] = useState<EmployeeRequest>({
    name: '',
    username: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateReservationRequest>({
    reservationDate: '',
    reservationTime: '',
    guestCount: 2,
    tableNumber: 1,
    status:'PENDING',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    specialRequests: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      alert('Failed to load emaployess');
    } finally {
      setLoading(false);
    }
  };

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

  
  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'SEATED': return 'bg-blue-100 text-blue-800';
      case 'NO_SHOW': return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading employees...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
        {/* <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Employee
        </button> */}
      </div>

      {/* New Reservation Form */}
      {/* {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Employee</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" required value={formData.reservationDate} onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input type="time" required value={formData.reservationTime} onChange={(e) => setFormData({ ...formData, reservationTime: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input type="number" min="1" required placeholder="Guests" value={formData.guestCount} onChange={(e) => setFormData({ ...formData, guestCount: +e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input type="number" min="1" required placeholder="Table Number" value={formData.tableNumber} onChange={(e) => setFormData({ ...formData, tableNumber: +e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input type="text" required placeholder="Customer Name" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input type="tel" required placeholder="Phone" value={formData.customerPhone} onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input type="email" required placeholder="Email" value={formData.customerEmail} onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Special Requests (optional)" value={formData.specialRequests} onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })} className="px-4 py-2 border rounded-lg md:col-span-2" />
            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400">Cancel</button>
            </div>
          </form>
        </div>
      )} */}

      {/* Reservations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-12">No employee registered yet</p>
        ) : (
          employees.map((res) => (
            <div key={res.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="bg-amber-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{res.name}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{res.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{res.email}</span>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}