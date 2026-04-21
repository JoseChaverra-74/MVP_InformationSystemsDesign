import { Link } from 'react-router';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { Button } from './ui/button';
import { useState } from 'react';

interface NavbarProps {
  variant?: 'public' | 'tourist' | 'guide';
}

export function Navbar({ variant = 'public' }: NavbarProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1A6B4A' }}>
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display', color: '#1A6B4A' }}>
              TuristGo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {variant === 'public' && !user && (
              <>
                <Link to="/tours" className="text-gray-700 hover:text-primary">
                  Explorar Tours
                </Link>
                <Link to="/login">
                  <Button variant="outline">Iniciar sesión</Button>
                </Link>
                <Link to="/registro/turista">
                  <Button>Registrarme</Button>
                </Link>
              </>
            )}

            {variant === 'tourist' && user && (
              <>
                <Link to="/turista/tours" className="text-gray-700 hover:text-primary">
                  Explorar Tours
                </Link>
                <Link to="/turista/reservas" className="text-gray-700 hover:text-primary">
                  Mis Reservas
                </Link>
                <Link to="/turista/facturas" className="text-gray-700 hover:text-primary">
                  Mis Facturas
                </Link>
                <Link to="/turista/perfil" className="text-gray-700 hover:text-primary">
                  Perfil
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </Button>
              </>
            )}

            {variant === 'guide' && user && (
              <>
                <Link to="/guia/tours" className="text-gray-700 hover:text-primary">
                  Mis Tours
                </Link>
                <Link to="/guia/disponibilidad" className="text-gray-700 hover:text-primary">
                  Mi Disponibilidad
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {variant === 'public' && !user && (
              <>
                <Link
                  to="/tours"
                  className="block py-2 text-gray-700 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Explorar Tours
                </Link>
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro/turista"
                  className="block py-2 text-gray-700 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrarme
                </Link>
              </>
            )}
            {variant === 'tourist' && user && (
              <>
                <Link
                  to="/turista/tours"
                  className="block py-2 text-gray-700 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Explorar Tours
                </Link>
                <Link
                  to="/turista/reservas"
                  className="block py-2 text-gray-700 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mis Reservas
                </Link>
                <button
                  className="block w-full text-left py-2 text-gray-700 hover:text-primary"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
