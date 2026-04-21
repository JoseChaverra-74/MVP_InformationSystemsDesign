import { useState } from 'react';
import { Navigate, useParams, useNavigate, Link } from 'react-router';
import { Check, AlertTriangle, X, Truck, ArrowLeft } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockTours, mockVehicles, Vehicle } from '../../lib/mockData';

export function AgencyAssignVehiclePage() {
  const { user, isAuthenticated } = useAuth();
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (!isAuthenticated || user?.role !== 'Agencia') {
    return <Navigate to="/login" replace />;
  }

  const tour = mockTours.find((t) => t.id === tourId && t.agencyId === user.id);

  if (!tour) {
    return <Navigate to="/agencia/tours" replace />;
  }

  const agencyVehicles = mockVehicles.filter((v) => v.agencyId === user.id);

  const handleAssignVehicle = () => {
    if (!selectedVehicle) return;
    
    // Simulate assignment
    setShowSuccessModal(true);
    
    // Redirect after 2 seconds
    setTimeout(() => {
      navigate('/agencia/tours');
    }, 2000);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isVehicleSelectable = (vehicle: Vehicle) => {
    if (vehicle.status !== 'Disponible') return false;
    if (vehicle.capacity < tour.maxCapacity) return false;
    return true;
  };

  const getValidationIcon = (vehicle: Vehicle) => {
    if (vehicle.capacity >= tour.maxCapacity) {
      return <Check className="h-5 w-5 text-green-600" />;
    }
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  const getTooltipText = (vehicle: Vehicle) => {
    if (vehicle.status === 'En mantenimiento') {
      return 'Este vehículo está en mantenimiento y no puede ser asignado';
    }
    if (vehicle.status === 'Ocupado') {
      return 'Este vehículo está ocupado en otro tour';
    }
    if (vehicle.capacity < tour.maxCapacity) {
      return `Capacidad insuficiente para este tour (${vehicle.capacity}/${tour.maxCapacity})`;
    }
    return '';
  };

  // Empty state
  if (agencyVehicles.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar variant="agency" />

        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/agencia/tours" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver a Tours
            </Link>

            <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>
              Asignar Vehículo
            </h1>

            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2">No tienes vehículos en tu flota</h3>
              <p className="text-gray-600 mb-6">Registra uno primero para poder asignarlo a tus tours.</p>
              <Link to="/agencia/flota">
                <Button>Ir a Gestión de Flota</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar variant="agency" />

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/agencia/tours" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a Tours
          </Link>

          <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>
            Asignar Vehículo
          </h1>

          {/* Tour Information Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tour</label>
                <p className="font-medium">{tour.name}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Fecha y hora</label>
                <p className="font-medium">{formatDate(tour.date)} · {tour.time}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cupo máximo del tour</label>
                <p className="font-medium text-lg" style={{ color: 'var(--turistgo-primary)' }}>
                  {tour.maxCapacity} personas
                </p>
              </div>
            </div>
          </div>

          {/* Error banners */}
          {selectedVehicle && (() => {
            const vehicle = agencyVehicles.find((v) => v.id === selectedVehicle);
            if (!vehicle) return null;
            
            if (vehicle.capacity < tour.maxCapacity) {
              return (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">
                    La capacidad del vehículo ({vehicle.capacity}) es menor al cupo máximo del tour ({tour.maxCapacity}). Selecciona uno con mayor capacidad.
                  </p>
                </div>
              );
            }
            
            if (vehicle.status === 'En mantenimiento') {
              return (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-800">
                    Este vehículo está en mantenimiento y no puede ser asignado.
                  </p>
                </div>
              );
            }
            
            return null;
          })()}

          {/* Vehicles List */}
          <div className="space-y-4 mb-6">
            {agencyVehicles.map((vehicle) => {
              const isSelectable = isVehicleSelectable(vehicle);
              const isSelected = selectedVehicle === vehicle.id;
              const tooltipText = getTooltipText(vehicle);

              return (
                <div
                  key={vehicle.id}
                  onClick={() => isSelectable && setSelectedVehicle(vehicle.id)}
                  className={`
                    bg-white rounded-lg shadow-sm p-6 transition-all
                    ${isSelectable ? 'cursor-pointer hover:shadow-md' : 'opacity-40 cursor-not-allowed'}
                    ${isSelected ? 'ring-2 ring-offset-2' : ''}
                  `}
                  style={isSelected ? { ringColor: 'var(--turistgo-primary)' } : {}}
                  title={tooltipText}
                >
                  <div className="flex items-center gap-6">
                    {/* Selection Radio */}
                    <div className="flex-shrink-0">
                      <div
                        className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                          ${isSelected ? 'border-[var(--turistgo-primary)] bg-[var(--turistgo-primary)]' : 'border-gray-300'}
                          ${!isSelectable && 'border-gray-200 bg-gray-100'}
                        `}
                      >
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>

                    {/* Vehicle Image Placeholder */}
                    <div className="w-24 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      <Truck className="h-8 w-8 text-gray-400" />
                    </div>

                    {/* Vehicle Info */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Placa</label>
                        <p className="font-medium">{vehicle.plate}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Marca/Modelo</label>
                        <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Capacidad</label>
                        <p className="font-medium">{vehicle.capacity} personas</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Estado</label>
                        <StatusBadge status={vehicle.status} />
                      </div>
                    </div>

                    {/* Validation Icon */}
                    <div className="flex-shrink-0">
                      {getValidationIcon(vehicle)}
                    </div>

                    {/* Capacity Warning Text */}
                    {vehicle.capacity < tour.maxCapacity && (
                      <div className="flex-shrink-0 text-xs text-red-600 max-w-[120px]">
                        Capacidad insuficiente para este tour
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/agencia/tours')}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssignVehicle}
              disabled={!selectedVehicle || !isVehicleSelectable(agencyVehicles.find((v) => v.id === selectedVehicle)!)}
            >
              Asignar vehículo seleccionado
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2">¡Vehículo asignado!</h3>
            <p className="text-gray-600 mb-6">
              Vehículo {agencyVehicles.find((v) => v.id === selectedVehicle)?.plate} asignado correctamente al tour.
            </p>
            <Button onClick={() => navigate('/agencia/tours')} className="w-full">
              Volver a Tours
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
