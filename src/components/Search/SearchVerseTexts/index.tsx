import './index.css';
import { Col, Row } from "react-bootstrap";
import { BibleVerse } from "../../../types/BibleContents";
import { useEffect, useRef } from 'react';

interface ISearchVerseTexts {
  requestFullBibleBookName: (keyword: string) => string;
  setZoom: React.Dispatch<React.SetStateAction<boolean>>;
  verses: BibleVerse[];
  zoom: boolean;
}

export default function SearchVerseTexts({ requestFullBibleBookName, setZoom, verses, zoom }: ISearchVerseTexts) {
  const containerPrimaryRef = useRef<any>();
  const containerSecondaryRef = useRef<any>();
  const zoomInButtonRef = useRef<any>();

  const onZoomClicked = () => {
    setZoom(prev => !prev);
  }

  useEffect(
    () => {
      if (!containerSecondaryRef.current) return;

      const primaryRef = containerPrimaryRef.current as HTMLDivElement;
      const secondaryRef = containerSecondaryRef.current as HTMLDivElement;
      const zoomButtonRef = zoomInButtonRef.current as HTMLButtonElement;

      if (zoom) {
        primaryRef.style.padding = '15px'
        primaryRef.style.borderTopLeftRadius = '20px';
        primaryRef.style.borderTopRightRadius = '20px';

        secondaryRef.style.height = '623px';
        zoomButtonRef.style.top = '25px';
      } else {
        primaryRef.style.padding = '0px 15px 15px 15px'
        primaryRef.style.borderTopLeftRadius = '0px';
        primaryRef.style.borderTopRightRadius = '0px';

        secondaryRef.style.height = '354.5px';
      }
    },
    [containerPrimaryRef, containerSecondaryRef, zoom, zoomInButtonRef]
  )

  const displayVerses = verses.map(
    (verse, idx) => {
      
      return (
        <div
          key={`search-result-display-verse-${verse.bibleBook}-${verse.bookChapter}-${verse.chapterVerseNumber}-${idx}`}
          className="search-result-display-verse"
        >
          <p>{requestFullBibleBookName(`${verse.bibleBook} ${verse.bookChapter}:${verse.chapterVerseNumber}`)}</p>{' '}
          <p>{verse.text}</p>
        </div>
      );
    }
  );

  return (
    <Row>
      <Col xs={12}>
        <div id="search-display-verses-container-primary" ref={containerPrimaryRef}>
          {!zoom && <button id="zoom-out-button" className="zoom-in-out-button" onClick={onZoomClicked}>&#8599;</button>}
          {zoom && <button id="zoom-in-button" ref={zoomInButtonRef} className="zoom-in-out-button" onClick={onZoomClicked}>&#8601;</button>}
          <div id="search-display-verses-container-secondary" ref={containerSecondaryRef}>
            {displayVerses}
          </div>
        </div>
      </Col>
    </Row>
  );
}