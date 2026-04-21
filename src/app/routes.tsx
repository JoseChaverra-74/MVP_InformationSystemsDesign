import { createBrowserRouter, Navigate } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { RegisterTouristPage } from './pages/RegisterTouristPage';
import { RegisterAgencyPage } from './pages/RegisterAgencyPage';
import { ToursPublicPage } from './pages/ToursPublicPage';
import { TourDetailPage } from './pages/TourDetailPage';
import { TouristDashboard } from './pages/tourist/TouristDashboard';
import { TouristToursPage } from './pages/tourist/TouristToursPage';
import { TouristReservationsPage } from './pages/tourist/TouristReservationsPage';
import { TouristReservationDetailPage } from './pages/tourist/TouristReservationDetailPage';
import { TouristInvoicesPage } from './pages/tourist/TouristInvoicesPage';
import { TouristProfilePage } from './pages/tourist/TouristProfilePage';
import { AdminDashboard, AdminUsersPage, AdminServicesPage, AdminReportsPage } from './pages/admin';
import { AgencyDashboard, AgencyToursPage, AgencyCreateTourPage, AgencyGuidesPage, AgencyFleetPage, AgencyReservationsPage, AgencyInvoicesPage, AgencyAssignVehiclePage } from './pages/agency';
import { GuideDashboard, GuideToursPage, GuideAvailabilityPage } from './pages/guide';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/recuperar-contrasena',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/registro/turista',
    element: <RegisterTouristPage />,
  },
  {
    path: '/registro/agencia',
    element: <RegisterAgencyPage />,
  },
  {
    path: '/tours',
    element: <ToursPublicPage />,
  },
  {
    path: '/tours/:id',
    element: <TourDetailPage />,
  },
  // Tourist routes
  {
    path: '/turista',
    children: [
      { index: true, element: <Navigate to="/turista/inicio" replace /> },
      { path: 'inicio', element: <TouristDashboard /> },
      { path: 'tours', element: <TouristToursPage /> },
      { path: 'reservas', element: <TouristReservationsPage /> },
      { path: 'reservas/:id', element: <TouristReservationDetailPage /> },
      { path: 'facturas', element: <TouristInvoicesPage /> },
      { path: 'perfil', element: <TouristProfilePage /> },
    ],
  },
  // Agency routes
  {
    path: '/agencia',
    children: [
      { index: true, element: <Navigate to="/agencia/inicio" replace /> },
      { path: 'inicio', element: <AgencyDashboard /> },
      { path: 'tours', element: <AgencyToursPage /> },
      { path: 'tours/nuevo', element: <AgencyCreateTourPage /> },
      { path: 'tours/:tourId/asignar-vehiculo', element: <AgencyAssignVehiclePage /> },
      { path: 'guias', element: <AgencyGuidesPage /> },
      { path: 'flota', element: <AgencyFleetPage /> },
      { path: 'reservas', element: <AgencyReservationsPage /> },
      { path: 'facturas', element: <AgencyInvoicesPage /> },
    ],
  },
  // Guide routes
  {
    path: '/guia',
    children: [
      { index: true, element: <Navigate to="/guia/inicio" replace /> },
      { path: 'inicio', element: <GuideDashboard /> },
      { path: 'tours', element: <GuideToursPage /> },
      { path: 'disponibilidad', element: <GuideAvailabilityPage /> },
    ],
  },
  // Admin routes
  {
    path: '/admin',
    children: [
      { index: true, element: <Navigate to="/admin/inicio" replace /> },
      { path: 'inicio', element: <AdminDashboard /> },
      { path: 'usuarios', element: <AdminUsersPage /> },
      { path: 'servicios', element: <AdminServicesPage /> },
      { path: 'reportes', element: <AdminReportsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);