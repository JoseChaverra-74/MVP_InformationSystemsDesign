Eres un desarrollador UX/UI experto. Tu tarea es COMPLETAR un prototipo funcional 
existente de TuristGo. El proyecto compila y funciona. NO rompas lo que ya existe. 
SOLO implementa lo que se describe a continuación, archivo por archivo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLAS GLOBALES DE IMPLEMENTACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Todo estado mutable se gestiona con useState LOCAL en el componente.
   Inicializar siempre como: const [items, setItems] = useState([...mockItems])
2. Toda acción exitosa emite un Sonner toast: import { toast } from 'sonner'
3. Modales y formularios usan Dialog o Sheet de shadcn/ui ya disponibles.
4. NUNCA usar <form> HTML. Usar onClick en <Button>.
5. Las reglas de negocio bloquean acciones con toast.error(), no con flujos alternativos.
6. Mantener Navbar o Sidebar del rol correspondiente en cada página.
7. Protección de ruta con useAuth() ya existe, no modificarla.
8. Importar desde '../../lib/mockData' o '../lib/mockData' según profundidad.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SISTEMA DE DISEÑO (respetar estrictamente)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary: #1A6B4A | Hover: #0F4530 | Light BG: #E8F5EE
Accent: #F5A623 | Error: #D94040 | BG page: #F4F6F8
Fuentes: "Playfair Display" (h1/h2) + "DM Sans" (todo lo demás)
Stack: React 18 + TypeScript + Tailwind v4 + shadcn/ui + lucide-react + Sonner

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 0 — MODIFICAR src/app/lib/mockData.ts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Agregar en mockUsers este usuario para demo del admin:

