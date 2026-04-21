# PROMPT COMPLETO PARA PROTOTIPO FIGMA — TuristGo
### Sistema Integral de Turismo | Alta Fidelidad | Diseño Conectado

---

## 🎯 CONTEXTO DEL PROYECTO

**Nombre del sistema:** TuristGo  
**Descripción:** Plataforma web de turismo para Medellín que conecta turistas con agencias certificadas y guías verificados. Permite explorar tours, hacer reservas digitales, gestionar servicios, flotas y facturación.  
**Plataforma objetivo:** Web responsive (desktop principal, mobile secundario)  
**Actores del sistema:** Turista · Agencia de Turismo · Guía Turístico · Administrador

---

## 🎨 SISTEMA DE DISEÑO

### Paleta de Colores
```
Primario:        #1A6B4A  (verde esmeralda — naturaleza, confianza)
Primario oscuro: #0F4530  (hover / énfasis)
Primario claro:  #E8F5EE  (fondos suaves, badges)
Acento:          #F5A623  (naranja dorado — llamadas a la acción, alertas)
Acento suave:    #FFF3DC  (fondos de advertencia)
Neutro oscuro:   #1C2B3A  (texto principal)
Neutro medio:    #5C6B7A  (texto secundario)
Neutro claro:    #F4F6F8  (fondos de página)
Blanco:          #FFFFFF
Error:           #D94040
Error suave:     #FDEAEA
Éxito:           #2E7D32
Info:            #1565C0
```

### Tipografía
```
Display/Títulos: "Playfair Display" — elegante, turístico
Cuerpo/UI:       "DM Sans" — moderna, legible
Código/Datos:    "DM Mono"
```

### Componentes Base (crear en Assets)
- **Buttons:** Primary (verde), Secondary (outline), Danger (rojo), Ghost (texto)
- **Input fields:** Normal, Focus, Error, Disabled, con ícono
- **Cards:** Tour card, User card, Reserva card, Factura card
- **Badges de estado:** Confirmada (azul), Completada (verde), Cancelada (rojo), Pendiente (naranja), Activo (verde), Inactivo (gris)
- **Topbar/Navbar:** variante por cada rol
- **Sidebar:** variante por cada rol
- **Modales:** Confirmación, Error, Éxito, Alerta
- **Alertas inline:** Info, Warning, Error, Success
- **Avatars:** con foto / inicial / con badge de estado
- **Empty states:** ilustración + mensaje + CTA

### Grids
- Desktop: 12 columnas, gutter 24px, margin 80px
- Tablet: 8 columnas, gutter 16px, margin 40px

---

## 🔗 FLUJO GENERAL DE NAVEGACIÓN (CONEXIONES)

```
LANDING PAGE (público)
  ├── [Explorar catálogo] → Catálogo público (sin login)
  │     └── [Reservar] → Redirect a Login
  ├── [Iniciar sesión] → Pantalla de Login
  │     ├── Rol: Turista    → Dashboard Turista
  │     ├── Rol: Agencia    → Dashboard Agencia
  │     ├── Rol: Guía       → Dashboard Guía
  │     └── Rol: Admin      → Dashboard Administrador
  ├── [Registrarse como Turista] → Formulario Registro Turista
  ├── [Registrar mi Agencia]     → Formulario Registro Agencia
  └── [¿Olvidaste tu contraseña?] → Recuperar Contraseña
```

---

## 📱 PANTALLAS — FLUJO PÚBLICO (Sin autenticación)

---

### PANTALLA 01 — Landing Page
**Ruta:** `/`  
**Descripción:** Página de bienvenida pública. Primer contacto con el sistema.

**Secciones:**
- **Hero:** Imagen de fondo de Medellín (El Poblado/Metro cable), logo TuristGo, tagline *"Descubre Medellín con guías certificados"*, buscador de tours (campo texto + botón Explorar), dos CTA: `Iniciar sesión` `Registrarme`.
- **Categorías destacadas:** 4 cards con íconos — Cultura · Aventura · Gastronomía · Naturaleza
- **Tours destacados:** Grid de 3 tour-cards con foto, nombre, precio, calificación ⭐, categoría
- **Sección ¿Por qué TuristGo?:** 3 columnas — Guías certificados / Reserva digital / Seguridad garantizada
- **Footer:** Logo, links legales, redes sociales

**Conexiones:**
- `[Explorar tours]` → Pantalla 03 (Catálogo Público)
- `[Iniciar sesión]` → Pantalla 02 (Login)
- `[Registrarme]` → Pantalla 05 (Registro Turista)
- `[Registrar mi Agencia]` → Pantalla 06 (Registro Agencia)
- Tour-card → Pantalla 04 (Detalle Tour Público)

---

