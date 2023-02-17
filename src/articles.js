'use strict';

import images from './assets/images/images.js';
// import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import NavBar from './components/navbar';
import Footer from './components/footer';
import ArticlesPage from './pages/articles';
import './sections/css/utilities.css';

const articleCont = document.getElementById('root');
const articleRoot = createRoot(articleCont);
articleRoot.render(
   <React.StrictMode>
      <NavBar />
      <ArticlesPage />
      <Footer />
   </React.StrictMode>
);