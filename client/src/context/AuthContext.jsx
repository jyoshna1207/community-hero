import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('community_hero_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('community_hero_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Restore user session on initial application mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        localStorage.setItem('community_hero_user', JSON.stringify(res.data));
      } catch (err) {
        console.error('Session restoration failed:', err);
        // Token invalid or expired
        setToken(null);
        setUser(null);
        localStorage.removeItem('community_hero_token');
        localStorage.removeItem('community_hero_user');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Login handler connected to Express Backend
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
      const { token: jwtToken, ...userData } = res.data;

      setToken(jwtToken);
      setUser(userData);

      localStorage.setItem('community_hero_token', jwtToken);
      localStorage.setItem('community_hero_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: errorMsg };
    }
  };

  // Register handler connected to Express Backend
  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
      const { token: jwtToken, ...userData } = res.data;

      setToken(jwtToken);
      setUser(userData);

      localStorage.setItem('community_hero_token', jwtToken);
      localStorage.setItem('community_hero_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (err) {
      console.error('Register error:', err);
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: errorMsg };
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('community_hero_token');
    localStorage.removeItem('community_hero_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);