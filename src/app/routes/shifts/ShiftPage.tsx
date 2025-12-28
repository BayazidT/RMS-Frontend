import { useState, useEffect } from 'react';
import { Mail, User, Plus, Trash2, ChevronDown, ChevronUp, Search,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Car} from 'lucide-react';
import Card from '@/components/ui/Card';
import { ShiftRequest, ShiftResponse } from '@/types/shift.types';
import { createSingleShift,createFullShifts, getShifts } from '@/api/shiftApi';
import { Employee, EmployeePage, EmployeeRequest } from '@/types/employee.types';
import { getEmployees } from '@/api/employeeApi';


export default function ShiftPage(){
    const [currentPage, setCurrentPage] = useState(0);
    const [pageData, setPageData] = useState<ShiftResponse>();
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); 
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [employeeInfo, setEmployeeInfo] =useState<Employee[]>();
    const [formData, setFormData] = useState<ShiftRequest>({
      shiftDate: '',
      startTime: '',
      endTime: ''
    })
    const [userId, setUserId] = useState('');

    const pageSize = 2;

  const getMonthStartEnd = (year: number, month: number) => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0); 

    const format = (date: Date) =>
      date.toISOString().split('T')[0]; 

    return { from: format(start), to: format(end) };
  };

  useEffect(() => {
    const { from, to } = getMonthStartEnd(selectedYear, selectedMonth);
    setFromDate(from);
    setToDate(to);
    setCurrentPage(0); 
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    setCurrentPage(0);
  }, [fromDate, toDate]);

    useEffect(() => {
        fetchShifts();
        fetchEmployees();
        
      }, [currentPage]);
    
      const fetchEmployees = async () => {
        try {
          const response = await getEmployees({
                  page: 0,
                  size: 1000,}
                );
          setEmployeeInfo(response.content);
        } catch (error) {
          
        }
      }
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
      const toOffsetDateTime = (localDateTime: string | null): string | null => {
        if (!localDateTime) return null;
        return new Date(localDateTime).toISOString();
      };
      
      const combineDateTime = (date: string, time: string): string | null => {
        if (!date || !time) return null;
        // Combine into "2025-12-29T12:00"
        const dateTimeString = `${date}T${time}`;
        // Convert to ISO string (UTC) for OffsetDateTime
        return new Date(dateTimeString).toISOString();
      };
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

          if(userId == 'create_for_all'){
            const payload = {
              shiftDate: formData.shiftDate,
              startTime: toOffsetDateTime(combineDateTime(formData.shiftDate,formData.startTime)),
              endTime: toOffsetDateTime(combineDateTime(formData.shiftDate,formData.endTime)),
            };
          createFullShifts(payload);
          setShowForm(false);
          getShifts();
          }else{
          const payload = {
            shiftDate: formData.shiftDate,
            startTime: toOffsetDateTime(combineDateTime(formData.shiftDate,formData.startTime)),
            endTime: toOffsetDateTime(combineDateTime(formData.shiftDate,formData.endTime)),
          };
          createSingleShift(userId, payload);
          setFormData({
            shiftDate: '',
            startTime: '',
            endTime: ''
          });
          getShifts();
        }
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
        <h1 className="text-3xl font-bold text-gray-900">Shifts</h1>
    
        {/* Right-side buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg
                       hover:bg-sky-700 transition"
          >
            <Plus className="w-5 h-5" />
            Create Shift
          </button>
        </div>
      </div>
        
          {/* Filters */}
          {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create Shifts</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label
              className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-600">
              Shift Date
            </label>

            <input
              type="date"
              required
              value={formData.shiftDate}
              onChange={(e) =>
                setFormData({ ...formData, shiftDate: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-600">
              Start Time
            </label>

            <input
              type="time"
              required
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-600">
              End Time
            </label>

            <input
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

                      
          <div className="relative">
            <label className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-600">
              Employee
            </label>

            <select
              required
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-sky-500 outline-none bg-white"
            >
              <option value="" disabled>Select Employee</option>
              <option key="create_for_all" value="create_for_all" >
               For All Employee
              </option>

              {employeeInfo?.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700"
              >
                Create Shift
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {!showForm && (
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
      )}
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