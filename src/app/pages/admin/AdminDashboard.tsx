import { Navigate } from 'react-router';
import { Users, Building2, Package, DollarSign, AlertCircle } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../lib/auth';
import { mockUsers, mockTours, mockReservations } from '../../lib/mockData';

export function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'Administrador') {
    return <Navigate to="/login" replace />;
  }

  const allUsers = Object.values(mockUsers);
  const pendingAgencies = allUsers.filter((u) => u.role === 'Agencia' && u.status === 'Pendiente');
  const activeTours = mockTours.filter((t) => t.status === 'Activo');
  const thisMonthReservations = mockReservations.filter((r) => {
    const date = new Date(r.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const thisMonthRevenue = thisMonthReservations.reduce((sum, r) => sum + r.price, 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar variant="admin" />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>
            Panel Administrativo
          </h1>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuarios Registrados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allUsers.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agencias Pendientes</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingAgencies.length}</div>
              </CardContent>
            </Card>

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
                <CardTitle className="text-sm font-medium">Ingresos este mes</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(thisMonthRevenue / 1000).toFixed(0)}k</div>
                <p className="text-xs text-muted-foreground">${thisMonthRevenue.toLocaleString('es-CO')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Approvals */}
          {pendingAgencies.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <h2 className="text-xl font-semibold">Solicitudes Pendientes de Aprobación</h2>
              </div>
              <div className="space-y-3">
                {pendingAgencies.map((agency) => (
                  <div key={agency.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{agency.name}</p>
                      <p className="text-sm text-gray-600">{agency.email}</p>
                    </div>
                    <Button size="sm">Revisar</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">Nueva reserva realizada</p>
                  <p className="text-sm text-gray-600">Tour Centro Histórico - Carlos Restrepo</p>
                </div>
                <span className="text-sm text-gray-500">Hace 2 horas</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">Nuevo usuario registrado</p>
                  <p className="text-sm text-gray-600">María González - Turista</p>
                </div>
                <span className="text-sm text-gray-500">Hace 5 horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
