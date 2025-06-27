import React from 'react';
import ProjectModule from '../components/projectmodule';
import './css/projects.css';

// API Configuration
const API_BASE_URL = 'https://devontaereid.com/scripts/api';
const PROJECTS_ENDPOINT = `${API_BASE_URL}/projects`;

class ProjectsPage extends React.Component {
    constructor() {
        super();
        this.state = {
            projects: [],
            loading: true,
            error: null
        };
    }

    async componentDidMount() {
        await this.fetchProjects();
    }

    async fetchProjects() {
        try {
            this.setState({ loading: true, error: null });
            
            const response = await fetch(PROJECTS_ENDPOINT, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.data) {
                const projects = data.data;
                console.log('Projects loaded from API:', projects.length);
                
                this.setState({
                    projects: projects,
                    loading: false
                });
            } else {
                throw new Error(data.message || 'Failed to fetch projects');
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            this.setState({ 
                error: 'Failed to load projects. Please try again later.',
                loading: false 
            });
        }
    }

    render() {
        const { projects, loading, error } = this.state;

        // Loading state
        if (loading) {
            return (
                <div className="projects-page">
                    <section className="projects-hero">
                        <h1 className="projects-hero-title">Projects</h1>
                        <p className="projects-hero-subtitle">A selection of my favorite work, from web apps to embedded systems.</p>
                    </section>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading projects...</p>
                    </div>
                </div>
            );
        }

        // Error state
        if (error) {
            return (
                <div className="projects-page">
                    <section className="projects-hero">
                        <h1 className="projects-hero-title">Projects</h1>
                        <p className="projects-hero-subtitle">A selection of my favorite work, from web apps to embedded systems.</p>
                    </section>
                    <div className="error-container">
                        <div className="error-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3>Error Loading Projects</h3>
                        <p>{error}</p>
                        <button className="retry-btn" onClick={this.fetchProjects}>
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        const projectComponents = projects.map((project, idx) => (
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
                    {projectComponents}
                </ul>
            </div>
        );
    }
}

export default ProjectsPage;