import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container } from 'react-bootstrap';
import Footer from './components/Footer';
import { BackendConnectionContextProvider } from './contexts/backend-connection';
import { BibleReaderContextProvider } from './contexts/bible-reader';
import { GlobalFeaturesConfigurationContextProvider } from './contexts/gloabl-features-confirguration';

function Layout() {
  return (
    <>
      <Container fluid>
        
      </Container>
      <Footer />
    </>
  );
}

function Routing() {
  return (
    <Layout />
  );
}

function ContextProviderLayer() {
  return (
    <GlobalFeaturesConfigurationContextProvider>
      <BackendConnectionContextProvider>
          <BibleReaderContextProvider>
            <Routing />
          </BibleReaderContextProvider>
      </BackendConnectionContextProvider>
    </GlobalFeaturesConfigurationContextProvider>
  );
}

function App() {
  return <ContextProviderLayer />
}

export default App;
