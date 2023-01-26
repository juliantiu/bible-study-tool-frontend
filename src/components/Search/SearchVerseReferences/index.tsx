import './index.css';
import { Accordion, Col, Row } from "react-bootstrap";
import { BibleVerse } from "../../../types/BibleContents";
import { VerseRecipeFlags } from '../../../types/Windows';

interface ISearchVerseReferences {
  requestFullBibleBookName: (keyword: string) => string;
  verses: BibleVerse[];
}

export default function SearchVerseReferences({ requestFullBibleBookName, verses }: ISearchVerseReferences) {
  
  const displayVerseRefs = verses.reduce(
    (result, v, idx, arr) => {

      if (idx > 0) {
        // check if the verse before is the same book and chapter
        const prevVerse = arr[idx-1];

        const sameBook =
          prevVerse.bibleBook === v.bibleBook;

        const sameChapter =
          prevVerse.bookChapter === v.bookChapter;

        const sameBookSameChapter =
          sameBook && sameChapter;

        if (sameBookSameChapter) {

          if (v.chapterVerseNumber - prevVerse.chapterVerseNumber === 1) {

            const lastIndexOfDash = result.lastIndexOf('-'); 

            /// <= 4 because last verse cane be three digits,  
            if ((lastIndexOfDash > 0) && (result.length - lastIndexOfDash <= 4))
              return result.slice(0, lastIndexOfDash) + `-${v.chapterVerseNumber}`;

            return result + `-${v.chapterVerseNumber}`;

          }

          return result + `, ${v.chapterVerseNumber}`

        } else if (sameBook) {
          return result + `; ${v.bookChapter}:${v.chapterVerseNumber}`;
        }
      }

      return result + `${idx === 0 ? '' : '; '}${requestFullBibleBookName(`${v.bibleBook} ${v.bookChapter}:${v.chapterVerseNumber}`)}`
    },
    ''
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