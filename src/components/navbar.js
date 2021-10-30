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
      if(this.window.scrollY === 0) {
         navbar.style.backgroundColor = 'rgb(255, 255, 255,0)';
         navbar.style.position = 'relative';
      } else if (this.window.scrollY >= 1 && this.window.scrollY < 150){
         document.documentElement.style.setProperty('--menu-color', '#FFFFFF');
      } else if (this.window.scrollY >= 150 && this.window.scrollY < 200) {
         navbar.style.backgroundColor = 'rgb(255, 255, 255,0.43)'
      } else if (this.window.scrollY >= 200 && this.window.scrollY < 300) {
         navbar.style.backgroundColor = 'rgb(255, 255, 255,0.863)';
      } else if (this.window.scrollY >= 300) {
         navbar.style.backgroundColor = 'rgb(255, 255, 255,0.992)';
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
                  <li><a href="#theology">Theology</a></li>
                  <li><a href="#blogs">Blog</a></li>
                  <li><a href="#contact">Contact</a></li>
               </ul>
               <div id='menu-button' className='hamburger-menu'></div>
            </nav>
         </div>
      )
  }
}

export default NavBar;