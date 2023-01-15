import './index.css';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { Window, WindowType } from '../../types/Windows'; 
import useWindowManager from '../../hooks/useWindowManager';
import NewWindowPopup from './NewWindowPopup';

export default function Footer() {
  const navigation = useNavigate();
  const { windows } = useWindowManager();
  const [showNewWindowPopup, setShowNewWindowPopup] = useState(false);

  const onNewWindowButtonClick = useCallback(() => setShowNewWindowPopup(true), [setShowNewWindowPopup]);
  const onNewWindowButtonClose = useCallback(() => setShowNewWindowPopup(false), [setShowNewWindowPopup]);

  const onWindowNavigateClick = useCallback(
    (window: Window) => {
      navigation(`/window/${window.windowId + 1}/${WindowType[window.windowType]}`);
    },
    [navigation]
  );

  const windowButtons = windows.map(
    window => {
      return (
        <button
          key={`${window.windowType}-${window.windowId}`}
          onClick={() => onWindowNavigateClick(window)}
        >
            {window.windowType === WindowType.read && <>&#x1f4d6;</>}
            {window.windowType === WindowType.search && <>&#128269;</>}
            {window.windowType === WindowType.memorize && <>&#129504;</>}
        </button>
      );
    }
  );

  return (
    <div id="footer">
      <NewWindowPopup numWindows={windows.length} show={showNewWindowPopup} onClose={onNewWindowButtonClose}/>
      {windowButtons}
      <button onClick={onNewWindowButtonClick}>+</button>
    </div>
  )
}
