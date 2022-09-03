import React from 'react';
import _projects from '../assets/json/projects.json';
import ProjectModule from '../components/projectmodule';

class ProjectsPage extends React.Component {
    render() {
        const projects = _projects.map((project, idx) => {
            return <ProjectModule
                key={idx}
                title={project.title}
                description={project.content}
                icon={project.image}
                links={project.preview_links} />
        });
        return (
            <div className='app-body' id='project-container'>
                <h2 className="projects-heading">Projects</h2>
                <ul className='projects-list'>
                    {projects}
                </ul>
            </div>
        )
    }
}

export default ProjectsPage;