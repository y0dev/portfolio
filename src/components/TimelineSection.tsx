import timeline from "@/data/timeline.json";

export default function TimelineSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Experience Timeline */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Experience</h2>
        <div className="relative border-l-2 border-blue-600 space-y-10 pl-6 sm:pl-8">
          {timeline.experience.map((exp, i) => (
            <div key={i} className="relative group">
              <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-2 top-1.5 sm:-left-2.5"></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 transition hover:shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {exp.title} <span className="text-blue-600">@ {exp.company}</span>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {exp.start} – {exp.end} &middot; {exp.location}
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  {exp.description.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Education Timeline */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-16 mb-8">Education</h2>
        <div className="relative border-l-2 border-green-600 space-y-10 pl-6 sm:pl-8">
          {timeline.education.map((edu, i) => (
            <div key={i} className="relative group">
              <div className="absolute w-4 h-4 bg-green-600 rounded-full -left-2 top-1.5 sm:-left-2.5"></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 transition hover:shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {edu.degree} <span className="text-green-600">@ {edu.school}</span>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {edu.start} – {edu.end} &middot; {edu.location}
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  {edu.description.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
