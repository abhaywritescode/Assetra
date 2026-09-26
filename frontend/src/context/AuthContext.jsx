import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const bootRef = React.useRef(false);

  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;

    const bootSession = async () => {
      try {
        const refreshRes = await api.post('/api/auth/refresh');
        const { accessToken } = refreshRes.data;
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        const meRes = await api.get('/api/auth/me');
        setUser(meRes.data.user || meRes.data);
      } catch (error) {
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    bootSession();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { accessToken, user: userData } = res.data;
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setUser(userData);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    const { accessToken, user: userData } = res.data;
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setUser(userData);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);