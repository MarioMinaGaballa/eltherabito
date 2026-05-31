import { FaHome, FaRobot, FaCalendar, FaBrain } from 'react-icons/fa';

export const BRAND = {
  name: 'Eltherabito',
  tagline: 'Mental Wellness',
  portalTagline: 'Patient Portal',
  adminTagline: 'Admin Portal',
};

export const PATIENT_NAV = [
  { id: 'dashboard', label: 'Home', Icon: FaHome, path: '/dashboard' },
  { id: 'chat', label: 'AI Support', Icon: FaRobot, path: '/chat' },
  { id: 'booking', label: 'Booking', Icon: FaCalendar, path: '/book-appointment' },
];

export function getPatientActiveNav(pathname) {
  if (pathname === '/chat') return 'chat';
  if (pathname === '/book-appointment' || pathname === '/confirm-session' || pathname === '/my-booking') {
    return 'booking';
  }
  if (pathname === '/display-preferences') return 'settings';
  if (pathname.startsWith('/patient-profile') || pathname.startsWith('/edit-profile')) {
    return 'profile';
  }
  return 'dashboard';
}

export const THERAPIST_BRAND = {
  name: 'ELTHERABITO',
  Icon: FaBrain,
};
