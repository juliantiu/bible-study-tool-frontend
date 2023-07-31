import { createContext, ReactNode, useCallback, useState } from "react";
import useGlobalFeaturesConfiguration from "../hooks/useGlobalfeaturesConfiguration";
import { SearchSettingsVerseOrder, SearchType } from "../types/Searching";
import { SearchWindow, Window, WindowType } from '../types/Windows'

interface IWindowManagerContext {
  windows: Window[];
  addWindow: (window: Window) => void;
  findNextAvailableWindow: (currWindow: Window) => Window | undefined;
  removeWindow: (window: Window) => void;
  updateWindow: (window: Window) => void;
}

export const WindowManagerContext = createContext<IWindowManagerContext>({
  windows: [],
  addWindow: () => undefined,
  findNextAvailableWindow: (currWindow: Window) => undefined,
  removeWindow: (window: Window) => undefined,
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

  const findNextAvailableWindow = useCallback(
    (currWindow: Window) => {

      if (windows.length === 1) {
        // currWindow is the only window
        return currWindow;
      }

      const currWindowIdx =
        windows.findIndex(win => win.windowId
                              === currWindow.windowId);

      if (currWindowIdx === 0) {
        return windows[currWindowIdx+1];
      }

      return windows[currWindowIdx-1];
    },
    [windows]
  );

  const removeWindow = useCallback(
    (window: Window) => {
      setWindows(prev => prev.filter(x => x.windowId !== window.windowId));
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
        findNextAvailableWindow,
        removeWindow,
        updateWindow,
        windows
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}
