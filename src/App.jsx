import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import Dashboard from "./pages/Dashboard/Dashboard";
import DailyAgenda from "./pages/DailyAgenda/DailyAgenda";
import DisplayPreferences from "./pages/DisplayPreferences/DisplayPreferences";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import SignUp from "./pages/Signup/Signup";
import AddDoctor from "./pages/AddDoctor/AddDoctor";
import PatientProfile from "./pages/PatientProfile/PatientProfile";
import EditProfile from "./pages/EditProfile/EditProfile";
import MyBookings from "./pages/MyBooking/MyBooking";
import BookAppointment from "./pages/BookAppointment/BookAppointment";
import ConfirmSession from "./pages/ConfirmSession/ConfirmSession";
import TherapistProfile from "./pages/TherapistProfile/TherapistProfile";
import EditSchedule from "./pages/EditSchedule/EditSchedule";
import TherapistUpdateProfile from "./pages/TherapistUpdateProfile/TherapistUpdateProfile";
import TherapistPatientView from "./pages/TherapistPatientView/TherapistPatientView";
import { ROUTES, LEGACY_REDIRECTS, shouldHideNavbar } from "./routes/paths";

function Layout() {
  const location = useLocation();
  const showNavbar = !shouldHideNavbar(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.signup} element={<SignUp />} />
        <Route path={ROUTES.login} element={<Login />} />

        {/* Patient */}
        <Route path={ROUTES.patient.dashboard} element={<Dashboard />} />
        <Route path={ROUTES.patient.chat} element={<Chat />} />
        <Route path={ROUTES.patient.profile} element={<PatientProfile />} />
        <Route path={ROUTES.patient.editProfile} element={<EditProfile />} />
        <Route path={ROUTES.patient.booking} element={<BookAppointment />} />
        <Route path={ROUTES.patient.bookingConfirm} element={<ConfirmSession />} />
        <Route path={ROUTES.patient.bookings} element={<MyBookings />} />
        <Route path={ROUTES.patient.settings} element={<DisplayPreferences />} />

        {/* Therapist */}
        <Route path={ROUTES.therapist.agenda} element={<DailyAgenda />} />
        <Route path={ROUTES.therapist.profile} element={<TherapistProfile />} />
        <Route path={ROUTES.therapist.editProfile} element={<TherapistUpdateProfile />} />
        <Route path={ROUTES.therapist.editSchedule} element={<EditSchedule />} />
        <Route path={ROUTES.therapist.viewPatient} element={<TherapistPatientView />} />

        {/* Admin */}
        <Route path={ROUTES.admin.home} element={<AdminDashboard />} />
        <Route path={ROUTES.admin.addDoctor} element={<AddDoctor />} />

        {/* Legacy redirects */}
        {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
