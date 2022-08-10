import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container } from 'react-bootstrap';
import Footer from './components/Footer';
import { BackendConnectionContextProvider } from './contexts/backend-connection';
import { BibleReaderContextProvider } from './contexts/bible-reader';
import { GlobalFeaturesConfigurationContextProvider } from './contexts/gloabl-features-confirguration';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Read from './components/Read';



function Layout() {
  return (
    <>
      <Routes>
        <Route path="read" element={<Read/>}/>
        {/* <Route path="notes" element={<h1>notes</h1>}/> */}
        <Route path="search" element={<h1>search</h1>}/>
        {/* <Route path="settings" element={<h1>settings</h1>}/> */}
        <Route path="memorize" element={<h1>memorize</h1>}/>
      </Routes>
      <Footer />
    </>
  );
}

function Routing() {
  return (
    <Router>
      <Layout />
    </Router>
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
