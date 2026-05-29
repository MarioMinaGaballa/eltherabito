import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar              from './components/Navbar/Navbar';
import Home                from './pages/Home/Home';
import Login               from './pages/Login/Login';
import Chat                from './pages/Chat/Chat';
import Dashboard           from './pages/Dashboard/Dashboard';
import DailyAgenda         from './pages/DailyAgenda/DailyAgenda';
import DisplayPreferences  from './pages/DisplayPreferences/DisplayPreferences';
import AdminDashboard      from './pages/AdminDashboard/AdminDashboard';
import SignUp            from './pages/Signup/Signup';

const NO_NAVBAR = ['/chat', '/dashboard', '/agenda', '/display-preferences', '/admin' ,'/login', '/signup'];

function Layout() {
  const location = useLocation();
  const showNavbar = !NO_NAVBAR.includes(location.pathname);
  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* All users */}
        <Route path="/"                    element={<Home />} />
        <Route path="/signup"              element={<SignUp />} />
        <Route path="/login"               element={<Login />} />
        <Route path="/chat"                element={<Chat />} />
        <Route path="/dashboard"           element={<Dashboard />} />
        <Route path="/display-preferences" element={<DisplayPreferences />} />

        {/* Therapist only */}
        <Route path="/agenda"              element={<DailyAgenda />} />

        {/* Admin only */}
        <Route path="/admin"               element={<AdminDashboard />} />
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