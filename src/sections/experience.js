import './css/experience.css';
import _experiences from '../assets/json/experience.json';
import ExperienceModule from '../components/experiencemodule';

function ExperienceSection() {
    const experiences = _experiences.map((experience, idx) => (
        <li className='experience-item' key={idx}><ExperienceModule 
                        icon={experience.icon} 
                        details={experience.details} /></li>
     ));
   return (
      <section id='experiences'>
         <div className='content'>
            <h2>Experience</h2>
            <ul className="experience-container">
                {experiences}              
            </ul>
         </div>
      </section>
   )
}

export default ExperienceSection;