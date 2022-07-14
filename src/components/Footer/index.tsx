import './index.css';
import { Button, Col, Container, Row, ToggleButton, ToggleButtonGroup } from "react-bootstrap";

export default function Footer() {
  return (
    <Container fluid className="App-footer">
      <Row>
        <Col xs={2}>
          <Button className="float-start">{'<'}</Button>
        </Col>
        <Col xs={8}>
          <Row className="text-center">
            <Col xs={3}>
              <Button>Read</Button>
            </Col>
            <Col xs={3}>
              <Button>Notes</Button>
            </Col>
            <Col xs={3}>
              <Button>Search</Button>
            </Col>
            <Col xs={3}>
              <Button>Settings</Button>
            </Col>
          </Row>
        </Col>
        <Col xs={2}>
          <Button className="float-end">{'>'}</Button>
        </Col>
      </Row>
    </Container>
  );
}
