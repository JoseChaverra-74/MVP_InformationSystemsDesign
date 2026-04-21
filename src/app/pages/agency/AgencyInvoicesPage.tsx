import { useState } from 'react';
import { Navigate } from 'react-router';
import { toast } from 'sonner';
import { Sidebar } from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockInvoices, mockTours, Invoice } from '../../lib/mockData';

export function AgencyInvoicesPage() {
  const { user, isAuthenticated } = useAuth();
  const agencyTours = mockTours.filter((t) => t.agencyId === user?.id);
  const [invoices, setInvoices] = useState<Invoice[]>(
    [...mockInvoices.filter((i) => agencyTours.some((t) => t.id === i.tourId))]
  );
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualForm, setManualForm] = useState({ reservationId: '', amount: '', description: '' });
  const [filterStatus, setFilterStatus] = useState<string>('Todas');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(invoices);
  
  if (!isAuthenticated || user?.role !== 'Agencia') {
    return <Navigate to="/login" replace />;
  }

  const handleEmitirManual = () => {
    if (!manualForm.reservationId || Number(manualForm.amount) <= 0) {
      toast.error('Debes completar todos los campos correctamente');
      return;
    }

    const newInvoice: Invoice = {
      id: 'FAC-MAN-' + Date.now().toString().slice(-4),
      reservationId: manualForm.reservationId,
      tourId: agencyTours[0]?.id || '',
      userId: 'user-001',
      date: new Date().toISOString().split('T')[0],
      amount: Number(manualForm.amount),
      status: 'Emitida',
      type: 'Manual',
    };

    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    toast.success('Factura manual emitida con N° ' + newInvoice.id);
    setShowManualDialog(false);
    setManualForm({ reservationId: '', amount: '', description: '' });
  };

  const handleApplyFilters = () => {
    let filtered = [...invoices];

    // Filter by status
    if (filterStatus !== 'Todas') {
      filtered = filtered.filter(inv => inv.status === filterStatus);
    }

    // Filter by date range
    if (filterDateFrom) {
      filtered = filtered.filter(inv => new Date(inv.date) >= new Date(filterDateFrom));
    }
    if (filterDateTo) {
      filtered = filtered.filter(inv => new Date(inv.date) <= new Date(filterDateTo));
    }

    setFilteredInvoices(filtered);

    if (filtered.length === 0) {
      toast.info('No hay facturas en este rango');
    } else {
      toast.success(`${filtered.length} factura(s) encontrada(s)`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar variant="agency" />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display' }}>
            Facturación
          </h1>
          <Button onClick={() => setShowManualDialog(true)}>Emitir factura manual</Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-semibold mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
              >
                <option value="Todas">Todas</option>
                <option value="Emitida">Emitida</option>
                <option value="Anulada">Anulada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleApplyFilters} className="w-full">
                Aplicar filtros
              </Button>
            </div>
          </div>
        </div>

        {filteredInvoices.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Factura</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turista</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredInvoices.map((invoice) => {
                  const tour = mockTours.find(t => t.id === invoice.tourId);
                  return (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4">{invoice.id}</td>
                      <td className="px-6 py-4">{tour?.name || 'N/A'}</td>
                      <td className="px-6 py-4">Carlos Restrepo</td>
                      <td className="px-6 py-4">{new Date(invoice.date).toLocaleDateString('es-CO')}</td>
                      <td className="px-6 py-4">${invoice.amount.toLocaleString('es-CO')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          invoice.type === 'Auto' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {invoice.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={invoice.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">Aún no tienes facturas registradas.</p>
          </div>
        )}
      </div>

      {/* Manual Invoice Dialog */}
      {showManualDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Emitir factura manual</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  N° de reserva
                </label>
                <input
                  type="text"
                  value={manualForm.reservationId}
                  onChange={(e) => setManualForm({ ...manualForm, reservationId: e.target.value })}
                  placeholder="RES-2025-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto (COP)
                </label>
                <input
                  type="number"
                  value={manualForm.amount}
                  onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })}
                  placeholder="80000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del ajuste
                </label>
                <textarea
                  value={manualForm.description}
                  onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)]"
                  placeholder="Motivo de la factura manual..."
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowManualDialog(false);
                  setManualForm({ reservationId: '', amount: '', description: '' });
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleEmitirManual}>
                Emitir factura
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}