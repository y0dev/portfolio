import timeline from '../assets/json/timeline.json';
import './css/experience.css';

export default function TimelineSection() {
  // Group experience by company to show progression
  const groupedExperience = timeline.experience.reduce((acc, exp) => {
    if (!acc[exp.company]) {
      acc[exp.company] = [];
    }
    acc[exp.company].push(exp);
    return acc;
  }, {});

  return (
    <section className="timeline-section">
      <div className="timeline-container">
        {/* Section Header */}
        <div className="timeline-header">
          <h2 className="timeline-title">
            My Journey
          </h2>
          <p className="timeline-subtitle">
            A timeline of my professional experience and educational background
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="timeline-experience">
          <h3 className="timeline-section-title">
            Professional Experience
          </h3>
          
          {Object.entries(groupedExperience).map(([company, experiences]) => (
            <div key={company} className="company-group">
              {/* Company Header */}
              <div className="company-header">
                <h4 className="company-name">
                  {company}
                </h4>
                <div className="company-meta">
                  <span className="company-dates">
                    {experiences[experiences.length - 1].start} - {experiences[0].end}
                  </span>
                  {experiences.length > 1 && (
                    <span className="career-growth-badge">
                      <svg className="career-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                      Career Growth
                    </span>
                  )}
                </div>
              </div>

              <div className="timeline-wrapper">
                {/* Timeline line */}
                <div className="timeline-line timeline-line-blue"></div>
                
                <div className="timeline-items">
                  {experiences.map((exp, i) => (
                    <div key={i} className="timeline-item">
                      {/* Timeline dot with promotion indicator */}
                      <div className="timeline-dot timeline-dot-blue"></div>
                      
                      {/* Promotion arrow for progression */}
                      {i < experiences.length - 1 && (
                        <div className="promotion-arrow"></div>
                      )}
                      
                      {/* Content card */}
                      <div className="timeline-card">
                        <div className="timeline-card-content">
                          {/* Header */}
                          <div className="timeline-card-header">
                            <div className="timeline-card-title-section">
                              <h4 className="timeline-card-title">
                                {exp.title}
                              </h4>
                              {experiences.length > 1 && (
                                <div className="timeline-card-level">
                                  <span className="level-badge">
                                    {i === 0 ? "Current" : `Level ${experiences.length - i}`}
                                  </span>
                                  {i < experiences.length - 1 && (
                                    <span className="promotion-text">
                                      Promoted from {experiences[i + 1].title}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="timeline-card-dates">
                              <span className="date-badge date-badge-blue">
                                {exp.start} – {exp.end}
                              </span>
                            </div>
                          </div>
                          
                          {/* Location */}
                          <p className="timeline-location">
                            <svg className="location-icon" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {exp.location}
                          </p>
                          
                          {/* Description */}
                          <ul className="timeline-description">
                            {exp.description.map((point, j) => (
                              <li key={j} className="timeline-point">
                                <span className="point-bullet point-bullet-blue"></span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Education Timeline */}
        <div className="timeline-education">
          <h3 className="timeline-section-title">
            Education
          </h3>
          <div className="timeline-wrapper">
            {/* Timeline line */}
            <div className="timeline-line timeline-line-green"></div>
            
            <div className="timeline-items">
              {timeline.education.map((edu, i) => (
                <div key={i} className="timeline-item">
                  {/* Timeline dot */}
                  <div className="timeline-dot timeline-dot-green"></div>
                  
                  {/* Content card */}
                  <div className="timeline-card">
                    <div className="timeline-card-content">
                      {/* Header */}
                      <div className="timeline-card-header">
                        <div className="timeline-card-title-section">
                          <h4 className="timeline-card-title">
                            {edu.degree}
                          </h4>
                          <p className="school-name">
                            @ {edu.school}
                          </p>
                        </div>
                        <div className="timeline-card-dates">
                          <span className="date-badge date-badge-green">
                            {edu.start} – {edu.end}
                          </span>
                        </div>
                      </div>
                      
                      {/* Location */}
                      <p className="timeline-location">
                        <svg className="location-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {edu.location}
                      </p>
                      
                      {/* Description */}
                      <ul className="timeline-description">
                        {edu.description.map((point, j) => (
                          <li key={j} className="timeline-point">
                            <span className="point-bullet point-bullet-green"></span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}