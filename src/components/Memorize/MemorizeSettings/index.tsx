import './index.css'
import { useCallback, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { BibleVerse } from '../../../types/BibleContents';
import { DifficultyLevels, MemorizationSettings, MemorizeSession, TimerStateOptions } from '../../../types/VerseMemorization';

interface IMemorizeSettings {
  difficulty: DifficultyLevels;
  inputtedVerses: string;
  quizSettings: number;
  requestVerses: (rawVerses: string) => BibleVerse[];
  setCurrentMemorizeSession: React.Dispatch<React.SetStateAction<MemorizeSession>>;
  setDifficulty: React.Dispatch<React.SetStateAction<DifficultyLevels>>;
  setInputtedVerses: React.Dispatch<React.SetStateAction<string>>;
  setQuizSettings: React.Dispatch<React.SetStateAction<number>>;
  setVerseList: React.Dispatch<React.SetStateAction<BibleVerse[]>>;
  timerState: TimerStateOptions;
}

export default function MemorizeSettings({
  difficulty,
  inputtedVerses,
  quizSettings,
  requestVerses,
  setCurrentMemorizeSession,
  setDifficulty,
  setInputtedVerses,
  setQuizSettings,
  setVerseList,
  timerState
}: IMemorizeSettings) {

  const onInputVersesChange = (elem: any) => {
    const { value } = elem.target;
    setInputtedVerses(value);
    setVerseList(
      requestVerses(value)
    );
    setCurrentMemorizeSession(
      prev => { 
        prev.inputVerses = value
        return prev;
      }
    );
  };

  const onRadioClick = useCallback(
    (diff: DifficultyLevels)=> {
      setDifficulty(diff);
    },
    [setDifficulty]
  );

  const radioOptions =
    ([
      ['Verse only', DifficultyLevels.VerseOnly],
      ['25%', DifficultyLevels.twentyFive],
      ['50%', DifficultyLevels.fifty],
      ['75%', DifficultyLevels.seventyFive],
      ['Reference only', DifficultyLevels.oneHundred]
    ] as const)
      .map(
        ([option, level]) => { 
          return (
            <Form.Check key={`memorize-settings-difficulty-${option}`}
              inline={true}
              label={option}
              name="group1"
              type="radio"
              id={`memorize-settings-difficulty-inline-${option}`}
              onChange={() => onRadioClick(level)}
              checked={level === difficulty}
              disabled={timerState !== TimerStateOptions.stop}
            />
          );
        }
      );
  

  const onCheckboxClick = useCallback(
    (setting: MemorizationSettings)=> {
      setQuizSettings(prev => prev ^ setting);
    },
    [setQuizSettings]
  );
  
  const checkboxOptions = 
    ([
      ['Randomize', MemorizationSettings.randomOrder],
      ['Remove duplicates', MemorizationSettings.removeDuplicates]
    ] as const)
      .map(
        ([label, val]) => {
          return (
            <Form.Check key={`memorize-settings-option-${val}`}
              inline={true}
              label={label}
              name="group2"
              type="checkbox"
              id={`memorize-settings-option-inline-${val}`}
              onChange={() => onCheckboxClick(val)}
              checked={!!(quizSettings & val)}
              disabled={timerState !== TimerStateOptions.stop}
            />
          )
        }
      );

  return (
    <Row>
      <Col xs={12}>
        <Row>
          <Col xs={12}>
            <div id="memorize-input-verses-container">
              <Form>
                <Form.Group>
                  <Form.Control
                    id="memorize-input-verses-control"
                    as="textarea"
                    placeholder="Start typing verse references to display verse text. (i.e. 1 Cor. 15:45; 2 Cor. 3:17, 18; 1 Cor. 6:17; 12:3; Rom. 10:8-10)"
                    style={{ height: '60px' }}
                    onChange={onInputVersesChange}
                    value={inputtedVerses}
                    readOnly={timerState !== TimerStateOptions.stop}
                  />
                </Form.Group>
              </Form>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div id="memorize-difficulty-container">
              <Form>
                <Form.Group>
                  {radioOptions}
                </Form.Group>
              </Form>
            </div>
            <div id="memorize-settings-container">
              <Form>
                <Form.Group>
                  {checkboxOptions}
                </Form.Group>
              </Form>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
