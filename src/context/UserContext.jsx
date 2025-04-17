import React, { createContext, useContext, useState, useEffect } from "react";
import { logoutUser } from "../api/userAPI"; 

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ניסיון לשחזר משתמש מ-localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const sessionNumber = storedUser?.sessionNumber;
  
    if (sessionNumber) {
      try {
        await logoutUser(sessionNumber);
      } catch (err) {
        console.error("שגיאה בעת התנתקות מהשרת:", err);
      }
    }
  
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};