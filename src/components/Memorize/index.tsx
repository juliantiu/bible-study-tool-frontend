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
  const [quizSettings, setQuizSettings] = useState(3); // binary 11

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
      setMemorizeSessionsHistory(
        prev => {
          const prevCopy = [...prev];
          const existingSession = prevCopy[prevCopy.length-1];

          if (!!existingSession
            && existingSession.memorizeSessionId
               === currentMemorizeSession.memorizeSessionId)
          {
            existingSession.inputVerses = currentMemorizeSession.inputVerses;
            existingSession.memorizeSessionId = currentMemorizeSession.memorizeSessionId;
            existingSession.memoryVerses = [...currentMemorizeSession.memoryVerses];
            return prevCopy;
          }
          
          prevCopy.push(currentMemorizeSession);
          return prevCopy;
        }
      );
    },
    [currSessionId, currentMemorizeSession, setMemorizeSessionsHistory]
  );

  useEffect(
    () => {
      setCurrentMemorizeSession(prev => ({
        inputVerses: prev.inputVerses,
        memorizeSessionId: currSessionId,
        memoryVerses: []
      }));
    },
    [currSessionId, setCurrentMemorizeSession]
  );

  return (
    <div> 
      <MemorizeNavbar />
      <Container className="content-window" fluid>
        <Row>
          <Col xs={12} md={8}>
            <Row>
              <Col xs={12}>
                <MemorizeSettings
                  difficulty={difficulty}
                  quizSettings={quizSettings}
                  requestVerses={requestVerses}
                  setCurrentMemorizeSession={setCurrentMemorizeSession}
                  setDifficulty={setDifficulty}
                  setQuizSettings={setQuizSettings}
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
                  quizSettings={quizSettings}
                  setCurrentMemorizeSession={setCurrentMemorizeSession}
                  timerState={timerState}
                  verseList={verseList}/>
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={4}>
            <Row>
              <Col xs={12}>
                <MemorizeHistory
                  currentMemorizeSession={currentMemorizeSession}
                  memorizeSessionsHistory={memorizeSessionsHistory}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}