import './App.css';
import { BackendConnectionContextProvider } from './contexts/backend-connection';
import { BibleReaderContextProvider } from './contexts/bible-reader';

function ContextProviderLayer() {
  return (
    <BackendConnectionContextProvider>
      <BibleReaderContextProvider>
        <h1>Hello world!</h1>
      </BibleReaderContextProvider>
    </BackendConnectionContextProvider>
  );
}

function App() {
  return <ContextProviderLayer />
}

export default App;
