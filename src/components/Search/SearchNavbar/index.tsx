import useWindowManager from "../../../hooks/useWindowManager";
import { SearchWindow } from "../../../types/Windows";

interface SearchNavbarProps {
  currWindow: SearchWindow;
}

export default function SearchNavbar({ currWindow }: SearchNavbarProps) {

  const { removeWindow } = useWindowManager();

  return (
    <div className="window-navbar">
      <h1>SEARCH</h1>
      <button className="window-navbar-close-button" onClick={() => removeWindow(currWindow)}>X</button>
    </div>
  );
}