import './css/testimonial.css';
import _testimonials from '../assets/json/testimonials.json';
import TestimonialModule from '../components/testimonalsmodule';

function TestimonialSection() {
    const testimonials = _testimonials.map((testimonial, idx) => (
        <li className='testimonials-item' key={idx}><TestimonialModule 
                                        name={testimonial.name}
                                        icon={testimonial.icon}
                                        details={testimonial.content}
                                        link={testimonial.link} /></li>
     ));
   return (
      <section id='testimonials'>
         <div className='content'>
            <h2>Testimonials</h2>
            <ul className="testimonial-container">
                {testimonials}              
            </ul>
         </div>
      </section>
   )
}

export default TestimonialSection;