import './css/navbar.css';

function NavBar() {
   return (
      <div className="navbar">
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

export default NavBar;