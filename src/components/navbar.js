import './css/navbar.css';
import {Component} from 'react';

class NavBar extends Component {
   constructor() {
      super();
      this.state = {
         menu_color: '',
         menu_bg_color: ''
      };
      this.handleScroll = this.handleScroll.bind(this);
      this.toggleMenu = this.toggleMenu.bind(this);
   }
   componentDidMount() {
      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener("hashchange", this.addPixels);
  }
  
  componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener("hashchange", this.addPixels);
  }
  addPixels(event) {
   //   console.log(window.screen.width);
      window.scrollTo(window.scrollX, window.scrollY - 100);
  }
   handleScroll(event){
      let navbar = document.getElementById('nav-bar');
      document.documentElement.style.setProperty('--menu-color', '#000000');
      document.documentElement.style.setProperty('--menu-background-color', 'rgba(255, 255, 255, 0)');
      // console.log(navbar)
      navbar.style.position = 'fixed';
      navbar.style.top = 20;
      navbar.style.left = 0;
      // console.log(this.window.scrollY);
      if(window.scrollY === 0) {
         document.documentElement.style.setProperty('--menu-background-color', '#FFFFFF');
         navbar.style.position = 'relative';
      } else if (window.scrollY >= 1 && window.scrollY < 500){
         document.documentElement.style.setProperty('--menu-color', '#FFFFFF');
      } else if (window.scrollY >= 500 && window.scrollY < 550) {
         document.documentElement.style.setProperty('--menu-background-color', 'rgba(255, 255, 255, 0.43)');
      } else if (window.scrollY >= 550 && window.scrollY < 600) {
         document.documentElement.style.setProperty('--menu-background-color', 'rgba(255, 255, 255, 0.863)');
      } else if (window.scrollY >= 600) {
         document.documentElement.style.setProperty('--menu-background-color', '#FFFFFF');
      }
      this.setState({
         menu_color: document.documentElement.style.getPropertyValue('--menu-color'),
         menu_bg_color: document.documentElement.style.getPropertyValue('--menu-background-color')
      })
  }

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
                  <div className="logo">
                     <img src="https://i.ibb.co/HY4dx9s/headshot.jpg" alt="headshot" />
                     <h3>Devontae Reid</h3>
                  </div>
                  <div id='menu-button' className='hamburger-menu' onClick={this.toggleMenu}>
                     <span className='menu-line'></span>
                     <span className='menu-line'></span>
                     <span className='menu-line'></span>
                     <span className='menu-line'></span>
                  </div>
                  <ul>
                     <li><a href="#intro">Home</a></li>
                     <li><a href="#about-me">About</a></li>
                     <li><a href="#projects">Projects</a></li>
                     {/* <li><a href="#theology">Theology</a></li> */}
                     <li><a href="https://devssite.net/">Blog</a></li>
                     <li><a href="#contact-me">Contact</a></li>
                  </ul>
               </div>
               <div id='side-menu' className='side-menu'>
                  <ul>
                     <li><a className='side-link' onClick={this.closeMenu} href="#intro">Home</a></li>
                     <li><a className='side-link' onClick={this.closeMenu} href="#about-me">About</a></li>
                     <li><a className='side-link' onClick={this.closeMenu} href="#projects">Projects</a></li>
                     {/* <li><a className='side-link' onClick={this.closeMenu} href="#theology">Theology</a></li> */}
                     <li><a className='side-link' onClick={this.closeMenu} href="https://devssite.net/">Blog</a></li>
                     <li><a className='side-link' onClick={this.closeMenu} href="#contact-me">Contact</a></li>
                  </ul>
               </div>
            </nav>
         </div>
      )
  }
}

export default NavBar;