### PANTALLA 02 — Login
**Ruta:** `/login`  
**Descripción:** Acceso unificado para todos los roles.

**Elementos:**
- Logo TuristGo centrado
- Campo: Correo electrónico
- Campo: Contraseña (con toggle mostrar/ocultar)
- Checkbox: Recordarme
- Botón primario: `Ingresar`
- Link: `¿Olvidaste tu contraseña?`
- Divisor: "¿Eres nuevo aquí?"
- Link: `Regístrate como turista`
- Link: `Registra tu agencia`
- **Estado error:** banner rojo "Correo o contraseña incorrectos"
- **Estado bloqueado:** banner naranja "Tu cuenta está bloqueada 15 min"
- **Estado pendiente (agencia):** banner amarillo "Tu solicitud está en revisión (24-48h)"
- **Estado suspendido:** banner rojo "Tu cuenta ha sido suspendida. Contacta al administrador"

**Conexiones:**
- Login exitoso Turista → Pantalla 10 (Dashboard Turista)
- Login exitoso Agencia → Pantalla 20 (Dashboard Agencia)
- Login exitoso Guía → Pantalla 40 (Dashboard Guía)
- Login exitoso Admin → Pantalla 50 (Dashboard Admin)
- `[¿Olvidaste tu contraseña?]` → Pantalla 08 (Recuperar contraseña paso 1)
- `[Regístrate como turista]` → Pantalla 05
- `[Registra tu agencia]` → Pantalla 06

---

### PANTALLA 03 — Catálogo Público de Tours
**Ruta:** `/tours`  
**Descripción:** Vista de todos los tours activos, accesible sin login.

**Elementos:**
- Navbar: Logo, `[Iniciar sesión]`, `[Registrarme]`
- Barra de búsqueda y filtros: Categoría (chips: Todos / Cultura / Aventura / Gastronomía / Naturaleza), Ciudad
- Grid de Tour-Cards (3 columnas):
  - Foto del tour (aspect ratio 4:3)
  - Badge de categoría (color por tipo)
  - Nombre del tour
  - ⭐ Calificación promedio (ej: 4.7)
  - ⏱ Duración (ej: 4 horas)
  - 👥 Cupos disponibles
  - 💰 Precio (ej: $80.000 COP)
  - Botón: `Ver detalles`
  - Si cupos = 0: Badge "Agotado", botón deshabilitado
- **Estado vacío:** ilustración + "No hay tours disponibles en este momento"

**Conexiones:**
- Tour-card `[Ver detalles]` → Pantalla 04 (Detalle Tour)
- Botón `[Reservar]` dentro del detalle (usuario no logueado) → Pantalla 02 (Login) con mensaje "Inicia sesión para reservar"

---

### PANTALLA 04 — Detalle Tour (Público)
**Ruta:** `/tours/:id`  

**Elementos:**
- Galería de fotos (carousel de hasta 5 imágenes)
- Nombre del tour + badge de categoría
- Descripción larga
- Información clave (en grid 2x2): Precio · Duración · Punto de encuentro · Fecha/Hora
- Calificación con distribución de estrellas (5★ 4★ 3★...)
- Lista de reseñas (avatar, nombre, estrellas, texto)
- Cupos disponibles (barra de progreso visual)
- Botón CTA: `Reservar este tour` — Si no logueado: redirige a login

**Conexiones:**
- `[Reservar este tour]` (logueado) → Pantalla 14 (Reserva — Confirmación)
- `[Reservar este tour]` (no logueado) → Pantalla 02

---

### PANTALLA 05 — Registro de Turista
**Ruta:** `/registro/turista`  

**Elementos:**
- Paso único (no multi-step)
- Campo: Nombre completo
- Campo: Correo electrónico (validación en tiempo real)
- Campo: Contraseña (con requisitos visuales: 8 caracteres, mayúscula, número)
- Campo: Confirmar contraseña
- Checkbox: Acepto los términos y condiciones
- Botón: `Crear mi cuenta`
- **Estados de validación:** campos en rojo con mensajes de error inline
- **Estado correo duplicado:** error inline "Este correo ya está registrado. ¿Deseas iniciar sesión?"
- **Estado éxito:** modal o pantalla de confirmación "¡Bienvenido! Tu cuenta fue creada"

**Conexiones:**
- Éxito → Pantalla 10 (Dashboard Turista)
- Link "¿Ya tienes cuenta?" → Pantalla 02

---

### PANTALLA 06 — Registro de Agencia
**Ruta:** `/registro/agencia`  

**Elementos:**
- Formulario multi-campo:
  - NIT (validación formato: 9 dígitos + dígito verificación, ej: 900123456-7)
  - Nombre comercial
  - Correo corporativo
  - Teléfono
  - Descripción de la agencia
  - Upload: documento de constitución o cámara de comercio (drag & drop + botón)
