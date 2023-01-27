import './index.css';
import { Accordion, Col, Row } from "react-bootstrap";
import { BibleContents, BibleVerse } from "../../../types/BibleContents";
import { ConsecutiveVerseTracker } from '../../../types/Searching';
import { useMemo } from 'react';

function isPrevVerseLastVerseInChapter(consecutiveVerseTracker: ConsecutiveVerseTracker, bibleContents: BibleContents) {

  const book = consecutiveVerseTracker.book;
  const chapter = consecutiveVerseTracker.currentChapter;
  const verse = consecutiveVerseTracker.currentVerse; 

  const versesInChapter: BibleVerse[] = (bibleContents as any)?.[book]?.contents?.[chapter]; 

  if (!versesInChapter) return false;

  let lastVerseInChapter = Object.keys(versesInChapter).length;
  lastVerseInChapter = versesInChapter[lastVerseInChapter]?.chapterVerseNumber;

  return verse === lastVerseInChapter;

}

const isCurrVerseTheNextVerseInSameChapter = (verse: BibleVerse, consecutiveVerseTracker: ConsecutiveVerseTracker) => 
  verse.chapterVerseNumber - consecutiveVerseTracker.currentVerse === 1;

const isSameBook = (verseBook: string, book: string) =>
verseBook === book;

const isSameChapter = (verseChapter: number, chapter: number) => 
verseChapter === chapter;

function isConsecutiveVerse(verse: BibleVerse, consecutiveVerseTracker: ConsecutiveVerseTracker, bibleContents: BibleContents) {

  if (isSameBook(verse.bibleBook, consecutiveVerseTracker.book)) {

    if (isSameChapter(verse.bookChapter, consecutiveVerseTracker.currentChapter)) {

      return isCurrVerseTheNextVerseInSameChapter(verse, consecutiveVerseTracker);

    } else {

      if(verse.bookChapter - consecutiveVerseTracker.currentChapter === 1
          && isPrevVerseLastVerseInChapter(consecutiveVerseTracker, bibleContents))
          
        // if the previous verse is the last verse in the previous chapter and the current verse is the first verse of the next chapter, then true;
        return verse.chapterVerseNumber === 1;

    }
  }

  return false;
}

interface ISearchVerseReferences {
  bibleContents: BibleContents;
  requestFullBibleBookName: (keyword: string) => string;
  verses: BibleVerse[];
}

export default function SearchVerseReferences({ bibleContents, requestFullBibleBookName, verses }: ISearchVerseReferences) {
  
  const displayVerseRefs = useMemo(
    () => {

      let consecutiveVerseTracker: ConsecutiveVerseTracker = {
        book: '',
        currentChapter: 0,
        currentVerse: 0,
        firstChapter: 0,
        firstVerse: 0,
        consecutiveCounter: 0
      };

      let res = verses.reduce(
          (result, verse, idx) => {
      
            if (isConsecutiveVerse(verse, consecutiveVerseTracker, bibleContents)) {

              const lastIndexOfDash = result.lastIndexOf('-');
                                
              if (isSameChapter(verse.bookChapter, consecutiveVerseTracker.firstChapter)) {

                // + 1 counting where the dash would be.
                // ex. Psalm 119:111-112 => dash is 4th from end.
                const lengthOfMaxPossibleGapBeforeDash_A = consecutiveVerseTracker.currentVerse.toString().length + 1;
                const lengthOfMaxPossibleGapBeforeDash_B = verse.chapterVerseNumber.toString().length + 1;
                const lengthOfMaxPossibleGapBeforeDash = Math.max(lengthOfMaxPossibleGapBeforeDash_A, lengthOfMaxPossibleGapBeforeDash_B);

                // Only slice when the last index of dash is lengthOfMaxPossibleGapBeforeDash away from the end
                if (result.length - lastIndexOfDash <= lengthOfMaxPossibleGapBeforeDash) {
                  result = result.slice(0, lastIndexOfDash);
                }

                result += `-${verse.chapterVerseNumber}`;

              } else {

                // + 2 counting colon and where the dash would be.
                // ex. Phil 1:1-3:21 =>dash is 5th from the end.
                const lengthOfMaxPossibleGapBeforeDash_A = consecutiveVerseTracker.currentChapter.toString().length + consecutiveVerseTracker.currentVerse.toString().length + 2;
                const lengthOfMaxPossibleGapBeforeDash_B = verse.bookChapter.toString().length + verse.chapterVerseNumber.toString().length + 2;
                const lengthOfMaxPossibleGapBeforeDash = Math.max(lengthOfMaxPossibleGapBeforeDash_A, lengthOfMaxPossibleGapBeforeDash_B);

                // Only slice when the last index of dash is lengthOfMaxPossibleGapBeforeDash away from the end
                if (result.length - lastIndexOfDash <= lengthOfMaxPossibleGapBeforeDash) {
                  result = result.slice(0, lastIndexOfDash);
                }

                result += `-${verse.bookChapter}:${verse.chapterVerseNumber}`;

              }

              consecutiveVerseTracker = {
                ...consecutiveVerseTracker,
                consecutiveCounter: consecutiveVerseTracker.consecutiveCounter + 1,
                currentChapter: verse.bookChapter,
                currentVerse: verse.chapterVerseNumber
              }
      
              return result;
      
            } else {

              if (isSameBook(verse.bibleBook, consecutiveVerseTracker.book)) {

                if (isSameChapter(verse.bookChapter, consecutiveVerseTracker.firstChapter)) {

                  result += `, ${verse.chapterVerseNumber}`;

                } else {

                  result += `; ${verse.bookChapter}:${verse.chapterVerseNumber}`;

                }

              } else {

                result += `${idx < 1 ? '' : '; '}${requestFullBibleBookName(verse.bibleBook)} ${verse.bookChapter}:${verse.chapterVerseNumber}`;

              }
      
              consecutiveVerseTracker = {
                book: verse.bibleBook,
                firstChapter: verse.bookChapter,
                firstVerse: verse.chapterVerseNumber,
                consecutiveCounter: 0,
                currentChapter: verse.bookChapter,
                currentVerse: verse.chapterVerseNumber
              }
      
            }
      
            return result;
          },
          ''
        );

      return res;

    },
    [bibleContents, requestFullBibleBookName, verses]
  );
  
  
  

  return (
    <Row>
      <Col xs={12}>
        <div id="search-verse-reference-container-primary">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Identified verses ({verses.length})</Accordion.Header>
              <Accordion.Body>
                {displayVerseRefs}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </Col>
    </Row>
  );
}