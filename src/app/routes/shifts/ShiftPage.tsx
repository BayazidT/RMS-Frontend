import { useState, useEffect } from 'react';
import { Mail, User, Plus, Trash2, ChevronDown, ChevronUp, Search,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Car} from 'lucide-react';
import Card from '@/components/ui/Card';
import { ShiftResponse } from '@/types/shift.types';
import { getShifts } from '@/api/shiftApi';


export default function ShiftPage(){
    const [currentPage, setCurrentPage] = useState(0);
    const [pageData, setPageData] = useState<ShiftResponse>();
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0 = Jan, 11 = Dec
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const pageSize = 2;

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
        fetchShifts();
      }, [currentPage]);
    
      const fetchShifts = async () => {
        try {
          const response = await getShifts({
            page: currentPage,
            size: pageSize,}
          );
          setPageData(response || []);
        } catch (err) {
          alert('Failed to load employees');
        } finally {
          setLoading(false);
        }
      };
      const totalPages = pageData?.totalPages || 0;
      const totalElements = pageData?.totalElements || 0;
      const shifts = pageData?.content || [];
      
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          getShifts();
        } catch (err) {
          alert('Failed to fetch shifts');
        }
      };
       const handleDelete = async (id: string) => {
          if (!confirm('Delete this shift?')) return;
          try {
            fetchShifts();
          } catch (err) {
            alert('Failed to delete');
          }
        };
    var random_number=0;
    
      if (loading) {
        return <div className="p-8 text-center">Loading Shift...</div>;
      }
    return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Shift</h1>
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
                            
                              className="text-left px-6 py-4 font-semibold text-sky-800 cursor-pointer hover:bg-sky-100 transition select-none"
                            >
                              <div className="flex items-center gap-2">
                                {col.label}
                              </div>
                            </th>
                          ))}
                          <th className="px-6 py-4 text-right font-semibold text-sky-800">
                          <div >
                            Actions
                            </div>
                            </th>
                        </tr>
                      </thead>
                      <tbody>
                        {shifts.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-12 text-gray-500">
                              No shift found
                            </td>
                          </tr>
                        ) : (
                            shifts.map((res) => (
                            <tr key={res.id} className="border-b hover:bg-sky-50 transition">
                              <td className="px-6 py-5">
                              <p className="font-medium text-gray-900">{random_number++}</p>
                              </td>
                              <td className="px-6 py-5">
                              <p className="font-medium text-gray-900">{res.name}</p>
                              </td>
                            
                              <td className="px-6 py-5">
                              <p className="font-medium text-gray-900">{res.shiftDate}</p>
                              </td>

                              <td className="px-6 py-5">
                              <p className="font-medium text-gray-900">{res.startTime}</p>
                              </td>
                              <td className="px-6 py-5">
                              <p className="font-medium text-gray-900">{res.endTime}</p>
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