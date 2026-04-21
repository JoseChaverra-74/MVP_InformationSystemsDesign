import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Si este correo está registrado, recibirás un enlace para restablecer tu contraseña');
  };

  const handleSimulateLink = () => {
    setStep('reset');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Contraseña actualizada. Ahora puedes iniciar sesión');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center space-x-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1A6B4A' }}>
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <span className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display', color: '#1A6B4A' }}>
            TuristGo
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {step === 'email' ? 'Recuperar contraseña' : 'Restablecer contraseña'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 'email' ? (
            <>
              <p className="text-sm text-gray-600 mb-6">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </p>
              <form className="space-y-6" onSubmit={handleSendLink}>
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Enviar enlace de recuperación
                </Button>
              </form>

              <div className="mt-6">
                <Button
                  onClick={handleSimulateLink}
                  variant="outline"
                  className="w-full"
                >
                  Simular enlace recibido
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  (Para simular el flujo en el prototipo)
                </p>
              </div>
            </>
          ) : (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full">
                Restablecer contraseña
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
