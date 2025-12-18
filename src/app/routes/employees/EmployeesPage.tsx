// src/app/routes/employees/EmployeesPage.tsx
import { useState, useEffect } from 'react';
import { Mail, User, Plus, Trash2, ChevronDown, ChevronUp, Search,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { getEmployees, createEmployee , deleteEmployee} from '@/api/employeeApi';
import type { Employee, EmployeePage, EmployeeRequest } from '@/types/employee.types';

export default function EmployeesPage() {
  const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 2; // Match your backend default
  
  const [pageData, setPageData] = useState<EmployeePage>();
  // const [employees, setEmployees] = useState<Employee[]>();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<EmployeeRequest>({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees({
        page: currentPage,
        size: pageSize,}
      );
      // The API returns { content: Employee[], totalElements, ... }
      setPageData(response || []);
      // setEmployees(response.content || []);
    } catch (err) {
      alert('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };
  const totalPages = pageData?.totalPages || 1;
  const totalElements = pageData?.totalElements || 0;
  const employees = pageData?.content || [];
  var id_prefix="KAK000"
  var random_number=1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmployee(formData);
      setShowForm(false);
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
      });
      fetchEmployees(); // Refresh list
    } catch (err) {
      alert('Failed to create employee');
    }
  };
   const handleDelete = async (id: string) => {
      if (!confirm('Delete this employee?')) return;
      try {
        const res = await deleteEmployee(id);
        fetchEmployees();
      } catch (err) {
        alert('Failed to delete');
      }
    };

  if (loading) {
    return <div className="p-8 text-center">Loading employees...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Employee
        </button>
      </div>

      {/* New Employee Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Employee</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              required
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700"
              >
                Create Employee
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
       {/* Table */}
            
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sky-50 border-b-2 border-sky-200">
                    <tr>
                      {[
                        { key: 'emlpoyeeId', label: 'Employee ID' },
                        { key: 'username', label: 'Username' },
                        { key: 'name', label: 'Name' },
                        { key: 'email', label: 'Email' },
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
                    {employees.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-500">
                          No employees found
                        </td>
                      </tr>
                    ) : (
                      employees.map((res) => (
                        <tr key={res.id} className="border-b hover:bg-sky-50 transition">
                          <td className="px-6 py-5">
                          <p className="font-medium text-gray-900">{id_prefix+random_number++}</p>
                          </td>
                          <td className="px-6 py-5">
                          <p className="font-medium text-gray-900">{res.username}</p>
                          </td>
                          <td className="px-6 py-5">
                              <p className="font-medium text-gray-900">{res.name}</p>
                          </td>
                          <td className="px-6 py-5">
                          <p className="font-medium text-gray-900">{res.email}</p>
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
      
      {/* Employees List */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-12">
            No employees registered yet
          </p>
        ) : (
          employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="bg-amber-600 text-white p-4">
                <h3 className="text-lg font-semibold">{employee.name}</h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="border-t pt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{employee.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{employee.email || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div> */}
    </div>
  );
}