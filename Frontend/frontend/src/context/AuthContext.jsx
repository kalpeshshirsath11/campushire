import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('campushire_token') || null);
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem('campushire_email');
    const role = localStorage.getItem('campushire_role');
    return email && role ? { email, role } : null;
  });
  const [firstLogin, setFirstLogin] = useState(() => {
    return localStorage.getItem('campushire_first_login') === 'true';
  });

  const login = (authToken, email, role, isFirstLogin) => {
    setToken(authToken);
    setUser({ email, role });
    setFirstLogin(isFirstLogin);

    localStorage.setItem('campushire_token', authToken);
    localStorage.setItem('campushire_email', email);
    localStorage.setItem('campushire_role', role);
    localStorage.setItem('campushire_first_login', String(isFirstLogin));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setFirstLogin(false);

    localStorage.removeItem('campushire_token');
    localStorage.removeItem('campushire_email');
    localStorage.removeItem('campushire_role');
    localStorage.removeItem('campushire_first_login');
  };

  const setPasswordChanged = () => {
    setFirstLogin(false);
    localStorage.setItem('campushire_first_login', 'false');
  };

  useEffect(() => {
    const handleLogoutEvent = () => {
      logout();
    };

    window.addEventListener('campushire_logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('campushire_logout', handleLogoutEvent);
    };
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, firstLogin, isAuthenticated, login, logout, setPasswordChanged }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