'nueva.agencia@turistgo.com': {
  id: 'agency-002',
  name: 'Aventuras Antioquia S.A.S',
  email: 'nueva.agencia@turistgo.com',
  password: 'password123',
  role: 'Agencia',
  phone: '+57 312 456 7890',
  status: 'Pendiente',
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 1 — src/app/pages/tourist/TourDetailPage.tsx
HU-35: Reservar un tour
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
La página ya existe y muestra el detalle del tour. Completar:

Estado local:
  const [reserved, setReserved] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [reservationCode, setReservationCode] = useState('')

El botón "Reservar este tour" abre un Dialog de confirmación que muestra:
  - Nombre del tour
  - Fecha y hora
  - Punto de encuentro
  - Precio total en COP
  - Botón "Confirmar reserva" (primary)
  - Botón "Cancelar" (outline)

Al presionar "Confirmar reserva":
  1. Generar código: 'RES-2026-' + Date.now().toString().slice(-4)
  2. setReserved(true), setReservationCode(código)
  3. Cerrar dialog
  4. toast.success('¡Reserva confirmada! Número: ' + código)
  5. El botón cambia a "✓ Reserva realizada" con variant="outline" y disabled

Regla de negocio aplicada visualmente:
  - Si tour.availableSpots === 0, mostrar badge "Agotado" y botón disabled con 
    texto "Sin cupos disponibles" sin abrir el dialog.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 2 — src/app/pages/tourist/TouristReservationsPage.tsx
HU-44: Cancelar reserva | HU-43: Cambiar fecha | HU-55: Calificar tour
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estado local:
  const [reservations, setReservations] = useState([...mockReservations])
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  const [dateTarget, setDateTarget] = useState<string | null>(null)
  const [rateTarget, setRateTarget] = useState<string | null>(null)
  const [newDate, setNewDate] = useState('')
  const [stars, setStars] = useState(0)
  const [review, setReview] = useState('')

HU-44 — Botón "Cancelar" (ya existe visualmente):
  Al presionar, abre Dialog de confirmación:
    Título: "¿Cancelar esta reserva?"
    Texto: "Esta acción no se puede deshacer. El cupo será liberado."
    Botón "Sí, cancelar" (destructive) ejecuta:
      setReservations(prev => prev.map(r =>
        r.id === cancelTarget ? {...r, status: 'Cancelada'} : r
      ))
      toast.success('Reserva cancelada correctamente')
      setCancelTarget(null)

HU-43 — Botón "Cambiar fecha" (ya existe visualmente):
  Abre Dialog con:
    - Input type="date" para nueva fecha
    - Botón "Confirmar cambio" ejecuta:
        setReservations(prev => prev.map(r =>
          r.id === dateTarget ? {...r, date: newDate} : r
        ))
        toast.success('Fecha actualizada correctamente')
        setDateTarget(null), setNewDate('')

HU-55 — Botón "Calificar tour" visible en reservas con status 'Completada' 
  y sin reservation.rating:
  Abre Dialog con:
    - 5 estrellas clicables (★ vacía / ★ llena con color #F5A623)
    - Textarea opcional "Escribe tu reseña (opcional)"
    - Botón "Enviar calificación" ejecuta:
        setReservations(prev => prev.map(r =>
          r.id === rateTarget ? {...r, rating: stars, review} : r
        ))
        toast.success('¡Gracias por tu calificación!')
        setRateTarget(null), setStars(0), setReview('')
  
  Regla de negocio: stars debe ser > 0 para habilitar el botón "Enviar".
  Una vez calificada, la fila muestra "★ Calificado" en lugar del botón.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 3 — src/app/pages/tourist/TouristReservationDetailPage.tsx
HU-44: Cancelar reserva (detalle) | HU-55: Calificar (detalle)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estado local:
  const [resStatus, setResStatus] = useState(reservation.status)
  const [rated, setRated] = useState(!!reservation.rating)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showRateDialog, setShowRateDialog] = useState(false)
  const [stars, setStars] = useState(0)
  const [review, setReview] = useState('')

Botón "Cancelar reserva" → mismo Dialog de confirmación que ARCHIVO 2.
  Al confirmar: setResStatus('Cancelada'), toast.success, botones desaparecen.

Botón "Calificar este tour" → mismo Dialog de estrellas que ARCHIVO 2.
  Al enviar: setRated(true), toast.success, botón desaparece y 
  muestra "✓ Tour calificado con X estrellas".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 4 — src/app/pages/tourist/TouristProfilePage.tsx
HU-11: Actualizar perfil | HU-14: Eliminar cuenta
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HU-11 — El botón "Guardar cambios" actualmente usa alert(). 
  Reemplazar con: toast.success('Perfil actualizado correctamente')

HU-14 — Botón "Eliminar mi cuenta":
  Estado: const [showDeleteDialog, setShowDeleteDialog] = useState(false)
            const [confirmPassword, setConfirmPassword] = useState('')
  
  Abre Dialog con:
    - Título: "Eliminar cuenta" (texto en rojo)
    - Texto: "Esta acción es permanente e irreversible."
    - Input type="password" placeholder="Confirma tu contraseña"
    - Botón "Eliminar mi cuenta" (destructive) — habilitado solo si 
      confirmPassword.length > 0
    Al confirmar:
      toast.success('Cuenta eliminada. ¡Hasta pronto!')
      setTimeout(() => logout(), 1500)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 5 — src/app/pages/admin/AdminUsersPage.tsx
HU-09: Aprobar agencia | HU-13: Suspender/eliminar cuenta
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estado local:
  const [users, setUsers] = useState(Object.values(mockUsers))
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [motivo, setMotivo] = useState('')

HU-09 — Botón "Aprobar" (visible en usuarios con status 'Pendiente'):
  Al presionar:
    setUsers(prev => prev.map(u =>
      u.id === target.id ? {...u, status: 'Activo'} : u
    ))
    toast.success(nombre + ' aprobada correctamente')
  Badge cambia de amarillo a verde. Botón "Aprobar" desaparece, 
  aparece botón "Suspender".

HU-13 — Botón "Suspender" (visible en usuarios con status 'Activo'):
  Abre Dialog:
    - Textarea "Motivo de la suspensión" (obligatorio)
    - Botón "Confirmar suspensión" (destructive) habilitado solo si motivo.length > 0
    Al confirmar:
      setUsers(prev => prev.map(u =>
        u.id === suspendTarget ? {...u, status: 'Suspendido'} : u
      ))
      toast.success('Cuenta suspendida')
      setSuspendTarget(null), setMotivo('')

Agregar filtros encima de la tabla:
  Botones tipo tabs: Todos | Turista | Agencia | Guía | Administrador
  const [roleFilter, setRoleFilter] = useState('Todos')
  Filtrar: users.filter(u => roleFilter === 'Todos' || u.role === roleFilter)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 6 — src/app/pages/admin/AdminServicesPage.tsx
HU-26: Dar de baja un servicio
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estado local:
  const [tours, setTours] = useState([...mockTours])
  const [bajaTarget, setBajaTarget] = useState<string | null>(null)
  const [motivoBaja, setMotivoBaja] = useState('')

Botón "Dar de baja" abre Dialog:
  - Nombre del tour seleccionado (readonly, visible en el dialog)
  - Textarea "Motivo de la baja" (obligatorio)
  - Botón "Confirmar baja" (destructive) habilitado solo si motivoBaja.length > 0
  Al confirmar:
    setTours(prev => prev.map(t =>
      t.id === bajaTarget ? {...t, status: 'Inactivo'} : t
    ))
    toast.success('Servicio dado de baja. Notificación enviada a la agencia.')
    setBajaTarget(null), setMotivoBaja('')

El badge de estado en la tabla debe reflejar el nuevo status desde el estado local.
Tours con status 'Inactivo' muestran el botón como "Reactivar" (outline, verde).
  Reactivar: setTours con status 'Activo', toast.success('Servicio reactivado')

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 7 — src/app/pages/admin/AdminReportsPage.tsx
HU-50: Reporte global de facturación
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reemplazar el placeholder con un reporte real usando mockInvoices y mockReservations.

Importar: mockInvoices, mockReservations, mockTours, mockUsers

Calcular al inicio del componente:
  const emitidas = mockInvoices.filter(i => i.status === 'Emitida')
  const anuladas = mockInvoices.filter(i => i.status === 'Anulada')
  const totalIngresos = emitidas.reduce((sum, i) => sum + i.amount, 0)
  const reservasCompletadas = mockReservations.filter(r => r.status === 'Completada')

Layout del reporte:
  1. Fila de 4 KPI cards:
     - Total ingresos: $totalIngresos.toLocaleString('es-CO') COP
     - Facturas emitidas: emitidas.length
     - Facturas anuladas: anuladas.length  
     - Reservas completadas: reservasCompletadas.length

  2. Tabla "Desglose por agencia":
     Columnas: Agencia | Tours activos | Reservas completadas | Ingresos
     Calcular por cada agencia del mockUsers con role === 'Agencia':
       - toursActivos: mockTours.filter(t => t.agencyId === a.id && t.status === 'Activo').length
       - reservasComp: mockReservations que pertenezcan a sus tours con status 'Completada'
       - ingresos: suma de amounts de mockInvoices de esas reservas

  3. Tabla "Facturas recientes":
     Columnas: N° Factura | Tour | Monto | Estado | Tipo
     Mostrar todas las de mockInvoices con StatusBadge en estado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 8 — src/app/pages/agency/AgencyGuidesPage.tsx
HU-04: Registrar guía | HU-10: Consultar perfil con alertas | HU-12: Actualizar certificado
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estado local:
  const [guides, setGuides] = useState([...mockGuides.filter(g => g.agencyId === user.id)])
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)
  const [showCertDialog, setShowCertDialog] = useState(false)
  const [certTarget, setCertTarget] = useState<string | null>(null)
  const [form, setForm] = useState({ name:'', email:'', documentId:'', certNumber:'', certExpiry:'' })
  const [newCertExpiry, setNewCertExpiry] = useState('')

