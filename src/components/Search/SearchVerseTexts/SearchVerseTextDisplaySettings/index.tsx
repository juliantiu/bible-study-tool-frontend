import { Col, Form, Row } from 'react-bootstrap';
import './index.css';

export default function SearchVerseTextDisplaySettings() {

  const verseReferenceFormCheckOps = ['bolded'].map(
    (option) => {
      return (
        <Form.Check
          inline
          id={`verse-reference-form-check-option-${option}`}
          type="checkbox"
          label={option}
          className="mt-2"
        />
      )
    }
  );

  const verseTextFormCheckOps = ['bolded'].map(
    (option) => {
      return (
        <Form.Check
          inline
          id={`verse-text-form-check-option-${option}`}
          type="checkbox"
          label={option}
          className="mt-2"
        />
      )
    }
  );

  const verseBothFormCheckOps = ['newline'].map(
    (option) => {
      return (
        <Form.Check
          inline
          id={`verse-both-form-check-option-${option}`}
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
              <Form.Control type="number" size="sm" defaultValue={11}/>
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
              <Form.Control type="number" size="sm" defaultValue={11}/>
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
            <Form.Label column xs="auto" htmlFor="exampleColorInput" style={{ 'paddingLeft': '8px' }}>Font color</Form.Label>
            <Col xs="auto">
              <Form.Control 
                type="color"
              />
            </Col>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}