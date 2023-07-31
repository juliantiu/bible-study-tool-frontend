import useWindowManager from '../../../hooks/useWindowManager';
import { MemorizeWindow } from '../../../types/Windows';
import './index.css';

interface MemorizeNavbarPorps {
  currWindow: MemorizeWindow;
}

export default function MemorizeNavbar({ currWindow }: MemorizeNavbarPorps) {

  const { removeWindow } = useWindowManager();

  return (
    <div className="window-navbar">
      <h1>MEMORIZE</h1>
      <button className="window-navbar-close-button" onClick={() => removeWindow(currWindow)}>X</button>
    </div>
  );
}