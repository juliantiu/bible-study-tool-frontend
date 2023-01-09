import { useContext } from 'react';
import { WindowManagerContext } from '../contexts/window-manager';

export default function useWindowManager() {
  return useContext(WindowManagerContext);
}