HU-10 — Mejorar el listado de guías con alertas visuales:
  Para cada guía, calcular:
    const expiry = new Date(guide.certificateExpiry)
    const daysLeft = Math.floor((expiry - new Date()) / 86400000)
    const certStatus = daysLeft < 0 ? 'vencido' : daysLeft < 30 ? 'proximo' : 'vigente'
  
  Mostrar junto al nombre:
    - certStatus 'vencido': badge rojo "Certificado vencido"
    - certStatus 'proximo': badge naranja "Vence en X días"
    - certStatus 'vigente': badge verde "Vigente"
  
  Mostrar: nombre, correo, N° certificado, fecha vencimiento, badge estado.

HU-04 — Botón "Registrar nuevo guía" abre Dialog con formulario:
  Campos:
    - Nombre completo (Input, required)
    - Correo electrónico (Input type="email", required)
    - Número de documento (Input, required)
    - Número de certificado (Input, placeholder "CERT-2024-XXXXX", required)
    - Fecha de vencimiento del certificado (Input type="date", required)
  
  Botón "Registrar guía":
    Regla de negocio: new Date(form.certExpiry) <= new Date() →
      toast.error('El certificado ya está vencido. Ingresa uno con vigencia actual.')
      return
    
    Si válido:
      const newGuide = { id: 'guide-'+Date.now(), ...form,
        certificateNumber: form.certNumber,
        certificateExpiry: form.certExpiry,
        agencyId: user.id, status: 'Activo', unavailablePeriods: [] }
      setGuides(prev => [newGuide, ...prev])
      toast.success(form.name + ' registrado exitosamente. Credenciales generadas.')
      setShowRegisterDialog(false)
      setForm({ name:'', email:'', documentId:'', certNumber:'', certExpiry:'' })

