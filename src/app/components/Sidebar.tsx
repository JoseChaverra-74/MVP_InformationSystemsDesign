import { Link, useLocation } from 'react-router';
import { Home, Package, Users, Truck, Calendar, FileText, LogOut, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../lib/auth';

interface SidebarProps {
  variant: 'agency' | 'admin';
}

export function Sidebar({ variant }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const agencyLinks = [
    { to: '/agencia/inicio', icon: Home, label: 'Inicio' },
    { to: '/agencia/tours', icon: Package, label: 'Mis Tours' },
    { to: '/agencia/guias', icon: Users, label: 'Guías' },
    { to: '/agencia/flota', icon: Truck, label: 'Flota' },
    { to: '/agencia/reservas', icon: Calendar, label: 'Reservas' },
    { to: '/agencia/facturas', icon: FileText, label: 'Facturación' },
  ];

  const adminLinks = [
    { to: '/admin/inicio', icon: Home, label: 'Inicio' },
    { to: '/admin/usuarios', icon: Users, label: 'Usuarios' },
    { to: '/admin/servicios', icon: Package, label: 'Servicios' },
    { to: '/admin/reportes', icon: BarChart3, label: 'Reportes' },
    { to: '/admin/configuracion', icon: Settings, label: 'Configuración' },
  ];

  const links = variant === 'agency' ? agencyLinks : adminLinks;

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1A6B4A' }}>
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display', color: '#1A6B4A' }}>
            TuristGo
          </span>
        </Link>
        {user && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Bienvenido,</p>
            <p className="font-semibold text-gray-900">{user.name}</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
