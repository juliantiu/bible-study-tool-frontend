import { createContext, ReactNode } from "react";

interface IBackendConnectionContext {
  domain: string;
  port: string;
  protocol: string;
}

export const BackendConnectionContext = createContext<IBackendConnectionContext>({
  domain: '',
  port: '',
  protocol: ''
});

interface BackendConntectionContextProviderProps {
  children: ReactNode;
}

export function BackendConnectionContextProvider({ children }: BackendConntectionContextProviderProps) {
  let domain = 'localhost:5000';
  let port = '5000';
  const protocol = 'https';

  if (process.env.NODE_ENV === 'production') {
    domain = '';
    port = '';
  }

  return (
    <BackendConnectionContext.Provider
      value={{
        domain,
        port,
        protocol
      }}
    >
      {children}
    </BackendConnectionContext.Provider>
  );
}