HU-12 — Botón "Actualizar certificado" por cada guía abre Dialog:
  Campos:
    - Input type="date" "Nueva fecha de vencimiento" (required)
  
  Botón "Actualizar":
    Regla: new Date(newCertExpiry) <= new Date() →
      toast.error('La fecha de vencimiento debe ser posterior a hoy.')
      return
    
    Si válido:
      setGuides(prev => prev.map(g =>
        g.id === certTarget ? {...g, certificateExpiry: newCertExpiry, status: 'Activo'} : g
      ))
      toast.success('Certificado actualizado. El guía está activo nuevamente.')
      setShowCertDialog(false), setCertTarget(null), setNewCertExpiry('')

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 9 — src/app/pages/agency/AgencyToursPage.tsx
HU-19: Asignar guía | HU-25: Desactivar tour | HU-23: Editar tour
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Importar también: mockGuides

Estado local:
  const [tours, setTours] = useState([...mockTours.filter(t => t.agencyId === user.id)])
  const [guideTarget, setGuideTarget] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<any | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ description:'', price:0, meetingPoint:'', maxCapacity:0 })

HU-19 — Botón "Asignar guía" abre Sheet lateral:
  Título: "Asignar guía al tour: [nombre del tour]"
  
  Listar guías de la agencia (mockGuides.filter(g => g.agencyId === user.id)):
  Por cada guía mostrar: nombre, N° certificado, fecha vencimiento, badge estado.
  
  Calcular para cada guía si está disponible:
    const expiry = new Date(guide.certificateExpiry)
    const certVigente = expiry > new Date()
    const isAvailable = certVigente && guide.status === 'Activo'
  
  Botón "Asignar" deshabilitado si !isAvailable con tooltip "Certificado vencido".
  
  Al presionar "Asignar" en un guía disponible:
    Regla de negocio: verificar que la fecha del tour sea > 24h desde ahora:
      const tourDate = new Date(tours.find(t => t.id === guideTarget)?.date || '')
      const hoursUntilTour = (tourDate - new Date()) / 3600000
      if (hoursUntilTour < 24) {
        toast.error('No se puede asignar con menos de 24 horas de anticipación.')
        return
      }
    Si válido:
      setTours(prev => prev.map(t =>
        t.id === guideTarget ? {...t, guideId: guide.id, status: 'Activo'} : t
      ))
      toast.success('Guía ' + guide.name + ' asignado. Tour marcado como Activo.')
      setGuideTarget(null)

HU-25 — Agregar botón "Desactivar" a cada fila:
  Solo visible si tour.status === 'Activo'.
  Abre Dialog de confirmación:
    Texto: "¿Desactivar este tour? Desaparecerá del catálogo público."
  Botón "Desactivar" (destructive):
    setTours(prev => prev.map(t =>
      t.id === deactivateTarget ? {...t, status: 'Inactivo'} : t
    ))
    toast.success('Tour desactivado del catálogo.')
    setDeactivateTarget(null)
  
  Tours con status 'Inactivo' muestran botón "Activar" que los vuelve a 'Activo'.
  Regla: solo activar si el tour tiene guideId asignado.
    Si no tiene guía: toast.error('Debes asignar un guía antes de activar el tour.')

