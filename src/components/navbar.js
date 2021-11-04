import './css/navbar.css';
import {Component} from 'react';

class NavBar extends Component {
   componentDidMount() {
      window.addEventListener('scroll', this.handleScroll);
  }
  
  componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
  }
   handleScroll(event){
      let navbar = document.getElementById('nav-bar');
      document.documentElement.style.setProperty('--menu-color', '#000000');
      // console.log(navbar)
      navbar.style.cssText = 'background-color: rgba(255, 255, 255, 0); transition: background-color 0.5s cubic-bezier(0.29, 0.26, 0.54, 1.19);';
      navbar.style.position = 'fixed';
      navbar.style.top = 20;
      navbar.style.left = 0;
      // console.log(this.window.scrollY);
      if(this.window.scrollY === 0) {
         navbar.style.backgroundColor = 'rgb(255, 255, 255,0)';
         navbar.style.position = 'relative';
      } else if (this.window.scrollY >= 1 && this.window.scrollY < 500){
         document.documentElement.style.setProperty('--menu-color', '#FFFFFF');
      } else if (this.window.scrollY >= 500 && this.window.scrollY < 550) {
         navbar.style.backgroundColor = 'rgb(255, 255, 255,0.43)'
      } else if (this.window.scrollY >= 550 && this.window.scrollY < 600) {
         navbar.style.backgroundColor = 'rgb(255, 255, 255,0.863)';
      } else if (this.window.scrollY >= 600) {
         navbar.style.backgroundColor = 'rgb(255, 255, 255,0.992)';
      }
  }

  toggleMenu(event) {
     if(event.target.id === 'menu-button') {
      let menu = document.getElementById(event.target.id);
      menu.classList.toggle('active');
     }
  }

  render() {
      return (
         <div id='nav-bar' onScroll={this.handleScroll} className="navbar">
            <nav>
               <div className="logo">
                  <img src="https://i.ibb.co/HY4dx9s/headshot.jpg" alt="headshot" />
                  <h3>Devontae Reid</h3>
               </div>
               <ul>
                  <li><a href="#intro">Home</a></li>
                  <li><a href="#about-me">About</a></li>
                  <li><a href="#projects">Projects</a></li>
                  {/* <li><a href="#theology">Theology</a></li> */}
                  <li><a href="https://devssite.net/">Blog</a></li>
                  <li><a href="#contact-me">Contact</a></li>
               </ul>
               <div id='menu-button' className='hamburger-menu' onClick={this.toggleMenu}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
               </div>
            </nav>
         </div>
      )
  }
}

export default NavBar;