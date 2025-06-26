import React from 'react';
import _projects from '../assets/json/projects.json';
import ProjectModule from '../components/projectmodule';
import './css/projects.css';

class ProjectsPage extends React.Component {
    render() {
        const projects = _projects.map((project, idx) => (
            <ProjectModule
                key={project.id || idx}
                title={project.title}
                description={project.description}
                icon={project.image}
                links={{
                    github: project.github,
                    demo: project.link
                }}
                technologies={project.technologies}
            />
        ));

        return (
            <div className="projects-page">
                <section className="projects-hero">
                    <h1 className="projects-hero-title">Projects</h1>
                    <p className="projects-hero-subtitle">A selection of my favorite work, from web apps to embedded systems.</p>
                </section>
                <ul className="projects-grid">
                    {projects}
                </ul>
            </div>
        );
    }
}

export default ProjectsPage;