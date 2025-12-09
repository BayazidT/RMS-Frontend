import { Bell, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-sky-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.username}!</h2>
          <p className="text-gray-600">Here's what's happening today</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-sky-50 rounded-lg transition">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 text-gray-600 hover:bg-sky-50 rounded-lg transition">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}