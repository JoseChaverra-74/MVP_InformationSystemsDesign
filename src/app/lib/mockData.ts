// Mock data for TuristGo application

export interface TourSchedule {
  id: string;
  startTime: string;
  endTime: string;
  availableSpots: number;
  maxCapacity: number;
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  category: 'Cultura' | 'Aventura' | 'Gastronomía' | 'Naturaleza';
  price: number;
  duration: number; // in hours
  maxCapacity: number;
  availableSpots: number;
  rating: number;
  city: string;
  meetingPoint: string;
  date: string;
  time: string;
  schedules?: TourSchedule[]; // Multiple schedules for the same tour
  images: string[];
  agencyId: string;
  guideId?: string;
  vehicleId?: string;
  status: 'Activo' | 'Inactivo';
}

export interface Reservation {
  id: string;
  tourId: string;
  userId: string;
  date: string;
  scheduleId?: string; // Reference to the selected schedule
  startTime?: string; // Start time of the reserved tour
  endTime?: string; // End time of the reserved tour
  status: 'Confirmada' | 'Completada' | 'Cancelada' | 'Pendiente';
  price: number;
  invoiceId?: string;
  rating?: number;
  review?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Turista' | 'Agencia' | 'Guía' | 'Administrador';
  phone?: string;
  avatar?: string;
  status: 'Activo' | 'Pendiente' | 'Suspendido';
}

export interface Agency extends User {
  nit: string;
  commercialName: string;
  description: string;
  documents: string[];
}

export interface Guide {
  id: string;
  name: string;
  email: string;
  documentId: string;
  certificateNumber: string;
  certificateExpiry: string;
  certificateFile: string;
  agencyId: string;
  status: 'Activo' | 'Inactivo';
  unavailablePeriods: { start: string; end: string }[];
}

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  type: 'Bus' | 'Buseta' | 'Van' | 'Automóvil';
  color: string;
  capacity: number;
  agencyId: string;
  status: 'Disponible' | 'En mantenimiento' | 'Ocupado';
  image?: string;
}

export interface Invoice {
  id: string;
  reservationId: string;
  tourId: string;
  userId: string;
  date: string;
  amount: number;
  status: 'Emitida' | 'Anulada';
  type: 'Auto' | 'Manual';
}

