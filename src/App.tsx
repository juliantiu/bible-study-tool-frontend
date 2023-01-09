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
} from "react-router-dom";

import { VerseRequesterContextProvider } from './contexts/verse-requester';
import { WindowManagerContextProvider } from './contexts/window-manager';

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

function Layout() {
  return (
    <>
      <Routes>
        <Route path="window/:windowType/:windowId" element={<>Hello world</>}>
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
            <VerseRequesterContextProvider>
              <Routing />
            </VerseRequesterContextProvider>
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
