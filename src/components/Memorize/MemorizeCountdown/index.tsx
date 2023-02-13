import './index.css'
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { useEffect, useRef } from 'react';
import { TimerStateOptions } from '../../../types/VerseMemorization';

function stopTimer(timerObj: any) {
  clearInterval(timerObj?.current);
  timerObj.current = undefined;
}

function stopAndResetTimer(
  timerObj: any,
  referenceTimerValues:
    { hh: number; mm: number; ss: number; },
  setCurrentSessionId:
    React.Dispatch<React.SetStateAction<string>>,
  setCurrentTimerValues:
    React.Dispatch<React.SetStateAction<
      { hh: number; mm: number; ss: number; }
    >>
) {
  setCurrentSessionId((Math.random() + 1).toString(16).substring(2));
  stopTimer(timerObj);
  setCurrentTimerValues({ ...referenceTimerValues });
}

function setTimerStartTime(
  dateNow: Date,
  goalDate: Date,
  currentTimerValues:
  { hh: number; mm: number; ss: number; }
) {
  goalDate.setHours
    (dateNow.getHours() + +currentTimerValues.hh);
  goalDate.setMinutes
    (dateNow.getMinutes() + +currentTimerValues.mm);
  goalDate.setSeconds
    (dateNow.getSeconds() + +currentTimerValues.ss+1);
}

function startTimer(
  currentTimerValues:
  { hh: number; mm: number; ss: number; },
  setCurrentTimerValues:
  React.Dispatch<React.SetStateAction<
    { hh: number; mm: number; ss: number; }
  >>,
  timerObj: any
) {
  let dateNow = new Date();
  const goalDate = new Date();
  setTimerStartTime(dateNow, goalDate, currentTimerValues);

  timerObj.current = setInterval(
    () => {
      dateNow = new Date();
      const timeElapsed = +goalDate - +dateNow;

      if (timeElapsed >= 0) {

        setCurrentTimerValues(() => {
          return ({
            hh: Math.floor(timeElapsed / 3600000),
            mm: Math.floor((timeElapsed / 60000) % 60),
            ss: Math.floor((timeElapsed % 60000) / 1000)
          });
        });

      } else {

        stopTimer(timerObj);
        setCurrentTimerValues({ hh: 0, mm: 0, ss: 0 });

      }
    },
    1000
  );
}

function timerFunctionality(
  timerState: TimerStateOptions,
  referenceTimerValues:
    { hh: number; mm: number; ss: number; },
  currentTimerValues:
    { hh: number; mm: number; ss: number; },
  setCurrentSessionId:
    React.Dispatch<React.SetStateAction<string>>,
  setCurrentTimerValues:
    React.Dispatch<React.SetStateAction<
      { hh: number; mm: number; ss: number; }
    >>,
  setTimerState: React.Dispatch<React.SetStateAction<TimerStateOptions>>,
  timerObj: any)
{
  switch (timerState) {
    case TimerStateOptions.stop:
      stopAndResetTimer(
        timerObj,
        referenceTimerValues,
        setCurrentSessionId,
        setCurrentTimerValues);
      break;
    case TimerStateOptions.play:
      startTimer(
        currentTimerValues,
        setCurrentTimerValues,
        timerObj);
      break;
    case TimerStateOptions.pause:
      stopTimer(timerObj);
      break;
    // case TimerStateOptions.repeat:
    //   stopAndResetTimer
    //   (timerObj, referenceTimerValues, setCurrentTimerValues);
    //   break;
    default:
      break;
  }
}

interface IMemorizeTimer {
  currentTimerValues: {
    hh: number;
    mm: number;
    ss: number;
  };
  referenceTimerValues: {
    hh: number;
    mm: number;
    ss: number;
  };
  setCurrentSessionId: React.Dispatch<React.SetStateAction<string>>;
  setCurrentTimerValues: React.Dispatch<React.SetStateAction<{
    hh: number;
    mm: number;
    ss: number;
  }>>;
  setReferenceTimerValues: React.Dispatch<React.SetStateAction<{
    hh: number;
    mm: number;
    ss: number;
  }>>;
  setTimerState: React.Dispatch<React.SetStateAction<TimerStateOptions>>;
  timerState: TimerStateOptions;
}

