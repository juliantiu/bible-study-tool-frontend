import './index.css';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Window, WindowType } from '../../types/Windows'; 
import useWindowManager from '../../hooks/useWindowManager';

export default function Footer() {
  const navigation = useNavigate();
  const { windows } = useWindowManager();

  const onWindowNavigateClick = useCallback(
    (window: Window) => {
      navigation(`/window/${WindowType[window.windowType]}/${window.windowId + 1}`);
    },
    [navigation]
  );

  const windowButtons = windows.map(
    window => {
      return (
        <button
          key={`${window.windowType}-${window.windowId}`}
          onClick={() => onWindowNavigateClick(window)}>
            {window.windowId + 1}
        </button>
      );
    }
  );

  return (
    <div id="footer">
      {windowButtons}
      <button>+</button>
    </div>
  )
}
