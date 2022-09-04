

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  BrowserRouter as Router,
  useRoutes
} from "react-router-dom";
import NavBar from './components/navbar';
import Footer from './components/footer';
import ProjectsPage from './pages/projects';
// import HomePage from './pages/home';
import AboutMePage from './pages/aboutme';
import ArticlesPage from './pages/articles';
import ViewArticlePage from './pages/viewarticle';
import reportWebVitals from './reportWebVitals';
import './sections/css/utilities.css';

const App = () => {
  let routes = useRoutes([
    // { path: "/", element: <HomePage /> },
    { path: "/", element: <AboutMePage /> },
    { path: "/about-me", element: <AboutMePage /> },
    { path: "/articles", element: <ArticlesPage /> },
    { path: "/projects", element: <ProjectsPage /> },
    { path: "/articles/:id", element: <ViewArticlePage /> },
    { path: "/notes/:id", element: <ViewArticlePage /> },
  ]);
  return routes;
};
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Router>
      <NavBar />
      <App />
    </Router>
    <Footer />
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
