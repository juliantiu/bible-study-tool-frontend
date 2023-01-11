import './index.css'
import { Col, Row } from "react-bootstrap";

export default function MemorizeCountdown() {
  return (
    <div id="memorize-countdown">
      <Row>
        <Col xs={12}>
          <div id="memorize-countdown-container-primary">
            <div id="memorize-countdown-container-secondary">
              hello world
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}