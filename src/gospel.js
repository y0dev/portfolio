'use strict';

import { createRoot } from 'react-dom/client';
import './index.css';
import NavBar from './components/navbar';
import Footer from './components/footer';
import GospelPage from './pages/gospel';
// import reportWebVitals from './reportWebVitals';
import './sections/css/utilities.css';
import favicon from './assets/images/logos/logo192.png'

const root = document.getElementById('root');
const reactRoot = createRoot(root);
reactRoot.render(
  <React.StrictMode>
      <NavBar />
      <GospelPage />
      <Footer />
   </React.StrictMode>
);
