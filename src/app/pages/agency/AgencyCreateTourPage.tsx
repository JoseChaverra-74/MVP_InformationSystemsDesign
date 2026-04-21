import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Sidebar } from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../lib/auth';
import { addTour } from '../../lib/toursStorage';
import { Tour } from '../../lib/mockData';

export function AgencyCreateTourPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    city: 'Medellín',
    price: '',
    maxCapacity: '',
    duration: '',
    meetingPoint: '',
    date: '',
    time: '',
  });
  
  if (!isAuthenticated || user?.role !== 'Agencia') {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = () => {
    // Validaciones
    if (!form.name || !form.description || !form.category || !form.price || 
        !form.maxCapacity || !form.duration || !form.meetingPoint || !form.date || !form.time) {
      toast.error('Todos los campos son obligatorios.');
      return;
    }
    
    if (Number(form.price) <= 0) {
      toast.error('El precio debe ser mayor a cero.');
      return;
    }
    
    if (Number(form.maxCapacity) <= 0) {
      toast.error('Los cupos deben ser un número mayor a cero.');
      return;
    }

    setSaving(true);

    const newTour: Tour = {
      id: 'tour-' + Date.now(),
      name: form.name,
      description: form.description,
      category: form.category as 'Cultura' | 'Aventura' | 'Gastronomía' | 'Naturaleza',
      price: Number(form.price),
      duration: Number(form.duration),
      maxCapacity: Number(form.maxCapacity),
      availableSpots: Number(form.maxCapacity),
      rating: 0,
      city: form.city,
      meetingPoint: form.meetingPoint,
      date: form.date,
      time: form.time,
      images: ['https://images.unsplash.com/photo-1675695614402-3dd6a58dfffe?w=800'],
      agencyId: user.id,
      status: 'Inactivo',
    };

    setTimeout(() => {
      addTour(newTour);
      const tourCode = 'TOUR-' + Date.now().toString().slice(-6);
      toast.success(`Tour creado con código ${tourCode}. Estado: Inactivo (asigna un guía para activarlo).`);
      setSaving(false);
      navigate('/agencia/tours');
    }, 800);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar variant="agency" />
      <div className="flex-1 overflow-auto p-8">
        <Link to="/agencia/tours" className="text-primary hover:underline mb-4 inline-block">
          ← Volver
        </Link>
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>
          Crear Nuevo Tour
        </h1>
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-3xl">
          <div className="space-y-6">
            <div>
              <Label>Nombre del tour</Label>
              <Input 
                placeholder="Ej: Tour Centro Histórico" 
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea 
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoría</Label>
                <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cultura">Cultura</SelectItem>
                    <SelectItem value="Aventura">Aventura</SelectItem>
                    <SelectItem value="Gastronomía">Gastronomía</SelectItem>
                    <SelectItem value="Naturaleza">Naturaleza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ciudad</Label>
                <Input 
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Precio (COP)</Label>
                <Input 
                  type="number" 
                  placeholder="80000"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div>
                <Label>Cupos máximos</Label>
                <Input 
                  type="number" 
                  placeholder="15"
                  value={form.maxCapacity}
                  onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })}
                />
              </div>
              <div>
                <Label>Duración (horas)</Label>
                <Input 
                  type="number" 
                  placeholder="4"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Punto de encuentro</Label>
              <Input 
                placeholder="Plaza Botero, Centro"
                value={form.meetingPoint}
                onChange={(e) => setForm({ ...form, meetingPoint: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha del tour</Label>
                <Input 
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Hora del tour</Label>
                <Input 
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar tour'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}