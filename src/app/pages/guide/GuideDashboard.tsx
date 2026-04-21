import { Navigate } from 'react-router';
import { Calendar, AlertTriangle } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockTours, mockGuides } from '../../lib/mockData';

export function GuideDashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'Guía') {
    return <Navigate to="/login" replace />;
  }

  const guide = mockGuides.find((g) => g.email === user.email);
  const assignedTours = guide ? mockTours.filter((t) => t.guideId === guide.id) : [];
  const nextTour = assignedTours.find((t) => new Date(t.date) > new Date());
  
  const certExpiry = guide ? new Date(guide.certificateExpiry) : new Date();
  const daysToExpiry = Math.floor((certExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const certStatus = daysToExpiry < 0 ? 'expired' : daysToExpiry < 30 ? 'expiring' : 'valid';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="guide" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>
          Hola, {user.name} 👋
        </h1>

        {/* Certificate Alert */}
        {certStatus !== 'valid' && (
          <div className={`${certStatus === 'expired' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'} border rounded-lg p-6 mb-8`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`h-5 w-5 ${certStatus === 'expired' ? 'text-red-600' : 'text-orange-600'} mt-0.5`} />
              <div>
                <h3 className={`font-semibold ${certStatus === 'expired' ? 'text-red-900' : 'text-orange-900'} mb-1`}>
                  {certStatus === 'expired' ? 'Tu certificado ha vencido' : 'Tu certificado vence pronto'}
                </h3>
                <p className={`text-sm ${certStatus === 'expired' ? 'text-red-800' : 'text-orange-800'}`}>
                  {certStatus === 'expired'
                    ? `Tu certificado venció el ${certExpiry.toLocaleDateString('es-CO')}. Comunícate con tu agencia.`
                    : `Tu certificado vence el ${certExpiry.toLocaleDateString('es-CO')} (${daysToExpiry} días).`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next Tour */}
        {nextTour && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Tu próximo tour</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img src={nextTour.images[0]} alt={nextTour.name} className="w-full h-64 object-cover rounded-lg" />
              <div>
                <h3 className="text-xl font-semibold mb-2">{nextTour.name}</h3>
                <StatusBadge status="Activo" />
                <div className="mt-4 space-y-2">
                  <p><strong>Fecha:</strong> {new Date(nextTour.date).toLocaleDateString('es-CO')}</p>
                  <p><strong>Hora:</strong> {nextTour.time}</p>
                  <p><strong>Punto de encuentro:</strong> {nextTour.meetingPoint}</p>
                  <p><strong>Turistas confirmados:</strong> {nextTour.maxCapacity - nextTour.availableSpots}</p>
                </div>
                <Button className="mt-6">Ver detalles</Button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Tours */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Mi agenda</h2>
          {assignedTours.length > 0 ? (
            <div className="space-y-3">
              {assignedTours.slice(0, 5).map((tour) => (
                <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{tour.name}</p>
                    <p className="text-sm text-gray-600">{new Date(tour.date).toLocaleDateString('es-CO')} - {tour.time}</p>
                  </div>
                  <StatusBadge status="Activo" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tienes tours asignados actualmente</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mis períodos de no disponibilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Gestiona tus días no disponibles</p>
              <Button variant="outline">Agregar periodo</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mi certificado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">N°: {guide?.certificateNumber}</p>
              <p className="text-sm text-gray-600 mb-4">Vence: {certExpiry.toLocaleDateString('es-CO')}</p>
              <Button variant="outline">Solicitar actualización</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
