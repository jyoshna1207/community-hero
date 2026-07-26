import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('community_hero_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    // Pure frontend mock user
    const dummyUser = {
      name: email ? email.split('@')[0] : 'Jyoshna',
      email: email || 'jyoshna@example.com',
      role: 'Community Member',
      createdAt: '2026-07-01',
      phone: '+91 9876543210',
      location: 'Visakhapatnam, Andhra Pradesh',
      occupation: 'Student',
    };

    setUser(dummyUser);
    localStorage.setItem('community_hero_user', JSON.stringify(dummyUser));

    // Always returns success so Login.jsx redirects immediately
    return { success: true, user: dummyUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('community_hero_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);