- Botón: `Enviar solicitud de registro`
- **Estado NIT inválido:** error "Formato inválido. Ejemplo: 900123456-7"
- **Estado éxito:** pantalla de confirmación "Tu solicitud fue enviada. Recibirás respuesta en 24-48 horas"

**Conexiones:**
- Éxito → Pantalla de confirmación (no hay acceso al sistema aún)
- Link "¿Ya tienes cuenta?" → Pantalla 02

---

### PANTALLA 07 — Pantalla de Espera (Agencia Pendiente)
Mensaje informativo de que la solicitud está en revisión. Ícono de reloj + instrucciones.

---

### PANTALLA 08 — Recuperar Contraseña (Paso 1: Ingreso de correo)
**Ruta:** `/recuperar-contrasena`  

**Elementos:**
- Ícono de llave o candado
- Título: "¿Olvidaste tu contraseña?"
- Descripción breve
- Campo: Correo electrónico
- Botón: `Enviar enlace de recuperación`
- Mensaje de respuesta (siempre igual, sea correo válido o no): "Si este correo está registrado, recibirás un enlace en breve"
- Link: `Volver al inicio de sesión`

**Conexiones:**
- Submit → Pantalla 09 (Confirmación de envío)

---

### PANTALLA 09 — Recuperar Contraseña (Paso 2: Nueva contraseña)
**Ruta:** `/nueva-contrasena?token=...`  

**Elementos:**
- Campo: Nueva contraseña (con indicador de requisitos)
- Campo: Confirmar contraseña
- Botón: `Cambiar contraseña`
- **Estado token expirado:** mensaje de error + link para solicitar nuevo enlace
- **Estado éxito:** "Contraseña cambiada correctamente" + botón Iniciar sesión

---

## 👤 FLUJO TURISTA (Pantallas 10–19)

---

### PANTALLA 10 — Dashboard Turista
**Ruta:** `/turista/inicio`  
**Navbar:** Logo · Explorar Tours · Mis Reservas · Mis Facturas · Perfil · [Cerrar sesión]

**Secciones:**
- **Saludo personalizado:** "Hola, [Nombre] 👋" + fecha actual
- **Resumen de actividad (3 cards métricas):**
  - Reservas activas (número)
  - Tours completados (número)
  - Facturas pendientes de descarga
- **Próxima reserva (card destacada):**
  - Foto del tour, nombre, fecha, hora, punto de encuentro
  - Badge "Confirmada"
  - Botones: `Ver detalles` `Cancelar reserva`
- **Tours recomendados (horizontal scroll):** 4 tour-cards con botón Reservar
- **Accesos rápidos (grid 2x2 con íconos):** Explorar catálogo / Mis reservas / Mis facturas / Mi perfil

**Conexiones:**
- `[Explorar catálogo]` → Pantalla 03
- `[Ver detalles]` de reserva → Pantalla 13 (Detalle Reserva)
- `[Cancelar reserva]` → Modal de confirmación → Pantalla 13
- Cards de tours → Pantalla 04
- Navbar → Pantallas 11, 12, 15, 17

---

### PANTALLA 11 — Catálogo (Turista Autenticado)
Igual que Pantalla 03 pero con botón `Reservar` habilitado y Navbar de turista.

**Conexiones:**
- `[Reservar]` → Pantalla 14 (Confirmación de Reserva)

---

### PANTALLA 12 — Historial de Reservas
**Ruta:** `/turista/reservas`  

**Elementos:**
- Filtros de estado: Todas · Confirmadas · Completadas · Canceladas (chips seleccionables)
- Lista de reservas (card por reserva):
  - Foto miniatura del tour
  - Nombre del tour
  - Fecha y hora
  - Precio
  - Badge de estado (Confirmada/Completada/Cancelada)
  - Botones según estado:
    - Confirmada: `Ver detalles` `Cambiar fecha` `Cancelar`
    - Completada: `Ver detalles` `Calificar tour` (si no calificado aún) / `Ya calificado` (si calificado)
    - Cancelada: `Ver detalles`
- **Estado vacío:** "Aún no tienes reservas. ¡Explora el catálogo para encontrar tu próximo tour!"

**Conexiones:**
- `[Ver detalles]` → Pantalla 13
- `[Cambiar fecha]` → Pantalla 13B (Modal cambio de fecha)
- `[Cancelar]` → Modal confirmación → Pantalla 12 actualizada
- `[Calificar tour]` → Pantalla 16 (Calificación)

---

### PANTALLA 13 — Detalle de Reserva (Turista)
**Ruta:** `/turista/reservas/:id`  

