import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import useGlobalFeaturesConfiguration from "../hooks/useGlobalfeaturesConfiguration";
import { ReadWindow, Window, WindowType } from '../types/Windows'

interface IWindowManagerContext {
  windows: Window[];
  addWindow: (window: Window) => void;
  removeWindow: () => void;
  updateWindow: (window: Window) => void;
}

export const WindowManagerContext = createContext<IWindowManagerContext>({
  windows: [],
  addWindow: () => undefined,
  removeWindow: () => undefined,
  updateWindow: () => undefined
});

interface WindowManagerContextProviderProps {
  children: ReactNode;
}

export function WindowManagerContextProvider({ children }: WindowManagerContextProviderProps) {
  const { defaultLanguage: language, defaultBibleVersion: bibleVersion } = useGlobalFeaturesConfiguration();
  const [windows, setWindows] = useState<Window[]>(
    () => {
      const defaultWindow: ReadWindow = {
        language,
        bibleVersion,
        windowId: 0,

        windowType: WindowType.read,
        bookKey: 'GEN',
        bookName: 'Genesis',
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

  const updateWindow = useCallback(
    (window: Window) => {
      setWindows(prev => {
        const prevCopy = [...prev];
        let matchingWindowIdx = prevCopy.findIndex(w => w.windowId === window.windowId);

        if (!matchingWindowIdx) return prev;
        
        prevCopy[matchingWindowIdx] = {...window};
        
        return prevCopy; 
      });
    },
    [setWindows]
  );

  return (
    <WindowManagerContext.Provider
      value={{
        addWindow,
        removeWindow,
        updateWindow,
        windows
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}
