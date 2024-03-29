import './css/aboutme.css';
import React from 'react';
import AboutMeSection from '../sections/about_me';
import ExperienceSection from '../sections/experience';
import CodeSnip from '../components/codesnippet';
// import TestimonialSection from '../sections/testimonials';

class AboutMePage extends React.Component {
    render() {
        
        return (
            <div className='app-body' id='about-me-container'>
                
                <AboutMeSection />
                <ExperienceSection />
            </div>
        )
    }
}

export default AboutMePage;