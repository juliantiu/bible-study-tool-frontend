import './index.css'
import { useCallback, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { BibleVerse } from '../../../types/BibleContents';

const enum DifficultyLevels {
  VerseOnly,
  Easy,
  Normal,
  ReferenceOnly
}

interface IMemorizeSettings {
  requestVerses: (rawVerses: string) => BibleVerse[];
  setVerseList: React.Dispatch<React.SetStateAction<BibleVerse[]>>;
}

export default function MemorizeSettings({ requestVerses, setVerseList }: IMemorizeSettings) {
  const [difficulty, setDifficulty] = useState(DifficultyLevels.Normal);
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

  const checkboxOptions =
    ([
      ['Verse only', DifficultyLevels.VerseOnly],
      ['Easy', DifficultyLevels.Easy],
      ['Normal', DifficultyLevels.Normal],
      ['Reference only', DifficultyLevels.ReferenceOnly]
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
            />
          );
        }
      );

  return (
    <div id="memorize-settings">
      <Row>
        <Col xs={12}>
          <div id="memorize-searchbar-container-primary">
            <div id="memorize-searchbar-container-secondary">
              <Form>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    placeholder="Input verses here (ex. Phil. 1:20-2:13; Mark 12:30)"
                    style={{ height: '60px' }}
                    onChange={onInputVersesChange}
                    value={inputtedVerses}
                  />
                </Form.Group>
              </Form>
            </div>
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
    </div>
  );
}
