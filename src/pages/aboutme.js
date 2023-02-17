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
                {/* <CodeSnip 
                    title='sample.js'
                    language='javascript'
                    code={['const something = { } ;','something = { title: "HELLO" }']}/>

                <CodeSnip 
                    title='sample2.js'
                    language='javascript'
                    code={['const another = { } ;','let sum = 0;']}/> */}
                {/* <TestimonialSection /> */}
            </div>
        )
    }
}

export default AboutMePage;