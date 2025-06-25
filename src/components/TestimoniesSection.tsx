import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Product Manager",
    company: "TechCorp",
    content: "Devontae is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills are outstanding. He's been instrumental in helping us build scalable solutions.",
    avatar: "👩‍💼",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "CTO",
    company: "StartupXYZ",
    content: "Working with Devontae was a game-changer for our project. His technical expertise and ability to communicate complex concepts clearly made him an invaluable team member. Highly recommended!",
    avatar: "👨‍💻",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Frontend Lead",
    company: "DesignStudio",
    content: "Devontae's code is always clean, well-documented, and follows best practices. He's not just a great developer but also a great collaborator who brings positive energy to every project.",
    avatar: "👩‍🎨",
    rating: 5
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Project Manager",
    company: "InnovateLab",
    content: "Devontae exceeded our expectations on every level. His technical skills are matched by his professionalism and reliability. He's the kind of developer you want on your team.",
    avatar: "👨‍💼",
    rating: 5
  }
];

export default function TestimoniesSection() {
  const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Testimonial card animations
    gsap.fromTo(".testimonial-card",
      { 
        y: 50, 
        opacity: 0,
        scale: 0.95
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: testimonialRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Star rating animations
    gsap.fromTo(".star-rating",
      { 
        scale: 0,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: testimonialRef.current,
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`star-rating text-lg ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <section ref={testimonialRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What People Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Testimonials from colleagues and clients I&apos;ve had the pleasure of working with
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="testimonial-card bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
            >
              {/* Rating */}
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                &quot;{testimonial.content}&quot;
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Interested in working together?
          </p>
          <a
            href="mailto:devontae.reid@gmail.com"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
} 