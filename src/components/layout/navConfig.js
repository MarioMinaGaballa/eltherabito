import { FaHome, FaRobot, FaCalendar, FaBrain } from 'react-icons/fa';
import { ROUTES } from '../../routes/paths';

export const BRAND = {
  name: 'Eltherabito',
  tagline: 'Mental Wellness',
  portalTagline: 'Patient Portal',
  adminTagline: 'Admin Portal',
};

export const PATIENT_NAV = [
  { id: 'dashboard', label: 'Home', Icon: FaHome, path: ROUTES.patient.dashboard },
  { id: 'chat', label: 'AI Support', Icon: FaRobot, path: ROUTES.patient.chat },
  { id: 'booking', label: 'Booking', Icon: FaCalendar, path: ROUTES.patient.booking },
];

export function getPatientActiveNav(pathname) {
  if (pathname === ROUTES.patient.chat || pathname === '/chat') return 'chat';
  if (
    pathname.startsWith('/patient/booking')
    || pathname === '/book-appointment'
    || pathname === '/confirm-session'
    || pathname.startsWith('/patient/bookings')
    || pathname === '/my-booking'
  ) {
    return 'booking';
  }
  if (pathname === ROUTES.patient.settings || pathname === '/display-preferences') return 'settings';
  if (
    pathname.startsWith('/patient/profile')
    || pathname === '/patient-profile'
    || pathname === '/edit-profile'
  ) {
    return 'dashboard';
  }
  return 'dashboard';
}

export const THERAPIST_BRAND = {
  name: 'ELTHERABITO',
  Icon: FaBrain,
};
