import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom";
import NavBar from './components/navbar';
import Footer from './components/footer';
import ProjectsPage from './pages/projects';
import HomePage from './pages/home';
import AboutMePage from './pages/aboutme';
import ArticlesPage from './pages/articles';
import reportWebVitals from './reportWebVitals';
// import Intro from './sections/intro';
// import About_Me_Section from './sections/about_me';
// import Projects from './sections/projects';
import './sections/css/utilities.css';
// import ContactMe from './sections/contact_me';

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about-me", element: <AboutMePage /> },
    { path: "/articles", element: <ArticlesPage /> },
    { path: "/projects", element: <ProjectsPage /> },
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
    
    {/* <Intro /> */}
    
    {/* <Projects />
    <ContactMe /> */}
    {/* <App /> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
