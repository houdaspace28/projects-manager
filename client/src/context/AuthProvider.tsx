import { useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");

    if (token && email && userId) {
      return { token, email, userId };
    }
    return null;
  });

 const login = (userData: User) => {
   localStorage.setItem("token", userData.token);
   localStorage.setItem("email", userData.email);
   localStorage.setItem("userId", userData.userId);
   setUser(userData);
 };

 const logout = () => {
   localStorage.removeItem("token");
   localStorage.removeItem("email");
   localStorage.removeItem("userId");
   setUser(null);
 };

  return (
    <AuthContext.Provider value={{user,isAuthenticated: !!user,login,logout,}}>
      {children}
    </AuthContext.Provider>
  );
}