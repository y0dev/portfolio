import React from 'react';
import data from '../assets/json/data.json';
import './css/testimonial.css';
import TestimonialModule from '../components/testimonalsmodule';

function TestimonialSection() {
    const testimonials = data.testimonials.map((testimonial, idx) => (
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