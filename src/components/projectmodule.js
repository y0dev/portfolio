import './css/project_module.css';

function ProjectModule(props) {
   let custom_icons =[];
   let content;
   let coverImage;
   let readMore;
   if(props.project.content) {
      content = <p>{props.project.content}</p>;
   }
   if(props.project.image) {
      coverImage = <img className='cover-image' src={props.project.image}  alt='{props.project.title}'/>;
   }
   if(props.project.read) {
      readMore = <button className="more">Read More</button>;
   }
   if(props.project.preview_links) {
      for (let i = 0; i < props.project.preview_links.length; i++) {
         custom_icons.push(<a href={props.preview_link[i]}><img src='/assets/icons/{props.preview_link[i].png}' alt='img'/></a>);
         
      }
   }
   return (
      <div className='module-container module'>
         <header>
            <div className="title-type">
               <h1>{ props.project.title }</h1>
               <div className="type-meta">{ props.project.category }</div>
            </div>
            <div className="custom-icons">
               { custom_icons }
            </div>
         </header>
         { content }
         {coverImage}
         {readMore}
      </div>
   )
}

export default ProjectModule;