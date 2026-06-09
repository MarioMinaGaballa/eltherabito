import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('eltherabito-user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  function login(userData, token) {
    const data = { ...userData, token };
    setUser(data);
    localStorage.setItem('eltherabito-user', JSON.stringify(data));
    localStorage.setItem('eltherabito-token', token);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('eltherabito-user');
    localStorage.removeItem('eltherabito-token');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}