'use strict';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import './sections/css/utilities.css';

import NavBar from './components/navbar';
import Footer from './components/footer';
import ProjectsPage from './pages/projects';
import AboutMePage from './pages/aboutme';
import ArticlesPage from './pages/articles';
import GospelPage from './pages/gospel';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavBar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <Routes>
            <Route path="/" element={<AboutMePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/gospel" element={<GospelPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);