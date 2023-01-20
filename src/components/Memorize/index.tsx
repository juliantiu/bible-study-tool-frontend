import './index.css';
import { Col, Container, Row } from "react-bootstrap";
import MemorizeNavbar from "./MemorizeNavbar";
import MemorizeSettings from './MemorizeSettings';
import MemorizeCountdown from './MemorizeCountdown';
import MemorizeQuizWindow from "./MemorizeQuizWIndow";
import MemorizeHistory from './MemorizeHistory';
import { MemorizeWindow, Window } from '../../types/Windows';
import useVerseRequester from '../../hooks/useVerseRequester';
import { useEffect, useRef, useState } from 'react';
import { BibleVerse } from '../../types/BibleContents';
import { DifficultyLevels, MemorizeSession, TimerStateOptions } from '../../types/VerseMemorization';

interface IMemorize {
  currWindow: MemorizeWindow;
  updateWindow: (window: Window) => void;
}

export default function Memorize({ currWindow, updateWindow }: IMemorize) {
  const { bibleVersion, language } = currWindow;
  const { requestFullBibleBookName, requestVerses } = useVerseRequester(language ?? '', bibleVersion ?? '');
  const memorizeWindow = useRef<MemorizeWindow>(currWindow);
  
  // Settings
  const [inputtedVerses, setInputtedVerses] = useState(currWindow.currentMemorizeSession.inputVerses);
  const [difficulty, setDifficulty] = useState(currWindow.difficulty);
  const [timerState, setTimerState] = useState(currWindow.timerState);
  const [quizSettings, setQuizSettings] = useState(currWindow.quizSettings); // binary 11
  
  // Quiz window settings
  const [currSessionId, setCurrentSessionId] =
    useState(currWindow.currSessionId);
  const [verseList, setVerseList] = useState<BibleVerse[]>(currWindow.verseList);
  const [currIdx, setCurrIdx] = useState(currWindow.currIdx);
  const [verseHistory, setVerseHistory] = useState<BibleVerse[]>(currWindow.verseHistory);
  const [currentMemorizeSession, setCurrentMemorizeSession] = useState<MemorizeSession>(currWindow.currentMemorizeSession);

  // Countdown timer settings
  const [referenceTimerValues, setReferenceTimerValues] =
    useState(currWindow.referenceTimerValues);
  const [currentTimerValues, setCurrentTimerValues] =
    useState(currWindow.currentTimerValues);

  const [memorizeSessionsHistory, setMemorizeSessionsHistory] = useState<MemorizeSession[]>(currWindow.memorizeSessionsHistory);

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
      if (currWindow.currSessionId === currSessionId) return;
      setCurrentMemorizeSession(prev => ({
        inputVerses: prev.inputVerses,
        memorizeSessionId: currSessionId,
        memoryVerses: [] // this will update and refresh when you remount, and memory verses will be back to [] instead of what is in currWindow.
      }));
    },
    [currSessionId, setCurrentMemorizeSession]
  );

  // every time window parameter changes, save it to the memorize window reference
  useEffect(
    () => {
      memorizeWindow.current = {
        currIdx,
        currentMemorizeSession,
        currentTimerValues,
        currSessionId,
        difficulty,
        memorizeSessionsHistory,
        quizSettings,
        referenceTimerValues,
        verseHistory,
        verseList,
        timerState:
          timerState === TimerStateOptions.play
          ? TimerStateOptions.pause
          : timerState,
        bibleVersion: currWindow.bibleVersion,
        language: currWindow.language,
        windowId: currWindow.windowId,
        windowType: currWindow.windowType,
      }
    },
    [
      currIdx,
      currentMemorizeSession,
      currentMemorizeSession.inputVerses,
      currentMemorizeSession.memoryVerses,
      currentTimerValues,
      currentTimerValues.hh,
      currentTimerValues.mm,
      currentTimerValues.ss,
      currSessionId,
      difficulty,
      memorizeSessionsHistory,
      quizSettings,
      referenceTimerValues,
      referenceTimerValues.hh,
      referenceTimerValues.mm,
      referenceTimerValues.ss,
      timerState,
      verseHistory,
      verseList,
      currWindow
    ]
  );

  // save window parameters on unmount
  useEffect(
    () => {
      return () => { updateWindow(memorizeWindow.current!); }
    },
    [memorizeWindow]
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
                  inputtedVerses={inputtedVerses}
                  quizSettings={quizSettings}
                  requestVerses={requestVerses}
                  setCurrentMemorizeSession={setCurrentMemorizeSession}
                  setDifficulty={setDifficulty}
                  setInputtedVerses={setInputtedVerses}
                  setQuizSettings={setQuizSettings}
                  setVerseList={setVerseList}
                  timerState={timerState}/>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <MemorizeCountdown
                  currentTimerValues={currentTimerValues}
                  referenceTimerValues={referenceTimerValues}
                  setCurrentSessionId={setCurrentSessionId}
                  setCurrentTimerValues={setCurrentTimerValues}
                  setReferenceTimerValues={setReferenceTimerValues}
                  setTimerState={setTimerState}
                  timerState={timerState}/>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <MemorizeQuizWindow
                  currIdx={currIdx}
                  difficulty={difficulty}
                  quizSettings={quizSettings}
                  requestFullBibleBookName={requestFullBibleBookName}
                  setCurrIdx={setCurrIdx}
                  setCurrentMemorizeSession={setCurrentMemorizeSession}
                  setVerseHistory={setVerseHistory}
                  timerState={timerState}
                  verseHistory={verseHistory}
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
                  requestFullBibleBookName={requestFullBibleBookName}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}