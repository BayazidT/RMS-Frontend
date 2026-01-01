// src/app/routes/dashboard/Dashboard.tsx
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';  
import {
  Calendar, Clock, Users, UserCheck, AlertCircle, TrendingUp, Plus,
} from 'lucide-react';

import Card from '@/components/ui/Card';
import { getReservations } from '@/api/reservationApi';
import { useState, useEffect } from 'react';
import type { ReservationPage } from '@/types/reservation.types';
import { getShifts } from '@/api/shiftApi';
import { ShiftResponse } from '@/types/shift.types';
import { EmployeePage } from '@/types/employee.types';
import { getEmployees } from '@/api/employeeApi';

export default function Dashboard() {
  const navigate = useNavigate();  

  const [todayStats, setTodayStats] = useState({
    totalToday: 0, pending: 0, confirmed: 0, seated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [shift, setShift] = useState<ShiftResponse>();
  const [employee, setEmployee] = useState<EmployeePage>();

  useEffect(() => {
    const fetchTodayStats = async () => {
      try {
        setLoading(true);
        const today = format(new Date(), 'yyyy-MM-dd');
        const data: ReservationPage = await getReservations({ page: 0, size: 100 });
        const todayReservations = data.content.filter(r => r.reservationDate === today);
        setTodayStats({
          totalToday: todayReservations.length,
          pending: todayReservations.filter(r => r.status === 'PENDING').length,
          confirmed: todayReservations.filter(r => r.status === 'CONFIRMED').length,
          seated: todayReservations.filter(r => r.status === 'SEATED').length,
        });
      } catch (err) {
        console.error('Failed to load today stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayStats();
  }, []);
  useEffect(() => {
    fetchShifts();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
      try {
        const response = await getEmployees({
          page: 1,
          size: 1000,}
        );
        setEmployee(response || []);
      } catch (err) {
        alert('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

  const fetchShifts = async () => {
          try {
            const today = format(new Date(), 'yyyy-MM-dd');
            const response = await getShifts({
              page: 1,
              size: 100,
              shiftDate: today
            }
            );
            setShift(response || []);

          } catch (err) {
            alert('Failed to load employees');
          } finally {
            setLoading(false);
          }
        };

  const quickLinks = [
    { title: 'Reservations', icon: Calendar, description: 'Manage all bookings', link: '/reservations', stats: `${todayStats.totalToday} today`, highlight: true },
    { title: 'Shifts', icon: Clock, description: 'View and assign staff shifts', link: '/shifts', stats: `${shift?.totalElements} today` },
    { title: 'Employees', icon: Users, description: 'Staff list & attendance', link: '/employees', stats: `Total employee ${employee?.totalElements}` },
  ];

  const todayHighlights = [
    { label: 'Pending', value: todayStats.pending, icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Confirmed', value: todayStats.confirmed, icon: UserCheck, color: 'text-green-600 bg-green-50' },
    { label: 'Seated', value: todayStats.seated, icon: TrendingUp, color: 'text-sky-600 bg-sky-50' },
  ];

  const handleNav = (path: string) => navigate(path);  // Reusable

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <button
          onClick={() => handleNav('/reservations')}
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Reservation
        </button>
      </div>

      {/* Today's Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {todayHighlights.map((item) => (
          <Card key={item.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '-' : item.value}</p>
              </div>
              <div className={`p-4 rounded-full ${item.color}`}>
                <item.icon className="w-8 h-8" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Links (Clickable Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickLinks.map((link) => (
          <div
            key={link.title}
            onClick={() => handleNav(link.link)}
            className="block cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNav(link.link)}  
          >
            <Card className={`p-8 h-full ${link.highlight ? 'border-2 border-sky-200 ring-1 ring-sky-100' : ''}`}>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{link.title}</h3>
                  <p className="text-gray-600 mt-2">{link.description}</p>
                  {link.stats && <p className="text-sm font-medium text-sky-600 mt-4">{link.stats}</p>}
                </div>
                <div className={`p-4 rounded-xl self-end mt-4 ${link.highlight ? 'bg-sky-100' : 'bg-gray-100'}`}>
                  <link.icon className={`w-8 h-8 ${link.highlight ? 'text-sky-600' : 'text-gray-600'}`} />
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Quick Tip */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Tip</h2>
        <p className="text-gray-600">
          You have <span className="font-semibold text-yellow-600">{todayStats.pending} pending reservations</span> for today.{' '}
          <button
            onClick={() => handleNav('/reservations')}
            className="text-sky-600 hover:underline font-medium"
          >
            Review now →
          </button>
        </p>
      </Card>
    </div>
  );
}