HU-23 — Botón "Editar" abre Sheet lateral con formulario:
  Inicializar editForm con los datos actuales del tour al abrir.
  Campos editables:
    - Descripción (Textarea)
    - Precio COP (Input type="number") — mínimo 1
    - Cupos máximos (Input type="number") — mínimo 1
    - Punto de encuentro (Input)
  
  Botón "Guardar cambios":
    setTours(prev => prev.map(t =>
      t.id === editTarget.id ? {...t, ...editForm} : t
    ))
    toast.success('Tour actualizado correctamente.')
    setEditTarget(null)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 10 — src/app/pages/agency/AgencyCreateTourPage.tsx
HU-17: Crear nuevo tour
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
El formulario existe pero sin lógica. Completar:

Estado local:
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name:'', description:'', category:'', city:'Medellín',
    price:'', maxCapacity:'', duration:'', meetingPoint:'',
    date:'', time:''
  })
  const [saving, setSaving] = useState(false)

Añadir campo date (Input type="date") y time (Input type="time") al formulario.

Botón "Guardar tour" onClick:
  Validaciones con reglas de negocio:
    if (!form.name || !form.description || !form.category || !form.price || 
        !form.maxCapacity || !form.duration || !form.meetingPoint || !form.date || !form.time)
      toast.error('Todos los campos son obligatorios.'); return
    if (Number(form.price) <= 0) 
      toast.error('El precio debe ser mayor a cero.'); return
    if (Number(form.maxCapacity) <= 0) 
      toast.error('Los cupos deben ser un número mayor a cero.'); return
  
  Si válido:
    setSaving(true)
    setTimeout(() => {
      const tourCode = 'TOUR-' + Date.now().toString().slice(-6)
      toast.success('Tour creado con código ' + tourCode + '. Estado: Inactivo (asigna un guía para activarlo).')
      setSaving(false)
      navigate('/agencia/tours')
    }, 800)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 11 — src/app/pages/agency/AgencyReservationsPage.tsx
HU-40: Gestión de reservas | HU-42: Marcar como completada
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estado local:
  const agencyTours = mockTours.filter(t => t.agencyId === user.id)
  const [reservations, setReservations] = useState(
    [...mockReservations.filter(r => agencyTours.some(t => t.id === r.tourId))]
  )
  const [filterTour, setFilterTour] = useState('Todos')
  const [filterStatus, setFilterStatus] = useState('Todos')

HU-40 — Agregar filtros funcionales encima de la tabla:
  - Select "Filtrar por tour" con opción "Todos" + cada tour de la agencia
  - Botones de estado: Todas | Confirmada | Completada | Cancelada
  Aplicar ambos filtros al listar.

HU-42 — Botón "Marcar como completada":
  La condición `new Date(res.date) < new Date()` ya existe. Añadir funcionalidad real.
  
  Al presionar:
    Regla de negocio: verificar que la fecha del tour ya pasó:
      const tour = mockTours.find(t => t.id === res.tourId)
      const tourDateTime = new Date(tour.date + 'T' + tour.time)
      if (tourDateTime > new Date()) {
        toast.error('No puedes completar un tour que aún no ha ocurrido.')
        return
      }
    Si válido:
      setReservations(prev => prev.map(r =>
        r.id === res.id ? {...r, status: 'Completada'} : r
      ))
      toast.success('Reserva marcada como completada. El turista puede calificar el tour.')

Para el demo: agregar al menos una reserva con fecha pasada en mockData 
(date: '2026-02-01', status: 'Confirmada') para que el botón sea visible.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 12 — src/app/pages/agency/AgencyInvoicesPage.tsx
HU-49: Historial de facturas | HU-47: Emitir factura manual
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Importar: mockInvoices, mockTours, mockReservations

Estado local:
  const agencyTours = mockTours.filter(t => t.agencyId === user.id)
  const [invoices, setInvoices] = useState(
    [...mockInvoices.filter(i => agencyTours.some(t => t.id === i.tourId))]
  )
  const [showManualDialog, setShowManualDialog] = useState(false)
  const [manualForm, setManualForm] = useState({ reservationId:'', amount:'', description:'' })

HU-49 — Reemplazar el placeholder con tabla real:
  Columnas: N° Factura | Tour | Turista | Fecha | Monto | Tipo | Estado
  Para obtener nombre del tour: mockTours.find(t => t.id === i.tourId)?.name
  StatusBadge para estado (Emitida/Anulada).
  Tipo: Badge "Auto" (gris) / "Manual" (azul).
  
  Si invoices.length === 0:
    Empty state: "Aún no tienes facturas registradas."

