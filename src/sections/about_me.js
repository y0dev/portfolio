import './css/about_me.css';

function AboutMe() {
   return (
      <section id='about-me'>
         <div className='content'>
            <h2>A Glisp of Who I Am</h2>
            <p>
               I am a Software Engineer currently working in embedded systems. From the start I started off in iOS development and from there grew to enjoy
               web development both Front-End and Back-End. Who would have known User Interface would be a love/hate relationship. The struggle of coming 
               up with inspiration while at the same time enjoying the finish product. I am proficient in the following languages: 
               <span className='highlight'>HTML, CSS, JavaScript, C/C++, and Python</span>
               The frameworks I currently work in is <span className='highlight'>ReactJS and VueJs</span>.</p>
            <p>
               In my free time I work on cool projects while experimenting with new
               technologies. Currently I'm working on an some api's that will also
               include a chrome extension the will be written in NodeJS.
            </p>
            <p>
               If I'm not programming you will find me reading my bible or spending time
               with my family. The bible has brought me so much wisdom when it comes to life
               along with teaching me about the grace of God. My collections of books are 
               growing I believe I'm north of 100 books in my collection. Here's a list of
               my study resources 
               <span className='highlight'>
                  <a className='web-link' href="https://www.desiringgod.org/">Desiring God</a></span>  ,
               <span className='highlight'>
                  <a className='web-link' href="https://www.gty.org/">Grace To You</a> </span> , and 
               <span className='highlight'>
                  <a className='web-link' href="https://www.truthforlife.org/"> Truth for Life</a>
               </span>.
            </p>
            <ul className="icons">
               <li>
                  <img id='vuejs' src='assets/icons/vue.png' alt='vuejs'/>
               </li>
               <li>
                  <img id='reactjs' src='assets/icons/reactjs.png' alt='reactjs'/>
               </li>
               <li>
                  <img id='node' src='assets/icons/node.png' alt='node'/>
               </li>
               <li>
                  <img id='python' src='assets/icons/python.png' alt='python'/>
               </li>
               <li>
                  <a href="assets/Devontae+Reid+Resume.pdf" download>
                     <span></span>
                     <span></span>
                     <span></span>
                     <span></span>
                     Resume
                  </a>
               </li>
            </ul>
         </div>
      </section>
   )
}

export default AboutMe;