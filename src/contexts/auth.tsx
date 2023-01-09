import { createContext, ReactNode, useCallback } from "react";

interface IAuthContext {
  login: () => void;
  logout: () => void;
  register: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  login: () => undefined,
  logout: () => undefined,
  register: () => undefined
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  
    const login = useCallback(
      () => {
        console.log('login');
      },
      []
    );
  
    const logout = useCallback(
      () => {
        console.log('logout');
      },
      []
    );

  const register = useCallback(
    () => {
      console.log('register');
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