HU-47 — Botón "Emitir factura manual" abre Dialog:
  Campos:
    - Input "N° de reserva" (placeholder "RES-2025-001")
    - Input type="number" "Monto (COP)"
    - Textarea "Descripción del ajuste"
  
  Botón "Emitir factura":
    Verificar que manualForm.reservationId y amount > 0.
    const newInvoice = {
      id: 'FAC-MAN-' + Date.now().toString().slice(-4),
      reservationId: manualForm.reservationId,
      tourId: agencyTours[0]?.id || '',
      userId: 'user-001',
      date: new Date().toISOString().split('T')[0],
      amount: Number(manualForm.amount),
      status: 'Emitida' as const,
      type: 'Manual' as const
    }
    setInvoices(prev => [newInvoice, ...prev])
    toast.success('Factura manual emitida con N° ' + newInvoice.id)
    setShowManualDialog(false)
    setManualForm({ reservationId:'', amount:'', description:'' })

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 13 — src/app/pages/agency/AgencyFleetPage.tsx
HU-27: Registrar vehículo | HU-34: Eliminar vehículo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
El archivo ya tiene HU-32 (cambiar estado) implementado. Agregar:

Estado adicional:
  const [vehicles, setVehicles] = useState([...mockVehicles.filter(v => v.agencyId === user.id)])
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [vehicleForm, setVehicleForm] = useState({
    plate:'', brand:'', model:'', type:'Van', color:'', capacity:''
  })

IMPORTANTE: Usar el estado local `vehicles` en lugar de `agencyVehicles` del mockData 
en TODOS los renders del componente.

HU-27 — Botón "Registrar vehículo" abre Dialog:
  Campos:
    - Placa (Input, placeholder "ABC-123")
    - Marca (Input, placeholder "Toyota")
    - Modelo (Input, placeholder "HiAce")
    - Tipo (Select: Bus | Buseta | Van | Automóvil)
    - Color (Input)
    - Capacidad de pasajeros (Input type="number")
  
  Botón "Registrar":
    Regla de negocio — validar formato placa colombiano:
      const plateRegex = /^[A-Z]{3}-[0-9]{3}$/
      if (!plateRegex.test(vehicleForm.plate.toUpperCase()))
        toast.error('Formato de placa inválido. Ejemplo: ABC-123'); return
    
    Verificar duplicado:
      if (vehicles.some(v => v.plate === vehicleForm.plate.toUpperCase()))
        toast.error('Esta placa ya está registrada en la plataforma.'); return
    
    Si válido:
      const newVehicle = {
        id: 'vehicle-' + Date.now(),
        plate: vehicleForm.plate.toUpperCase(),
        brand: vehicleForm.brand, model: vehicleForm.model,
        type: vehicleForm.type as any, color: vehicleForm.color,
        capacity: Number(vehicleForm.capacity),
        agencyId: user.id, status: 'Disponible' as const
      }
      setVehicles(prev => [newVehicle, ...prev])
      toast.success('Vehículo ' + newVehicle.plate + ' registrado exitosamente.')
      setShowRegisterDialog(false)
      setVehicleForm({ plate:'', brand:'', model:'', type:'Van', color:'', capacity:'' })

HU-34 — Agregar botón "Eliminar" a cada tarjeta de vehículo:
  Al presionar, setDeleteTarget(vehicle.id) abriendo Dialog de confirmación.
  
  Regla de negocio: verificar tours futuros asignados:
    const hasFutureTours = mockTours.some(t => 
      t.vehicleId === deleteTarget && new Date(t.date) > new Date()
    )
    if (hasFutureTours)
      toast.error('No puedes eliminar un vehículo con tours futuros asignados.'); return
  
  Si válido:
    setVehicles(prev => prev.filter(v => v.id !== deleteTarget))
    toast.success('Vehículo eliminado de la flota.')
    setDeleteTarget(null)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 14 — src/app/pages/guide/GuideAvailabilityPage.tsx
HU-24: Registrar períodos de no disponibilidad
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reemplazar el placeholder completo con implementación funcional.

Importar: mockTours, mockGuides

