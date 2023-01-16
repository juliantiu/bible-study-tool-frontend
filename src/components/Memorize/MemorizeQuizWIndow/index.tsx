import { Col, Row } from 'react-bootstrap';
import { BibleVerse } from '../../../types/BibleContents';
import './index.css';

interface MemorizeQuizWindow {
  verseList: BibleVerse[];
}

export default function MemorizeQuizWindow({ verseList }: MemorizeQuizWindow) {

  const verses = verseList.map(
    (verseObj) => {
      return (
        <div key={`memorize-verse-${verseObj.bibleBook}-${verseObj.bookChapter}-${verseObj.chapterVerseNumber}`}>
          <h5>{verseObj.bibleBook} {verseObj.bookChapter}:{verseObj.chapterVerseNumber}</h5>
          <p>{verseObj.text}</p>
        </div>
      );
    }
  );

  return (
    <div id="memorize-quiz-window">
      <Row className="h-100">
        <Col xs={12}>
          <div id="memorize-quiz-window-form-container">
            {verses}
          </div>
        </Col>
      </Row>
    </div>
  );
}
