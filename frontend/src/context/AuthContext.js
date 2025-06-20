import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  isAdmin: false,
  user: null, // user 객체 (id, username 등)
  setIsLoggedIn: () => {},
  setIsAdmin: () => {},
  setUser: () => {},
});
