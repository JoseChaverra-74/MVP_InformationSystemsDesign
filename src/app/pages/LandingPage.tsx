import { Link } from 'react-router';
import { Search, Mountain, Utensils, Palette, Trees, Star, Shield, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { TourCard } from '../components/TourCard';
import { mockTours } from '../lib/mockData';
import { Navbar } from '../components/Navbar';

export function LandingPage() {
  const featuredTours = mockTours.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="public" />

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center text-white text-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(26, 107, 74, 0.7), rgba(26, 107, 74, 0.7)), url(https://images.unsplash.com/photo-1633627425472-d07ac65e2a36?w=1920)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Playfair Display' }}>
              Descubre Medellín con guías certificados
            </h1>
            <p className="text-xl mb-8">
              Conectamos turistas con experiencias únicas y agencias verificadas
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-lg p-2 flex gap-2 shadow-xl">
              <Input
                placeholder="¿Qué tour buscas?"
                className="flex-1 border-0 focus-visible:ring-0"
              />
              <Link to="/tours">
                <Button size="lg">
                  <Search className="h-5 w-5 mr-2" />
                  Explorar
                </Button>
              </Link>
            </div>

            {/* CTAs */}
            <div className="flex gap-4 mt-8">
              <Link to="/login">
                <Button size="lg" variant="outline" className="bg-white text-primary border-white hover:bg-gray-100">
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/registro/turista">
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  Registrarme
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Playfair Display' }}>
            Categorías Destacadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Palette, name: 'Cultura', color: '#8B5CF6' },
              { icon: Mountain, name: 'Aventura', color: '#10B981' },
              { icon: Utensils, name: 'Gastronomía', color: '#F59E0B' },
              { icon: Trees, name: 'Naturaleza', color: '#059669' },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/tours?categoria=${category.name}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <category.icon className="h-12 w-12 mx-auto mb-4" style={{ color: category.color }} />
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Playfair Display' }}>
            Tours Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} showReserveButton={false} linkTo={`/tours/${tour.id}`} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/tours">
              <Button size="lg">Ver todos los tours</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why TuristGo Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Playfair Display' }}>
            ¿Por qué TuristGo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Guías certificados</h3>
              <p className="text-gray-600">
                Todos nuestros guías están certificados y verificados para garantizar la mejor experiencia
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reserva digital</h3>
              <p className="text-gray-600">
                Sistema de reservas simple y seguro, sin complicaciones
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Seguridad garantizada</h3>
              <p className="text-gray-600">
                Agencias certificadas y procesos seguros para tu tranquilidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display' }}>
                TuristGo
              </h3>
              <p className="text-gray-400">
                Conectando turistas con las mejores experiencias de Medellín
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/tours" className="hover:text-white">
                    Explorar Tours
                  </Link>
                </li>
                <li>
                  <Link to="/registro/agencia" className="hover:text-white">
                    Registra tu Agencia
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p className="text-gray-400">info@turistgo.com</p>
              <p className="text-gray-400">+57 300 123 4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 TuristGo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}