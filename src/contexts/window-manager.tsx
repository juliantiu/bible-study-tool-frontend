import { createContext, ReactNode, useState } from "react";
import { Window } from '../types/Windows'

interface IWindowManagerContext {
  windows: Window[]
}

export const WindowManagerContext = createContext<IWindowManagerContext>({
  windows: []
});

interface WindowManagerContextProviderProps {
  children: ReactNode;
}

export function WindowManagerContextProvider({ children }: WindowManagerContextProviderProps) {
  const [windows, setWindows] = useState([]);
  return (
    <WindowManagerContext.Provider
      value={{
        windows
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}
