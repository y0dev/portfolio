'use strict';

// import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import NavBar from './components/navbar';
import Footer from './components/footer';
import AboutMePage from './pages/aboutme';


const aboutMeCont = document.getElementById('root');
const aboutMeRoot = createRoot(aboutMeCont);
aboutMeRoot.render(
   <React.StrictMode>
      <NavBar />
      <AboutMePage />
      <Footer />
   </React.StrictMode>
);
