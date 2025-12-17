// src/app/routes/reservations/ReservationsTableView.tsx
import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import {
  Calendar, Clock, Users, Phone, Mail, Trash2,
  ChevronDown, ChevronUp, Search,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';

import {
  getReservations,
  updateReservationStatus,
  deleteReservation
} from '@/api/reservationApi';
import { RESERVATION_STATUSES, RESERVATION_STATUS_LABELS } from '@/types/reservation.types';
import type { Reservation, ReservationPage, ReservationStatus} from '@/types/reservation.types';
import Card from '@/components/ui/Card';

type SortKey = 'reservationDate' | 'reservationTime' | 'customerName' | 'tableNumber' | 'status';
type SortOrder = 'asc' | 'desc';

export default function ReservationsTableView() {
  const [pageData, setPageData] = useState<ReservationPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2; // Match your backend default

  // Client-side sorting (optional – you can move to server later)
  const [sortKey, setSortKey] = useState<SortKey>('reservationDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Fetch data whenever page, search, or filter changes
  useEffect(() => {
    fetchReservations();
  }, [currentPage]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await getReservations({
        page: currentPage,
        size: pageSize,
        // You can add status/search/sort params later when backend supports them
      });
      setPageData(data);
    } catch (err) {
      console.error('Failed to load reservations', err);
      alert('Failed to load reservations');
      setPageData(null);
    } finally {
      setLoading(false);
    }
  };

  // After status update or delete, refresh current page
  const handleStatusChange = async (id: string, status: ReservationStatus) => {
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

  const reservations = pageData?.content || [];

  // Client-side filtering (search + status)
  const filteredReservations = useMemo(() => {
    let filtered = reservations;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.customerName.toLowerCase().includes(lower) ||
        r.customerPhone.includes(searchTerm) ||
        r.customerEmail.toLowerCase().includes(lower)
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    return filtered;
  }, [reservations, searchTerm, statusFilter]);

  // Client-side sorting
  const filteredAndSorted = useMemo(() => {
    return [...filteredReservations].sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];

      if (sortKey === 'reservationDate') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredReservations, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status: ReservationStatus) => {
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
    return <div className="p-12 text-center text-gray-600">Loading reservations...</div>;
  }

  const totalPages = pageData?.totalPages || 1;
  const totalElements = pageData?.totalElements || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reservations - Table View</h1>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SEATED">Seated</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sky-50 border-b-2 border-sky-200">
              <tr>
                {[
                  { key: 'customerName', label: 'Customer' },
                  { key: 'reservationDate', label: 'Date' },
                  { key: 'reservationTime', label: 'Time' },
                  { key: 'tableNumber', label: 'Table' },
                  { key: 'guestCount', label: 'Guests' },
                  { key: 'status', label: 'Status' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key as SortKey)}
                    className="text-left px-6 py-4 font-semibold text-sky-800 cursor-pointer hover:bg-sky-100 transition select-none"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {sortKey === col.key && (
                        sortOrder === 'asc' 
                          ? <ChevronUp className="w-4 h-4" /> 
                          : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-right font-semibold text-sky-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    No reservations found
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((res) => (
                  <tr key={res.id} className="border-b hover:bg-sky-50 transition">
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium text-gray-900">{res.customerName}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {res.customerPhone}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {res.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-sky-600" />
                        {format(new Date(res.reservationDate), 'dd MMM yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-600" />
                        {res.reservationTime.slice(0, 5)}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-sky-700">Table {res.tableNumber}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-sky-600" />
                        {res.guestCount}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                    <select
  value={res.status}
  onChange={(e) => handleStatusChange(res.id, e.target.value as ReservationStatus)}
  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(res.status)} border-0 cursor-pointer`}
>
  {RESERVATION_STATUSES.map((status) => (
    <option key={status} value={status}>
      {RESERVATION_STATUS_LABELS[status]}
    </option>
  ))}
</select>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="text-red-600 hover:bg-red-50 p-3 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t gap-4">
            <p className="text-sm text-gray-600">
              Showing {pageData?.numberOfElements || 0} of {totalElements} reservations
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(0)}
                disabled={pageData?.first || loading}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={pageData?.first || loading}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="px-4 py-2 text-sm font-medium">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={pageData?.last || loading}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={pageData?.last || loading}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}