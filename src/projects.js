'use strict';

// import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import {
//   BrowserRouter as Router,
//   useRoutes
// } from "react-router-dom";
import NavBar from './components/navbar';
import Footer from './components/footer';
import ProjectsPage from './pages/projects';
// import ViewArticlePage from './pages/viewarticle';
// import reportWebVitals from './reportWebVitals';
import './sections/css/utilities.css';

const projectCont = document.getElementById('root');
const projectRoot = createRoot(projectCont);
projectRoot.render(
  <React.StrictMode>
      <NavBar />
      <ProjectsPage />
      <Footer />
   </React.StrictMode>
);