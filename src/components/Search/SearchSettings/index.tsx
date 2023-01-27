import './index.css';
import { Col, Form, Nav, Row } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import { BibleVerse } from "../../../types/BibleContents";
import { SearchSettings as SearchSettingsType, SearchSettingsVerseOrder, SearchType } from '../../../types/Searching';
import { useCallback } from 'react';

interface ISearchSettings {
  inputtedKeywords: string;
  inputtedVerses: string;
  requestVerses: (rawVerses: string) => BibleVerse[];
  searchSettings: SearchSettingsType;
  setActiveSearchType: React.Dispatch<React.SetStateAction<SearchType>>;
  setInputtedKeywords: React.Dispatch<React.SetStateAction<string>>;
  setInputtedVerses: React.Dispatch<React.SetStateAction<string>>;
  setSearchSettings: React.Dispatch<React.SetStateAction<SearchSettingsType>>;
  setVerseList: React.Dispatch<React.SetStateAction<BibleVerse[]>>;
}

export default function SearchSettings({
  inputtedKeywords,
  inputtedVerses,
  requestVerses,
  searchSettings,
  setActiveSearchType,
  setInputtedKeywords,
  setInputtedVerses,
  setSearchSettings,
  setVerseList }: ISearchSettings
) {

  const onSelectTab = (category: any) => {
    setActiveSearchType((SearchType as any)[category]);
  }

  const onInputVersesChange = (elem: any) => {
    const { value } = elem.target;
    setInputtedVerses(value);
    setVerseList(requestVerses(value));
  };

  const onInputKeywordsChange = (elem: any) => {
    const { value } = elem.target;
    setInputtedKeywords(value);
    // setVerseList(
    //   requestVerses(value)
    // );
  };

  const onVerseOrderClick = useCallback(
    (order: SearchSettingsVerseOrder)=> {
      setSearchSettings(
        prev => {
          const prevCopy = { ...prev };
          prevCopy.verseOrder = order;
          return prevCopy;
        }
      );
    },
    [setSearchSettings]
  );

  const searchOrderRadio =
  ([
    ['Default', SearchSettingsVerseOrder.default],
    ['Ascending', SearchSettingsVerseOrder.ascending],
    ['Descending', SearchSettingsVerseOrder.descending]
  ] as const)
    .map(
      ([option, val]) => { 
        return (
          <Form.Check key={`search-settings-difficulty-${option}`}
            inline={true}
            label={option}
            name="group1"
            type="radio"
            id={`search-settings-difficulty-inline-${option}`}
            onChange={() => onVerseOrderClick(val)}
            checked={val === searchSettings.verseOrder}
          />
        );
      }
    );

    const onCheckboxClick = useCallback(
      () => {
        setSearchSettings(
          prev => {
            const prevCopy = { ...prev };
            prevCopy.removeDuplicates = !prev.removeDuplicates;
            return prevCopy;
          }
        )
      },
      [setSearchSettings]
    );

    const checkboxOptions = 
    ([
      'Remove-duplicates'
    ] as const)
      .map(
        (label) => {
          return (
            <Form.Check key={`search-settings-remove-duplicates-${label}`}
              inline={true}
              label={label.replace('-', ' ')}
              name="group2"
              type="checkbox"
              id={`search-settings-remove-duplicates-${label}`}
              onChange={onCheckboxClick}
              checked={searchSettings.removeDuplicates === true}
            />
          )
        }
      );

  const tabOptions = [
    'Verses',
    'Keywords'
  ].map(
    label => {
      return (
        <Nav.Item key={`search-settings-search-option-${label}`}>
          <Nav.Link eventKey={label.toLowerCase()}>
            {label}
          </Nav.Link>
        </Nav.Item>
      );
    }
  );

  const tabDisplay = ([
    ['verses', inputtedVerses, onInputVersesChange, "Start typing verse references to display verse text. (i.e. 1 Cor. 15:45; 2 Cor. 3:17, 18; 1 Cor. 6:17; 12:3; Rom. 10:8-10)"],
    ['keywords', inputtedKeywords, onInputKeywordsChange, "Functionality coming soon."/*"Start typing keywords to display verse text. (i.e. Rejoice in the Lord always)"*/]
  ] as const).map(
    ([label, val, onChange, placeholder]) => {
      return (
        <Tab.Pane key={`search-settings-tab-display-${label}`} eventKey={label}>
          <Form>
            <Form.Group>
              <Form.Control
                as="textarea"
                placeholder={placeholder}
                style={{ height: '60px' }}
                onChange={onChange}
                value={val}
              />
            </Form.Group>
          </Form>
        </Tab.Pane>
      );
    }
  );

  return (
    <Row>
      <Col xs={12}>
        <Row>
          <Col xs={12}>
            <div id="search-settings-input-verses-container">
              <Tab.Container defaultActiveKey="verses" onSelect={onSelectTab}>
                <Row>
                  <Col xs={12}>
                    <Nav variant="tabs">
                      {tabOptions}
                    </Nav>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Tab.Content>
                      {tabDisplay}
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div id="search-settings-order-container">
              <Form>
                <Form.Group>
                  {searchOrderRadio}
                </Form.Group>
              </Form>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div id="search-settings-duplicates-container">
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