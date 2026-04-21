import { Navigate } from 'react-router';
import { useState } from 'react';
import { Car, Users, X } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockTours, mockGuides, mockVehicles, mockReservations, mockUsers, Tour } from '../../lib/mockData';

export function GuideToursPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [showTouristsDialog, setShowTouristsDialog] = useState(false);

  if (!isAuthenticated || user?.role !== 'Guía') {
    return <Navigate to="/login" replace />;
  }

  const guide = mockGuides.find((g) => g.email === user.email);
  const assignedTours = guide ? mockTours.filter((t) => t.guideId === guide.id) : [];

  const getVehicleInfo = (vehicleId?: string) => {
    if (!vehicleId) return null;
    return mockVehicles.find(v => v.id === vehicleId);
  };

  const getTourists = (tourId: string) => {
    const tourReservations = mockReservations.filter(
      r => r.tourId === tourId && r.status === 'Confirmada'
    );
    return tourReservations.map(res => {
      const tourist = Object.values(mockUsers).find(u => u.id === res.userId);
      return tourist?.name || 'Desconocido';
    });
  };

  const handleViewTourists = (tour: Tour) => {
    setSelectedTour(tour);
    setShowTouristsDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="guide" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>
          Mis Tours Asignados
        </h1>

        {assignedTours.length > 0 ? (
          <div className="space-y-4">
            {assignedTours.map((tour) => {
              const vehicle = getVehicleInfo(tour.vehicleId);
              const tourists = getTourists(tour.id);
              return (
                <div key={tour.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img src={tour.images[0]} alt={tour.name} className="w-full md:w-48 h-32 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold">{tour.name}</h3>
                          <p className="text-gray-600">{tour.category}</p>
                        </div>
                        <StatusBadge status={tour.status} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-gray-600">Fecha/Hora</p>
                          <p className="font-semibold">{new Date(tour.date).toLocaleDateString('es-CO')} - {tour.time}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Turistas confirmados</p>
                          <p className="font-semibold">{tourists.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Punto de encuentro</p>
                          <p className="font-semibold">{tour.meetingPoint}</p>
                        </div>
                      </div>

                      {/* Vehicle Information */}
                      {vehicle && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Car className="h-5 w-5 text-blue-600" />
                            <h4 className="font-semibold text-blue-900">Datos de transporte</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                            <div>
                              <span className="font-medium">Placa:</span> {vehicle.plate}
                            </div>
                            <div>
                              <span className="font-medium">Marca:</span> {vehicle.brand}
                            </div>
                            <div>
                              <span className="font-medium">Modelo:</span> {vehicle.model}
                            </div>
                            <div>
                              <span className="font-medium">Capacidad:</span> {vehicle.capacity} pasajeros
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" onClick={() => handleViewTourists(tour)}>
                          <Users className="h-4 w-4 mr-1" />
                          Ver turistas
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No tienes tours asignados actualmente</p>
          </div>
        )}
      </div>

      {/* Tourists List Dialog */}
      {showTouristsDialog && selectedTour && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Turistas confirmados</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedTour.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowTouristsDialog(false);
                    setSelectedTour(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 mb-4">
                Número de turistas confirmados: <strong>{getTourists(selectedTour.id).length}</strong>
              </p>

              {getTourists(selectedTour.id).length > 0 ? (
                <div className="space-y-2">
                  {getTourists(selectedTour.id).map((name, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-medium">{name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No hay turistas confirmados aún
                </p>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end">
              <Button
                onClick={() => {
                  setShowTouristsDialog(false);
                  setSelectedTour(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
