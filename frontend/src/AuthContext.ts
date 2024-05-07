// AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialAuthContext: AuthContextType = {
  isLoggedIn: false,
  setIsLoggedIn: () => {},
};

export const AuthContext = createContext<AuthContextType>(initialAuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check session on component mount
  useEffect(() => {
    const sessionCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("session="));

    if (sessionCookie) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
