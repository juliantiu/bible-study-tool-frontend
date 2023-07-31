import { useNavigate } from 'react-router-dom';
import useWindowManager from "../../../hooks/useWindowManager";
import { SearchWindow, WindowType } from "../../../types/Windows";

interface SearchNavbarProps {
  currWindow: SearchWindow;
}

export default function SearchNavbar({ currWindow }: SearchNavbarProps) {

  const { findNextAvailableWindow, removeWindow } = useWindowManager();
  const navigate = useNavigate();
  
  const nextAvailableWindow = findNextAvailableWindow(currWindow);

  const onRemoveWindow = () => {
    removeWindow(currWindow);

    navigate(`/window/${nextAvailableWindow!.windowId+1}/${WindowType[nextAvailableWindow!.windowType]}`);

  }

  return (
    <div className="window-navbar">
      <h1>SEARCH</h1>
      <button className="window-navbar-close-button" onClick={onRemoveWindow} disabled={currWindow.windowId === nextAvailableWindow?.windowId}>X</button>
    </div>
  );
}