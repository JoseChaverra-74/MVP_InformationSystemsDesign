import { useParams, useNavigate, Link } from 'react-router';
import { useState } from 'react';
import { Star, Clock, Users, MapPin, Calendar, X, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockTours, mockReservations } from '../lib/mockData';
import { useAuth } from '../lib/auth';

export function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [reservationNumber, setReservationNumber] = useState('');
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [showScheduleConflictAlert, setShowScheduleConflictAlert] = useState(false);
  const [conflictingReservation, setConflictingReservation] = useState<any>(null);

  const tour = mockTours.find((t) => t.id === id);

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar variant="public" />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Tour no encontrado</h1>
          <Link to="/tours">
            <Button className="mt-4">Volver al catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleReserve = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // For tours with schedules, require selection
      if (tour?.schedules && tour.schedules.length > 0 && !selectedScheduleId) {
        toast.error('Por favor selecciona un horario');
        return;
      }
      setShowConfirmModal(true);
    }
  };

  const checkScheduleConflict = () => {
    if (!user || !tour) return null;

    // Get user's active reservations
    const userReservations = mockReservations.filter(
      r => r.userId === user.id && (r.status === 'Confirmada' || r.status === 'Pendiente')
    );

    // Get selected schedule times
    const selectedSchedule = tour.schedules?.find(s => s.id === selectedScheduleId);
    if (!selectedSchedule) return null;

    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const newStartMinutes = parseTime(selectedSchedule.startTime);
    const newEndMinutes = parseTime(selectedSchedule.endTime);

    // Check for conflicts
    for (const reservation of userReservations) {
      if (!reservation.startTime || !reservation.endTime) continue;

      const existingStartMinutes = parseTime(reservation.startTime);
      const existingEndMinutes = parseTime(reservation.endTime);

      // Check if times overlap
      const hasOverlap =
        (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes);

      if (hasOverlap) {
        const conflictTour = mockTours.find(t => t.id === reservation.tourId);
        return {
          reservation,
          tour: conflictTour,
        };
      }
    }

    return null;
  };

  const handleConfirmReservation = () => {
    // Check for schedule conflicts
    const conflict = checkScheduleConflict();
    if (conflict) {
      setConflictingReservation(conflict);
      setShowScheduleConflictAlert(true);
      setShowConfirmModal(false);
      return;
    }

    const resNumber = `RES-2026-${Math.random().toString().slice(2, 5)}`;
    setReservationNumber(resNumber);
    setIsReserved(true);
    setShowConfirmModal(false);

    toast.success(`¡Reserva confirmada! Número: ${resNumber}`);
  };

  const categoryColors: Record<string, string> = {
    Cultura: 'bg-purple-100 text-purple-800',
    Aventura: 'bg-green-100 text-green-800',
    Gastronomía: 'bg-orange-100 text-orange-800',
    Naturaleza: 'bg-emerald-100 text-emerald-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant={isAuthenticated ? 'tourist' : 'public'} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <img
            src={tour.images[0]}
            alt={tour.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <Badge className={`mb-4 ${categoryColors[tour.category]}`}>
                {tour.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display' }}>
                {tour.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-lg">{tour.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-500">(48 reseñas)</span>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-3">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{tour.description}</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Reseñas de viajeros</h3>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="font-semibold">CR</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Carlos Restrepo</p>
                      <div className="flex items-center gap-1 my-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700">Excelente tour, el guía muy conocedor de la historia de Medellín. Totalmente recomendado.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <div className="mb-6">
                <p className="text-3xl font-bold" style={{ color: '#1A6B4A' }}>
                  ${tour.price.toLocaleString('es-CO')}
                </p>
                <p className="text-sm text-gray-500">COP por persona</p>
              </div>

              {/* Tour Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Duración</p>
                    <p className="font-semibold">{tour.duration} horas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-semibold">{new Date(tour.date).toLocaleDateString('es-CO')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Punto de encuentro</p>
                    <p className="font-semibold">{tour.meetingPoint}</p>
                  </div>
                </div>

                {/* Schedule Selector */}
                {tour.schedules && tour.schedules.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Selecciona un horario</p>
                    <div className="space-y-2">
                      {tour.schedules.map((schedule) => (
                        <button
                          key={schedule.id}
                          onClick={() => setSelectedScheduleId(schedule.id)}
                          className={`w-full p-3 border rounded-lg text-left transition-colors ${
                            selectedScheduleId === schedule.id
                              ? 'border-primary bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="font-semibold">
                                {schedule.startTime} - {schedule.endTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {schedule.availableSpots} cupos
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${((tour.maxCapacity - tour.availableSpots) / tour.maxCapacity) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {tour.maxCapacity - tour.availableSpots} personas ya reservaron
                </p>
              </div>

              <Button
                onClick={handleReserve}
                className="w-full"
                size="lg"
                disabled={tour.availableSpots === 0 || isReserved}
              >
                {isReserved 
                  ? 'Reserva realizada ✓'
                  : tour.availableSpots > 0 
                  ? 'Reservar este tour' 
                  : 'Agotado'}
              </Button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-500 text-center mt-4">
                  Inicia sesión para reservar
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Reservation Modal */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Confirmar reserva</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Revisa los detalles de tu reserva
                  </p>
                </div>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tour</p>
                <p className="font-semibold text-lg">{tour.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fecha</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{new Date(tour.date).toLocaleDateString('es-CO')}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Horario</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">
                      {selectedScheduleId
                        ? tour.schedules?.find(s => s.id === selectedScheduleId)?.startTime + ' - ' +
                          tour.schedules?.find(s => s.id === selectedScheduleId)?.endTime
                        : tour.time}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Punto de encuentro</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <p className="font-medium">{tour.meetingPoint}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Precio total</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--turistgo-primary)' }}>
                    ${tour.price.toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleConfirmReservation}>
                Confirmar reserva
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Confirmation Modal */}
      {isReserved && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Reserva Confirmada</h3>
              <button
                onClick={() => setIsReserved(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-700 mb-6">
              Tu reserva ha sido confirmada. Aquí está tu número de reserva:
            </p>
            <div className="flex items-center justify-center mb-6">
              <p className="text-xl font-bold text-primary">{reservationNumber}</p>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setIsReserved(false)}
                className="bg-gray-200 text-gray-700"
                size="sm"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Conflict Alert */}
      {showScheduleConflictAlert && conflictingReservation && (
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
                Ya tienes reservado:
              </p>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                <p className="font-semibold text-red-900">
                  {conflictingReservation.tour?.name}
                </p>
                <p className="text-sm text-red-800 mt-1">
                  de {conflictingReservation.reservation.startTime} a {conflictingReservation.reservation.endTime}
                </p>
              </div>
              <p className="text-gray-700">
                No puedes confirmar esta reserva porque los horarios se superponen.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end">
              <Button
                onClick={() => {
                  setShowScheduleConflictAlert(false);
                  setConflictingReservation(null);
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