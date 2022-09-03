import './css/navbar.css';
import { Link } from "react-router-dom";
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
      
      if (display !== null)
      {
         const htmlTag = document.getElementsByTagName('html')[0];
         const displayButtons = document.getElementsByClassName('display-switch');

         // If last known theme was dark toggle the theme to dark
         if ( display === 'true' && !htmlTag.classList.contains('dark-mode') )
         {
            htmlTag.classList.toggle('dark-mode');
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
      // let navbar = document.getElementById('nav-bar');
      // document.documentElement.style.setProperty('--menu-color', '#000000');
      // document.documentElement.style.setProperty('--menu-background-color', 'rgba(255, 255, 255, 0)');
      // // console.log(navbar)
      // navbar.style.position = 'fixed';
      // navbar.style.top = 20;
      // navbar.style.left = 0;
      // // console.log(this.window.scrollY);
      // if(window.scrollY === 0) {
      //    document.documentElement.style.setProperty('--menu-background-color', '#FFFFFF');
      //    navbar.style.position = 'relative';
      // } else if (window.scrollY >= 1 && window.scrollY < 500){
      //    document.documentElement.style.setProperty('--menu-color', '#FFFFFF');
      // } else if (window.scrollY >= 500 && window.scrollY < 550) {
      //    document.documentElement.style.setProperty('--menu-background-color', 'rgba(255, 255, 255, 0.43)');
      // } else if (window.scrollY >= 550 && window.scrollY < 600) {
      //    document.documentElement.style.setProperty('--menu-background-color', 'rgba(255, 255, 255, 0.863)');
      // } else if (window.scrollY >= 600) {
      //    document.documentElement.style.setProperty('--menu-background-color', '#FFFFFF');
      // }
      // this.setState({
      //    menu_color: document.documentElement.style.getPropertyValue('--menu-color'),
      //    menu_bg_color: document.documentElement.style.getPropertyValue('--menu-background-color')
      // })
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
         // Then trigger an alert
         return;
      }

      const htmlTag = document.getElementsByTagName('html')[0];
      const displayButtons = document.getElementsByClassName('display-switch');

      htmlTag.classList.toggle('dark-mode');
      
      // Store state of theme into local storage
      if ( htmlTag.classList.contains('dark-mode') )
      {
         displayButtons[0].innerText = '☀️';
         localStorage.setItem('dark-mode', "true");
      }
      else
      {
         displayButtons[0].innerText = '🌙';  
         localStorage.setItem('dark-mode', "false"); 
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
         <div id='nav-bar' onScroll={this.handleScroll} className="navbar">
            <nav>
               <div className='main-menu'>
                  <Link to="/" className="menu-branding">
                     <img src={logo} alt="branding-logo" />
                     <h3>Devontae Reid</h3>
                  </Link>
                  <ul className='menu-list'>
                     <li><Link to="/about-me">About Me</Link></li>
                     <li><Link to="/projects">Projects</Link></li>
                     <li><Link to="/articles">Articles</Link></li>
                     <li><button className='display-switch' onClick={this.changeDisplay}>☀️</button></li>
                     {/* <li><a href="https://devssite.net/">Blog</a></li> */}
                  </ul>
               </div>
            </nav>
         </div>
      )
  }
}

export default NavBar;