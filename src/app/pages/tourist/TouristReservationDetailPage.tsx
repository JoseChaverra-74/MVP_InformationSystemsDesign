import { useParams, Navigate, Link } from 'react-router';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockReservations, mockTours, mockVehicles } from '../../lib/mockData';

export function TouristReservationDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'Turista') {
    return <Navigate to="/login" replace />;
  }

  const reservation = mockReservations.find((r) => r.id === id);
  const tour = reservation ? mockTours.find((t) => t.id === reservation.tourId) : null;
  const vehicle = tour?.vehicleId ? mockVehicles.find((v) => v.id === tour.vehicleId) : null;

  if (!reservation || !tour) {
    return <Navigate to="/turista/reservas" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="tourist" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/turista/reservas" className="text-primary hover:underline mb-4 inline-block">
          ← Volver a mis reservas
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display' }}>
                Detalle de Reserva
              </h1>
              <p className="text-gray-600">Reserva #{reservation.id}</p>
            </div>
            <StatusBadge status={reservation.status} />
          </div>

          <img
            src={tour.images[0]}
            alt={tour.name}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          <h2 className="text-2xl font-semibold mb-4">{tour.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="font-semibold">Fecha y hora</p>
                <p className="text-gray-700">{new Date(tour.date).toLocaleDateString('es-CO')}</p>
                <p className="text-gray-700">{tour.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="font-semibold">Punto de encuentro</p>
                <p className="text-gray-700">{tour.meetingPoint}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="font-semibold">Precio pagado</p>
                <p className="text-gray-700">${reservation.price.toLocaleString('es-CO')} COP</p>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          {vehicle ? (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-3">Información del transporte</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Placa</p>
                  <p className="font-semibold">{vehicle.plate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Marca</p>
                  <p className="font-semibold">{vehicle.brand}</p>
                </div>
                <div>
                  <p className="text-gray-600">Modelo</p>
                  <p className="font-semibold">{vehicle.model}</p>
                </div>
                <div>
                  <p className="text-gray-600">Color</p>
                  <p className="font-semibold">{vehicle.color}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">El vehículo será asignado próximamente por la agencia</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {reservation.status === 'Confirmada' && (
              <>
                <Button>Cambiar fecha</Button>
                <Button variant="destructive">Cancelar reserva</Button>
              </>
            )}
            {reservation.status === 'Completada' && (
              <>
                {!reservation.rating && <Button>Calificar este tour</Button>}
                <Link to="/turista/facturas">
                  <Button variant="outline">Ver mi factura</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
