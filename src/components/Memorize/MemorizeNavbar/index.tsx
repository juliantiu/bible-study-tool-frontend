import { useNavigate } from 'react-router-dom';
import useWindowManager from '../../../hooks/useWindowManager';
import { MemorizeWindow, WindowType } from '../../../types/Windows';
import './index.css';

interface MemorizeNavbarPorps {
  currWindow: MemorizeWindow;
}

export default function MemorizeNavbar({ currWindow }: MemorizeNavbarPorps) {

  const { findNextAvailableWindow, removeWindow } = useWindowManager();
  const navigate = useNavigate();

  const nextAvailableWindow = findNextAvailableWindow(currWindow);

  const onRemoveWindow = () => {
    removeWindow(currWindow);
    navigate(`/window/${nextAvailableWindow!.windowId+1}/${WindowType[nextAvailableWindow!.windowType]}`);
  }

  return (
    <div className="window-navbar">
      <h1>MEMORIZE</h1>
      <button className="window-navbar-close-button" onClick={onRemoveWindow} disabled={currWindow.windowId === nextAvailableWindow?.windowId}>X</button>
    </div>
  );
}