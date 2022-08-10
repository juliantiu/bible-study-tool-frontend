import './index.css';
import { Button, Col, Container, Row, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export default function Footer() {
  const navigation = useNavigate();

  const onReadNavigateClick = useCallback(
    () => {
      navigation("/read");
    },
    [navigation]
  );

  const onSearchNavigateClick = useCallback(
    () => {
      navigation("/search");
    },
    [navigation]
  );

  const onMemorizeNavigateClick = useCallback(
    () => {
      navigation("/memorize");
    },
    [navigation]
  );

  // return (
  //   <Container fluid className="App-footer">
  //     <Row>
  //       {/* <Col xs={2}>
  //         <Button className="float-start">{'<'}</Button>
  //       </Col> */}
  //       <Col xs={12}>
  //         <Row className="text-center">
  //           <Col xs={4}>
  //             <Button onClick={onReadNavigateClick}>Read</Button>
  //           </Col>
  //           {/* <Col xs={3}>
  //             <Button>Notes</Button>
  //           </Col> */}
  //           <Col xs={4}>
  //             <Button onClick={onSearchNavigateClick}>Search</Button>
  //           </Col>
  //           <Col xs={4}>
  //             <Button onClick={onMemorizeNavigateClick}>Memorize</Button>
  //           </Col>
  //           {/* <Col xs={3}>
  //             <Button>Settings</Button>
  //           </Col> */}
  //         </Row>
  //       </Col>
  //       {/* <Col xs={2}>
  //         <Button className="float-end">{'>'}</Button>
  //       </Col> */}
  //     </Row>
  //   </Container>
  // );

  return (
    <div id="footer">
      <button onClick={onReadNavigateClick}>&#x1f4d6;</button>
      <button onClick={onSearchNavigateClick}>&#128269; </button>
      <button onClick={onMemorizeNavigateClick}>&#129504;</button>
    </div>
  );
}
