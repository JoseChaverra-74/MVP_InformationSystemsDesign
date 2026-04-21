import { Navigate } from 'react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { Sidebar } from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../lib/auth';
import { mockUsers, User } from '../../lib/mockData';

export function AdminUsersPage() {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<(User & { password: string })[]>(Object.values(mockUsers));
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);
  const [motivo, setMotivo] = useState('');
  
  if (!isAuthenticated || user?.role !== 'Administrador') {
    return <Navigate to="/login" replace />;
  }

  const handleApprove = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId 
          ? { ...u, status: 'Activo' as const }
          : u
      )
    );
    const approvedUser = users.find(u => u.id === userId);
    if (approvedUser) {
      toast.success(`Cuenta de ${approvedUser.name} aprobada correctamente`);
    }
  };

  const handleSuspend = () => {
    if (!motivo.trim()) {
      toast.error('Debes ingresar un motivo de suspensión');
      return;
    }
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === suspendTarget 
          ? { ...u, status: 'Suspendido' as const }
          : u
      )
    );
    toast.success('Cuenta suspendida');
    setSuspendTarget(null);
    setMotivo('');
  };

  const roles = ['Todos', 'Turista', 'Agencia', 'Guía', 'Administrador'];
  const filteredUsers = roleFilter === 'Todos' 
    ? users 
    : users.filter(u => u.role === roleFilter);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar variant="admin" />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>
          Gestión de Usuarios
        </h1>
        
        {/* Role Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {roles.map((role) => (
            <Button
              key={role}
              variant={roleFilter === role ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRoleFilter(role)}
            >
              {role}
            </Button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.role}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={u.status as any} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Ver</Button>
                      {u.status === 'Pendiente' && (
                        <Button size="sm" onClick={() => handleApprove(u.id)}>
                          Aprobar
                        </Button>
                      )}
                      {u.status === 'Activo' && (
                        <Button size="sm" variant="destructive" onClick={() => setSuspendTarget(u.id)}>
                          Suspender
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suspend Dialog */}
      {suspendTarget && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Suspender cuenta</h2>
            </div>
            <div className="px-6 py-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de la suspensión
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--turistgo-primary)]"
                placeholder="Describe el motivo..."
              />
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSuspendTarget(null);
                  setMotivo('');
                }}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleSuspend}
                disabled={!motivo.trim()}
              >
                Confirmar suspensión
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}