import { Bell, Settings, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-sky-200">
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">

        {/* Left section */}
        <div className="flex items-center gap-3">

          {/* Hamburger menu (mobile only) */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div>
            <h2 className="text-lg md:text-2xl font-bold text-gray-800">
              Welcome back, {user?.username}!
            </h2>

            <p className="text-gray-600 text-sm hidden md:block">
              Here's what's happening today
            </p>
          </div>

        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 md:gap-4">

          <button className="relative p-2 text-gray-600 hover:bg-sky-50 rounded-lg transition">
            <Bell className="w-5 h-5 md:w-6 md:h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-2 text-gray-600 hover:bg-sky-50 rounded-lg transition">
            <Settings className="w-5 h-5 md:w-6 md:h-6" />
          </button>

        </div>
      </div>
    </header>
  );
}