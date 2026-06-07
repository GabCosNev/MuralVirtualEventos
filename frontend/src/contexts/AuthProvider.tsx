import { useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { AuthContext } from './AuthContext';

interface AuthState {
  user: User | null;
  token: string | null;
}

function getInitialAuth(): AuthState {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if(storedToken && storedUser) {
    const payload = JSON.parse(atob(storedToken.split('.')[1])) as {exp: number};
    const isExpired = payload.exp * 1000 < Date.now();

  if(isExpired){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {token: null, user: null}
  }
  return {
    token: storedToken,
    user: JSON.parse(storedUser) as User
  }
  }
  return { token: null, user: null };
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(getInitialAuth);

   function login(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null });
  }
return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        token: auth.token,
        login,
        logout,
        isAdmin: auth.user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}