**Elementos:**
- Número de reserva (ej: #RES-2025-001)
- Estado (badge coloreado)
- Foto + nombre del tour
- Fecha y hora del tour
- Punto de encuentro (con mapa estático embebido)
- Precio pagado
- **Sección Transporte (si asignado):** Placa · Marca · Modelo · Color
- **Mensaje si no asignado:** "El vehículo será asignado próximamente por la agencia"
- Botones (según estado):
  - Confirmada: `Cambiar fecha` `Cancelar reserva`
  - Completada: `Calificar este tour` / `Ver mi calificación`
  - Cancelada: sin acciones
- Link: `Ver mi factura`

**Conexiones:**
- `[Cambiar fecha]` → Modal de selección de nueva fecha
- `[Cancelar reserva]` → Modal de confirmación → Éxito con cupo liberado
- `[Calificar]` → Pantalla 16
- `[Ver mi factura]` → Pantalla 17 (Detalle Factura)

---

### PANTALLA 13B — Modal: Cambio de Fecha de Reserva
**Overlay sobre Pantalla 13**  

**Elementos:**
- Título: "Cambiar fecha de reserva"
- Selector de fecha (disponibles para ese tour)
- Indicador de cupos por fecha
- Advertencia si < 24h de anticipación
- Botón: `Confirmar cambio` (deshabilitado si no cumple reglas)
- Botón: `Cancelar`

---

### PANTALLA 14 — Confirmar Reserva
**Ruta:** `/turista/reservas/nueva?tour=:id`  

**Elementos:**
- **Resumen del tour (read-only):**
  - Foto, nombre, categoría
  - Fecha y hora
  - Punto de encuentro
  - Precio
  - Guía asignado (nombre)
- **Simulación de pago:**
  - Mensaje: "Confirmar pago simulado de $[precio]"
  - Resumen total
- Botón: `Confirmar reserva`
- Link: `Cancelar y volver al catálogo`
- **Estado alerta cruce de horarios:** banner rojo "Conflicto detectado. Ya tienes reservado: [Tour X] de 9:00 a 13:00. No puedes confirmar esta reserva."
- **Estado sin cupos:** banner rojo "Este tour no tiene cupos disponibles"
- **Estado éxito:** pantalla de confirmación con número de reserva generado, ícono de check verde, "¡Reserva confirmada! Número: #RES-2025-001"

**Conexiones:**
- Éxito → Pantalla 13 (Detalle de esa reserva)

---

### PANTALLA 15 — Mi Perfil (Turista)
**Ruta:** `/turista/perfil`  

**Elementos:**
- Foto de perfil + nombre + correo (correo no editable, con candado)
- Formulario editable: Nombre completo · Teléfono · Foto (upload)
- Botón: `Guardar cambios`
- Sección separada: `Cambiar contraseña` → Link a flujo HU-15
- Sección separada: zona de peligro — `Eliminar mi cuenta` (botón rojo)
- **Modal eliminación:** confirmación con contraseña actual requerida
- **Bloqueo si tiene reservas activas:** "Tienes reservas activas. Cancélalas antes de eliminar tu cuenta"

---

### PANTALLA 16 — Calificar Tour
**Ruta:** `/turista/calificar/:reservaId`  

**Elementos:**
- Foto del tour + nombre
- Selector de estrellas interactivo (1-5, con hover visual)
- Campo de texto: "Cuéntanos tu experiencia (opcional)"
- Botón: `Enviar calificación`
- **Estado ya calificado:** mostrar la calificación enviada en modo lectura, sin poder modificar
- **Estado tour no completado:** "Solo puedes calificar tours marcados como completados"

**Conexiones:**
- Éxito → Banner "¡Gracias por tu calificación!" → Volver al historial

---

### PANTALLA 17 — Mis Facturas (Turista)
**Ruta:** `/turista/facturas`  

**Elementos:**
- Lista de facturas:
  - Número de factura
  - Nombre del tour
  - Fecha
  - Valor
  - Estado (Emitida/Anulada con badge diferenciado)
  - Botón: `Ver detalle`
  - Botón: `Descargar PDF` (solo si estado = Emitida)
- **Estado vacío:** "Aún no tienes facturas. Realiza tu primera reserva."

---

## 🏢 FLUJO AGENCIA (Pantallas 20–39)

---

### PANTALLA 20 — Dashboard Agencia
**Ruta:** `/agencia/inicio`  
**Sidebar izquierdo:** Logo · Inicio · Mis Tours · Guías · Flota · Reservas · Facturación · Perfil · Cerrar sesión

**Secciones:**
- **Header:** "Panel de control — [Nombre Agencia]" + badge "Aprobada"
- **Métricas (4 cards):**
  - Tours activos
  - Reservas este mes
  - Ingresos este mes (simulado)
  - Guías disponibles
- **Reservas recientes (tabla compacta):** Turista · Tour · Fecha · Estado
- **Tours con cupos críticos (< 3 cupos):** alerta amarilla con nombre y cupos restantes
- **Guías con certificado próximo a vencer:** alerta naranja

**Conexiones:**
- Sidebar → Pantallas 21, 25, 28, 32, 36, 38

---

### PANTALLA 21 — Gestión de Tours (Lista)
**Ruta:** `/agencia/tours`  

**Elementos:**
- Botón: `+ Crear nuevo tour`
- Filtros: Estado (Todos · Activos · Inactivos)
- Tabla/lista de tours:
  - Foto miniatura · Código · Nombre · Categoría · Precio · Cupos · Estado
  - Acciones: `Ver` `Editar` `Activar/Desactivar` `Asignar guía` `Asignar vehículo`

**Conexiones:**
- `[+ Crear nuevo tour]` → Pantalla 22
- `[Editar]` → Pantalla 23
- `[Asignar guía]` → Pantalla 24
- `[Asignar vehículo]` → Pantalla 24B
- `[Activar/Desactivar]` → Modal de confirmación

---

### PANTALLA 22 — Crear Tour
**Ruta:** `/agencia/tours/nuevo`  

**Elementos (formulario):**
- Nombre del tour
- Descripción (textarea enriquecida)
- Categoría (selector: Cultura / Aventura / Gastronomía / Naturaleza)
- Ciudad
- Precio (validación: > 0)
- Cupos máximos (validación: entero > 0)
- Duración (en horas)
- Fecha y hora de inicio
- Punto de encuentro (campo de texto + selector de mapa)
- Upload de fotos (hasta 5, drag & drop con previews)
- Botón: `Guardar tour` (queda en Inactivo)
- Nota informativa: "El tour se activará automáticamente al asignarle un guía con certificado vigente"

---

### PANTALLA 23 — Editar Tour
Similar a Pantalla 22 pero con datos precargados.  
Regla visual: campo Cupos muestra "Reservas confirmadas: X" para que la agencia no baje por debajo de ese número.

---

### PANTALLA 24 — Asignar Guía a Tour
**Overlay/Modal o página dedicada**  

**Elementos:**
- Nombre del tour (read-only)
- Fecha del tour (read-only)
- Lista de guías disponibles de la agencia:
  - Nombre · Certificado vigente (badge verde/rojo) · Estado disponibilidad
  - Guías no disponibles aparecen con opacity reducida y tooltip explicativo
- Botón: `Asignar guía seleccionado`
- **Errores posibles (banners inline):**
  - "Certificado vencido. Actualiza el certificado antes de asignar."
  - "Cruce de horarios: este guía tiene [Tour X] en ese horario."
  - "Menos de 24h de anticipación para asignar."
  - "El guía tiene periodo de no disponibilidad en esa fecha."

**Conexiones:**
- Éxito → Tour cambia a estado "Activo" → Volver a lista de tours

---

### PANTALLA 24B — Asignar Vehículo a Tour
Similar a Pantalla 24 pero con listado de vehículos disponibles.  
Validación visible: la capacidad del vehículo no puede ser menor al cupo del tour.

---

### PANTALLA 25 — Gestión de Guías (Lista)
**Ruta:** `/agencia/guias`  

**Elementos:**
- Botón: `+ Registrar nuevo guía`
- Lista de guías:
  - Foto/Avatar · Nombre · N° Certificado · Vencimiento · Estado
  - Badge alerta: "Vencido" (rojo) / "Vence en X días" (naranja) / "Vigente" (verde)
  - Tours asignados activos (número)
  - Acciones: `Ver perfil` `Actualizar certificado`

**Conexiones:**
- `[+ Registrar nuevo guía]` → Pantalla 26
- `[Actualizar certificado]` → Pantalla 27

---

### PANTALLA 26 — Registrar Guía
**Ruta:** `/agencia/guias/nuevo`  

**Elementos:**
- Nombre completo
- Documento de identidad
- Correo (se usará para las credenciales)
- Número de certificado oficial (único en el sistema)
- Fecha de vencimiento del certificado (validar: posterior a hoy)
- Upload: archivo del certificado
- Botón: `Registrar guía`
- Nota: "Las credenciales de acceso serán enviadas automáticamente al correo del guía"

---

### PANTALLA 27 — Actualizar Certificado del Guía
Formulario simple: upload nuevo archivo + nueva fecha de vencimiento.  
Validación visible: fecha debe ser posterior a hoy.  
Nota: el certificado anterior queda archivado.

---

### PANTALLA 28 — Gestión de Flota (Vehículos)
**Ruta:** `/agencia/flota`  

**Elementos:**
- Botón: `+ Registrar vehículo`
- Lista de vehículos:
  - Foto miniatura (opcional) · Placa · Marca · Modelo · Capacidad · Estado (Disponible/En mantenimiento/Ocupado)
  - Acciones: `Ver` `Cambiar estado` `Eliminar`
- Badge de estado con color: Disponible (verde) · En mantenimiento (naranja) · Ocupado (azul)

**Conexiones:**
- `[+ Registrar vehículo]` → Pantalla 29
- `[Cambiar estado]` → Modal de confirmación (con validación de tours futuros)
- `[Eliminar]` → Modal de confirmación

---

### PANTALLA 29 — Registrar Vehículo
**Elementos:**
- Placa (validación formato colombiano: ABC-123)
- Marca
- Modelo (año)
- Tipo de vehículo (selector: Bus / Buseta / Van / Automóvil)
- Color
- Capacidad de pasajeros (entero > 0)
- Upload: foto del vehículo (opcional)
- Botón: `Registrar vehículo`

---

### PANTALLA 30 — Detalle Vehículo
Ficha completa del vehículo con historial de tours asignados (pasados).

---

### PANTALLA 31 — Modal: Cambiar Estado Vehículo
- Estado actual (read-only)
- Selector nuevo estado: Disponible / En mantenimiento
- **Bloqueo si tiene tours futuros:** "Este vehículo tiene tours futuros asignados. Desvincúlalo primero."
- Botón: `Confirmar cambio`

---

### PANTALLA 32 — Gestión de Reservas (Agencia)
**Ruta:** `/agencia/reservas`  

**Elementos:**
- Selector de tour (dropdown para filtrar)
- Filtro por estado: Todas · Confirmadas · Completadas · Canceladas
- Tabla de reservas:
  - N° Reserva · Turista · Fecha reserva · Fecha tour · Estado
  - Botón: `Marcar como completada` (visible solo si la fecha del tour ya pasó)
- **Bloqueo tiempo real:** si fecha del tour es futura, el botón está deshabilitado con tooltip "El tour aún no ha ocurrido"

**Conexiones:**
- `[Marcar como completada]` → Modal de confirmación → Estado actualizado

---

### PANTALLA 33 — Detalle Reserva (Agencia)
Ficha completa de una reserva con datos del turista y del tour.

---

### PANTALLA 34 — Dar de Baja Servicio (Admin-like para Agencia)
**Aplica HU-25:** Modal para desactivar un tour propio.  
Bloqueo si tiene reservas futuras confirmadas.

---

### PANTALLA 36 — Facturación (Agencia)
**Ruta:** `/agencia/facturas`  

**Elementos:**
- Filtros: rango de fechas · estado (Emitida/Anulada/Manual)
- Tabla de facturas:
  - N° Factura · Tour · Turista · Fecha · Valor · Estado · Tipo (Auto/Manual)
  - Botones: `Ver detalle`
- Resumen: Total emitido en el período seleccionado
- Botón: `+ Emitir factura manual`

**Conexiones:**
- `[Emitir factura manual]` → Pantalla 37

---

### PANTALLA 37 — Emitir Factura Manual
**Elementos:**
- Selector de reserva (buscar por número)
- Valor del ajuste
- Descripción del ajuste
- Botón: `Emitir factura manual`
- Indicador visual: quedará registrada con sello "MANUAL"

---

### PANTALLA 38 — Perfil Agencia
Datos empresariales editables (excepto NIT). Gestión de documentos.

---

## 🧭 FLUJO GUÍA TURÍSTICO (Pantallas 40–49)

---

### PANTALLA 40 — Dashboard Guía
**Ruta:** `/guia/inicio`  
**Navbar:** Logo · Mis Tours · Mi Disponibilidad · Mi Perfil · Cerrar sesión

**Secciones:**
- **Alerta certificado (condicional):**
  - Si vencido: banner rojo "Tu certificado venció el [fecha]. Comunícate con tu agencia."
  - Si próximo a vencer (< 30 días): banner naranja "Tu certificado vence el [fecha]."
- **Próximo tour asignado (card grande):**
  - Nombre del tour · Fecha · Hora · Punto de encuentro
  - N° de turistas confirmados
  - Datos del vehículo (si asignado)
  - Badge de estado
- **Mi agenda (lista compacta de los próximos 5 tours):**
  - Fecha · Nombre del tour · Estado
- **Mis períodos de no disponibilidad:** mini lista + botón `+ Agregar periodo`

**Conexiones:**
- `[Ver mis tours]` → Pantalla 41
- `[Agregar periodo]` → Pantalla 43
- Cada tour → Pantalla 42

---

### PANTALLA 41 — Mis Tours Asignados (Guía)
**Ruta:** `/guia/tours`  

**Elementos:**
- Lista de tours asignados, ordenados por fecha más próxima:
  - Nombre · Fecha/Hora · N° turistas confirmados · Estado del tour · Vehículo asignado
  - Botón: `Ver detalles`
- **Estado vacío:** "No tienes tours asignados actualmente"

**Conexiones:**
- `[Ver detalles]` → Pantalla 42

---

### PANTALLA 42 — Detalle Tour Asignado (Guía)
**Elementos:**
- Nombre del tour · Fecha y hora · Punto de encuentro · Descripción
- **Lista de turistas confirmados:** Nombre de cada turista (sin datos de contacto)
- Total de turistas
- **Datos del vehículo (si asignado):** Placa · Marca · Modelo · Capacidad
- Si no hay vehículo: "El vehículo aún no ha sido asignado a este tour"

---

### PANTALLA 43 — Gestionar Disponibilidad
**Ruta:** `/guia/disponibilidad`  

**Elementos:**
- Calendario visual con períodos de no disponibilidad marcados en rojo
- Lista de períodos registrados: Fecha inicio · Fecha fin · Acciones (eliminar)
- Formulario para agregar nuevo período:
  - Fecha inicio (no puede ser pasada)
  - Fecha fin
  - Botón: `Registrar no disponibilidad`
- **Alerta conflicto:** "Tienes un tour asignado en este período: [nombre del tour]. Comunícate con tu agencia."

---

### PANTALLA 44 — Mi Perfil (Guía)
- Datos personales (editables: nombre, teléfono, foto)
- Sección certificado: número, entidad emisora, fecha vencimiento, estado
- Link: `Solicitar actualización de certificado` (informa que debe pedirlo a su agencia)

---

## 🔐 FLUJO ADMINISTRADOR (Pantallas 50–59)

---

### PANTALLA 50 — Dashboard Administrador
**Ruta:** `/admin/inicio`  
**Sidebar:** Logo · Inicio · Usuarios · Servicios · Reportes · Configuración · Cerrar sesión

**Secciones:**
- **Métricas globales (4 cards):**
  - Total usuarios registrados
  - Agencias pendientes de aprobación
  - Tours activos en plataforma
  - Ingresos totales este mes
- **Solicitudes pendientes (tabla urgente):** Agencias en estado Pendiente con botón `Revisar`
- **Actividad reciente:** últimas acciones del sistema (registro, reservas, etc.)
- **Alertas del sistema:** certificados vencidos, servicios reportados

**Conexiones:**
- `[Revisar]` → Pantalla 52 (Detalle Agencia)
- Sidebar → Pantallas 51, 54, 57

---

### PANTALLA 51 — Gestión de Usuarios
**Ruta:** `/admin/usuarios`  

**Elementos:**
- Filtros: Tipo de actor (Todos · Turistas · Agencias · Guías) · Estado (Todos · Activos · Pendientes · Suspendidos)
- Tabla de usuarios:
  - Avatar · Nombre · Correo · Tipo · Estado · Fecha registro
  - Acciones: `Ver detalle` `Aprobar` (solo agencias pendientes) `Suspender` `Eliminar`
- Contadores por categoría en tabs superiores

**Conexiones:**
- `[Ver detalle]` → Pantalla 52
- `[Aprobar]` → Modal confirmación → Estado actualizado
- `[Suspender]` → Modal con campo de motivo obligatorio
- `[Eliminar]` → Modal con campo de motivo + validación de reservas activas

---

### PANTALLA 52 — Detalle de Usuario / Agencia (Admin)
Ficha completa: datos · documentos adjuntos (si agencia) · tours publicados · historial de acciones administrativas.  
Botones de acción: `Aprobar` / `Suspender` / `Reactivar` / `Eliminar`

---

### PANTALLA 53 — Modal: Suspender / Eliminar Usuario
**Overlay:**
- Nombre del usuario (read-only)
- Acción seleccionada (read-only)
- Campo obligatorio: Motivo de la acción (textarea)
- **Si eliminar con reservas activas:** banner bloqueante "No se puede eliminar: el usuario tiene reservas activas"
- Botones: `Confirmar` `Cancelar`

---

### PANTALLA 54 — Gestión de Servicios (Admin)
**Ruta:** `/admin/servicios`  

**Elementos:**
- Lista de todos los tours del sistema (de todas las agencias):
  - Tour · Agencia · Estado · Fecha · Cupos · Calificación
  - Acción: `Dar de baja` (con motivo obligatorio)
- Filtros: Agencia · Estado · Categoría

**Conexiones:**
- `[Dar de baja]` → Pantalla 55

---

### PANTALLA 55 — Modal: Dar de Baja Servicio (Admin)
**Overlay:**
- Nombre del tour (read-only)
- Agencia propietaria (read-only)
- Campo obligatorio: Motivo de la baja
- Nota: "La agencia recibirá una notificación interna con este motivo"
- Botones: `Confirmar baja` `Cancelar`
- Si sin motivo: botón deshabilitado

---

### PANTALLA 56 — Detalle Tour (Admin)
Vista completa del tour con guía asignado, vehículo, reservas activas y calificaciones.

---

### PANTALLA 57 — Reporte Global de Facturación
**Ruta:** `/admin/reportes`  

**Elementos:**
- Selector de período (mes/rango personalizado)
- **Resumen (4 tarjetas métricas):**
  - Total ingresos en período
  - N° reservas completadas
  - N° facturas emitidas
  - N° facturas anuladas
- **Tabla desglose por agencia:** Agencia · N° reservas · Total facturado · Comisión plataforma
- **Gráfico de barras:** Ingresos por mes (últimos 6 meses)
- **Estado vacío:** "No hay datos de facturación para el período seleccionado"

---

## 📐 ESPECIFICACIONES TÉCNICAS DE FIGMA

### Organización de Páginas en Figma
```
📄 0. Design System        (colores, tipografía, componentes, íconos)
📄 1. Flujo Público        (Pantallas 01-09)
📄 2. Flujo Turista        (Pantallas 10-19)
📄 3. Flujo Agencia        (Pantallas 20-39)
📄 4. Flujo Guía           (Pantallas 40-49)
📄 5. Flujo Administrador  (Pantallas 50-59)
📄 6. Componentes          (modales, alerts, estados vacíos)
📄 7. Prototype Flow Map   (mapa visual de todas las conexiones)
```

### Frames recomendados
- Desktop principal: **1440 × 900** px (cada pantalla)
- Modales y overlays: centrados sobre el frame de fondo
- Usar Auto Layout en todos los componentes para facilitar variantes

### Variantes de Componentes que deben existir
```
Button:    Default / Hover / Pressed / Disabled / Loading
Input:     Default / Focus / Filled / Error / Disabled
Card Tour: Default / Hover / Agotado
Badge:     Confirmada / Completada / Cancelada / Pendiente / Activo / Inactivo / Vencido
```

### Conexiones del Prototipo (Interactions)
- Usar **Smart Animate** para transiciones entre pantallas del mismo flujo
- Usar **Instant** para modales (aparecen y desaparecen rápido)
- Todos los botones primarios deben tener al menos una conexión funcional
- Los flujos de cada rol deben ser navegables de forma independiente (Starting Point)
- Establecer **4 Starting Points:** Login Turista / Login Agencia / Login Guía / Login Admin

### Datos Ficticios a usar en los Diseños
```
Turista:      Carlos Restrepo · carlos.restrepo@gmail.com
Agencia:      Explora Medellín S.A.S · NIT: 900345678-2
Guía:         Valentina Ospina · CERT-2024-00456 (vence 2026-12-31)
Admin:        Sistema TuristGo · admin@turistgo.com

Tours ficticios:
  - "Tour Centro Histórico Medellín" · Cultura · $80.000 · 4h · ⭐4.8
  - "Cable Arví Naturaleza" · Aventura · $120.000 · 6h · ⭐4.6
  - "Sabores de Medellín" · Gastronomía · $95.000 · 3h · ⭐4.9
  - "Graffiti Tour El Poblado" · Cultura · $60.000 · 2.5h · ⭐4.7

Vehículo:     ABC-123 · Toyota HiAce · Blanco · Capacidad 15
N° Reserva:   #RES-2025-0047
N° Factura:   #FAC-2025-0031
```

---

## ✅ CHECKLIST DE CALIDAD DEL PROTOTIPO

Antes de entregar, verificar que:

- [ ] Todas las pantallas usan el Design System definido (colores, tipografía, componentes)
- [ ] Cada rol tiene un flujo navegable de principio a fin sin pantallas sin conexión
- [ ] Los 4 Starting Points están configurados (uno por rol)
- [ ] Los estados de error están diseñados (no solo el happy path)
- [ ] Los estados vacíos tienen ilustración + mensaje + CTA
- [ ] Los modales de confirmación están conectados correctamente
- [ ] Los badges de estado usan colores consistentes en todo el sistema
- [ ] Las alertas (certificado vencido, cruce de horarios) son visibles y prominentes
- [ ] El catálogo público (sin login) redirige al login al intentar reservar
- [ ] El flujo de agencia pendiente no permite acceder al dashboard

---

*Prompt elaborado para el proyecto TuristGo — ITM Diseño de Sistemas de Información · Marzo 2026*