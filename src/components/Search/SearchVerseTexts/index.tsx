import './index.css';
import { Accordion, Col, Row } from "react-bootstrap";
import { BibleVerse } from "../../../types/BibleContents";
import { useEffect, useRef, useState } from 'react';
import SearchVerseTextDisplaySettings from './SearchVerseTextDisplaySettings' 
import { SearchDisplayBothSettings, SearchDisplayRefTextSettings } from '../../../types/Searching';

interface ISearchVerseTexts {
  requestFullBibleBookName: (keyword: string) => string;
  setZoom: React.Dispatch<React.SetStateAction<boolean>>; 
  verses: BibleVerse[];
  zoom: boolean;
}

export default function SearchVerseTexts({ requestFullBibleBookName, setZoom, verses, zoom }: ISearchVerseTexts) {
  const [searchDisplayReferenceSettings, setSearchDisplayReferenceSettings] =
    useState<SearchDisplayRefTextSettings>({ bolded: true, fontSize: 11 });
  const [searchDisplayTextSettings, setSearchDisplayTextSettings] =
    useState<SearchDisplayRefTextSettings>({ bolded: false, fontSize: 11 });
  const [searchDisplayBothSettings, setSearchDisplayBothSettings] =
    useState<SearchDisplayBothSettings>({ fontColor: '#000000', newline: false });

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
  );

  const searchDisplayRefStyle = { 
    fontWeight: searchDisplayReferenceSettings.bolded ? 'bold' : 'normal',
    fontSize: `${searchDisplayReferenceSettings.fontSize}pt`,
    color: searchDisplayBothSettings.fontColor,
    display: searchDisplayBothSettings.newline ? 'block' : 'inline',
    marginBottom: searchDisplayBothSettings.newline ? '-5px' : '16px'
  };

  const searchDisplayTextStyle = {
    fontWeight: searchDisplayTextSettings.bolded ? 'bold' : 'normal',
    fontSize: `${searchDisplayTextSettings.fontSize}pt`,
    color: searchDisplayBothSettings.fontColor,
    display: searchDisplayBothSettings.newline ? 'block' : 'inline',
    marginBottom: searchDisplayBothSettings.newline ? '0px' : '16px'
  };

  const displayVerses = verses.map(
    (verse, idx) => {
      
      return (
        <div
          key={`search-result-display-verse-${verse.bibleBook}-${verse.bookChapter}-${verse.chapterVerseNumber}-${idx}`}
          className="search-result-display-verse"
        >
          <p className="search-display-reference" style={searchDisplayRefStyle}>{requestFullBibleBookName(`${verse.bibleBook} ${verse.bookChapter}:${verse.chapterVerseNumber}`)}</p>{' '}
          <p className="search-display-text" style={searchDisplayTextStyle}>{verse.text}</p>
        </div>
      );
    }
  );

  const zoomOutButton = (
    <button id="zoom-out-button" className="zoom-in-out-button" onClick={onZoomClicked}>
      <div className="zoom-in-out-out-button-div" />
    </button>
  );

  const zoomInButton = (
    <button id="zoom-in-button" ref={zoomInButtonRef} className="zoom-in-out-button" onClick={onZoomClicked}>
      <div className="zoom-in-out-in-button-div" />
    </button>
  );

  const displaySettingsAccordion = !zoom && (
    <Row>
      <Col xs={12}>
        <div id="search-display-verses-display-settings-container">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Display settings</Accordion.Header>
              <Accordion.Body>
                <SearchVerseTextDisplaySettings
                  searchDisplayReferenceSettings={searchDisplayReferenceSettings}
                  setSearchDisplayTextSettings={setSearchDisplayTextSettings}
                  searchDisplayTextSettings={searchDisplayTextSettings}
                  setSearchDisplayReferenceSettings={setSearchDisplayReferenceSettings}
                  searchDisplayBothSettings={searchDisplayBothSettings}
                  setSearchDisplayBothSettings={setSearchDisplayBothSettings}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </Col>
    </Row>
  );

  return (
    <Row>
      <Col xs={12}>
        {displaySettingsAccordion}
        <Row>
          <Col xs={12}>
            <div id="search-display-verses-container-primary" ref={containerPrimaryRef}>
              {/* {!zoom && <button id="zoom-out-button" className="zoom-in-out-button" onClick={onZoomClicked}>&#8599;</button>} */}
              {/* {zoom && <button id="zoom-in-button" ref={zoomInButtonRef} className="zoom-in-out-button" onClick={onZoomClicked}>&#8601;</button>} */}
              {!zoom && zoomOutButton}
              {zoom && zoomInButton}          
              <div id="search-display-verses-container-secondary" ref={containerSecondaryRef}>
                {displayVerses}
              </div>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}