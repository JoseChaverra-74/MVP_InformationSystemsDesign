import { Link, Navigate } from 'react-router';
import { Calendar, Check, FileText, Package } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { TourCard } from '../../components/TourCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockTours, mockReservations, mockInvoices } from '../../lib/mockData';

export function TouristDashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'Turista') {
    return <Navigate to="/login" replace />;
  }

  const userReservations = mockReservations.filter((r) => r.userId === user.id);
  const activeReservations = userReservations.filter((r) => r.status === 'Confirmada');
  const completedReservations = userReservations.filter((r) => r.status === 'Completada');
  const userInvoices = mockInvoices.filter((i) => i.userId === user.id);
  const nextReservation = activeReservations[0];
  const nextTour = nextReservation ? mockTours.find((t) => t.id === nextReservation.tourId) : null;

  const recommendedTours = mockTours.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="tourist" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display' }}>
            Hola, {user.name} 👋
          </h1>
          <p className="text-gray-600">{new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Activity Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeReservations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tours Completados</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedReservations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facturas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userInvoices.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Next Reservation */}
        {nextTour && nextReservation && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Tu próxima reserva</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img
                src={nextTour.images[0]}
                alt={nextTour.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">{nextTour.name}</h3>
                <StatusBadge status={nextReservation.status} />
                <div className="mt-4 space-y-2 text-gray-700">
                  <p><strong>Fecha:</strong> {new Date(nextTour.date).toLocaleDateString('es-CO')}</p>
                  <p><strong>Hora:</strong> {nextTour.time}</p>
                  <p><strong>Punto de encuentro:</strong> {nextTour.meetingPoint}</p>
                </div>
                <div className="flex gap-3 mt-6">
                  <Link to={`/turista/reservas/${nextReservation.id}`}>
                    <Button>Ver detalles</Button>
                  </Link>
                  <Button variant="outline">Cancelar reserva</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Tours */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Tours recomendados para ti</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} showReserveButton linkTo={`/tours/${tour.id}`} />
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6">Accesos rápidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/turista/tours">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Package className="h-6 w-6" />
                <span>Explorar catálogo</span>
              </Button>
            </Link>
            <Link to="/turista/reservas">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Calendar className="h-6 w-6" />
                <span>Mis reservas</span>
              </Button>
            </Link>
            <Link to="/turista/facturas">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <FileText className="h-6 w-6" />
                <span>Mis facturas</span>
              </Button>
            </Link>
            <Link to="/turista/perfil">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">👤</span>
                <span>Mi perfil</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
