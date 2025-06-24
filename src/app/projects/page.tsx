
import projects from '@/data/projects.json';

export default function Projects() {
  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            My Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A collection of projects I&apos;ve built, from full-stack applications to 
            creative experiments. Each project represents a learning opportunity 
            and a chance to solve real-world problems.
          </p>
        </div>

        {/* Featured Projects */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Featured Projects
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">{project.image}</div>
                    <p className="text-xl font-medium">{project.title}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.link && project.link !== "" && (
                      <a
                        href={project.link}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
                      >
                        View Live
                      </a>
                    )}

                    {project.github && project.github !== "" && (
                      <a
                        href={project.github}
                        className="border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 px-4 py-2 rounded font-medium transition-colors"
                      >
                        View Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Other Projects */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Other Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-40 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">{project.image}</div>
                    <p className="font-medium">{project.title}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {project.link && project.link !== "" && (
                      <a
                        href={project.link}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.github && project.github !== "" && (
                      <a
                        href={project.github}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium"
                      >
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Interested in working together?
            </h3>
            <p className="text-blue-100 mb-6">
              I&apos;m always open to discussing new opportunities and exciting projects.
            </p>
            <a
              href="mailto:devontae.reid@gmail.com"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </section>
      </div>
    </div>
  );
} 