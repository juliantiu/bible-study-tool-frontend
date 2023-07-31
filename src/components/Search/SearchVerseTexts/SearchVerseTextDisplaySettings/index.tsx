import { Col, Form, Row } from 'react-bootstrap';
import './index.css';
import { SearchDisplayBothSettings, SearchDisplayRefTextSettings } from '../../../../types/Searching';

enum RefTextChangeType {
  bolded,
  fontSize,
  newline,
  fontColor
}

interface SearchVerseTextDisplaySettingsProps {
  searchDisplayReferenceSettings: SearchDisplayRefTextSettings;
  setSearchDisplayReferenceSettings: React.Dispatch<React.SetStateAction<SearchDisplayRefTextSettings>>;
  searchDisplayTextSettings: SearchDisplayRefTextSettings;
  setSearchDisplayTextSettings: React.Dispatch<React.SetStateAction<SearchDisplayRefTextSettings>>;
  searchDisplayBothSettings: SearchDisplayBothSettings;
  setSearchDisplayBothSettings: React.Dispatch<React.SetStateAction<SearchDisplayBothSettings>>;
}

export default function SearchVerseTextDisplaySettings({
  searchDisplayReferenceSettings,
  setSearchDisplayReferenceSettings,
  searchDisplayTextSettings,
  setSearchDisplayTextSettings,
  searchDisplayBothSettings,
  setSearchDisplayBothSettings
}: SearchVerseTextDisplaySettingsProps) {

  const onSearchDisplayReferenceSettingsChange = (changeType: RefTextChangeType, e: any) => {
    const { value, checked } = e.target;

    switch (changeType) {
      case RefTextChangeType.bolded:
        setSearchDisplayReferenceSettings(prev => {
          const prevCopy = prev;
          prevCopy.bolded = checked;
          return {...prevCopy};
        });
        break;
      case RefTextChangeType.fontSize:
        setSearchDisplayReferenceSettings(prev => {
          const prevCopy = prev;
          prevCopy.fontSize = value;
          return {...prevCopy};
        });
        break;
    }
  };
  
  const onSetSearchDisplayTextSettingsChange = (changeType: RefTextChangeType, e: any) => {
    const { value, checked } = e.target;

    switch (changeType) {
      case RefTextChangeType.bolded:
        setSearchDisplayTextSettings(prev => {
          const prevCopy = prev;
          prevCopy.bolded = checked;
          return {...prevCopy};
        });
        break;
      case RefTextChangeType.fontSize:
        setSearchDisplayTextSettings(prev => {
          const prevCopy = prev;
          prevCopy.fontSize = value;
          return {...prevCopy};
        });
        break;
    }
  };

  const onSetSearchDisplayBothSettingsChange = (changeType: RefTextChangeType, e: any) => {
    const { value, checked } = e.target;

    switch (changeType) {
      case RefTextChangeType.newline:
        setSearchDisplayBothSettings(prev => {
          const prevCopy = prev;
          prevCopy.newline = checked;
          return {...prevCopy};
        });
        break;
      case RefTextChangeType.fontColor:
        setSearchDisplayBothSettings(prev => {
          const prevCopy = prev;
          prevCopy.fontColor = value;
          return {...prevCopy};
        });
        break;
    }
  };

  const verseReferenceFormCheckOps = [
    ['bolded', searchDisplayReferenceSettings.bolded, RefTextChangeType.bolded]
  ].map(
    ([option, val, changeType]) => {
      return (
        <Form.Check
          inline
          key={`verse-reference-form-check-option-${option}`}
          id={`verse-reference-form-check-option-${option}`}
          onChange={e => onSearchDisplayReferenceSettingsChange(changeType as RefTextChangeType, e)}
          type="checkbox"
          label={option}
          className="mt-2"
          checked={val as boolean}
        />
      )
    }
  );

  const verseTextFormCheckOps = [
    ['bolded', searchDisplayTextSettings.bolded, RefTextChangeType.bolded]
  ].map(
    ([option, val, changeType]) => {
      return (
        <Form.Check
          inline
          key={`verse-text-form-check-option-${option}`}
          id={`verse-text-form-check-option-${option}`}
          onChange={e => onSetSearchDisplayTextSettingsChange(changeType as RefTextChangeType, e)}
          type="checkbox"
          label={option}
          className="mt-2"
          checked={val as boolean}
        />
      )
    }
  );

  const verseBothFormCheckOps = [
    ['newline', RefTextChangeType.newline]
  ].map(
    ([option, changeType]) => {
      return (
        <Form.Check
          inline
          key={`verse-both-form-check-option-${option}`}
          id={`verse-both-form-check-option-${option}`}
          onChange={e => onSetSearchDisplayBothSettingsChange(changeType as RefTextChangeType, e)}
          type="checkbox"
          label={option}
          className="mt-2"
        />
      )
    }
  );

  return (
    <Form>
      <Row>
        <Col xs={12} sm={3} md={2} lg={1} className="pt-2">
          <p className="search-verse-text-display-settings-label">REFERENCE:</p>
        </Col>
        <Col xs="auto">
          <Form.Group>
            {verseReferenceFormCheckOps}
          </Form.Group>
        </Col>
        <Col xs="auto">
          <Form.Group as={Row}>
            <Form.Label column xs="auto">Font size</Form.Label>
            <Col xs="auto">
              <Form.Control
                type="number"
                size="sm"
                value={searchDisplayReferenceSettings.fontSize}
                onChange={e => onSearchDisplayReferenceSettingsChange(RefTextChangeType.fontSize, e)}
              />
            </Col>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={3} md={2} lg={1} className="pt-2">
          <p className="search-verse-text-display-settings-label">TEXT:</p>
        </Col>
        <Col xs="auto">
          <Form.Group>
            {verseTextFormCheckOps}
          </Form.Group>
        </Col>
        <Col xs="auto">
          <Form.Group as={Row}>
            <Form.Label column xs="auto">Font size</Form.Label>
            <Col xs="auto">
              <Form.Control
                type="number"
                size="sm"
                value={searchDisplayTextSettings.fontSize}
                onChange={e => onSetSearchDisplayTextSettingsChange(RefTextChangeType.fontSize, e)}
              />
            </Col>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={3} md={2} lg={1} className="pt-2">
          <p className="search-verse-text-display-settings-label">BOTH:</p>
        </Col>
        <Col xs="auto">
          <Form.Group>
            {verseBothFormCheckOps}
          </Form.Group>
        </Col>
        <Col xs="auto">
          <Form.Group as={Row}>
            <Form.Label
              column xs="auto"
              htmlFor="exampleColorInput"
              style={{ 'paddingLeft': '8px' }}
            >
              Font color
            </Form.Label>
            <Col xs="auto">
              <Form.Control 
                type="color"
                onChange={e => onSetSearchDisplayBothSettingsChange(RefTextChangeType.fontColor, e)}
              />
            </Col>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}