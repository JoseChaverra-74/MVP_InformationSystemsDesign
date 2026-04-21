import { Navigate, Link } from 'react-router';
import { Package, Users, Truck, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockTours, mockReservations, mockGuides, mockVehicles } from '../../lib/mockData';

export function AgencyDashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'Agencia') {
    return <Navigate to="/login" replace />;
  }

  const agencyTours = mockTours.filter((t) => t.agencyId === user.id);
  const activeTours = agencyTours.filter((t) => t.status === 'Activo');
  const agencyGuides = mockGuides.filter((g) => g.agencyId === user.id);
  const agencyReservations = mockReservations.filter((r) => 
    agencyTours.some((t) => t.id === r.tourId)
  );
  
  const thisMonthReservations = agencyReservations.filter((r) => {
    const date = new Date(r.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const thisMonthRevenue = thisMonthReservations.reduce((sum, r) => sum + r.price, 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar variant="agency" />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display' }}>
                Panel de control
              </h1>
              <p className="text-gray-600 mt-2">{user.name}</p>
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              Aprobada
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tours Activos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeTours.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reservas este mes</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{thisMonthReservations.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos este mes</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(thisMonthRevenue / 1000).toFixed(0)}k</div>
                <p className="text-xs text-muted-foreground">${thisMonthRevenue.toLocaleString('es-CO')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Guías disponibles</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{agencyGuides.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reservations */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Reservas recientes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Turista</th>
                    <th className="text-left py-3 px-4">Tour</th>
                    <th className="text-left py-3 px-4">Fecha</th>
                    <th className="text-left py-3 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {agencyReservations.slice(0, 5).map((reservation) => {
                    const tour = mockTours.find((t) => t.id === reservation.tourId);
                    return (
                      <tr key={reservation.id} className="border-b">
                        <td className="py-3 px-4">Carlos Restrepo</td>
                        <td className="py-3 px-4">{tour?.name}</td>
                        <td className="py-3 px-4">{new Date(reservation.date).toLocaleDateString('es-CO')}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={reservation.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Link to="/agencia/reservas">
              <Button variant="outline" className="mt-4">Ver todas las reservas</Button>
            </Link>
          </div>

          {/* Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Tours con cupos críticos</h3>
                  <p className="text-sm text-yellow-800">
                    2 tours tienen menos de 3 cupos disponibles
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-2">Certificados próximos a vencer</h3>
                  <p className="text-sm text-orange-800">
                    1 guía tiene su certificado por vencer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
