import './index.css'
import { useCallback, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { BibleVerse } from '../../../types/BibleContents';
import { DifficultyLevels, MemorizeSession, TimerStateOptions } from '../../../types/VerseMemorization';

interface IMemorizeSettings {
  difficulty: DifficultyLevels;
  requestVerses: (rawVerses: string) => BibleVerse[];
  setCurrentMemorizeSession: React.Dispatch<React.SetStateAction<MemorizeSession>>;
  setDifficulty: React.Dispatch<React.SetStateAction<DifficultyLevels>>;
  setVerseList: React.Dispatch<React.SetStateAction<BibleVerse[]>>;
  timerState: TimerStateOptions;
}

export default function MemorizeSettings({
  difficulty,
  requestVerses,
  setCurrentMemorizeSession,
  setDifficulty,
  setVerseList,
  timerState
}: IMemorizeSettings) {
  const [inputtedVerses, setInputtedVerses] = useState('');

  const onCheckboxClick = useCallback(
    (diff: DifficultyLevels)=> {
      setDifficulty(diff);
    },
    [setDifficulty]
  );

  const onInputVersesChange = (elem: any) => {
    const { value } = elem.target;
    setInputtedVerses(value);
    setVerseList(
      requestVerses(value)
    );
  };

  useEffect(
    () => {
      setCurrentMemorizeSession(
        prev => { 
          prev.inputVerses = inputtedVerses
          return prev;
        }
      );
    },
    [inputtedVerses, setCurrentMemorizeSession]
  );

  const checkboxOptions =
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
            <Form.Check key={`memorize-settings-option-${option}`}
              inline={true}
              label={option}
              name="group1"
              type="radio"
              id={`memorize-settings-option-inline-${option}`}
              onChange={() => onCheckboxClick(level)}
              checked={level === difficulty}
              disabled={timerState !== TimerStateOptions.stop}
            />
          );
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
                    placeholder="Input verses here (ex. Phil. 1:20-2:13; Mark 12:30)"
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
