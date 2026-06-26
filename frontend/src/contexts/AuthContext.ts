import { createContext } from "react";
import type { User } from "../types";

export interface AuthContextData {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isAdmin: boolean;
}

export const AuthContext = createContext({} as AuthContextData);
