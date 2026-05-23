
import { projects } from '@/data/projects';
import Image from 'next/image';
import ExpandableDescription from '@/components/ExpandableDescription';

export default function Projects() {
  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-cream)" }}>
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
                className="rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-dr-border"
                style={{ background: "var(--dr-surface)" }}
              >
                <div
                  className={`h-64 flex items-center justify-center relative overflow-hidden ${
                    project.isEmoji
                      ? "border-b border-dr-border"
                      : ""
                  }`}
                  style={!project.isEmoji ? { background: "var(--dr-ink)" } : { background: "var(--dr-cream)" }}
                >
                  {!project.isEmoji ? (
                    <div className="relative w-full h-full max-w-[80%] max-h-[80%] flex items-center justify-center p-4">
                      <Image
                        src={`/assets/${project.image}`}
                        alt={project.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="text-7xl">{project.image}</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {project.title}
                  </h3>
                  <ExpandableDescription text={project.description} />
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded text-sm font-medium"
                        style={{ background: "var(--dr-amber-pale)", color: "var(--dr-amber-deep)" }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.link && project.link !== "" && (
                      <a
                        href={project.link}
                        className="text-white px-4 py-2 rounded font-medium transition-opacity hover:opacity-90"
                        style={{ background: "var(--dr-amber)" }}
                      >
                        View Live
                      </a>
                    )}
                    {project.github && project.github !== "" && (
                      <a
                        href={project.github}
                        className="border border-dr-border text-gray-700 dark:text-gray-300 px-4 py-2 rounded font-medium transition-colors hover:border-amber-400 dark:hover:border-amber-400"
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
                className="rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-dr-border"
                style={{ background: "var(--dr-surface)" }}
              >
                <div
                  className={`h-40 flex items-center justify-center relative overflow-hidden ${
                    project.isEmoji ? "border-b border-dr-border" : ""
                  }`}
                  style={!project.isEmoji ? { background: "var(--dr-ink)" } : { background: "var(--dr-cream)" }}
                >
                  {!project.isEmoji ? (
                    <div className="relative w-full h-full max-w-[80%] max-h-[80%] flex items-center justify-center p-4">
                      <Image
                        src={`/assets/${project.image}`}
                        alt={project.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="text-5xl">{project.image}</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <ExpandableDescription text={project.description} className="text-sm" />
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-xs font-medium text-gray-600 dark:text-gray-300 bg-dr-cream"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium text-gray-500 dark:text-gray-400 bg-dr-cream">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {project.link && project.link !== "" && (
                      <a
                        href={project.link}
                        className="text-sm font-medium hover:underline"
                        style={{ color: "var(--dr-amber-deep)" }}
                      >
                        Live Demo
                      </a>
                    )}
                    {project.github && project.github !== "" && (
                      <a
                        href={project.github}
                        className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
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
          <div className="rounded-xl p-8 text-white" style={{ background: "var(--dr-amber)" }}>
            <h3 className="text-2xl font-bold mb-4">
              Interested in working together?
            </h3>
            <p className="text-white/90 mb-6">
              I&apos;m always open to discussing new opportunities and exciting projects.
            </p>
            <a
              href="mailto:devontae.reid@gmail.com"
              className="hover:opacity-90 px-6 py-3 rounded-lg font-medium transition-opacity"
              style={{ background: "var(--dr-cream)", color: "var(--dr-amber-deep)" }}
            >
              Get In Touch
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
