import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Footer from './components/Footer';
import { BackendConnectionContextProvider } from './contexts/backend-connection';
import { AuthContextProvider } from './contexts/auth';
import { GlobalFeaturesConfigurationContextProvider } from './contexts/gloabl-features-confirguration';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import { WindowManagerContextProvider } from './contexts/window-manager';
import WindowContent from './components/WindowContent';
import { useEffect } from 'react';

// function Layout() {
//   return (
//     <>
//       <Routes>
//         <Route path="read" element={<Read/>}/>
//         {/* <Route path="notes" element={<h1>notes</h1>}/> */}
//         <Route path="search" element={<h1>search</h1>}/>
//         {/* <Route path="settings" element={<h1>settings</h1>}/> */}
//         <Route path="memorize" element={<h1>memorize</h1>}/>
//       </Routes>
//       <Footer />
//     </>
//   );
//  }

function DummyComponent() {

  const navigate = useNavigate();

  useEffect(
    () => {
      navigate('/window/1/search');
    },
    [navigate]
  );

  return (
    <></>
  );
}

function Layout() {
  return (
    <>
      <Routes>
        <Route index element={<DummyComponent />} />
        <Route path="window/:windowId/:windowType" element={<WindowContent />}>
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

function Routing() {
  return (
    <>
      <Router>
        <Layout />
      </Router>
    </>
  );
}

function ContextProviderLayer() {
  return (
    <AuthContextProvider>
      <GlobalFeaturesConfigurationContextProvider>
        <BackendConnectionContextProvider>
          <WindowManagerContextProvider>
            <Routing />
          </WindowManagerContextProvider>
        </BackendConnectionContextProvider>
      </GlobalFeaturesConfigurationContextProvider>
    </AuthContextProvider>
  );
}

function App() {
  return <ContextProviderLayer />
}

export default App;
