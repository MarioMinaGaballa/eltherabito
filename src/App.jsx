import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup/Signup';
import Login  from './pages/Login/Login';

const Home      = () => <h1>Home Page</h1>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/login"     element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}