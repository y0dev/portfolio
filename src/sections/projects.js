import './css/projects.css';
import projects from '../assets/json/projects.json'
import ProjectModule from '../components/projectmodule';
import FilterTag from '../components/filter_tags';
import React from 'react';
class Projects extends React.Component {
   constructor() {
      super();
      this.state = {
         selectedType: 'In Production',
         criteria: ["In Production", "Programming"],
      };
      this.toggleCriteria = this.toggleCriteria.bind(this);
   }
   filtered() {
      return projects.filter((project) => {
         if(this.state.selectedType === 'In Production') {
            return project.favorite === 'Favorites';
         }
         return project.category === this.state.selectedType;
      })
   }
   // https://www.freecodecamp.org/news/updating-state-from-child-component-onclick/
   toggleCriteria(event) {
      this.setState({selectedType: event.target.innerHTML});
   }

   render() {
      const tags = this.state.criteria.map((type,idx) => (
         <li key={idx}><FilterTag 
                        type={type} 
                        state={type === this.state.selectedType}
                        handleChange={this.toggleCriteria} /></li>
      ));

      const projects = this.filtered().map((project,idx) => (
         <ProjectModule key={idx} project={project} />
      ));
      
      return (
         <section id='projects'>
            <h1 className='section-title'>Projects</h1>
            <ul className='criteria-list'>
               {tags}
            </ul>
            <div className='project-container'>
               {projects}
            </div>
         </section>
      );
    }
}

export default Projects;