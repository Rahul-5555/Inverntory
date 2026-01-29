import React from "react";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const shopName = localStorage.getItem("shopName");

    if (token && shopName) {
      setUser({ shopName });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("shopName", data.shopName);
    setUser({ shopName: data.shopName });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("shopName");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
