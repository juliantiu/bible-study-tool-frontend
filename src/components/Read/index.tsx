import { Row, Col, Container } from "react-bootstrap";
import ReadNavbar from "./ReadNavbar"; 

export default function Read() {
  return (
    <div className="h-100">
      <ReadNavbar />
      <Container className="content-window" fluid>
        <Row>
          <Col xs={12}>
          </Col>
        </Row>
      </Container>
    </div>
  );
}