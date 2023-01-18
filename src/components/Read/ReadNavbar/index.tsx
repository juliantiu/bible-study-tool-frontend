import { useRef } from 'react';
import './index.css';

export default function ReadNavbar() {
  const verseNavigatorExpansion: any = useRef();

  const onVerseNavigatorHover = () => {
    verseNavigatorExpansion.current.style.height = '300px';
    verseNavigatorExpansion.current.style.display = 'flex';
  }

  const onVerseNavigatorHoverLeave = () => {
    verseNavigatorExpansion.current.style.height = '0px';
    verseNavigatorExpansion.current.style.display = 'none';
  }

  return (
    <div className="window-navbar">
      <h1>READ</h1>
      <div id="verse-navigator" onMouseEnter={onVerseNavigatorHover} onMouseLeave={onVerseNavigatorHoverLeave}>
        <div className="verse-navigator-dot"/>
        <div className="verse-navigator-dot"/>
        <div className="verse-navigator-dot"/>
        <div id="verse-navigator-expansion" ref={verseNavigatorExpansion}>
          <div className="verse-navigator-option">B</div>
          <div className="verse-navigator-option">C</div>
          <div className="verse-navigator-option">V</div>
        </div>
      </div>
    </div>
  );
}