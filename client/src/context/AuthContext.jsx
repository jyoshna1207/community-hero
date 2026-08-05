<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
=======
// File path: src/context/AuthContext.jsx
>>>>>>> 611f9a8 (completed dashboard and role-based ui)

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, ROLE_REDIRECTS } from '../constants/roles';

const AuthContext = createContext(null);

// Dummy user database for mock authentication
const DUMMY_USERS = [
  { id: 1, name: 'John Citizen', email: 'citizen@hero.com', password: 'password', role: ROLES.CITIZEN },
  { id: 2, name: 'Officer Smith', email: 'officer@hero.com', password: 'password', role: ROLES.WARD_OFFICER },
  { id: 3, name: 'Dept Head Jones', email: 'dept@hero.com', password: 'password', role: ROLES.DEPARTMENT },
  { id: 4, name: 'Admin Boss', email: 'admin@hero.com', password: 'password', role: ROLES.ADMIN },
];

const API_BASE_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
<<<<<<< HEAD
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
=======
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on page refresh from Local Storage
  useEffect(() => {
    const storedUser = localStorage.getItem('hero_user');
    const storedRole = localStorage.getItem('hero_role');
    const storedAuth = localStorage.getItem('hero_auth');

    if (storedAuth === 'true' && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(storedRole || parsedUser.role || '');
        setIsAuthenticated(true);
      } catch (e) {
        // Fallback if local storage was somehow corrupted
        localStorage.removeItem('hero_user');
        localStorage.removeItem('hero_role');
        localStorage.removeItem('hero_auth');
      }
    }
    setIsLoading(false);
  }, []);

  
  const login = (email, password) => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const foundUser = DUMMY_USERS.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
          );

          if (foundUser) {
            const roleString = typeof foundUser.role === 'string' 
              ? foundUser.role.toLowerCase() 
              : (foundUser.role?.name || 'citizen').toLowerCase();

            const normalizedUser = { ...foundUser, role: roleString };
            delete normalizedUser.password;

            setUser(normalizedUser);
            setRole(roleString);
            setIsAuthenticated(true);

            localStorage.setItem('hero_user', JSON.stringify(normalizedUser));
            localStorage.setItem('hero_role', roleString);
            localStorage.setItem('hero_auth', 'true');

            setIsLoading(false);
            resolve({ success: true, redirectPath: ROLE_REDIRECTS[roleString] || '/dashboard' });
          } else {
            setIsLoading(false);
            reject(new Error('Invalid email or password. Try citizen@hero.com, officer@hero.com, dept@hero.com, or admin@hero.com with password "password".'));
          }
        } catch (error) {
          setIsLoading(false);
          reject(error);
        }
      }, 500);
    });
  };

  const register = (name, email, password, assignedRole = ROLES.CITIZEN) => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const roleString = typeof assignedRole === 'string' 
          ? assignedRole.toLowerCase() 
          : (assignedRole?.name || 'citizen').toLowerCase();

        const newUser = { id: Date.now(), name, email, role: roleString };
        setUser(newUser);
        setRole(roleString);
        setIsAuthenticated(true);

        localStorage.setItem('hero_user', JSON.stringify(newUser));
        localStorage.setItem('hero_role', roleString);
        localStorage.setItem('hero_auth', 'true');

        setIsLoading(false);
        resolve({ success: true, redirectPath: ROLE_REDIRECTS[roleString] || '/dashboard' });
      }, 500);
    });
>>>>>>> 611f9a8 (completed dashboard and role-based ui)
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
<<<<<<< HEAD
    localStorage.removeItem('community_hero_token');
    localStorage.removeItem('community_hero_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
=======
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('hero_user');
    localStorage.removeItem('hero_role');
    localStorage.removeItem('hero_auth');
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, isLoading, login, logout, register }}>
>>>>>>> 611f9a8 (completed dashboard and role-based ui)
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