import { Navigate } from 'react-router';
import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../lib/auth';
import { StatusBadge } from '../../components/StatusBadge';

interface UnavailablePeriod {
  id: string;
  start: string;
  end: string;
}

export function GuideAvailabilityPage() {
  const { user, isAuthenticated } = useAuth();
  const [periods, setPeriods] = useState<UnavailablePeriod[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!isAuthenticated || user?.role !== 'Guía') {
    return <Navigate to="/login" replace />;
  }

  const handleAddPeriod = () => {
    if (!startDate || !endDate) {
      toast.error('Por favor completa ambas fechas');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }

    const newPeriod: UnavailablePeriod = {
      id: `period-${Date.now()}`,
      start: startDate,
      end: endDate,
    };

    setPeriods([...periods, newPeriod]);
    toast.success('Período de no disponibilidad registrado');
    setShowDialog(false);
    setStartDate('');
    setEndDate('');
  };

  const handleDeletePeriod = (id: string) => {
    setPeriods(periods.filter(p => p.id !== id));
    toast.success('Período eliminado');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="guide" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>
          Gestionar Disponibilidad
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Períodos de no disponibilidad</h2>
              <p className="text-gray-600 text-sm mt-1">
                Registra los períodos en los que no estarás disponible para tours
              </p>
            </div>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar nuevo período
            </Button>
          </div>

          <div className="space-y-4">
            {periods.length === 0 ? (
              <div className="border rounded-lg p-8 text-center">
                <p className="text-gray-500">No tienes períodos de no disponibilidad registrados</p>
              </div>
            ) : (
              <div className="overflow-hidden border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Fecha Inicio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Fecha Fin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {periods.map((period) => (
                      <tr key={period.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(period.start)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(period.end)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: 'var(--turistgo-primary-light)',
                              color: 'var(--turistgo-primary)'
                            }}
                          >
                            Registrado
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePeriod(period.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Period Dialog */}
      {showDialog && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            {/* Dialog Header */}
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Agregar período de no disponibilidad</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Selecciona las fechas en las que no estarás disponible
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDialog(false);
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha inicio
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                />
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                  setStartDate('');
                  setEndDate('');
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddPeriod}>
                Registrar período
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}