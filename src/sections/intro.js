import './css/intro.css';

function Intro() {
   return (
      <section id='intro'>
         <div className='container'>
            <div className='name'>
               <h2>Hi, I'm <span>Devontae Reid</span></h2>
               <p>A Full-Stack Web Developer building the Frontend of Websites and Web Applications that leads to the success of the overall product</p>
            </div>
            <a className='bttn' href='#projects'>Projects</a>
         </div>
         <div className='mouse'></div>
      </section>
   )
}

export default Intro;