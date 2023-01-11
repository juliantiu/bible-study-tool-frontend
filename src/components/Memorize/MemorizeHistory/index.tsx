import './index.css';
import { Col, Row } from "react-bootstrap";

export default function MemorizeHistory() {
  return (
    <div id="memorize-history">
      <Row className="h-100">
        <Col xs={12}>
          <div id="memorize-history-container">
          </div>
        </Col>
      </Row>
    </div>
  );
}