export default function MemorizeCountdown({
  currentTimerValues,
  referenceTimerValues,
  setCurrentSessionId,
  setCurrentTimerValues,
  setReferenceTimerValues,
  setTimerState,
  timerState
}: IMemorizeTimer) {

  const timerObj = useRef();

  const onChangeReferenceTimer = (ref: any) => {
    const { name, value } = ref.target;
    setReferenceTimerValues(prev => ({ ...prev, [name]: +value }));
    setCurrentTimerValues(prev => ({ ...prev, [name]: +value }));
  }

  const timerForm =
    (timerState
      === TimerStateOptions.stop)
      && 
        ['hh', 'mm', 'ss']
          .map(
            label => {
              return (
                <InputGroup
                  key={`memorize-timer-form-${label}`}
                  className="memorize-timer-input"
                >
                  <Form.Control
                    name={label}
                    type='number'
                    max='59'
                    min='0'
                    value={(referenceTimerValues as any)[label]}
                    onChange={onChangeReferenceTimer}
                  />
                  <InputGroup.Text>{label}</InputGroup.Text> 
                </InputGroup>
              );
            }
          );

  const timerDisplay =
    (timerState === TimerStateOptions.play
      || timerState === TimerStateOptions.pause
      || timerState === TimerStateOptions.repeat
      || timerState === TimerStateOptions.finished)
      && (
        <>
          <InputGroup
            key="memorize-timer-form-readonly-hh"
            className="memorize-timer-input"
          >
            <Form.Control
              name="memorize-timer-form-readonly-hh"
              value={currentTimerValues.hh}
              readOnly={true}
            />
            <InputGroup.Text>hh</InputGroup.Text> 
          </InputGroup>
          <InputGroup
            key="memorize-timer-form-readonly-mm"
            className="memorize-timer-input"
          >
            <Form.Control
              name="memorize-timer-form-readonly-mm"
              value={currentTimerValues.mm}
              readOnly={true}
            />
            <InputGroup.Text>mm</InputGroup.Text> 
          </InputGroup>
          <InputGroup
            key="memorize-timer-form-readonly-ss"
            className="memorize-timer-input"
          >
            <Form.Control
              name="memorize-timer-form-readonly-ss"
              value={currentTimerValues.ss}
              readOnly={true}
            />
            <InputGroup.Text>ss</InputGroup.Text> 
          </InputGroup>
        </>
      );

  const onTimerStateClick = (state: TimerStateOptions) => {
    timerFunctionality(
        state,
        referenceTimerValues,
        currentTimerValues,
        setCurrentSessionId,
        setCurrentTimerValues,
        setTimerState,
        timerObj
      );
    setTimerState(state);
  }

  useEffect(
    () => {
      setTimerState(
        prev => {
          if ((currentTimerValues.hh === 0
            && currentTimerValues.mm === 0
            && currentTimerValues.ss === 0)
            && prev === TimerStateOptions.play)
            return TimerStateOptions.finished
            
          return prev;
        }
      );
    },
    [currentTimerValues, setTimerState]
  );

  const timerZeroed = 
    currentTimerValues.hh === 0
      && currentTimerValues.mm === 0
      && currentTimerValues.ss === 0

  const playButton = 
    (timerState === TimerStateOptions.stop
      || timerState === TimerStateOptions.pause
      || timerState === TimerStateOptions.repeat)
      && (
        <button
          onClick={() => onTimerStateClick(TimerStateOptions.play)}
          disabled={timerZeroed}
        >
          &#10148;
        </button>
      );

  const pauseButton =
    (timerState === TimerStateOptions.play
      || timerState === TimerStateOptions.finished)
      && (
        <button
          name="pause-button"
          onClick={() => onTimerStateClick(TimerStateOptions.pause)}
          disabled={timerZeroed}
        >
          &#10073;&#10073;
        </button> 
      );
    
  const stopButton = (
    <button
      onClick={() => onTimerStateClick(TimerStateOptions.stop)}
      disabled={timerState === TimerStateOptions.stop}
      id="memorize-stop-button-container"
    >
      <div id="stop-button"/>
    </button>
  );

  // const repeatButton = (
  //   <button
  //     onClick={() => onTimerStateClick(TimerStateOptions.repeat)}
  //     disabled={timerState === TimerStateOptions.stop}
  //   >
  //     &#8634;
  //   </button>
  // );

  return (
    <Row>
      <Col xs={12}>
        <div id="memorize-timer-container">
          {timerForm}
          {timerDisplay}
          <div id="memorize-timer-state-options-container">
            {playButton}
            {pauseButton}
            {stopButton}
            {/* {repeatButton} */}
          </div>
        </div>
      </Col>
    </Row>
  );
}