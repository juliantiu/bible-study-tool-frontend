import { useEffect, useMemo, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import useVerseRequester from '../../hooks/useVerseRequester';
import { BibleVerse } from '../../types/BibleContents';
import { SearchWindow, Window } from '../../types/Windows';
import SearchSettings from './SearchSettings';
import SearchNavbar from './SearchNavbar';
import SearchVerseTexts from './SearchVerseTexts';
import SearchVerseReferences from './SearchVerseReferences';
import { SearchSettings as SearchSettingsType, SearchSettingsVerseOrder, SearchType } from '../../types/Searching';
import { getBibleBookOrder } from '../../utils/verse-misc';


function generateUniqueSetOfVerses(verseList: BibleVerse[], searchSettings: SearchSettingsType) {
  if (!searchSettings.removeDuplicates) return verseList;

  const verseListCopy = [...verseList];

  return verseListCopy.filter(
    (verse, index, verseList2) => {
      const arrCopy = Array.from(Array(index).keys()).map(i => verseList2[i]);
      const condition = 
        arrCopy.some(v => v.bibleBook === verse.bibleBook
                       && v.bookChapter === verse.bookChapter
                       && v.chapterVerseNumber === verse.chapterVerseNumber)

      if (condition) return false;

      return true;
    }
  );
}

function sortOrder(a: BibleVerse, b: BibleVerse) {

  const aBookOrder = getBibleBookOrder(a.bibleBook);
  const bBookOrder = getBibleBookOrder(b.bibleBook)

  if (aBookOrder === bBookOrder) {

    const aBookChapter = a.bookChapter;
    const bBookChapter = b.bookChapter;

    if (aBookChapter === bBookChapter) {
      return a.chapterVerseNumber - b.chapterVerseNumber;
    }
    return a.bookChapter - b.bookChapter
  }

  return aBookOrder - bBookOrder;
}

function generateOrderedVerses(verses: BibleVerse[], searchSettings: SearchSettingsType) {

  let versesCopy = [...verses];

  switch (searchSettings.verseOrder) {
    case SearchSettingsVerseOrder.default:
      return versesCopy;
    case SearchSettingsVerseOrder.ascending:
      return versesCopy.sort((a, b) => sortOrder(a, b));
    case SearchSettingsVerseOrder.descending:
      return versesCopy.sort((a, b) => sortOrder(b, a));
  }
}

interface ISearch {
  currWindow: SearchWindow;
  updateWindow: (window: Window) => void
}

export default function Search({ currWindow, updateWindow }: ISearch) {

  const { bibleContents, requestFullBibleBookName, requestVerses } = useVerseRequester(currWindow.language, currWindow.bibleVersion, currWindow.bibleContents);
  
  const searchWindow = useRef(currWindow);

  const [activeSearchType, setActiveSearchType] = useState<SearchType>(currWindow.activeSearchType);
  const [inputtedKeywords, setInputtedKeywords] = useState(currWindow.rawKeywordSearch);
  const [inputtedVerses, setInputtedVerses] = useState(currWindow.rawVerseSearch);
  const [searchSettings, setSearchSettings] = useState<SearchSettingsType>(currWindow.searchSettings);
  const [verseList, setVerseList] = useState<BibleVerse[]>(currWindow.verses);
  const [zoom, setZoom] = useState(false);

  const verses = useMemo(
    () => { 
      const verses = generateUniqueSetOfVerses(verseList, searchSettings);
      return generateOrderedVerses(verses, searchSettings);
    },  
    [searchSettings, verseList]
  );

  // every time window parameter changes, save it to the search window reference
  useEffect(
    () => {
      searchWindow.current = {
        activeSearchType,
        bibleContents,
        searchSettings,
        bibleVersion: currWindow.bibleVersion,
        language: currWindow.language,
        rawKeywordSearch: inputtedKeywords,
        rawVerseSearch: inputtedVerses,
        verses: verseList,
        windowId: currWindow.windowId,
        windowType: currWindow.windowType
      }
    },
    [
      activeSearchType,
      bibleContents,
      currWindow,
      inputtedKeywords,
      inputtedVerses,
      searchSettings,
      verseList,
    ]
  );

  // save window parameters on unmount
  useEffect(
    () => {
      return () => { updateWindow(searchWindow.current); }
    },
    [searchWindow, updateWindow]
  );

  const searchSettingsDisplay = !zoom && (
    <Row>
      <Col xs={12}>
        <SearchSettings
          inputtedKeywords={inputtedKeywords}
          inputtedVerses={inputtedVerses}
          requestVerses={requestVerses}
          searchSettings={searchSettings}
          setActiveSearchType={setActiveSearchType}
          setInputtedKeywords={setInputtedKeywords}
          setInputtedVerses={setInputtedVerses}
          setSearchSettings={setSearchSettings}
          setVerseList={setVerseList}
        />
      </Col>
    </Row>
  );

  const searchVerseReferencesDisplay = !zoom && (
    <Row>
      <Col xs={12}>
        <SearchVerseReferences
          bibleContents={bibleContents}
          requestFullBibleBookName={requestFullBibleBookName}
          verses={verses}
        />
      </Col>
    </Row>
  );

  const noBibleContents =
    bibleContents === undefined
    || bibleContents === null
    || Object.keys(bibleContents).length === 0;

  return (
    <div>
      {noBibleContents && <div className="window-content-loading">Loading...</div>} 
      <SearchNavbar />
      <Container className="content-window" fluid>
        {searchSettingsDisplay}
        {searchVerseReferencesDisplay}
        <Row>
          <Col xs={12}>
            <SearchVerseTexts
              requestFullBibleBookName={requestFullBibleBookName}
              setZoom={setZoom}
              verses={verses}
              zoom={zoom}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
