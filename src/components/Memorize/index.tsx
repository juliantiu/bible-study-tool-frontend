import './index.css';
import { Col, Container, Row } from "react-bootstrap";
import MemorizeNavbar from "./MemorizeNavbar";
import MemorizeSettings from './MemorizeSettings';
import MemorizeCountdown from './MemorizeCountdown';
import MemorizeQuizWindow from "./MemorizeQuizWIndow";
import MemorizeHistory from './MemorizeHistory';

export default function Memorize() {
  return (
    <div className="h-100">
      <MemorizeNavbar />
      <Container className="content-window" fluid>
        <Row className="h-100">
          <Col xs={12} id="memorize-content-window">
            <Row>
              <Col xs={12} md={7}>
                <MemorizeSettings />
              </Col>
              <Col xs={12} md={5}>
                <MemorizeCountdown />
              </Col>
            </Row>
            <Row id="memorize-quiz-window-container">
              <Col xs={12} md={7}>
                <MemorizeQuizWindow />
              </Col>
              <Col xs={12} md={5}>
                <MemorizeHistory />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}