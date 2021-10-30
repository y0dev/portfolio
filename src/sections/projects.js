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
         filterTags: [],
         projectModules: []
      };
      this.toggleCriteria = this.toggleCriteria.bind(this);
      
      // console.log(filtered);
      for (let i = 0; i < this.filtered().length; i++) {
         this.state.projectModules.push(<ProjectModule key={i} project={this.filtered()[i]} />)
      }
      
      for (let i = 0; i < this.state.criteria.length; i++) {
         this.state.filterTags.push(<li onClick={this.toggleCriteria} key={i}><FilterTag type={this.state.criteria[i]} state={this.state.criteria[i] === this.state.selectedType} /></li>);
      }
   }
   filtered() {
      return projects.filter((project) => {
         if(this.state.selectedType === 'In Production') {
            return project.favorite === 'Favorites';
         }
         return project.category === this.state.selectedType;
      })
   }
   toggleCriteria(event) {
      // console.log(event.target);
      // console.log(event.target.innerHTML);

      let newFilterTags = [];
      for (let i = 0; i < this.state.criteria.length; i++) {
         newFilterTags.push(<li onClick={this.toggleCriteria} key={i}><FilterTag type={this.state.criteria[i]} state={this.state.criteria[i] === this.state.selectedType} /></li>);
      }
      let newProjectModules = [];
      for (let i = 0; i < this.filtered().length; i++) {
         newProjectModules.push(<ProjectModule key={i} project={this.filtered()[i]} />)
      }
      this.setState({selectedType: event.target.innerHTML,
                     filterTags: newFilterTags,
                     projectModules: newProjectModules});
   }
   render() {
      return (
         <section id='projects'>
            <h1 className='section-title'>Projects</h1>
            <ul className='criteria-list'>
               {this.state.filterTags}
            </ul>
            <div className='project-container'>
               {this.state.projectModules}
            </div>
         </section>
      );
    }
}

export default Projects;