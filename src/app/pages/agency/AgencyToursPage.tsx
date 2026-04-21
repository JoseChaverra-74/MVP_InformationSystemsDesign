import { Navigate, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Sidebar } from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockGuides, Tour } from '../../lib/mockData';
import { getAllTours } from '../../lib/toursStorage';

export function AgencyToursPage() {
  const { user, isAuthenticated } = useAuth();
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    setTours(getAllTours());
  }, []);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [showAssignGuideDialog, setShowAssignGuideDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    description: '',
    price: 0,
    meetingPoint: '',
    maxCapacity: 0,
  });

  if (!isAuthenticated || user?.role !== 'Agencia') {
    return <Navigate to="/login" replace />;
  }

  const agencyTours = tours.filter((t) => t.agencyId === user.id);
  const agencyGuides = mockGuides.filter((g) => g.agencyId === user.id);

  const handleOpenAssignGuide = (tour: Tour) => {
    setSelectedTour(tour);
    setShowAssignGuideDialog(true);
  };

  const handleAssignGuide = (guideId: string) => {
    if (!selectedTour) return;

    const guide = agencyGuides.find(g => g.id === guideId);
    if (!guide) return;

    setTours(prevTours =>
      prevTours.map(t =>
        t.id === selectedTour.id
          ? { ...t, guideId: guideId, status: 'Activo' as const }
          : t
      )
    );

    toast.success(`Guía ${guide.name} asignado correctamente al tour`);
    setShowAssignGuideDialog(false);
    setSelectedTour(null);
  };

  const getGuideName = (guideId?: string) => {
    if (!guideId) return null;
    const guide = agencyGuides.find(g => g.id === guideId);
    return guide?.name;
  };

  const handleOpenEditTour = (tour: Tour) => {
    setSelectedTour(tour);
    setEditFormData({
      description: tour.description,
      price: tour.price,
      meetingPoint: tour.meetingPoint,
      maxCapacity: tour.maxCapacity,
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!selectedTour) return;

    setTours(prevTours =>
      prevTours.map(t =>
        t.id === selectedTour.id
          ? {
              ...t,
              description: editFormData.description,
              price: editFormData.price,
              meetingPoint: editFormData.meetingPoint,
              maxCapacity: editFormData.maxCapacity,
            }
          : t
      )
    );

    toast.success('Servicio actualizado correctamente');
    setShowEditDialog(false);
    setSelectedTour(null);
  };

  const handleOpenDeactivate = (tour: Tour) => {
    setSelectedTour(tour);
    setShowDeactivateDialog(true);
  };

  const handleDeactivateTour = () => {
    if (!selectedTour) return;

    setTours(prevTours =>
      prevTours.map(t =>
        t.id === selectedTour.id
          ? { ...t, status: 'Inactivo' as const }
          : t
      )
    );

    toast.success('Servicio desactivado');
    setShowDeactivateDialog(false);
    setSelectedTour(null);
  };

  const handleOpenActivate = (tour: Tour) => {
    setSelectedTour(tour);
    setShowActivateDialog(true);
  };

  const handleActivateTour = () => {
    if (!selectedTour) return;

    setTours(prevTours =>
      prevTours.map(t =>
        t.id === selectedTour.id
          ? { ...t, status: 'Activo' as const }
          : t
      )
    );

    toast.success('Servicio activado');
    setShowActivateDialog(false);
    setSelectedTour(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar variant="agency" />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display' }}>
              Gestión de Tours
            </h1>
            <Link to="/agencia/tours/nuevo">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear nuevo tour
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cupos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agencyTours.map((tour) => {
                  const guideName = getGuideName(tour.guideId);
                  return (
                    <tr key={tour.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={tour.images[0]} alt={tour.name} className="h-10 w-10 rounded object-cover" />
                          <span className="ml-3 font-medium">{tour.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{tour.category}</td>
                      <td className="px-6 py-4">${tour.price.toLocaleString('es-CO')}</td>
                      <td className="px-6 py-4">{tour.availableSpots}/{tour.maxCapacity}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={tour.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          <Button size="sm" variant="outline" onClick={() => handleOpenEditTour(tour)}>
                            Editar
                          </Button>
                          {tour.status === 'Activo' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDeactivate(tour)}
                            >
                              Desactivar
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenActivate(tour)}
                            >
                              Activar servicio
                            </Button>
                          )}
                          {!tour.guideId ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenAssignGuide(tour)}
                            >
                              Asignar guía
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              Guía: {guideName}
                            </Button>
                          )}
                          <Link to={`/agencia/tours/${tour.id}/asignar-vehiculo`}>
                            <Button size="sm" variant="outline">Asignar vehículo</Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assign Guide Dialog */}
      {showAssignGuideDialog && selectedTour && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-200">
            {/* Dialog Header */}
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Asignar guía al tour</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedTour.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAssignGuideDialog(false);
                    setSelectedTour(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="px-6 py-5">
              {agencyGuides.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tienes guías registrados. Por favor registra un guía primero.
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Selecciona un guía disponible:
                  </p>
                  {agencyGuides.map((guide) => (
                    <div 
                      key={guide.id}
                      className="border rounded-lg p-4 hover:border-[var(--turistgo-primary)] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{guide.name}</p>
                          <p className="text-sm text-gray-600">
                            Certificado: {guide.certificateNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            Vence: {new Date(guide.certificateExpiry).toLocaleDateString('es-CO')}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAssignGuide(guide.id)}
                        >
                          Asignar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAssignGuideDialog(false);
                  setSelectedTour(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tour Dialog */}
      {showEditDialog && selectedTour && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Editar servicio</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedTour.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedTour(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio (COP)
                </label>
                <input
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Punto de encuentro
                </label>
                <input
                  type="text"
                  value={editFormData.meetingPoint}
                  onChange={(e) => setEditFormData({ ...editFormData, meetingPoint: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cupos máximos
                </label>
                <input
                  type="number"
                  value={editFormData.maxCapacity}
                  onChange={(e) => setEditFormData({ ...editFormData, maxCapacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos (subir nuevas)
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="tour-photos-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90"
                      >
                        <span>Sube archivos</span>
                        <input
                          id="tour-photos-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          multiple
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
                onClick={() => {
                  setShowEditDialog(false);
                  setSelectedTour(null);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Tour Dialog */}
      {showDeactivateDialog && selectedTour && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Desactivar servicio</h2>
            </div>

            <div className="px-6 py-5">
              <p className="text-gray-700">
                ¿Estás seguro que deseas desactivar el tour <strong>{selectedTour.name}</strong>?
                Este tour dejará de aparecer en el catálogo público.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeactivateDialog(false);
                  setSelectedTour(null);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleDeactivateTour}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Activate Tour Dialog */}
      {showActivateDialog && selectedTour && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Activar servicio</h2>
            </div>

            <div className="px-6 py-5">
              <p className="text-gray-700">
                ¿Estás seguro que deseas activar el tour <strong>{selectedTour.name}</strong>?
                Este tour aparecerá nuevamente en el catálogo público.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowActivateDialog(false);
                  setSelectedTour(null);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleActivateTour}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}