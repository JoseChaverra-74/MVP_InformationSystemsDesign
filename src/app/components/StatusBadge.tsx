import { Badge as BadgeUI } from './ui/badge';

interface StatusBadgeProps {
  status: 'Confirmada' | 'Completada' | 'Cancelada' | 'Pendiente' | 'Activo' | 'Inactivo' | 'Vencido' | 'Vigente' | 'Emitida' | 'Anulada' | 'Disponible' | 'En mantenimiento' | 'Ocupado';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, { bg: string; text: string }> = {
    Confirmada: { bg: 'bg-blue-100', text: 'text-blue-800' },
    Completada: { bg: 'bg-green-100', text: 'text-green-800' },
    Cancelada: { bg: 'bg-red-100', text: 'text-red-800' },
    Pendiente: { bg: 'bg-orange-100', text: 'text-orange-800' },
    Activo: { bg: 'bg-green-100', text: 'text-green-800' },
    Inactivo: { bg: 'bg-gray-100', text: 'text-gray-800' },
    Vencido: { bg: 'bg-red-100', text: 'text-red-800' },
    Vigente: { bg: 'bg-green-100', text: 'text-green-800' },
    Emitida: { bg: 'bg-blue-100', text: 'text-blue-800' },
    Anulada: { bg: 'bg-red-100', text: 'text-red-800' },
    Disponible: { bg: 'bg-green-100', text: 'text-green-800' },
    'En mantenimiento': { bg: 'bg-orange-100', text: 'text-orange-800' },
    Ocupado: { bg: 'bg-blue-100', text: 'text-blue-800' },
  };

  const variant = variants[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };

  return (
    <BadgeUI className={`${variant.bg} ${variant.text}`}>
      {status}
    </BadgeUI>
  );
}