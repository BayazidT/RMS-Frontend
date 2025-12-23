import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { getEmployeeById, updateWeeklySchedule } from '@/api/employeeApi';
import type { Employee, WeeklySchedule } from '@/types/employee.types';

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee>();
  const [schedule, setSchedule] = useState<WeeklySchedule>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await getEmployeeById(id!);
      setEmployee(res);
      setSchedule(res.weeklySchedule);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = async (dayKey: string) => {
    if (!schedule) return;

    const updated = {
      ...schedule,
      [dayKey]: {
        ...schedule[dayKey],
        isOff: !schedule[dayKey].isOff
      }
    };

    setSchedule(updated);
    await updateWeeklySchedule(id!, updated);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Employee Details
      </h1>

      {/* Employee Info */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info label="Name" value={employee?.name} />
          <Info label="Username" value={employee?.username} />
          <Info label="Email" value={employee?.email || '-'} />
        </div>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>

        <div className="space-y-3">
          {schedule &&
            Object.entries(schedule).map(([key, day]) => (
              <div
                key={key}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{day.dayNameGerman}</p>
                  <p className="text-sm text-gray-500">
                    {day.isOff ? 'Frei' : day.displayText}
                  </p>
                </div>

                <Toggle
                  checked={!day.isOff}
                  onChange={() => toggleDay(key)}
                />
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}

/* Helper Components */

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`w-16 h-8 rounded-full flex items-center px-1 transition
        ${checked ? 'bg-sky-600' : 'bg-gray-300'}`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow transform transition
          ${checked ? 'translate-x-8' : ''}`}
      />
      <span className="sr-only">Toggle</span>
    </button>
  );
}
