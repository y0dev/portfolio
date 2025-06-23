// import { Link } from "react-router-dom";
import React, { Component } from 'react';
import logo from '../assets/images/logos/logo192.png';

class NavBar extends Component {
   constructor() {
      super();
      this.state = {
         menu_color: '',
         menu_bg_color: '',
         showMobileMenu: false,
      };
      this.handleScroll = this.handleScroll.bind(this);
      this.toggleMenu = this.toggleMenu.bind(this);
      this.changeDisplay = this.changeDisplay.bind(this);
   }
   
   componentDidMount() {
      const display = localStorage.getItem('dark-mode');
      
      if (display !== null) {
         const htmlTag = document.getElementsByTagName('html')[0];
         const displayButtons = document.getElementsByClassName('display-switch');

         // If last known theme was dark toggle the theme to dark
         if (display === 'true' && !htmlTag.classList.contains('dark')) {
            htmlTag.classList.add('dark');
            if (displayButtons[0]) displayButtons[0].innerText = '☀️'; 
         }
      }
      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener("hashchange", this.addPixels);
   }
  
   
   componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener("hashchange", this.addPixels);
   }
   
   addPixels(event) {
   //   console.log(window.screen.width);
      window.scrollTo(window.scrollX, window.scrollY - 70);
   }

   // Scroll event
   handleScroll(event){
      const navbar = document.getElementById('nav-bar');
      if (window.scrollY > 50) {
         navbar.classList.add('shadow-md');
         navbar.classList.add('h-[60px]');
      } else {
         navbar.classList.remove('shadow-md');
         navbar.classList.remove('h-[60px]');
      }
   }

  // This is to toggle menu button on all phone or tablets
  toggleMenu() {
   this.setState((prevState) => ({ showMobileMenu: !prevState.showMobileMenu }));
  }
   changeDisplay(event) { 
      // Create a media condition that targets viewports prefers dark color scheme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      // Check if the media query is true
      if (mediaQuery.matches) {
         return;
      }

      const htmlTag = document.getElementsByTagName('html')[0];
      const displayButtons = document.getElementsByClassName('display-switch');

      if (htmlTag.classList.contains('dark')) {
         htmlTag.classList.remove('dark');
         if (displayButtons[0]) displayButtons[0].innerText = '🌙';
         localStorage.setItem('dark-mode', "false");
      } else {
         htmlTag.classList.add('dark');
         if (displayButtons[0]) displayButtons[0].innerText = '☀️';
         localStorage.setItem('dark-mode', "true");
      }
   }

   closeMenu(event) {
      if(event.target.className === 'side-link') {
         let menu = document.getElementById('menu-button');
         let side_menu = document.getElementById('side-menu'); 
         menu.classList.toggle('active');
         side_menu.classList.toggle('show');
      }
   }

  render() {
      const { showMobileMenu } = this.state;
      return (
         <div id='nav-bar' onScroll={this.handleScroll} className="fixed z-50 w-full h-[75px] bg-white dark:bg-gray-800 transition-all duration-400">
            <nav className="h-full">
               <div className='max-w-[950px] mx-auto px-5 py-4 flex items-center justify-between'>
                  <a href="/" className="flex items-center gap-3">
                     <img src="/images/logo.png" alt="branding-logo" className="w-10 h-10" />
                     <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Devontae Reid</h3>
                  </a>
                  {/* Hamburger menu button for mobile */}
                  <button
                     className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
                     onClick={this.toggleMenu}
                     aria-label="Toggle menu"
                  >
                     <span className={`block w-6 h-0.5 bg-gray-800 dark:bg-white mb-1 transition-all ${showMobileMenu ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                     <span className={`block w-6 h-0.5 bg-gray-800 dark:bg-white mb-1 transition-all ${showMobileMenu ? 'opacity-0' : ''}`}></span>
                     <span className={`block w-6 h-0.5 bg-gray-800 dark:bg-white transition-all ${showMobileMenu ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                  </button>
                  {/* Desktop menu */}
                  <ul className="hidden md:flex items-center gap-6">
                     <li><a href="/projects" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Projects</a></li>
                     <li><a href="/articles" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Articles</a></li>
                     <li><a href="/gospel" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Gospel</a></li>
                     <li><button className='display-switch p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700' onClick={this.changeDisplay}>☀️</button></li>
                  </ul>
               </div>
               {/* Mobile menu dropdown */}
               <div className={`md:hidden w-full bg-white dark:bg-gray-800 transition-all duration-300 ${showMobileMenu ? 'block' : 'hidden'}`}>
                  <ul className="flex flex-col items-center gap-4 py-4">
                     <li><a href="/projects" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" onClick={this.toggleMenu}>Projects</a></li>
                     <li><a href="/articles" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" onClick={this.toggleMenu}>Articles</a></li>
                     <li><a href="/gospel" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" onClick={this.toggleMenu}>Gospel</a></li>
                     <li><button className="display-switch p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" onClick={this.changeDisplay}>☀️</button></li>
                  </ul>
               </div>
            </nav>
         </div>
      )
  }
}

export default NavBar;