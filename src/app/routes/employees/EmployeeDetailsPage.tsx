import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '@/components/ui/Card';
import {Trash2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  } from 'lucide-react';
import { getEmployeeById } from '@/api/employeeApi';
import { createOrUpdateSchedule, getScheduleByUserId } from '@/api/scheduleApi';
import type { Employee } from '@/types/employee.types';
import type { WeeklySchedule, WeekDayKey } from '@/types/schedule.types';
import { getShiftsByUserId } from '@/api/shiftApi';
import { ShiftResponse } from '@/types/shift.types';
import { format } from 'date-fns';


const leftColumnDays: WeekDayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday'];
const rightColumnDays: WeekDayKey[] = ['friday', 'saturday', 'sunday'];

const englishDayNames: Record<WeekDayKey, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export default function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [schedule, setSchedule] = useState<WeeklySchedule | null>(null);
  const [shifts, setShifts] = useState<ShiftResponse | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // 0-based for API
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0 = Jan, 11 = Dec

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const pageSize = 10;

  const getMonthStartEnd = (year: number, month: number) => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0); // Last day of month

    const format = (date: Date) =>
      date.toISOString().split('T')[0]; // YYYY-MM-DD

    return { from: format(start), to: format(end) };
  };

  // Sync month/year picker → date range
  useEffect(() => {
    const { from, to } = getMonthStartEnd(selectedYear, selectedMonth);
    setFromDate(from);
    setToDate(to);
    setCurrentPage(0); // Reset to first page (API is 0-based)
  }, [selectedYear, selectedMonth]);

  // Reset page when manual date inputs change (if you add them later)
  useEffect(() => {
    setCurrentPage(0);
  }, [fromDate, toDate]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const [employeeRes, scheduleRes, userShifts] = await Promise.all([
          getEmployeeById(id),
          getScheduleByUserId(id),
          getShiftsByUserId(id, {
            page: currentPage,
            size: pageSize,
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
          }),
        ]);
  
        setEmployee(employeeRes);
        setSchedule(scheduleRes.schedule);
        setShifts(userShifts);
      } catch (error) {
        console.error('Failed to load employee details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDetails();
  }, [id, currentPage, fromDate, toDate]); 

  const totalPages = shifts?.totalPages || 1;
  const totalElements = shifts?.totalElements || 0;
  const shiftContent = shifts?.content || [];
  let serialNumber = currentPage * pageSize + 1; 

  const toggleDay = (dayKey: WeekDayKey, id: string) => {
    if (!schedule || !id) return;
    const updated = {
      ...schedule,
      [dayKey]: {
        ...schedule[dayKey],
        isOff: !schedule[dayKey].isOff,
        startTime: "10:00:00",
        endTime: "22:00:00",
        displayText: "10:00 – 22:00 Uhr"
      }
    };
    setSchedule(updated);
    createOrUpdateSchedule(id, updated);
  };

  const handleDelete = async (shiftId: string) => {
    if (!confirm('Delete this shift?')) return;
    try {
      // TODO: implement delete API call and refetch
      alert('Delete not implemented yet');
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!employee) {
    return <div className="p-8 text-center text-gray-600">Employee not found.</div>;
  }

  const renderDayRow = (dayKey: WeekDayKey) => {
    if (!schedule) return null;
    const day = schedule[dayKey];
    const isWorking = !day.isOff;

    return (
      <div
        key={dayKey}
        className="flex items-center justify-between px-5 py-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
      >
        <div className="flex-1">
          <p className="font-medium text-gray-900">{englishDayNames[dayKey]}</p>
          <p className="text-sm text-gray-600 mt-0.5">
            {day.isOff ? 'Off' : day.displayText}
          </p>
        </div>

        <ToggleSwitch
          checked={isWorking}
          onChange={() => toggleDay(dayKey, employee.id)}
          label={`Toggle ${englishDayNames[dayKey]}`}
        />
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Header */}
      <header>
        <div className='px-4'>
          <h1 className="text-3xl font-bold text-gray-900">
            {employee.name || 'Employee Details'}
          </h1>
          <p className="mt-2 text-lg text-gray-600">Employee Information</p>
        </div>
      </header>

      {/* Employee Info */}
      <div className="flex justify-center">
        <Card className="w-full max-w-4xl shadow-sm p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Personal Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-base text-gray-900">{employee.username}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-base text-gray-900">{employee.email || '–'}</dd>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Shifts</h1>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Shifts</h3>
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Month & Year
            </label>
            <div className="flex gap-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              >
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="flex-1 w-42 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              >
                {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing shifts from <strong>{fromDate || 'beginning'}</strong> to <strong>{toDate || 'end'}</strong>
        </div>
        <div className="mt-4 text-m text-gray-600">
          <p>Total Shift: {totalElements} </p>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sky-50 border-b-2 border-sky-200">
              <tr>
                {[
                  { key: 'serial', label: 'Serial#' },
                  { key: 'name', label: 'Name' },
                  { key: 'shiftDate', label: 'Shift Date' },
                  { key: 'shiftTime', label: 'Shift Time' },
                  { key: 'endTime', label: 'End Time' },
                ].map(col => (
                  <th
                    key={col.key}
                    className="text-left px-6 py-4 font-semibold text-sky-800 select-none"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-right font-semibold text-sky-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {shiftContent.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No shift found
                  </td>
                </tr>
              ) : (
                shiftContent.map((res) => (
                  <tr key={res.id} className="border-b hover:bg-sky-50 transition">
                    <td className="px-6 py-5">
                      <p className="font-medium text-gray-900">{serialNumber++}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-medium text-gray-900">{res.name}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-medium text-gray-900">{res.shiftDate}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-medium text-gray-900">{format(new Date(`${res.startTime}`), 'h:mm a')}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-medium text-gray-900">{format(new Date(`${res.endTime}`), 'h:mm a')}</p>
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

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4">
            <p className="text-sm text-gray-600">
              Showing page {currentPage + 1} of {totalPages} ({totalElements} total)
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(0)}
                disabled={shifts?.first || loading}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={shifts?.first || loading}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="px-4 py-2 text-sm font-medium">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={shifts?.last || loading}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={shifts?.last || loading}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Weekly Schedule */}
      <div className="flex justify-center">
        <Card className="w-full max-w-4xl shadow-sm p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-5 text-center">
            Weekly Schedule
          </h2>

          {schedule ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                {leftColumnDays.map(renderDayRow)}
              </div>
              <div className="space-y-2">
                {rightColumnDays.map(renderDayRow)}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">No schedule defined yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`
        relative inline-flex h-9 w-16 items-center rounded-full transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${checked ? 'bg-blue-600' : 'bg-gray-300'}
      `}
    >
      <span
        className={`
          inline-block h-7 w-7 transform rounded-full bg-white shadow
          transition duration-200 ease-in-out
          ${checked ? 'translate-x-7' : 'translate-x-1'}
        `}
      />
    </button>
  );
}