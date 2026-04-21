Eres un asistente que va a MEJORAR y COMPLETAR un prototipo funcional existente de TuristGo, 
una plataforma de turismo para Medellín. El proyecto ya tiene estructura, diseño system y 
datos mock. NO cambies el diseño ni los componentes existentes. SOLO completa lo que falta.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SISTEMA DE DISEÑO (mantener estrictamente)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Primary: #1A6B4A | Hover: #0F4530 | Light: #E8F5EE
- Accent: #F5A623 | Neutral dark: #1C2B3A | BG: #F4F6F8
- Fuentes: "Playfair Display" (títulos) + "DM Sans" (UI)
- Componentes: shadcn/ui (Radix) + Tailwind v4 + lucide-react

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STACK EXISTENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
React 18 + Vite + TypeScript + React Router v7
Auth: localStorage key "turistgo_user" via useAuth()
Datos: mockData.ts (mockTours, mockReservations, mockGuides, 
       mockVehicles, mockInvoices, mockUsers)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USUARIOS DE PRUEBA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Turista:  carlos.restrepo@gmail.com  / password123
Agencia:  explora@medellin.com       / password123
Guía:     valentina.ospina@guia.com  / password123
Admin:    admin@turistgo.com         / admin123

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBJETIVO DEL ENTREGABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prototipo funcional: 1 historia de usuario por cada uno de los 
5 roles/actores, mostrando SOLO el flujo exitoso (happy path).
Sin flujos alternativos. Con datos mock visibles y acciones 
que cambien el estado en pantalla (useState local).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TAREAS POR ROL — IMPLEMENTAR HAPPY PATH COMPLETO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▸ ROL TURISTA — HU-35: Reservar un tour
  Archivo: src/app/pages/tourist/TouristToursPage.tsx y TourDetailPage.tsx
  
  Flujo completo:
  1. El turista ve el catálogo de tours desde /turista/tours
  2. Entra al detalle de un tour (/tours/:id)
  3. Presiona "Reservar este tour"
  4. Aparece un modal/drawer de confirmación con: nombre del tour, 
     fecha, hora, punto de encuentro y precio
  5. Presiona "Confirmar reserva"
  6. Toast de éxito: "¡Reserva confirmada! Número: RES-2026-XXX"
  7. Botón cambia a "Reserva realizada ✓" (disabled)
  
  Datos a usar de mockTours. El número de reserva se genera como 
  "RES-2026-" + Math.random().toString().slice(2,5)
  Estado gestionado con useState local (no persistir).

---

▸ ROL AGENCIA — HU-19: Asignar guía a un tour
  Archivo: src/app/pages/agency/AgencyToursPage.tsx
  
  Flujo completo:
  1. La agencia ve su listado de tours en /agencia/tours
  2. Cada tour muestra un badge de estado (Activo/Inactivo) y 
     un botón "Asignar guía" si no tiene guía asignado
  3. Al presionar "Asignar guía", se abre un Sheet/Dialog con:
     - Lista de guías disponibles de mockGuides (nombre, certificado, 
       fecha vencimiento)
     - Botón "Asignar" junto a cada guía
  4. Al confirmar la asignación:
     - El tour actualiza su estado visual a "Activo" con badge verde
     - El botón cambia a "Guía asignado: [nombre]" (disabled)
     - Toast: "Guía [nombre] asignado correctamente al tour"
  
  Estado gestionado con useState local sobre copia de mockTours.

---

▸ ROL GUÍA — HU-24: Registrar período de no disponibilidad
  Archivo: src/app/pages/guide/GuideAvailabilityPage.tsx
  
  Flujo completo (la página actual es un placeholder vacío):
  1. El guía ve en /guia/disponibilidad sus períodos registrados 
     (tabla vacía con mensaje "No tienes períodos registrados")
  2. Presiona "Agregar nuevo período"
  3. Se abre un Dialog con:
     - DatePicker o inputs tipo date para "Fecha inicio" y "Fecha fin"
     - Botón "Registrar período"
  4. Al guardar:
     - El período aparece en la tabla con: fecha inicio, fecha fin, 
       y badge "Registrado" en verde
     - Toast: "Período de no disponibilidad registrado"
  5. Cada fila tiene botón "Eliminar" que lo quita de la lista
  
  Estado con useState: array de períodos { id, start, end }
  Iniciar con array vacío. Permitir agregar múltiples períodos.

---

▸ ROL ADMINISTRADOR — HU-09: Aprobar cuenta de agencia
  Archivo: src/app/pages/admin/AdminUsersPage.tsx
  
  La página ya tiene la tabla. Completar la funcionalidad:
  1. La tabla muestra todos los usuarios con su estado actual
  2. Las agencias con estado "Pendiente" tienen botón "Aprobar" visible
  3. Al presionar "Aprobar":
     - El estado cambia a "Aprobada" visualmente en la tabla
     - El badge cambia de color (amarillo → verde)
     - El botón "Aprobar" desaparece y aparece "Suspender"
     - Toast: "Cuenta de [nombre agencia] aprobada correctamente"
  4. Al presionar "Suspender" en una cuenta Activa/Aprobada:
     - El estado cambia a "Suspendido" con badge rojo
     - Toast: "Cuenta suspendida"
  
  Estado con useState sobre copia de Object.values(mockUsers).
  Agregar al menos 1 usuario con estado "Pendiente" en mockData 
  si no existe (agencia nueva de prueba).

---

▸ ROL AGENCIA (segunda HU) — HU-04: Registrar un nuevo guía
  Archivo: src/app/pages/agency/AgencyGuidesPage.tsx
  
  La página actual solo lista guías. Completar:
  1. La agencia ve el listado de sus guías con datos reales de mockGuides
  2. Presiona "Registrar nuevo guía"
  3. Se abre un Dialog/Sheet con formulario:
     - Nombre completo (input text)
     - Correo electrónico (input email)  
     - Número de documento (input text)
     - Número de certificado (input text, placeholder "CERT-2024-XXXXX")
     - Fecha de vencimiento del certificado (input date)
     - Botón "Registrar guía"
  4. Al guardar:
     - El nuevo guía aparece al inicio del listado con badge "Activo"
     - Certificado muestra la fecha ingresada
     - Toast: "Guía [nombre] registrado exitosamente"
     - El formulario se cierra y limpia
  
  Estado con useState sobre copia de mockGuides.
  El nuevo guía toma id generado localmente.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLAS GENERALES DE IMPLEMENTACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Usar SOLO componentes shadcn/ui ya importados: Dialog, Sheet, 
  Button, Badge, Input, Label, Toast (Sonner), DatePicker si disponible
- Toda acción que modifique datos usa useState LOCAL (no context, 
  no backend, no localStorage adicional)
- Cada acción exitosa muestra un toast con Sonner (import { toast } from 'sonner')
- Mantener la protección de rutas existente (redirect si no autenticado)
- No modificar mockData.ts directamente; clonar con useState al inicio 
  del componente: const [items, setItems] = useState([...mockItems])
- No crear páginas nuevas, solo completar las existentes
- Mantener Navbar/Sidebar del rol correspondiente en cada página