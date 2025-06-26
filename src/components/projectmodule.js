import './css/project_module.css';

function ProjectModule(props) {
  const { title, description, icon, links, technologies } = props;

  return (
    <li className="project-card">
      {icon && typeof icon === 'string' ? (
        <div className="project-card-emoji-container">
          <span className="project-card-emoji" role="img" aria-label="Project Icon">{icon}</span>
        </div>
      ) : icon && icon.link ? (
        <div className="project-card-image-container">
          <img className="project-card-image" src={icon.link} alt={icon.alt} />
        </div>
      ) : null}
      <div className="project-card-content">
        {title && <h3 className="project-card-title">{title}</h3>}
        {description && <p className="project-card-description">{description}</p>}
        {technologies && Array.isArray(technologies) && (
          <div className="project-card-tech">
            {technologies.map((tech, i) => (
              <span className="project-tech-badge" key={i}>{tech}</span>
            ))}
          </div>
        )}
      </div>
      <div className="project-card-actions">
        {links && links.github && (
          <a href={links.github} className="project-card-button project-github" target="_blank" rel="noopener noreferrer">GitHub</a>
        )}
        {links && links.demo && (
          <a href={links.demo} className="project-card-button project-demo" target="_blank" rel="noopener noreferrer">Demo</a>
        )}
      </div>
    </li>
  );
}

export default ProjectModule;