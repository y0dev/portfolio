import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router,
  useRoutes
} from "react-router-dom";
import NavBar from './components/navbar';
import Footer from './components/footer';
import ProjectsPage from './pages/projects';
import HomePage from './pages/home';
import AboutMePage from './pages/aboutme';
import ArticlesPage from './pages/articles';
import ViewArticlePage from './pages/viewarticle';
import reportWebVitals from './reportWebVitals';
import './sections/css/utilities.css';

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about-me", element: <AboutMePage /> },
    { path: "/articles", element: <ArticlesPage /> },
    { path: "/projects", element: <ProjectsPage /> },
    { path: "/articles/:id", element: <ViewArticlePage /> },
    // ...
  ]);
  return routes;
};

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <NavBar />
      <App />
    </Router>
    <Footer />
  </React.StrictMode>,
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
