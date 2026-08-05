// File path: src/context/AuthContext.jsx

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

export const AuthProvider = ({ children }) => {
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
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('hero_user');
    localStorage.removeItem('hero_role');
    localStorage.removeItem('hero_auth');
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, isLoading, login, logout, register }}>
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