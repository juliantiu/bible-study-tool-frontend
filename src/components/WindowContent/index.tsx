import { useParams } from 'react-router-dom';
import useWindowManager from '../../hooks/useWindowManager';
import { WindowType } from '../../types/Windows';
import Read from '../Read';
import Memorize from '../Memorize';
import Search from '../Search';

export default function WindowContent() {
  const { windowId } = useParams();
  const { windows } = useWindowManager();

  const currWindow = windows.find(window => { 
    return window.windowId+1 === +windowId!
  });

  return (
    <>
      {currWindow?.windowType === WindowType.read && <Read />}
      {currWindow?.windowType === WindowType.search && <Search />}
      {currWindow?.windowType === WindowType.memorize && <Memorize />}
    </>
  );
}