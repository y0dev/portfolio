'use strict';

// import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import {
//   BrowserRouter as Router,
//   useRoutes
// } from "react-router-dom";
// import NavBar from './components/navbar';
// import Footer from './components/footer';
import ProjectsPage from './pages/projects';
// // import HomePage from './pages/home';
import AboutMePage from './pages/aboutme';
import ArticlesPage from './pages/articles';
// import ViewArticlePage from './pages/viewarticle';
// import reportWebVitals from './reportWebVitals';
import './sections/css/utilities.css';


const aboutMeCont = document.getElementById('about-me-root');
const aboutMeRoot = createRoot(aboutMeCont);
aboutMeRoot.render(<AboutMePage />);

const projectCont = document.getElementById('projects-root');
const projectRoot = createRoot(projectCont);
projectRoot.render(<ProjectsPage />);

const articleCont = document.getElementById('articles-root');
const articleRoot = createRoot(articleCont);
articleRoot.render(<ArticlesPage />);