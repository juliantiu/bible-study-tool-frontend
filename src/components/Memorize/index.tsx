import './index.css';
import { Col, Container, Row } from "react-bootstrap";
import MemorizeNavbar from "./MemorizeNavbar";
import MemorizeSettings from './MemorizeSettings';
import MemorizeCountdown from './MemorizeCountdown';
import MemorizeQuizWindow from "./MemorizeQuizWIndow";
import MemorizeHistory from './MemorizeHistory';
import { Window } from '../../types/Windows';
import useVerseRequester from '../../hooks/useVerseRequester';
import { useEffect, useState } from 'react';
import { BibleVerse } from '../../types/BibleContents';
import { DifficultyLevels, MemorizeSession, TimerStateOptions } from '../../types/VerseMemorization';

interface IMemorize {
  currWindow: Window
}

export default function Memorize(memorizeProps: IMemorize) {
  const { currWindow } = memorizeProps;
  const { bibleVersion, language } = currWindow;
  const { requestVerses } = useVerseRequester(language ?? '', bibleVersion ?? '');
  
  const [verseList, setVerseList] = useState<BibleVerse[]>([]);
  const [difficulty, setDifficulty] = useState(DifficultyLevels.fifty);
  const [timerState, setTimerState] = useState(TimerStateOptions.stop);

  const [currSessionId, setCurrentSessionId] =
    useState((Math.random() + 1).toString(16).substring(2));
  const [memorizeSessionsHistory, setMemorizeSessionsHistory] = useState<MemorizeSession[]>([]);
  const [currentMemorizeSession, setCurrentMemorizeSession] = useState<MemorizeSession>({
    inputVerses: '',
    memorizeSessionId: currSessionId,
    memoryVerses: []
  });

  useEffect(
    () => {
      if (currSessionId === currentMemorizeSession.memorizeSessionId) return;

      setMemorizeSessionsHistory(
        prev => {
          prev.push(currentMemorizeSession);
          return prev;
        }
      );
    },
    [currSessionId, currentMemorizeSession, setMemorizeSessionsHistory]
  );

  useEffect(
    () => {
      setCurrentMemorizeSession({
        inputVerses: '',
        memorizeSessionId: currSessionId,
        memoryVerses: []
      });
    },
    [currSessionId, setCurrentMemorizeSession]
  );

  return (
    <div className="h-100"> 
      <MemorizeNavbar />
      <Container className="content-window" fluid>
        <Row className="h-100">
          <Col xs={12} md={8}>
            <Row>
              <Col xs={12}>
                <MemorizeSettings
                  difficulty={difficulty}
                  requestVerses={requestVerses}
                  setCurrentMemorizeSession={setCurrentMemorizeSession}
                  setDifficulty={setDifficulty}
                  setVerseList={setVerseList}
                  timerState={timerState}/>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <MemorizeCountdown
                  setCurrentSessionId={setCurrentSessionId}
                  setTimerState={setTimerState}
                  timerState={timerState}/>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <MemorizeQuizWindow
                  difficulty={difficulty}
                  setCurrentMemorizeSession={setCurrentMemorizeSession}
                  timerState={timerState}
                  verseList={verseList}/>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col xs={12} md={4}>
                {/* <MemorizeHistory /> */}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}