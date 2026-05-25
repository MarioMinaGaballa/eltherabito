import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar     from './components/Navbar/Navbar';
import Home       from './pages/Home/Home';
import Signup     from './pages/Signup/Signup';
import Login      from './pages/Login/Login';
import Chat       from './pages/Chat/Chat';
import Dashboard  from './pages/Dashboard/Dashboard';

// صفحات من غير Navbar
const NO_NAVBAR = ['/chat', '/dashboard',];
function Layout() {
  const location = useLocation();
  const showNavbar = !NO_NAVBAR.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/chat"      element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard />} />
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