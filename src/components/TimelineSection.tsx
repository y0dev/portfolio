import timeline from "@/data/timeline.json";

export default function TimelineSection() {
  // Group experience by company to show progression
  const groupedExperience = timeline.experience.reduce((acc, exp) => {
    if (!acc[exp.company]) {
      acc[exp.company] = [];
    }
    acc[exp.company].push(exp);
    return acc;
  }, {} as Record<string, typeof timeline.experience>);

  return (
    <section id="timeline-section" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-surface)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A timeline of my professional experience and educational background
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Professional Experience
          </h3>
          
          {Object.entries(groupedExperience).map(([company, experiences]) => (
            <div key={company} className="mb-16">
              {/* Company Header */}
              <div className="company-header text-center mb-8">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {company}
                </h4>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {experiences[experiences.length - 1].start} - {experiences[0].end}
                  </span>
                  {experiences.length > 1 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ background: "var(--dr-amber-pale, oklch(96% 0.04 75))", color: "var(--dr-amber-deep, oklch(52% 0.14 72))" }}>
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                      Career Growth
                    </span>
                  )}
                </div>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5" style={{ background: "var(--dr-amber, oklch(71% 0.17 72))" }}></div>
                
                <div className="space-y-8">
                  {experiences.map((exp, i) => (
                    <div key={i} className="timeline-item relative group opacity-100">
                      {/* Timeline dot with promotion indicator */}
                      <div className="absolute left-6 w-4 h-4 rounded-full border-4 border-dr-surface shadow-lg timeline-dot group-hover:scale-125 transition-transform duration-300" style={{ background: "var(--dr-amber, oklch(71% 0.17 72))" }}></div>
                      
                      {/* Promotion arrow for progression */}
                      {i < experiences.length - 1 && (
                        <div className="absolute left-7 top-4 w-0.5 h-8" style={{ background: "var(--dr-amber, oklch(71% 0.17 72))" }}></div>
                      )}
                      
                      {/* Content card */}
                      <div className="ml-16 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-dr-border overflow-hidden bg-dr-cream">
                        <div className="p-6 sm:p-8">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                {exp.title}
                              </h4>
                              {experiences.length > 1 && (
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-xs font-medium px-2 py-1 rounded" style={{ background: "var(--dr-amber-pale, oklch(96% 0.04 75))", color: "var(--dr-amber-deep, oklch(52% 0.14 72))" }}>
                                    {i === 0 ? "Current" : `Level ${experiences.length - i}`}
                                  </span>
                                  {i < experiences.length - 1 && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      Promoted from {experiences[i + 1].title}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="mt-2 sm:mt-0 text-right">
                              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ background: "var(--dr-amber-pale, oklch(96% 0.04 75))", color: "var(--dr-amber-deep, oklch(52% 0.14 72))" }}>
                                {exp.start} – {exp.end}
                              </span>
                            </div>
                          </div>
                          
                          {/* Location */}
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {exp.location}
                          </p>
                          
                          {/* Description */}
                          <ul className="space-y-2">
                            {exp.description.map((point, j) => (
                              <li key={j} className="flex items-start text-gray-700 dark:text-gray-300">
                                <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ background: "var(--dr-amber)" }}></span>
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
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Education
          </h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5" style={{ background: "var(--dr-amber)" }}></div>
            
            <div className="space-y-12">
              {timeline.education.map((edu, i) => (
                <div key={i} className="timeline-item relative group opacity-100">
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 rounded-full border-4 border-dr-surface shadow-lg timeline-dot group-hover:scale-125 transition-transform duration-300" style={{ background: "var(--dr-amber)" }}></div>
                  
                  {/* Content card */}
                  <div className="ml-16 bg-dr-surface rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-dr-border overflow-hidden">
                    <div className="p-6 sm:p-8">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {edu.degree}
                          </h4>
                          <p className="font-semibold" style={{ color: "var(--dr-amber-deep)" }}>
                            @ {edu.school}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ background: "var(--dr-amber-pale)", color: "var(--dr-amber-deep)" }}>
                            {edu.start} – {edu.end}
                          </span>
                        </div>
                      </div>
                      
                      {/* Location */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {edu.location}
                      </p>
                      
                      {/* Description */}
                      <ul className="space-y-2">
                        {edu.description.map((point, j) => (
                          <li key={j} className="flex items-start text-gray-700 dark:text-gray-300">
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ background: "var(--dr-amber)" }}></span>
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
