import './index.css'
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from 'react';

const enum TimerInterfaceOptions {
  stop,
  play,
  pause,
  repeat
}

function stopTimer(timerObj: any) {
  clearInterval(timerObj?.current);
  timerObj.current = undefined;
}

function stopAndResetTimer(
  timerObj: any,
  referenceTimerValues:
    { hh: number; mm: number; ss: number; },
  setCurrentTimerValues:
    React.Dispatch<React.SetStateAction<
      { hh: number; mm: number; ss: number; }
    >>
) {
  stopTimer(timerObj);
  setCurrentTimerValues({ ...referenceTimerValues });
}

function setTimerEndTime(
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
  setTimerEndTime(dateNow, goalDate, currentTimerValues);

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
  selectedOption: TimerInterfaceOptions,
  referenceTimerValues:
    { hh: number; mm: number; ss: number; },
  currentTimerValues:
    { hh: number; mm: number; ss: number; },
  setCurrentTimerValues:
    React.Dispatch<React.SetStateAction<
      { hh: number; mm: number; ss: number; }
    >>,
  timerObj: any)
{
  switch (selectedOption) {
    case TimerInterfaceOptions.stop:
      stopAndResetTimer
        (timerObj, referenceTimerValues, setCurrentTimerValues);
      break;
    case TimerInterfaceOptions.play:
      startTimer(currentTimerValues, setCurrentTimerValues, timerObj);
      break;
    case TimerInterfaceOptions.pause:
      stopTimer(timerObj);
      break;
    case TimerInterfaceOptions.repeat:
      stopAndResetTimer
      (timerObj, referenceTimerValues, setCurrentTimerValues);
      break;
    default:
      break;
  }
}

export default function MemorizeCountdown() {
  const [selectedInterfaceOption, setSelectedInterfaceOption] =
    useState(TimerInterfaceOptions.stop);
  const [referenceTimerValues, setReferenceTimerValues] =
    useState({ hh: 0, mm: 0, ss: 0 });
  const [currentTimerValues, setCurrentTimerValues] =
    useState({ hh: 0, mm: 0, ss: 0 });
  const timerObj = useRef();

  const onChangeReferenceTimer = (ref: any) => {
    const { name, value } = ref.target;
    setReferenceTimerValues(prev => ({ ...prev, [name]: value }));
  }

  const countdownForm =
    (selectedInterfaceOption
      === TimerInterfaceOptions.stop)
      && 
        ['hh', 'mm', 'ss']
          .map(
            label => {
              return (
                <InputGroup key={`memorize-countdown-timer-form-${label}`} className="memorize-countdown-input">
                  <Form.Control name={label} size='lg' type='number' max='59' min='0' value={(referenceTimerValues as any)[label]} onChange={onChangeReferenceTimer}/>
                  <InputGroup.Text>{label}</InputGroup.Text> 
                </InputGroup>
              );
            }
          );

  const countdownTimerDisplay =
    (selectedInterfaceOption === TimerInterfaceOptions.play
      || selectedInterfaceOption === TimerInterfaceOptions.pause
      || selectedInterfaceOption === TimerInterfaceOptions.repeat)
      && (
        <div id="memorize-countdown-timer-display-container">
          <div className="memorize-countdown-timer-display-value"><span>{currentTimerValues.hh}</span><p>HOURS</p></div>
          <div className="memorize-countdown-timer-display-value"><span>{currentTimerValues.mm}</span><p>MINUTES</p></div>
          <div className="memorize-countdown-timer-display-value"><span>{currentTimerValues.ss}</span><p>SECONDS</p></div>
        </div>
      );

  const onInterfaceOptionClick = (selectedOption: TimerInterfaceOptions) => {
    timerFunctionality(
        selectedOption,
        referenceTimerValues,
        currentTimerValues,
        setCurrentTimerValues,
        timerObj
      );
    setSelectedInterfaceOption(selectedOption);
  }

  useEffect(
    () => {
      setCurrentTimerValues({ ...referenceTimerValues });
    },
    [referenceTimerValues]
  );

  const disablePlayOrPauseButton = 
    currentTimerValues.hh === 0
      && currentTimerValues.mm === 0
      && currentTimerValues.ss === 0

  const playButton = 
    (selectedInterfaceOption === TimerInterfaceOptions.stop
      || selectedInterfaceOption === TimerInterfaceOptions.pause
      || selectedInterfaceOption === TimerInterfaceOptions.repeat)
      && (
        <button
          onClick={() => onInterfaceOptionClick(TimerInterfaceOptions.play)}
          disabled={disablePlayOrPauseButton}
        >
          &#10148;
        </button>
      );

  const pauseButton =
    selectedInterfaceOption === TimerInterfaceOptions.play
      && (
        <button
          name="pause-button"
          onClick={() => onInterfaceOptionClick(TimerInterfaceOptions.pause)}
          disabled={disablePlayOrPauseButton}
        >
          &#10073;&#10073;
        </button> 
      );
    
  const stopButton = (
    <button
      onClick={() => onInterfaceOptionClick(TimerInterfaceOptions.stop)}
    >
      <div id="stop-button"/>
    </button>
  );

  const repeatButton = (
    <button
      onClick={() => onInterfaceOptionClick(TimerInterfaceOptions.repeat)}
      disabled={selectedInterfaceOption === TimerInterfaceOptions.stop}
    >
      &#8634;
    </button>
  );

  return (
    <div id="memorize-countdown">
      <Row>
        <Col xs={12}>
          <div id="memorize-countdown-container-primary">
            <div id="memorize-countdown-container-secondary">
              {countdownForm}
              {countdownTimerDisplay}
            </div>
            <div id="memorize-interface-options-container">
              {playButton}
              {pauseButton}
              {stopButton}
              {repeatButton}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}