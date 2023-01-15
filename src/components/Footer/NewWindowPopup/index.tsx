import './index.css';
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Window, WindowType } from "../../../types/Windows";
import useWindowManager from '../../../hooks/useWindowManager';
import useGlobalFeaturesConfiguration from '../../../hooks/useGlobalfeaturesConfiguration';

interface INewWindowPopup {
  numWindows: number;
  onClose: () => void;
  show: boolean;
}

export default function NewWindowPopup({ numWindows, onClose, show }: INewWindowPopup) {
  const { defaultLanguage, defaultBibleVersion, languageAndBibleVersionList } = useGlobalFeaturesConfiguration();

  const [windowType, setWindowType] = useState<WindowType>(WindowType.none);
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [selectedBibleVersion, setSelectedBibleVersion] = useState(defaultBibleVersion);
  const { addWindow } = useWindowManager();

  const onWindowOptionClick = (option: WindowType) => {
    setWindowType(option);
  }
  
  const onClearAndHide = useCallback(
    () => {
      setWindowType(WindowType.none);
      onClose();
    },
    [onClose, setWindowType]
    );
    
  const onAddWindow = () => {
    const newWindow: Window = {
      windowId: numWindows,
      windowType: windowType,
      language: selectedLanguage,
      bibleVersion: selectedBibleVersion
    }
    addWindow(newWindow);
    onClearAndHide();
  }

  const buttonActiveClass = (type: WindowType) => {
    return windowType === type ? 'active' : '';
  }

  const onLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const onBibleVersionChange = (ver: string) => {
    setSelectedBibleVersion(ver);
  };

  const languageOptions = useMemo(
    () => {
      if (!!languageAndBibleVersionList && languageAndBibleVersionList.length > 0) {
        return languageAndBibleVersionList
          .map(
            (lang) => {
              return (
                <option key={lang.iso639} value={lang.endonym} onChange={() => onLanguageChange(lang.iso639)}>{lang.endonym}</option>
              );
            }
          );
      }

      return <option>Select</option>;
    },
    [languageAndBibleVersionList]
  );

  const bibleVersionOptions = useMemo(
    () => {
      if (!!languageAndBibleVersionList && languageAndBibleVersionList.length > 0) {
        return languageAndBibleVersionList.find(lang => lang.iso639 === selectedLanguage)!.bibles
        .map(
          (ver) => {
            return (
              <option
                key={`bible-version-option-${ver.fileName}`}
                value={ver.fileName}
                onChange={() => onBibleVersionChange(ver.fileName)}
              >
                {ver.version}
              </option>
            );
          }
        );
      }
      
      return <option>Select</option>;
    },
    [languageAndBibleVersionList, languageOptions]
  );

  return (
    <Modal show={show} onHide={onClearAndHide}>
      <Modal.Body>
        <Row>
          <Col xs={12}>
            <div id="new-window-options">
              <button className={buttonActiveClass(WindowType.read)} onClick={() => onWindowOptionClick(WindowType.read)}>&#x1f4d6;</button>
              <button className={buttonActiveClass(WindowType.search)} onClick={() => onWindowOptionClick(WindowType.search)}>&#128269;</button>
              <button className={buttonActiveClass(WindowType.memorize)} onClick={() => onWindowOptionClick(WindowType.memorize)}>&#129504;</button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Form>
              <Row className="mb-2">
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Language</Form.Label>
                    <Form.Select>
                      {languageOptions}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Bible version</Form.Label>
                    <Form.Select>
                      {bibleVersionOptions}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onClearAndHide}>Close</Button>
        <Button id="new-window-add-button" onClick={onAddWindow} disabled={windowType === WindowType.none}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
}