Estado local:
  type Period = { id: string; start: string; end: string }
  const [periods, setPeriods] = useState<Period[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [form, setForm] = useState({ start: '', end: '' })

Layout de la página:
  1. Header con título "Gestionar Disponibilidad" y botón "Agregar período"
  2. Si periods.length === 0: card con texto "No tienes períodos registrados."
  3. Si periods.length > 0: tabla con columnas:
     Fecha inicio | Fecha fin | Estado | Acciones

Botón "Agregar nuevo período" abre Dialog:
  Campos:
    - Fecha inicio (Input type="date", min=hoy)
    - Fecha fin (Input type="date")
  
  Botón "Registrar período":
    Regla: if (new Date(form.start) <= new Date())
      toast.error('La fecha de inicio debe ser posterior a hoy.'); return
    Regla: if (new Date(form.end) < new Date(form.start))
      toast.error('La fecha fin debe ser igual o posterior a la fecha de inicio.'); return
    
    Advertencia (no bloquea): verificar si hay tour asignado en ese rango:
      const guide = mockGuides.find(g => g.email === user.email)
      const conflictTour = mockTours.find(t => {
        const td = new Date(t.date)
        return t.guideId === guide?.id && 
               td >= new Date(form.start) && td <= new Date(form.end)
      })
      if (conflictTour) {
        toast.warning('Período registrado. Advertencia: tienes el tour "' + 
          conflictTour.name + '" asignado en este rango. Comunícate con tu agencia.')
      } else {
        toast.success('Período de no disponibilidad registrado correctamente.')
      }
    
    setPeriods(prev => [...prev, { id: Date.now().toString(), ...form }])
    setShowDialog(false), setForm({ start:'', end:'' })

Cada fila de la tabla tiene botón "Eliminar" (destructive, small):
  setPeriods(prev => prev.filter(p => p.id !== id))
  toast.success('Período eliminado.')

Badge "Registrado" en verde para cada período.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 15 — src/app/pages/guide/GuideToursPage.tsx
HU-41: Ver turistas confirmados en el tour
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Importar: mockReservations, mockUsers

Para cada tour en el listado, agregar una sección expandible/collapsible:
  
  Estado: const [expandedTour, setExpandedTour] = useState<string | null>(null)
  
  Por cada tour, calcular:
    const confirmedReservations = mockReservations.filter(r => 
      r.tourId === tour.id && r.status === 'Confirmada'
    )
    const touristNames = confirmedReservations.map(r => {
      const u = Object.values(mockUsers).find(u => u.id === r.userId)
      return u?.name || 'Turista'
    })
  
  Debajo de los datos del tour, agregar botón toggle:
    "{confirmedReservations.length} turista(s) confirmado(s) ▾"
  
  Al expandir, mostrar:
    - Lista con nombre de cada turista confirmado en bullets
    - Si no hay turistas: "Aún no hay turistas confirmados para este tour."
  
  Nota UX: El guía NO ve correo ni teléfono de los turistas, solo nombres. 
  (Regla de negocio HU-41)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESUMEN DE HUs CUBIERTAS EN ESTE PROMPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Turista:   HU-35 · HU-39 · HU-43 · HU-44 · HU-48 · HU-52(*) · HU-55 · HU-11 · HU-14
Agencia:   HU-04 · HU-10 · HU-12 · HU-17 · HU-19 · HU-23 · HU-25 · HU-27 · HU-28B · HU-34 · HU-40 · HU-42 · HU-47 · HU-49
Guía:      HU-22 · HU-24 · HU-41
Admin:     HU-09 · HU-13 · HU-26 · HU-50
Públicas:  HU-01 · HU-02 · HU-05/06/07 · HU-15(**) · HU-21

(*) HU-52 PDF: el botón "Descargar PDF" en TouristInvoicesPage ya existe. 
    Añadir: onClick={() => { toast.success('Descargando factura ' + invoice.id + '...') }}
    (Simulación sin librería PDF externa, apropiado para prototipo.)

(**) HU-15 Recuperar contraseña: en LoginPage.tsx el enlace "¿Olvidaste tu contraseña?" 
    debe abrir un Dialog con Input email y botón "Enviar enlace".
    Al presionar: toast.success('Si este correo está registrado, recibirás un enlace en breve.')
    (Simulación sin SMTP, apropiado para prototipo.)