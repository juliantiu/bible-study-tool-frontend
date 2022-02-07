import { createContext, ReactNode, useCallback } from "react";

interface IBibleReaderContext {
  login: () => void;
  logout: () => void;
  register: () => void;
}

export const BibleReaderContext = createContext<IBibleReaderContext>({
  login: () => undefined,
  logout: () => undefined,
  register: () => undefined
});

interface BibleReaderContextProviderProps {
  children: ReactNode;
}

export function BibleReaderContextProvider({ children }: BibleReaderContextProviderProps) {
  
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
    <BibleReaderContext.Provider
      value={{
        login,
        logout,
        register
      }}
    >
      {children}
    </BibleReaderContext.Provider>
  );
}
