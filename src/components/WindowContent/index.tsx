import { useParams } from 'react-router-dom';
import useWindowManager from '../../hooks/useWindowManager';
import { MemorizeWindow, SearchWindow, WindowType } from '../../types/Windows';
import Read from '../Read';
import Memorize from '../Memorize';
import Search from '../Search';
import { useEffect, useMemo, useRef } from 'react';
import Search2 from '../Search/Search2';
import Memorize2 from '../Memorize/Memorize2';

export default function WindowContent() {
  const { windowId } = useParams(); 
  const { windows, updateWindow } = useWindowManager();

  const toggle = useRef(true);
  
  const currWindow = windows.find(window => { 
    return window.windowId+1 === +windowId!
  });

  useEffect(
    () => {
      toggle.current = !toggle.current;
    },
    [windowId]
  );

  // A little trick so that when changing from search window to search window,
  // it will trigger a render of eith a Search component or Search2 component.
  // So that the useEffect on unmount will work when switching from seach window to search window.
  // The same goes for read and memorize windows.
  const ret = useMemo(
    () => {
      if (toggle.current) {
        return (
          <>
            {currWindow?.windowType === WindowType.read && <Read />}
            {currWindow?.windowType === WindowType.search && <Search2 currWindow={currWindow as SearchWindow} updateWindow={updateWindow}/>}
            {currWindow?.windowType === WindowType.memorize && <Memorize2 currWindow={currWindow as MemorizeWindow} updateWindow={updateWindow}/>}
          </>
        );
      } else {
        return (
          <>
            {currWindow?.windowType === WindowType.read && <Read />}
            {currWindow?.windowType === WindowType.search && <Search currWindow={currWindow as SearchWindow} updateWindow={updateWindow}/>}
            {currWindow?.windowType === WindowType.memorize && <Memorize currWindow={currWindow as MemorizeWindow} updateWindow={updateWindow}/>}
          </>
        );
      }
    },
    [toggle, updateWindow, windowId]
  );
    
  return ret;
}