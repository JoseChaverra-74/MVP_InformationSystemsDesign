import { useState } from 'react';
import { Navigate } from 'react-router';
import { toast } from 'sonner';
import { Sidebar } from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockReservations, mockTours, Reservation } from '../../lib/mockData';

export function AgencyReservationsPage() {
  const { user, isAuthenticated } = useAuth();
  const agencyTours = mockTours.filter((t) => t.agencyId === user?.id);
  const [reservations, setReservations] = useState<Reservation[]>(
    [...mockReservations.filter((r) => agencyTours.some((t) => t.id === r.tourId))]
  );
  const [filterTour, setFilterTour] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todas');
  
  if (!isAuthenticated || user?.role !== 'Agencia') {
    return <Navigate to="/login" replace />;
  }

  const handleMarkAsCompleted = (res: Reservation) => {
    const tour = mockTours.find(t => t.id === res.tourId);
    if (!tour) return;

    const tourDateTime = new Date(tour.date + 'T' + (tour.time || '00:00'));
    if (tourDateTime > new Date()) {
      toast.error('No puedes completar un tour que aún no ha ocurrido.');
      return;
    }

    setReservations(prev => prev.map(r =>
      r.id === res.id ? { ...r, status: 'Completada' as const } : r
    ));
    toast.success('Reserva marcada como completada. El turista puede calificar el tour.');
  };

  // Filtros
  let filteredReservations = reservations;
  if (filterTour !== 'Todos') {
    filteredReservations = filteredReservations.filter(r => r.tourId === filterTour);
  }
  if (filterStatus !== 'Todas') {
    filteredReservations = filteredReservations.filter(r => r.status === filterStatus);
  }

  const statusFilters = ['Todas', 'Confirmada', 'Completada', 'Cancelada'];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar variant="agency" />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>
          Gestión de Reservas
        </h1>

        {/* Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por tour</label>
            <select
              value={filterTour}
              onChange={(e) => setFilterTour(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)]"
            >
              <option value="Todos">Todos</option>
              {agencyTours.map(tour => (
                <option key={tour.id} value={tour.id}>{tour.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por estado</label>
            <div className="flex gap-2">
              {statusFilters.map(status => (
                <Button
                  key={status}
                  size="sm"
                  variant={filterStatus === status ? 'default' : 'outline'}
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  N° Reserva
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Turista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredReservations.map((res) => {
                const tour = mockTours.find((t) => t.id === res.tourId);
                return (
                  <tr key={res.id}>
                    <td className="px-6 py-4">{res.id}</td>
                    <td className="px-6 py-4">Carlos Restrepo</td>
                    <td className="px-6 py-4">{tour?.name}</td>
                    <td className="px-6 py-4">
                      {new Date(res.date).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={res.status} />
                    </td>
                    <td className="px-6 py-4">
                      {res.status === 'Confirmada' && new Date(res.date) < new Date() && (
                        <Button size="sm" onClick={() => handleMarkAsCompleted(res)}>
                          Marcar como completada
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}