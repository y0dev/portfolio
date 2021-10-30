import './css/projects.css';
import projects from '../assets/json/projects.json'
import ProjectModule from '../components/projectmodule';
import FilterTag from '../components/filter_tags';

let selectedType = 'In Production';
function Projects() {
   let projectModules = [];
   let filtered = projects.filter((project) => {
      console.log(project);
      if(selectedType === 'In Production') {
         return project.favorite === 'Favorites';
      }
      return project.category === selectedType;
   })
   for (let i = 0; i < filtered.length; i++) {
      projectModules.push(<ProjectModule project={filtered[i]} />)
   }
   let filterTags = [];
   let criteria = ["In Production", "Programming"];
   for (let i = 0; i < criteria.length; i++) {
      filterTags.push(<li key={i}><FilterTag type={criteria[i]} state={criteria[i] === selectedType}/></li>);
   }
   return (
      <section id='projects'>
         <h1 className='section-title'>Projects</h1>
         <ul className='criteria-list'>
            {filterTags}
         </ul>
         <div className='project-container'>
            {projectModules}
         </div>
      </section>
   )
}

export default Projects;