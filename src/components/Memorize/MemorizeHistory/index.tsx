import './index.css';
import { Accordion, Col, Row } from "react-bootstrap";
import { MemorizeSession, MemoryVerse } from '../../../types/VerseMemorization';

function mapThroughVerses(verses: MemoryVerse[], isCurrent: boolean, requestFullBibleBookName: (keyword: string) => string) {
  return verses.map(
    (verse, idx) => {

      let hasMistake = false;

      const verseWords =
        verse.verseWords.map(
          (v, idx) => {

            if (typeof v === 'string') {
              
              if (v.length === 1) {
                if ((/^[\.,;:!]$/.test(v)))
                  return <div key={`memorize-history-${isCurrent ? 'current-' : ''}verse-word-display-${idx}`} className="memorize-history-verse-word-display-ending-punct">{v}</div>;
              
                if (/['"]$/.test(v))
                  return <div key={`memorize-history-${isCurrent ? 'current-' : ''}verse-word-display-${idx}`} className="memorize-history-verse-word-display-ending-punct-quote">{v}</div>;
              }

              if (/^['"]/.test(v))
                return <div key={`memorize-history-${isCurrent ? 'current-' : ''}verse-word-display-${idx}`} className="memorize-history-verse-word-display-starting-punct">{v}</div>

              return <p key={`memorize-history-${isCurrent ? 'current-' : ''}verse-word-display-${idx}`}>{idx === 0 ? requestFullBibleBookName(v) : v}</p>;
            }

            if (requestFullBibleBookName(v.attemptedWord) === requestFullBibleBookName(v.missingWord))
              return <p key={`memorize-history-${isCurrent ? 'current-' : ''}verse-word-display-${idx}`} className="memorize-history-verse-word-display-no-mistake">{v.attemptedWord}</p>;

            hasMistake = true;

            return (
              <p key={`memorize-history-${isCurrent ? 'current-' : ''}verse-word-display-${idx}`} className="mmemorize-history-verse-word-display-has-mistake">{v.attemptedWord} [{v.missingWord}]</p>
            );
          }
        );

      return (
        <Accordion.Item key={`memorize-history-${isCurrent ? 'current-' : ''}verse-display-${idx}`} eventKey={`${idx}`}>
          <Accordion.Header className={hasMistake ? 'memorize-history-verse-display-header-has-mistake' : 'memorize-history-verse-display-header-no-mistake'}>
            {requestFullBibleBookName(verse.bibleBook)} {verse.bookChapter}:{verse.chapterVerse}
          </Accordion.Header>
          <Accordion.Body className="memorize-history-verse-body-container">
            {verseWords}
          </Accordion.Body>
        </Accordion.Item>
      );
    }
  );
}

interface IMemorizeHisotry {
  currentMemorizeSession: MemorizeSession;
  memorizeSessionsHistory: MemorizeSession[];
  requestFullBibleBookName: (keyword: string) => string;
}

export default function MemorizeHistory({ currentMemorizeSession, memorizeSessionsHistory, requestFullBibleBookName }: IMemorizeHisotry) {

  const pastSessionsCopy = [...memorizeSessionsHistory].reverse();

  const pastSessions = pastSessionsCopy.slice(1, pastSessionsCopy.length).map(
    pastSess => {

      const pastSessVersesCopy = [...pastSess.memoryVerses].reverse();
      const pastSessVerses = mapThroughVerses(pastSessVersesCopy, false, requestFullBibleBookName);

      return (
        <div key={`memorize-history-past-session-display-${pastSess.memorizeSessionId}`}>
          <div className="memorize-history-section-display">{pastSess.inputVerses}</div>
          <Accordion>{pastSessVerses}</Accordion>
        </div>
      );
    }
  );

  const memoryVersesCopy =
    [...currentMemorizeSession.memoryVerses].reverse();
  const currentSession = mapThroughVerses(memoryVersesCopy, true, requestFullBibleBookName);  

  return (
    <Row className="h-100">
      <Col xs={12}>
        <div id="memorize-history-container-primary">
          <div id="memorize-history-container-secondary">
            <div className="memorize-history-section-display">{currentMemorizeSession.inputVerses}</div>
            <Accordion>{currentSession}</Accordion>
            {pastSessions}
          </div>
        </div>
      </Col>
    </Row>
  );
}
