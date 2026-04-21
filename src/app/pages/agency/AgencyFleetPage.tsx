import { Navigate } from 'react-router';
import { Plus, X, Check, AlertCircle, Wrench, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Sidebar } from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockVehicles, mockTours, Vehicle } from '../../lib/mockData';
import { useState } from 'react';

export function AgencyFleetPage() {
  const { user, isAuthenticated } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([...mockVehicles]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<'Disponible' | 'En mantenimiento' | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [vehicleStatuses, setVehicleStatuses] = useState<{ [key: string]: 'Disponible' | 'En mantenimiento' | 'Ocupado' }>({});
  const [registerFormData, setRegisterFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: '',
    capacity: '',
  });
  
  if (!isAuthenticated || user?.role !== 'Agencia') {
    return <Navigate to="/login" replace />;
  }

  const agencyVehicles = vehicles.filter((v) => v.agencyId === user.id);

  const handleOpenChangeStatus = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    const currentStatus = vehicleStatuses[vehicle.id] || vehicle.status;
    setNewStatus(currentStatus === 'Disponible' ? 'En mantenimiento' : 'Disponible');
    setShowChangeStatusModal(true);
  };

  const handleCloseModal = () => {
    setShowChangeStatusModal(false);
    setSelectedVehicle(null);
    setNewStatus(null);
  };

  // Check if vehicle has future tours assigned
  const hasAssignedTours = (vehicleId: string) => {
    const today = new Date();
    return mockTours.some((tour) => {
      const tourDate = new Date(tour.date);
      return tour.vehicleId === vehicleId && tourDate > today && tour.agencyId === user.id;
    });
  };

  const getAssignedTour = (vehicleId: string) => {
    const today = new Date();
    return mockTours.find((tour) => {
      const tourDate = new Date(tour.date);
      return tour.vehicleId === vehicleId && tourDate > today && tour.agencyId === user.id;
    });
  };

  const handleConfirmChange = () => {
    if (!selectedVehicle || !newStatus) return;

    // Update the vehicle status
    setVehicleStatuses({
      ...vehicleStatuses,
      [selectedVehicle.id]: newStatus,
    });

    setShowChangeStatusModal(false);
    setShowSuccessModal(true);

    // Close success modal after 2 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      setSelectedVehicle(null);
      setNewStatus(null);
    }, 2000);
  };

  const getCurrentStatus = (vehicle: Vehicle) => {
    return vehicleStatuses[vehicle.id] || vehicle.status;
  };

  const isChangeBlocked = selectedVehicle && newStatus === 'En mantenimiento' && hasAssignedTours(selectedVehicle.id);
  const assignedTour = selectedVehicle ? getAssignedTour(selectedVehicle.id) : null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleRegisterVehicle = () => {
    const newVehicle: Vehicle = {
      id: `vehicle-${Date.now()}`,
      plate: registerFormData.plate,
      brand: registerFormData.brand,
      model: registerFormData.model,
      type: 'Van',
      color: 'Blanco',
      capacity: Number(registerFormData.capacity),
      agencyId: user.id,
      status: 'Disponible',
    };

    setVehicles([...vehicles, newVehicle]);
    toast.success('Vehículo registrado correctamente');
    setShowRegisterDialog(false);
    setRegisterFormData({ plate: '', brand: '', model: '', year: '', capacity: '' });
  };

  const handleOpenDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteDialog(true);
  };

  const handleDeleteVehicle = () => {
    if (!selectedVehicle) return;

    setVehicles(vehicles.filter(v => v.id !== selectedVehicle.id));
    toast.success('Vehículo eliminado');
    setShowDeleteDialog(false);
    setSelectedVehicle(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar variant="agency" />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display' }}>
            Gestión de Flota
          </h1>
          <Button onClick={() => setShowRegisterDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar vehículo
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agencyVehicles.map((vehicle) => {
            const currentStatus = getCurrentStatus(vehicle);
            return (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-gray-600">Placa: {vehicle.plate}</p>
                  </div>
                  <StatusBadge status={currentStatus} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Tipo:</span> {vehicle.type}
                  </div>
                  <div>
                    <span className="text-gray-600">Capacidad:</span> {vehicle.capacity}
                  </div>
                  <div>
                    <span className="text-gray-600">Color:</span> {vehicle.color}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">Ver detalles</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenChangeStatus(vehicle)}
                  >
                    Cambiar estado
                  </Button>
                  {!hasAssignedTours(vehicle.id) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDelete(vehicle)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Change Status Modal */}
      {showChangeStatusModal && selectedVehicle && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[560px] animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Cambiar estado del vehículo</h2>
                  <p className="text-sm text-gray-600">
                    {selectedVehicle.plate} · {selectedVehicle.brand} {selectedVehicle.model}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5">
              {/* Current Status */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado actual
                </label>
                <StatusBadge status={getCurrentStatus(selectedVehicle)} />
              </div>

              {/* New Status Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selecciona el nuevo estado
                </label>
                <div className="space-y-3">
                  {/* Disponible Option */}
                  <div
                    onClick={() => {
                      if (getCurrentStatus(selectedVehicle) !== 'Disponible') {
                        setNewStatus('Disponible');
                      }
                    }}
                    className={`
                      border-2 rounded-lg p-4 flex items-center gap-3 transition-all
                      ${getCurrentStatus(selectedVehicle) === 'Disponible'
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                        : newStatus === 'Disponible'
                        ? 'border-[var(--turistgo-primary)] bg-green-50 cursor-pointer'
                        : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                      }
                    `}
                  >
                    <div
                      className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${newStatus === 'Disponible' && getCurrentStatus(selectedVehicle) !== 'Disponible'
                          ? 'border-[var(--turistgo-primary)] bg-[var(--turistgo-primary)]'
                          : 'border-gray-300'
                        }
                      `}
                    >
                      {newStatus === 'Disponible' && getCurrentStatus(selectedVehicle) !== 'Disponible' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">Disponible</span>
                    </div>
                    <StatusBadge status="Disponible" />
                  </div>

                  {/* En mantenimiento Option */}
                  <div
                    onClick={() => {
                      if (getCurrentStatus(selectedVehicle) !== 'En mantenimiento') {
                        setNewStatus('En mantenimiento');
                      }
                    }}
                    className={`
                      border-2 rounded-lg p-4 flex items-center gap-3 transition-all
                      ${getCurrentStatus(selectedVehicle) === 'En mantenimiento'
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                        : newStatus === 'En mantenimiento'
                        ? 'border-[var(--turistgo-primary)] bg-orange-50 cursor-pointer'
                        : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                      }
                    `}
                  >
                    <div
                      className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${newStatus === 'En mantenimiento' && getCurrentStatus(selectedVehicle) !== 'En mantenimiento'
                          ? 'border-[var(--turistgo-primary)] bg-[var(--turistgo-primary)]'
                          : 'border-gray-300'
                        }
                      `}
                    >
                      {newStatus === 'En mantenimiento' && getCurrentStatus(selectedVehicle) !== 'En mantenimiento' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <Wrench className="h-5 w-5 text-orange-600 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">En mantenimiento</span>
                    </div>
                    <StatusBadge status="En mantenimiento" />
                  </div>
                </div>
              </div>

              {/* Error Banner - Vehicle has assigned tours */}
              {isChangeBlocked && assignedTour && (
                <div 
                  className="rounded-lg p-4 flex items-start gap-3 mb-4"
                  style={{ 
                    backgroundColor: 'var(--turistgo-error-light)',
                    border: '1px solid var(--turistgo-error)'
                  }}
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--turistgo-error)' }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--turistgo-error)' }}>
                      Este vehículo tiene tours futuros asignados
                    </p>
                    <p className="text-sm mt-1" style={{ color: 'var(--turistgo-error)' }}>
                      Desvincúlalo primero del tour "{assignedTour.name}" ({formatDate(assignedTour.date)}) antes de marcarlo en mantenimiento.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmChange}
                disabled={
                  !newStatus || 
                  newStatus === getCurrentStatus(selectedVehicle) ||
                  isChangeBlocked
                }
              >
                Confirmar cambio
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedVehicle && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-200">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'var(--turistgo-primary-light)' }}
            >
              <Check className="h-8 w-8" style={{ color: 'var(--turistgo-primary)' }} />
            </div>
            <h3 className="mb-2">Estado actualizado correctamente</h3>
            <p className="text-gray-600">
              El vehículo {selectedVehicle.plate} ahora está marcado como <strong>{newStatus}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Register Vehicle Dialog */}
      {showRegisterDialog && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Registrar vehículo</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Completa la información del vehículo
                  </p>
                </div>
                <button
                  onClick={() => setShowRegisterDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placa
                </label>
                <input
                  type="text"
                  value={registerFormData.plate}
                  onChange={(e) => setRegisterFormData({ ...registerFormData, plate: e.target.value })}
                  placeholder="ABC-123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={registerFormData.brand}
                    onChange={(e) => setRegisterFormData({ ...registerFormData, brand: e.target.value })}
                    placeholder="Toyota"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={registerFormData.model}
                    onChange={(e) => setRegisterFormData({ ...registerFormData, model: e.target.value })}
                    placeholder="HiAce"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año
                  </label>
                  <input
                    type="text"
                    value={registerFormData.year}
                    onChange={(e) => setRegisterFormData({ ...registerFormData, year: e.target.value })}
                    placeholder="2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacidad de pasajeros
                  </label>
                  <input
                    type="number"
                    value={registerFormData.capacity}
                    onChange={(e) => setRegisterFormData({ ...registerFormData, capacity: e.target.value })}
                    placeholder="15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto (opcional)
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="vehicle-photo-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90"
                      >
                        <span>Sube una foto</span>
                        <input
                          id="vehicle-photo-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG hasta 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRegisterDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleRegisterVehicle}>
                Registrar vehículo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Vehicle Dialog */}
      {showDeleteDialog && selectedVehicle && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Eliminar vehículo</h2>
            </div>

            <div className="px-6 py-5">
              <p className="text-gray-700">
                ¿Estás seguro que deseas eliminar el vehículo <strong>{selectedVehicle.plate}</strong>?
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedVehicle(null);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleDeleteVehicle} variant="destructive">
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}