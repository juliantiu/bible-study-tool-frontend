import { createContext, ReactNode, useCallback, useState } from "react";
import useGlobalFeaturesConfiguration from "../hooks/useGlobalfeaturesConfiguration";
import { SearchSettingsVerseOrder, SearchType } from "../types/Searching";
import { SearchWindow, Window, WindowType } from '../types/Windows'

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
      const defaultWindow: SearchWindow = {
        language,
        bibleVersion,
        bibleContents: undefined,
        windowId: 0,
        windowType: WindowType.search,

        activeSearchType: SearchType.verses,
        rawVerseSearch: '',
        rawKeywordSearch: '',
        searchSettings: {
          removeDuplicates: true,
          verseOrder: SearchSettingsVerseOrder.default
        },
        verses: []
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

        if (matchingWindowIdx < 0) return prev;
        
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
