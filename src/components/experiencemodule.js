import './css/experience_module.css';

function ExperienceModule(props) {
    let icon;
    let details;
    if(props.icon) {
        icon = <p className="experience-icon">{props.icon}</p>;
    }

    if (props.details) {
        const description = props.details.description.map((description, idx) => (
            <li className='description-item' key={idx}>{ description }</li>
        ));
       details =
           <div className="experience-details">
                <span className="experience-institution">
                    {props.details.institution} 
                <span className="experience-time"> {props.details.time}</span></span>
               <h3 className="experience-position">{props.details.position}</h3>
               <ul className="experience-description">
                   { description }
               </ul>
            </div>;
   }
   return (
       <div className='experience-item-container'>
            {icon}
            {details}
      </div>
   )
}

export default ExperienceModule;