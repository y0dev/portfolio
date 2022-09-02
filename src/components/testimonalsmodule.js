import './css/testimonial_module.css';

function TestimonialModule(props) {
    let icon;
    let name;
    let details;
    if(props.icon && props.icon !== undefined) {
        icon = <p className="testimonials-icon">{props.icon}</p>;
    }

    if (props.name) {
        if (props.link && props.link !== undefined)
        {
            name = <h3 className="testimonials-author"><a className="testimonials-link" href={props.link} rel="noreferrer" target="_blank">- {props.name}</a></h3>; 
        }
        else 
        {  
            name = <h3 className="testimonials-author">- {props.name}</h3>;    
        }
    }

   if(props.details) {
       details = <p className="testimonials-content">{props.details}</p>
   }
   return (
       <div className='testimonials-item-container'>
            {icon}
           <div className="testimonial-details">
                {details}  
                {name}
           </div>
      </div>
   )
}

export default TestimonialModule;