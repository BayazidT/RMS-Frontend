import { NavLink } from 'react-router-dom';
import { Calendar, Package, Users, Utensils, UserCog, Home, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/reservations', label: 'Reservations', icon: Calendar },
  { to: '/menu', label: 'Menu', icon: Utensils },
  { to: '/employees', label: 'Employees', icon: UserCog },
  { to: '/users', label: 'Customers', icon: Users },
];

export default function Sidebar() {
  const { logout, user } = useAuthStore();

  return (
    <aside className="w-64 bg-sky-700 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sky-600">
        <h1 className="text-2xl font-bold">XYZ Restaurant</h1>
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
            <p className="text-sky-200 text-xs">Admin</p>
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