import './index.css';
import { useCallback, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Window, WindowType } from "../../../types/Windows";
import useWindowManager from '../../../hooks/useWindowManager';

interface INewWindowPopup {
  numWindows: number;
  onClose: () => void;
  show: boolean;
}

export default function NewWindowPopup({ numWindows, onClose, show }: INewWindowPopup) {
  const [windowType, setWindowType] = useState<WindowType>(WindowType.none);
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
      windowType: windowType
    }
    addWindow(newWindow);
    onClearAndHide();
  }

  return (
    <Modal show={show} onHide={onClearAndHide}>
      <Modal.Body>
        <div id="new-window-options">
          <button className={windowType === WindowType.read ? 'active' : ''} onClick={() => onWindowOptionClick(WindowType.read)}>&#x1f4d6;</button>
          <button className={windowType === WindowType.search ? 'active' : ''} onClick={() => onWindowOptionClick(WindowType.search)}>&#128269;</button>
          <button className={windowType === WindowType.memorize ? 'active' : ''} onClick={() => onWindowOptionClick(WindowType.memorize)}>&#129504;</button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onClearAndHide}>Close</Button>
        <Button id="new-window-add-button" onClick={onAddWindow}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
}
