import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export function RegisterAgencyPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nit: '',
    commercialName: '',
    email: '',
    phone: '',
    description: '',
  });
  const [document, setDocument] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Tu solicitud fue enviada. Recibirás respuesta en 24-48 horas.');
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="flex justify-center items-center space-x-2 mb-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1A6B4A' }}>
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <span className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display', color: '#1A6B4A' }}>
            TuristGo
          </span>
        </Link>

        <div className="bg-white shadow sm:rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-2">Registra tu agencia</h2>
          <p className="text-gray-600 mb-8">
            Completa el formulario para solicitar el registro de tu agencia de turismo.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="nit">NIT</Label>
              <Input
                id="nit"
                value={formData.nit}
                onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                placeholder="900123456-7"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Ejemplo: 900123456-7</p>
            </div>

            <div>
              <Label htmlFor="commercialName">Nombre comercial</Label>
              <Input
                id="commercialName"
                value={formData.commercialName}
                onChange={(e) => setFormData({ ...formData, commercialName: e.target.value })}
                placeholder="Mi Agencia de Turismo S.A.S"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Correo corporativo</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contacto@miagencia.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+57 300 123 4567"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción de la agencia</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe tu agencia y los servicios que ofreces..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="document">Documento de constitución o cámara de comercio</Label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90"
                    >
                      <span>Sube un archivo</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setDocument(e.target.files?.[0] || null)}
                      />
                    </label>
                    <p className="pl-1">o arrastra y suelta</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC hasta 10MB</p>
                  {document && (
                    <p className="text-sm text-green-600 mt-2">
                      Archivo seleccionado: {document.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Enviar solicitud de registro
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