// Mock Tours
export const mockTours: Tour[] = [
  {
    id: 'tour-001',
    name: 'Tour Centro Histórico Medellín',
    description: 'Descubre la historia y cultura de Medellín en un recorrido por el centro de la ciudad. Visitaremos la Plaza Botero, el Museo de Antioquia, y el Parque de las Luces.',
    category: 'Cultura',
    price: 80000,
    duration: 4,
    maxCapacity: 15,
    availableSpots: 8,
    rating: 4.8,
    city: 'Medellín',
    meetingPoint: 'Plaza Botero, Centro de Medellín',
    date: '2026-05-15',
    time: '09:00',
    schedules: [
      { id: 'sch-001-1', startTime: '09:00', endTime: '13:00', availableSpots: 8, maxCapacity: 15 },
      { id: 'sch-001-2', startTime: '14:00', endTime: '18:00', availableSpots: 10, maxCapacity: 15 },
    ],
    images: ['https://images.unsplash.com/photo-1675695614402-3dd6a58dfffe?w=800'],
    agencyId: 'agency-001',
    guideId: 'guide-001',
    vehicleId: 'vehicle-001',
    status: 'Activo',
  },
  {
    id: 'tour-002',
    name: 'Tour Museo de Antioquia',
    description: 'Visita guiada al emblemático Museo de Antioquia. Descubre las obras de Fernando Botero y la historia del arte en la región.',
    category: 'Cultura',
    price: 70000,
    duration: 4,
    maxCapacity: 12,
    availableSpots: 5,
    rating: 4.6,
    city: 'Medellín',
    meetingPoint: 'Entrada Museo de Antioquia',
    date: '2026-05-15',
    time: '11:00',
    schedules: [
      { id: 'sch-002-1', startTime: '11:00', endTime: '15:00', availableSpots: 5, maxCapacity: 12 },
      { id: 'sch-002-2', startTime: '16:00', endTime: '20:00', availableSpots: 7, maxCapacity: 12 },
    ],
    images: ['https://images.unsplash.com/photo-1652265843310-9953cd934a8c?w=800'],
    agencyId: 'agency-001',
    guideId: 'guide-001',
    status: 'Activo',
  },
  {
    id: 'tour-003',
    name: 'Cable Arví Naturaleza',
    description: 'Experiencia única en la naturaleza. Recorrido en metrocable hasta el Parque Arví con caminatas ecológicas y avistamiento de aves.',
    category: 'Aventura',
    price: 120000,
    duration: 6,
    maxCapacity: 15,
    availableSpots: 8,
    rating: 4.8,
    city: 'Medellín',
    meetingPoint: 'Estación Metrocable Santo Domingo',
    date: '2026-05-16',
    time: '08:00',
    schedules: [
      { id: 'sch-003-1', startTime: '08:00', endTime: '14:00', availableSpots: 8, maxCapacity: 15 },
      { id: 'sch-003-2', startTime: '15:00', endTime: '21:00', availableSpots: 10, maxCapacity: 15 },
    ],
    images: ['https://images.unsplash.com/photo-1652265843310-9953cd934a8c?w=800'],
    agencyId: 'agency-001',
    guideId: 'guide-001',
    status: 'Activo',
  },
  {
    id: 'tour-004',
    name: 'Sabores de Medellín',
    description: 'Tour gastronómico por los mejores lugares de comida tradicional paisa. Incluye degustaciones de bandeja paisa, arepas y café colombiano.',
    category: 'Gastronomía',
    price: 95000,
    duration: 3,
    maxCapacity: 10,
    availableSpots: 3,
    rating: 4.9,
    city: 'Medellín',
    meetingPoint: 'Parque Lleras, El Poblado',
    date: '2026-05-17',
    time: '10:00',
    schedules: [
      { id: 'sch-004-1', startTime: '10:00', endTime: '13:00', availableSpots: 3, maxCapacity: 10 },
      { id: 'sch-004-2', startTime: '18:00', endTime: '21:00', availableSpots: 6, maxCapacity: 10 },
    ],
    images: ['https://images.unsplash.com/photo-1723693407562-bb4fcae76797?w=800'],
    agencyId: 'agency-001',
    status: 'Activo',
  },
  {
    id: 'tour-005',
    name: 'Graffiti Tour El Poblado',
    description: 'Conoce el arte urbano de Medellín con guías expertos. Aprende sobre la transformación de la ciudad a través del arte callejero.',
    category: 'Cultura',
    price: 60000,
    duration: 2.5,
    maxCapacity: 20,
    availableSpots: 15,
    rating: 4.7,
    city: 'Medellín',
    meetingPoint: 'Parque El Poblado',
    date: '2026-05-18',
    time: '15:00',
    schedules: [
      { id: 'sch-005-1', startTime: '15:00', endTime: '17:30', availableSpots: 15, maxCapacity: 20 },
      { id: 'sch-005-2', startTime: '18:00', endTime: '20:30', availableSpots: 18, maxCapacity: 20 },
    ],
    images: ['https://images.unsplash.com/photo-1551282642-8f89255a611a?w=800'],
    agencyId: 'agency-001',
    status: 'Activo',
  },
];

// Mock Users
export const mockUsers: { [email: string]: User & { password: string } } = {
  'carlos.restrepo@gmail.com': {
    id: 'user-001',
    name: 'Carlos Restrepo',
    email: 'carlos.restrepo@gmail.com',
    password: 'password123',
    role: 'Turista',
    phone: '+57 300 123 4567',
    status: 'Activo',
  },
  'explora@medellin.com': {
    id: 'agency-001',
    name: 'Explora Medellín S.A.S',
    email: 'explora@medellin.com',
    password: 'password123',
    role: 'Agencia',
    phone: '+57 300 987 6543',
    status: 'Activo',
  },
  'aventuras@paisa.com': {
    id: 'agency-002',
    name: 'Aventuras Paisa',
    email: 'aventuras@paisa.com',
    password: 'password123',
    role: 'Agencia',
    phone: '+57 300 111 2222',
    status: 'Pendiente',
  },
  'valentina.ospina@guia.com': {
    id: 'guide-001',
    name: 'Valentina Ospina',
    email: 'valentina.ospina@guia.com',
    password: 'password123',
    role: 'Guía',
    phone: '+57 310 555 8888',
    status: 'Activo',
  },
  'admin@turistgo.com': {
    id: 'admin-001',
    name: 'Administrador TuristGo',
    email: 'admin@turistgo.com',
    password: 'admin123',
    role: 'Administrador',
    status: 'Activo',
  },
};

