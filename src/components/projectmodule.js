import './css/project_module.css';

function ProjectModule(props) {
   let title;
   let description;
   let icon;
   let image;
   let date;
   let links;
   let id;

    if (props.title)
    {
        title = <h3 className="project-title">{props.title}</h3>;
        if (props.id)
        {
            id = props.id;    
        }
   }
   
   if (props.description)
    {
      description = <p className="project-description">{props.description}</p>;
    }

   if (props.icon) {
      icon = <img className="project-image" src={props.icon.link} alt={props.icon.alt}></img>  
   }
   
   if (props.image)
   {
      image = <img className="project-image" src={props.image.link} alt={props.image.alt}></img>
   }

    if (props.date)
    {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const dateObj = new Date(parseInt(props.date));
        // eslint-disable-next-line no-unused-vars
        date = <span className="project-date">{dateObj.toLocaleDateString("en-US", options)}</span>;
    }

    if (props.links)
    {
      const github = props.links.github ? <a href={props.links.github} className='project-button project-github'>Github</a> : null;
      const demo = props.links.demo ? <a href={props.links.demo} className='project-button project-demo'>Demo</a> : null; 
      const writeup = props.links.writeup ? <a href={'/articles/' + id} className='project-button project-writeup'>Writeup</a> : null; 
      links = [github , demo , writeup]
    }

    

   
   return (
       <li className='project-item-container'>
           {icon ? icon : image}
           <div className='project-content'>
               {title}
               {description}
           </div>
           <div className='project-links'>
               {links}
           </div>
      </li>
   )
}

export default ProjectModule;