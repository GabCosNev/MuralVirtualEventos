import { createContext } from "react";
import type { User } from "../types";

export interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  isAdmin: boolean;
}

export const AuthContext = createContext({} as AuthContextData);
