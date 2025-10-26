import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const login = (password) => {
    if (password === "biblio@241") {
      setIsAuthorized(true);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ isAuthorized, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
