import { Navigate, Link } from 'react-router';
import { useState } from 'react';
import { Download, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockInvoices, mockTours, Invoice } from '../../lib/mockData';

export function TouristInvoicesPage() {
  const { user, isAuthenticated } = useAuth();
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  if (!isAuthenticated || user?.role !== 'Turista') {
    return <Navigate to="/login" replace />;
  }

  const userInvoices = mockInvoices.filter((i) => i.userId === user.id);

  const handleDownloadPdf = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPdfPreview(true);
    toast.success(`PDF generado: factura_${invoice.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="tourist" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>
          Mis Facturas
        </h1>

        {userInvoices.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userInvoices.map((invoice) => {
                  const tour = mockTours.find((t) => t.id === invoice.tourId);
                  return (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tour?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${invoice.amount.toLocaleString('es-CO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {invoice.status === 'Emitida' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadPdf(invoice)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Descargar PDF
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg mb-4">
              Aún no tienes facturas. Realiza tu primera reserva.
            </p>
            <Link to="/turista/tours">
              <Button>Explorar tours</Button>
            </Link>
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      {showPdfPreview && selectedInvoice && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Vista previa - Factura PDF</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      factura_{selectedInvoice.id}.pdf
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPdfPreview(false);
                    setSelectedInvoice(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-8 bg-gray-50 max-h-[500px] overflow-y-auto">
              {/* Simulated PDF content */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#1A6B4A' }}>
                    <span className="text-white font-bold text-2xl">T</span>
                  </div>
                  <h1 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display', color: '#1A6B4A' }}>
                    TuristGo
                  </h1>
                  <p className="text-sm text-gray-600 mt-2">Factura Electrónica</p>
                </div>

                <div className="border-t border-b border-gray-200 py-6 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Número de Factura</p>
                      <p className="font-semibold">{selectedInvoice.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fecha de Emisión</p>
                      <p className="font-semibold">{new Date(selectedInvoice.date).toLocaleDateString('es-CO')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <p className="font-semibold text-green-600">Emitida</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipo</p>
                      <p className="font-semibold">{selectedInvoice.type}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Datos del Cliente</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Detalle del Servicio</h3>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Descripción</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="px-4 py-3">
                          {mockTours.find(t => t.id === selectedInvoice.tourId)?.name || 'Tour'}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          ${selectedInvoice.amount.toLocaleString('es-CO')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">Total</p>
                    <p className="text-2xl font-bold" style={{ color: '#1A6B4A' }}>
                      ${selectedInvoice.amount.toLocaleString('es-CO')} COP
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                  <p>Documento generado electrónicamente por TuristGo</p>
                  <p className="mt-1">Medellín, Colombia</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPdfPreview(false);
                  setSelectedInvoice(null);
                }}
              >
                Cerrar
              </Button>
              <Button onClick={() => toast.success('PDF descargado correctamente')}>
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
