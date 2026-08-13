import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_BASE_URL = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("community_hero_token") || null
  );

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("community_hero_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Restore login session
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

        localStorage.setItem(
          "community_hero_user",
          JSON.stringify(res.data)
        );
      } catch (error) {
        console.error("Session restore failed:", error);

        setToken(null);
        setUser(null);

        localStorage.removeItem("community_hero_token");
        localStorage.removeItem("community_hero_user");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);


  // Login
  const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });

    const { token: jwtToken, ...userData } = res.data;

    setToken(jwtToken);
    setUser(userData);

    localStorage.setItem("community_hero_token", jwtToken);
    localStorage.setItem(
      "community_hero_user",
      JSON.stringify(userData)
    );

    let redirectPath = "/dashboard";

    switch ((userData.role || "").toLowerCase()) {
      case "admin":
      case "administrator":
        redirectPath = "/admin/dashboard";
        break;

      case "officer":
      case "ward_officer":
        redirectPath = "/officer/dashboard";
        break;

      case "department":
      case "department_officer":
        redirectPath = "/department/dashboard";
        break;

      default:
        redirectPath = "/dashboard";
    }

    return {
      success: true,
      user: userData,
      redirectPath,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Login failed",
    };
  }
};
  // Register
  const register = async (nameOrData, emailArg, passwordArg, roleArg = "citizen") => {
    let name, email, password, role;
    if (typeof nameOrData === "object" && nameOrData !== null) {
      name = nameOrData.name || nameOrData.fullName;
      email = nameOrData.email;
      password = nameOrData.password;
      role = nameOrData.role || "citizen";
    } else {
      name = nameOrData;
      email = emailArg;
      password = passwordArg;
      role = roleArg || "citizen";
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/register`, {
        name,
        email,
        password,
        role: (role || "citizen").toLowerCase(),
      });

      const { token: jwtToken, ...userData } = res.data;

      setToken(jwtToken);
      setUser(userData);

      localStorage.setItem("community_hero_token", jwtToken);
      localStorage.setItem("community_hero_user", JSON.stringify(userData));

      return {
        success: true,
        user: userData,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };


  // Update Profile
  const updateProfile = async (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("community_hero_user", JSON.stringify(newUser));

    if (token) {
      try {
        const res = await axios.put(`${API_BASE_URL}/profile`, updatedData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data) {
          setUser(res.data);
          localStorage.setItem("community_hero_user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("API update profile error:", err);
      }
    }
    return { success: true, user: newUser };
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem(
      "community_hero_token"
    );

    localStorage.removeItem(
      "community_hero_user"
    );
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};