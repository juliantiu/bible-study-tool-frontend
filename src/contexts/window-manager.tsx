import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { ReadWindow, Window, WindowType } from '../types/Windows'

interface IWindowManagerContext {
  windows: Window[];
  addWindow: (window: Window) => void;
  removeWindow: () => void;
}

export const WindowManagerContext = createContext<IWindowManagerContext>({
  windows: [],
  addWindow: () => undefined,
  removeWindow: () => undefined
});

interface WindowManagerContextProviderProps {
  children: ReactNode;
}

export function WindowManagerContextProvider({ children }: WindowManagerContextProviderProps) {
  const [windows, setWindows] = useState<Window[]>(
    () => {
      const defaultWindow: ReadWindow = {
        windowId: 0,
        windowType: WindowType.read,
        bookKey: 'default',
        bookName: 'default',
        chapterNumber: 1,
        verseNumber: 1
      };

      return [defaultWindow];
    }
  );

  const addWindow = useCallback(
    (window: Window) => {
      setWindows(prev => [...prev, window]);
    },
    [setWindows]
  );

  const removeWindow = useCallback(
    () => {
      setWindows(prev => [...prev.slice(0, -1)]);
    },
    [setWindows]
  );

  return (
    <WindowManagerContext.Provider
      value={{
        addWindow,
        removeWindow,
        windows
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}
