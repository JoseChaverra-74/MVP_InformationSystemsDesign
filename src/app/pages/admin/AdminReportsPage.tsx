import { Navigate } from 'react-router';
import { Sidebar } from '../../components/Sidebar';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockInvoices, mockReservations, mockTours, mockUsers } from '../../lib/mockData';

export function AdminReportsPage() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || user?.role !== 'Administrador') {
    return <Navigate to="/login" replace />;
  }

  // Calcular KPIs
  const emitidas = mockInvoices.filter(i => i.status === 'Emitida');
  const anuladas = mockInvoices.filter(i => i.status === 'Anulada');
  const totalIngresos = emitidas.reduce((sum, i) => sum + i.amount, 0);
  const reservasCompletadas = mockReservations.filter(r => r.status === 'Completada');

  // Desglose por agencia
  const agencias = Object.values(mockUsers).filter(u => u.role === 'Agencia');
  const agenciaData = agencias.map(agencia => {
    const toursActivos = mockTours.filter(t => t.agencyId === agencia.id && t.status === 'Activo').length;
    const agencyTourIds = mockTours.filter(t => t.agencyId === agencia.id).map(t => t.id);
    const reservasComp = mockReservations.filter(r => 
      agencyTourIds.includes(r.tourId) && r.status === 'Completada'
    ).length;
    const ingresos = mockInvoices
      .filter(i => agencyTourIds.includes(i.tourId) && i.status === 'Emitida')
      .reduce((sum, i) => sum + i.amount, 0);
    
    return {
      nombre: agencia.name,
      toursActivos,
      reservasComp,
      ingresos,
    };
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar variant="admin" />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>
          Reportes
        </h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm text-gray-600 mb-2">Total Ingresos</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--turistgo-primary)' }}>
              ${totalIngresos.toLocaleString('es-CO')}
            </p>
            <p className="text-xs text-gray-500 mt-1">COP</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm text-gray-600 mb-2">Facturas Emitidas</h3>
            <p className="text-3xl font-bold">{emitidas.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm text-gray-600 mb-2">Facturas Anuladas</h3>
            <p className="text-3xl font-bold text-red-600">{anuladas.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm text-gray-600 mb-2">Reservas Completadas</h3>
            <p className="text-3xl font-bold">{reservasCompletadas.length}</p>
          </div>
        </div>

        {/* Desglose por Agencia */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Desglose por Agencia</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agencia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tours Activos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservas Completadas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingresos</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {agenciaData.map((ag, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4">{ag.nombre}</td>
                    <td className="px-6 py-4">{ag.toursActivos}</td>
                    <td className="px-6 py-4">{ag.reservasComp}</td>
                    <td className="px-6 py-4">${ag.ingresos.toLocaleString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Facturas Recientes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Facturas Recientes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Factura</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockInvoices.map((invoice) => {
                  const tour = mockTours.find(t => t.id === invoice.tourId);
                  return (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4">{invoice.id}</td>
                      <td className="px-6 py-4">{tour?.name || 'N/A'}</td>
                      <td className="px-6 py-4">${invoice.amount.toLocaleString('es-CO')}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          invoice.type === 'Auto' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {invoice.type}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}