import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import timeline from "@/data/timeline.json";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TimelineSection() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Timeline animations
    gsap.fromTo(".timeline-item",
      { 
        x: -50, 
        opacity: 0,
        scale: 0.95
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Timeline dots animation
    gsap.fromTo(".timeline-dot",
      { 
        scale: 0,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.3,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={timelineRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500"></div>
            
            <div className="space-y-12">
              {timeline.experience.map((exp, i) => (
                <div key={i} className="timeline-item relative group">
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full border-4 border-white dark:border-gray-800 shadow-lg timeline-dot group-hover:scale-125 transition-transform duration-300"></div>
                  
                  {/* Content card */}
                  <div className="ml-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 sm:p-8">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {exp.title}
                          </h4>
                          <p className="text-blue-600 dark:text-blue-400 font-semibold">
                            @ {exp.company}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
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
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
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

        {/* Education Timeline */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Education
          </h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-green-600 dark:from-green-400 dark:to-green-500"></div>
            
            <div className="space-y-12">
              {timeline.education.map((edu, i) => (
                <div key={i} className="timeline-item relative group">
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 bg-green-600 dark:bg-green-400 rounded-full border-4 border-white dark:border-gray-800 shadow-lg timeline-dot group-hover:scale-125 transition-transform duration-300"></div>
                  
                  {/* Content card */}
                  <div className="ml-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 sm:p-8">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {edu.degree}
                          </h4>
                          <p className="text-green-600 dark:text-green-400 font-semibold">
                            @ {edu.school}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
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
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
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
