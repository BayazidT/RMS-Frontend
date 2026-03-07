import { NavLink } from 'react-router-dom';
import { Calendar, Utensils, UserCog, Home, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/reservations', label: 'Reservations', icon: Calendar },
  { to: '/shifts', label: 'Shift', icon: Utensils },
  { to: '/employees', label: 'Employees', icon: UserCog }
];

export default function Sidebar() {
  const { logout, user } = useAuthStore();

  return (
    <aside className="w-64 bg-sky-700 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sky-600">
        <h2 className="text-xl font-bold">Eiscafe San Marco</h2>
        <p className="text-sky-200 text-sm">Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                  isActive
                    ? 'bg-white text-sky-700 shadow-md font-semibold'
                    : 'hover:bg-sky-600'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-sky-600">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-sky-300 rounded-full flex items-center justify-center font-bold">
            {user?.username?.[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{user?.username}</p>
            <p className="text-sky-200 text-xs">{user?.roles[0]}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sky-600 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}