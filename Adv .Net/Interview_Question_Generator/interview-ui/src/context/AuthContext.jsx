import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("name");

    return role ? { role, userId, name } : null;
  });

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const { token, role, userId, name } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);
    localStorage.setItem("name", name);

    setUser({ role, userId, name });

    return role;
  };

  const register = async (data) => {
    await api.post("/auth/register", data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ login, register, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
