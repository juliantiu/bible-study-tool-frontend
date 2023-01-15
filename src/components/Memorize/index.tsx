import './index.css';
import { Col, Container, Row } from "react-bootstrap";
import MemorizeNavbar from "./MemorizeNavbar";
import MemorizeSettings from './MemorizeSettings';
import MemorizeCountdown from './MemorizeCountdown';
import MemorizeQuizWindow from "./MemorizeQuizWIndow";
import MemorizeHistory from './MemorizeHistory';
import { Window } from '../../types/Windows';
import useVerseRequester from '../../hooks/useVerseRequester';
import { useEffect, useState } from 'react';
import { BibleVerse } from '../../types/BibleContents';

interface IMemorize {
  currWindow: Window
}

export default function Memorize(memorizeProps: IMemorize) {
  const { currWindow } = memorizeProps;
  const { bibleVersion, language } = currWindow;
  const { requestVerses } = useVerseRequester(language ?? '', bibleVersion ?? '');
  const [verseList, setVerseList] = useState<BibleVerse[]>([]);

  useEffect(
    () => {
      requestVerses('Psa. 113:21; 1 John 3:22, 23,24, 3:25; Rev 18:22-25; Rev. 5; 2 Tim 2:22-3:1');
    },
    []
  );

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