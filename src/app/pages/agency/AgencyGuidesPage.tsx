import { Navigate } from 'react-router';
import { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Sidebar } from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockGuides, Guide } from '../../lib/mockData';

export function AgencyGuidesPage() {
  const { user, isAuthenticated } = useAuth();
  const [guides, setGuides] = useState<Guide[]>([...mockGuides]);
  const [showDialog, setShowDialog] = useState(false);
  const [showUpdateCertDialog, setShowUpdateCertDialog] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [updateCertData, setUpdateCertData] = useState({
    certificateExpiry: '',
    certificateFile: null as File | null,
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    documentId: '',
    certificateNumber: '',
    certificateExpiry: '',
  });
  
  if (!isAuthenticated || user?.role !== 'Agencia') {
    return <Navigate to="/login" replace />;
  }
  
  const agencyGuides = guides.filter((g) => g.agencyId === user.id);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegisterGuide = () => {
    const newGuide: Guide = {
      id: `guide-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      documentId: formData.documentId,
      certificateNumber: formData.certificateNumber,
      certificateExpiry: formData.certificateExpiry,
      certificateFile: 'pending-upload.pdf',
      agencyId: user.id,
      status: 'Activo',
      unavailablePeriods: [],
    };

    setGuides([newGuide, ...guides]);
    toast.success(`Guía ${formData.name} registrado exitosamente`);

    setShowDialog(false);
    setFormData({
      name: '',
      email: '',
      documentId: '',
      certificateNumber: '',
      certificateExpiry: '',
    });
  };

  const handleOpenUpdateCert = (guide: Guide) => {
    setSelectedGuide(guide);
    setUpdateCertData({
      certificateExpiry: guide.certificateExpiry,
      certificateFile: null,
    });
    setShowUpdateCertDialog(true);
  };

  const handleUpdateCertificate = () => {
    if (!selectedGuide) return;

    const updatedGuides = guides.map(g =>
      g.id === selectedGuide.id
        ? {
            ...g,
            certificateExpiry: updateCertData.certificateExpiry,
            certificateFile: updateCertData.certificateFile?.name || g.certificateFile,
            status: 'Activo' as const,
          }
        : g
    );

    setGuides(updatedGuides);
    toast.success('Certificado actualizado. El guía ahora está disponible');
    setShowUpdateCertDialog(false);
    setSelectedGuide(null);
    setUpdateCertData({ certificateExpiry: '', certificateFile: null });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar variant="agency" />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display' }}>
            Gestión de Guías
          </h1>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar nuevo guía
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          {agencyGuides.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No tienes guías registrados
            </div>
          ) : (
            agencyGuides.map((guide) => (
              <div key={guide.id} className="flex items-center justify-between p-6 border-b last:border-b-0">
                <div>
                  <p className="font-semibold text-lg">{guide.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{guide.email}</p>
                  <p className="text-sm text-gray-600">Cert: {guide.certificateNumber}</p>
                  <p className="text-sm text-gray-600">
                    Vence: {new Date(guide.certificateExpiry).toLocaleDateString('es-CO')}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <StatusBadge status={guide.status} />
                  <Button size="sm" variant="outline" onClick={() => handleOpenUpdateCert(guide)}>
                    Actualizar certificado
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Register Guide Dialog */}
      {showDialog && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
            {/* Dialog Header */}
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Registrar nuevo guía</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Completa la información del guía turístico
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDialog(false);
                    setFormData({
                      name: '',
                      email: '',
                      documentId: '',
                      certificateNumber: '',
                      certificateExpiry: '',
                    });
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
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: María Fernanda López"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="guia@ejemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de documento
                </label>
                <input
                  type="text"
                  value={formData.documentId}
                  onChange={(e) => handleInputChange('documentId', e.target.value)}
                  placeholder="123456789"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de certificado
                </label>
                <input
                  type="text"
                  value={formData.certificateNumber}
                  onChange={(e) => handleInputChange('certificateNumber', e.target.value)}
                  placeholder="CERT-2024-XXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de vencimiento del certificado
                </label>
                <input
                  type="date"
                  value={formData.certificateExpiry}
                  onChange={(e) => handleInputChange('certificateExpiry', e.target.value)}
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
                  setFormData({
                    name: '',
                    email: '',
                    documentId: '',
                    certificateNumber: '',
                    certificateExpiry: '',
                  });
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleRegisterGuide}>
                Registrar guía
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Update Certificate Dialog */}
      {showUpdateCertDialog && selectedGuide && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Actualizar certificado</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Guía: {selectedGuide.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowUpdateCertDialog(false);
                    setSelectedGuide(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo archivo de certificado
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="cert-file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90"
                      >
                        <span>Sube un archivo</span>
                        <input
                          id="cert-file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf"
                          onChange={(e) => setUpdateCertData({
                            ...updateCertData,
                            certificateFile: e.target.files?.[0] || null
                          })}
                        />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF hasta 10MB</p>
                    {updateCertData.certificateFile && (
                      <p className="text-sm text-green-600 mt-2">
                        Archivo: {updateCertData.certificateFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de vencimiento
                </label>
                <input
                  type="date"
                  value={updateCertData.certificateExpiry}
                  onChange={(e) => setUpdateCertData({
                    ...updateCertData,
                    certificateExpiry: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)] focus:border-transparent"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUpdateCertDialog(false);
                  setSelectedGuide(null);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdateCertificate}>
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}