import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { Star, X, Clock, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockReservations, mockTours, Reservation } from '../../lib/mockData';

export function TouristReservationsPage() {
  const { user, isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<string>('Todas');
  const [reservations, setReservations] = useState<Reservation[]>([...mockReservations]);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [dateTarget, setDateTarget] = useState<string | null>(null);
  const [rateTarget, setRateTarget] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newScheduleId, setNewScheduleId] = useState('');
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState('');
  const [showConflictAlert, setShowConflictAlert] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<any>(null);

  if (!isAuthenticated || user?.role !== 'Turista') {
    return <Navigate to="/login" replace />;
  }

  const userReservations = reservations.filter((r) => r.userId === user.id);
  const filteredReservations = filter === 'Todas'
    ? userReservations
    : userReservations.filter((r) => r.status === filter);

  const filters = ['Todas', 'Confirmada', 'Completada', 'Cancelada'];

  const handleCancelReservation = () => {
    setReservations(prev => prev.map(r =>
      r.id === cancelTarget ? { ...r, status: 'Cancelada' as const } : r
    ));
    toast.success('Reserva cancelada correctamente');
    setCancelTarget(null);
  };

  const checkDateConflict = (reservationId: string, newScheduleId: string, newDateSelected: string) => {
    if (!newScheduleId || !newDateSelected) return null;

    const currentReservation = reservations.find(r => r.id === reservationId);
    if (!currentReservation) return null;

    const tour = mockTours.find(t => t.id === currentReservation.tourId);
    if (!tour || !tour.schedules) return null;

    const newSchedule = tour.schedules.find(s => s.id === newScheduleId);
    if (!newSchedule) return null;

    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const newStartMinutes = parseTime(newSchedule.startTime);
    const newEndMinutes = parseTime(newSchedule.endTime);

    // Check for conflicts with other reservations (except current one)
    for (const reservation of reservations) {
      if (reservation.id === reservationId) continue;
      if (reservation.status !== 'Confirmada' && reservation.status !== 'Pendiente') continue;
      if (!reservation.startTime || !reservation.endTime) continue;

      // Only check for conflicts on the same date
      if (reservation.date !== newDateSelected) continue;

      const existingStartMinutes = parseTime(reservation.startTime);
      const existingEndMinutes = parseTime(reservation.endTime);

      const hasOverlap =
        (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes);

      if (hasOverlap) {
        const conflictTour = mockTours.find(t => t.id === reservation.tourId);
        return { reservation, tour: conflictTour };
      }
    }

    return null;
  };

  const handleChangeDate = () => {
    if (!newScheduleId) {
      toast.error('Por favor selecciona un horario');
      return;
    }

    const conflict = checkDateConflict(dateTarget!, newScheduleId, newDate);
    if (conflict) {
      setConflictInfo(conflict);
      setShowConflictAlert(true);
      setDateTarget(null);
      setNewDate('');
      setNewScheduleId('');
      return;
    }

    const currentReservation = reservations.find(r => r.id === dateTarget);
    const tour = mockTours.find(t => t.id === currentReservation?.tourId);
    const newSchedule = tour?.schedules?.find(s => s.id === newScheduleId);

    if (newSchedule) {
      setReservations(prev => prev.map(r =>
        r.id === dateTarget ? {
          ...r,
          date: newDate,
          scheduleId: newScheduleId,
          startTime: newSchedule.startTime,
          endTime: newSchedule.endTime
        } : r
      ));
      toast.success('Fecha actualizada correctamente');
      setDateTarget(null);
      setNewDate('');
      setNewScheduleId('');
    }
  };

  const handleRateTour = () => {
    if (stars === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }
    setReservations(prev => prev.map(r =>
      r.id === rateTarget ? { ...r, rating: stars, review } : r
    ));
    toast.success('¡Gracias por tu calificación!');
    setRateTarget(null);
    setStars(0);
    setReview('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="tourist" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>
          Mis Reservas
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Reservations List */}
        {filteredReservations.length > 0 ? (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => {
              const tour = mockTours.find((t) => t.id === reservation.tourId);
              if (!tour) return null;

              return (
                <div key={reservation.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={tour.images[0]}
                      alt={tour.name}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold">{tour.name}</h3>
                          <p className="text-gray-600">Reserva #{reservation.id}</p>
                        </div>
                        <StatusBadge status={reservation.status} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
                        <div>
                          <p className="font-semibold">Fecha</p>
                          <p>{new Date(reservation.date).toLocaleDateString('es-CO')}</p>
                          {reservation.startTime && reservation.endTime && (
                            <p className="text-xs text-gray-500 mt-1">
                              {reservation.startTime} - {reservation.endTime}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">Precio</p>
                          <p>${reservation.price.toLocaleString('es-CO')}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Link to={`/turista/reservas/${reservation.id}`}>
                          <Button size="sm">Ver detalles</Button>
                        </Link>
                        {reservation.status === 'Completada' && !reservation.rating && (
                          <Button size="sm" variant="outline" onClick={() => setRateTarget(reservation.id)}>Calificar tour</Button>
                        )}
                        {reservation.status === 'Completada' && reservation.rating && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Star className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                            <span>Calificado</span>
                          </div>
                        )}
                        {reservation.status === 'Confirmada' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => setDateTarget(reservation.id)}>Cambiar fecha</Button>
                            <Button size="sm" variant="destructive" onClick={() => setCancelTarget(reservation.id)}>Cancelar</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg mb-4">
              {filter === 'Todas'
                ? 'Aún no tienes reservas. ¡Explora el catálogo para encontrar tu próximo tour!'
                : `No tienes reservas con estado "${filter}"`}
            </p>
            <Link to="/turista/tours">
              <Button>Explorar tours</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Modals */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">¿Estás seguro?</h2>
            <p className="text-gray-600 mb-6">¿Deseas cancelar esta reserva?</p>
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setCancelTarget(null)}>Cancelar</Button>
              <Button size="sm" variant="destructive" onClick={handleCancelReservation}>Confirmar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Change Date Modal */}
      {dateTarget && (() => {
        const currentReservation = reservations.find(r => r.id === dateTarget);
        const tour = mockTours.find(t => t.id === currentReservation?.tourId);

        return (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Cambiar fecha</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {tour?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDateTarget(null);
                      setNewDate('');
                      setNewScheduleId('');
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-5 space-y-6">
                {/* Date Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona una nueva fecha
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                  />
                </div>

                {/* Schedule Selector */}
                {newDate && tour?.schedules && tour.schedules.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Selecciona un horario disponible
                    </label>
                    <div className="space-y-3">
                      {tour.schedules.map((schedule) => (
                        <button
                          key={schedule.id}
                          onClick={() => setNewScheduleId(schedule.id)}
                          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                            newScheduleId === schedule.id
                              ? 'border-primary bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="font-semibold">
                                  {schedule.startTime} - {schedule.endTime}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {tour.duration} horas de recorrido
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-gray-400" />
                              <div className="text-right">
                                <p className="font-semibold text-sm">
                                  {schedule.availableSpots} cupos
                                </p>
                                <p className="text-xs text-gray-500">disponibles</p>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!newDate && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Selecciona una fecha para ver los horarios disponibles</p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDateTarget(null);
                    setNewDate('');
                    setNewScheduleId('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleChangeDate}
                  disabled={!newDate || !newScheduleId}
                >
                  Guardar cambios
                </Button>
              </div>
            </div>
          </div>
        );
      })()}

      {rateTarget && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Calificar tour</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Comparte tu experiencia con otros viajeros
                  </p>
                </div>
                <button
                  onClick={() => {
                    setRateTarget(null);
                    setStars(0);
                    setReview('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Calificación
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 cursor-pointer transition-colors ${
                        stars >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                      onClick={() => setStars(star)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reseña (opcional)
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Cuéntanos sobre tu experiencia..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setRateTarget(null);
                  setStars(0);
                  setReview('');
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleRateTour}>
                Enviar calificación
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Conflict Alert */}
      {showConflictAlert && conflictInfo && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-red-900">
                  Conflicto de horario detectado
                </h2>
              </div>
            </div>

            <div className="px-6 py-5">
              <p className="text-gray-700 mb-4">
                No puedes cambiar a esta fecha/hora porque se solapa con:
              </p>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                <p className="font-semibold text-red-900">
                  {conflictInfo.tour?.name}
                </p>
                <p className="text-sm text-red-800 mt-1">
                  Horario: {conflictInfo.reservation.startTime} - {conflictInfo.reservation.endTime}
                </p>
                <p className="text-sm text-red-800">
                  Fecha: {new Date(conflictInfo.reservation.date).toLocaleDateString('es-CO')}
                </p>
              </div>
              <p className="text-gray-700 text-sm">
                Por favor, selecciona otro horario que no se solape con tus reservas existentes.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end">
              <Button
                onClick={() => {
                  setShowConflictAlert(false);
                  setConflictInfo(null);
                }}
              >
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}