// Mock Reservations
export const mockReservations: Reservation[] = [
  {
    id: 'RES-2026-001',
    tourId: 'tour-001',
    userId: 'user-001',
    date: '2026-05-15',
    scheduleId: 'sch-001-1',
    startTime: '09:00',
    endTime: '13:00',
    status: 'Confirmada',
    price: 80000,
    invoiceId: 'FAC-2026-001',
  },
  {
    id: 'RES-2026-002',
    tourId: 'tour-003',
    userId: 'user-001',
    date: '2026-05-16',
    scheduleId: 'sch-003-1',
    startTime: '08:00',
    endTime: '14:00',
    status: 'Confirmada',
    price: 120000,
    invoiceId: 'FAC-2026-002',
  },
  {
    id: 'RES-2026-003',
    tourId: 'tour-004',
    userId: 'user-001',
    date: '2026-04-10',
    scheduleId: 'sch-004-1',
    startTime: '10:00',
    endTime: '13:00',
    status: 'Completada',
    price: 95000,
    invoiceId: 'FAC-2026-003',
  },
];

// Mock Guides
export const mockGuides: Guide[] = [
  {
    id: 'guide-001',
    name: 'Valentina Ospina',
    email: 'valentina.ospina@guia.com',
    documentId: '1234567890',
    certificateNumber: 'CERT-2024-00456',
    certificateExpiry: '2026-12-31',
    certificateFile: 'certificate-001.pdf',
    agencyId: 'agency-001',
    status: 'Activo',
    unavailablePeriods: [],
  },
  {
    id: 'guide-002',
    name: 'Juan Pérez',
    email: 'juan.perez@guia.com',
    documentId: '0987654321',
    certificateNumber: 'CERT-2024-00789',
    certificateExpiry: '2026-06-30',
    certificateFile: 'certificate-002.pdf',
    agencyId: 'agency-001',
    status: 'Activo',
    unavailablePeriods: [],
  },
];

// Mock Vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: 'vehicle-001',
    plate: 'ABC-123',
    brand: 'Toyota',
    model: 'HiAce',
    type: 'Van',
    color: 'Blanco',
    capacity: 15,
    agencyId: 'agency-001',
    status: 'Disponible',
  },
  {
    id: 'vehicle-002',
    plate: 'XYZ-789',
    brand: 'Chevrolet',
    model: 'NPR',
    type: 'Buseta',
    color: 'Gris',
    capacity: 8,
    agencyId: 'agency-001',
    status: 'Disponible',
  },
  {
    id: 'vehicle-003',
    plate: 'DEF-456',
    brand: 'Ford',
    model: 'Transit',
    type: 'Van',
    color: 'Plateado',
    capacity: 12,
    agencyId: 'agency-001',
    status: 'Disponible',
  },
];

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'FAC-2026-001',
    reservationId: 'RES-2026-001',
    tourId: 'tour-001',
    userId: 'user-001',
    date: '2026-05-10',
    amount: 80000,
    status: 'Emitida',
    type: 'Auto',
  },
  {
    id: 'FAC-2026-002',
    reservationId: 'RES-2026-002',
    tourId: 'tour-003',
    userId: 'user-001',
    date: '2026-05-10',
    amount: 120000,
    status: 'Emitida',
    type: 'Auto',
  },
  {
    id: 'FAC-2026-003',
    reservationId: 'RES-2026-003',
    tourId: 'tour-004',
    userId: 'user-001',
    date: '2026-04-05',
    amount: 95000,
    status: 'Emitida',
    type: 'Auto',
  },
  {
    id: 'FAC-2026-004',
    reservationId: 'RES-2026-001',
    tourId: 'tour-001',
    userId: 'user-001',
    date: '2026-03-15',
    amount: 80000,
    status: 'Anulada',
    type: 'Auto',
  },
];