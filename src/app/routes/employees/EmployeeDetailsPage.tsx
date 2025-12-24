import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { getEmployeeById } from '@/api/employeeApi';
import { getScheduleByUserID } from '@/api/scheduleApi';
import type { Employee } from '@/types/employee.types';
import type { DaySchedule, WeeklySchedule, WeekDayKey } from '@/types/schedule.types';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const [employeeRes, scheduleRes] = await Promise.all([
          getEmployeeById(id),
          getScheduleByUserID(id),
        ]);

        setEmployee(employeeRes);
        setSchedule(scheduleRes.schedule);
      } catch (error) {
        console.error('Failed to load employee details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const toggleDay = (dayKey: WeekDayKey) => {
    if (!schedule) return;

    const updated = {
      ...schedule,
      [dayKey]: {
        ...schedule[dayKey],
        isOff: !schedule[dayKey].isOff,
      },
    };

    setSchedule(updated);
    // TODO: persist via API
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
          onChange={() => toggleDay(dayKey)}
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
        <p className="mt-2 text-lg text-gray-600">Weekly working schedule</p>
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

      {/* Refined Two-Column Schedule - Tighter padding */}
      <div className="flex justify-center">
        <Card className="w-full max-w-4xl shadow-sm p-4">  {/* Reduced overall card padding */}
          <h2 className="text-xl font-semibold text-gray-900 mb-5 text-center">  {/* Tighter margin */}
            Weekly Schedule
          </h2>

          {schedule ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  {/* Reduced gap between columns */}
              {/* Left Column: Mon–Thu */}
              <div className="space-y-2">  {/* Reduced row spacing */}
                {leftColumnDays.map(renderDayRow)}
              </div>

              {/* Right Column: Fri–Sun */}
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

/* Same clean toggle */
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