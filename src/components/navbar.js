import './css/navbar.css';
// import { Link } from "react-router-dom";
import { Component } from 'react';
import logo from '../assets/images/logos/logo192.png';

class NavBar extends Component {
   constructor() {
      super();
      this.state = {
         menu_color: '',
         menu_bg_color: ''
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
            displayButtons[0].innerText = '☀️'; 
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
  toggleMenu(event) {
   const menu = document.getElementById('menu-button');
   const side_menu = document.getElementById('side-menu'); 
   //   console.log(event.target) 
     if(event.target.id === 'menu-button' 
        || event.target.className === 'menu-line') {
      menu.classList.toggle('active');
      side_menu.classList.toggle('show');
     }

     const menu_color = document.documentElement.style.getPropertyValue('--menu-color');
     const menu_bg_color = document.documentElement.style.getPropertyValue('--menu-background-color');
   //   console.log(menu_color,menu_bg_color);
     if(menu.classList.contains('active') && (menu_color === '#FFFFFF' && menu_bg_color === 'rgba(255, 255, 255, 0)')) {
         document.documentElement.style.setProperty('--menu-color', '#000000');
         document.documentElement.style.setProperty('--menu-background-color', 'rgba(255, 255, 255, 1)');
     } else if (!menu.classList.contains('active')) {
         document.documentElement.style.setProperty('--menu-color', this.state.menu_color);
         document.documentElement.style.setProperty('--menu-background-color', this.state.menu_bg_color);
     }
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
         displayButtons[0].innerText = '🌙';
         localStorage.setItem('dark-mode', "false");
      } else {
         htmlTag.classList.add('dark');
         displayButtons[0].innerText = '☀️';
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
      return (
         <div id='nav-bar' onScroll={this.handleScroll} className="fixed z-50 w-full h-[75px] bg-white dark:bg-gray-800 transition-all duration-400">
            <nav className="h-full">
               <div className='max-w-[950px] mx-auto px-5 py-4 flex items-center justify-between'>
                  <a href="/" className="flex items-center gap-3">
                     <img src="/images/logo.png" alt="branding-logo" className="w-10 h-10" />
                     <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Devontae Reid</h3>
                  </a>
                  <ul className='flex items-center gap-6'>
                     <li><a href="/projects" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Projects</a></li>
                     <li><a href="/articles" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Articles</a></li>
                     <li><a href="/gospel" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Gospel</a></li>
                     <li><button className='display-switch p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700' onClick={this.changeDisplay}>☀️</button></li>
                  </ul>
               </div>
            </nav>
         </div>
      )
  }
}

export default NavBar;