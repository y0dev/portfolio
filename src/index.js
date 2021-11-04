import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import NavBar from './components/navbar';
import reportWebVitals from './reportWebVitals';
import Footer from './components/footer';
import Intro from './sections/intro';
import AboutMe from './sections/about_me';
import Projects from './sections/projects';
import './sections/css/utilities.css';
import ContactMe from './sections/contact_me';
ReactDOM.render(
  <React.StrictMode>
    <NavBar />
    <Intro />
    <AboutMe />
    <Projects />
    <ContactMe />
    <Footer />
    {/* <App /> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
