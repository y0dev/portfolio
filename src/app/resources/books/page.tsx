import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Bookshelf | Devontae Reid",
  description: "Recommended books on technology, theology, and personal development",
};

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  rating: number;
  image: string;
  link: string;
  featured?: boolean;
}

const books: Book[] = [
  // Technology Books
  {
    id: "clean-code",
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A handbook of agile software craftsmanship that teaches you how to write clean, maintainable code.",
    category: "Technology",
    rating: 5,
    image: "📚",
    link: "https://amzn.to/3example",
    featured: true,
  },
  {
    id: "design-patterns",
    title: "Design Patterns",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    description: "Elements of Reusable Object-Oriented Software - the definitive guide to design patterns.",
    category: "Technology",
    rating: 5,
    image: "📚",
    link: "https://amzn.to/3example",
  },
  {
    id: "refactoring",
    title: "Refactoring",
    author: "Martin Fowler",
    description: "Improving the Design of Existing Code - essential reading for any developer who wants to write better code.",
    category: "Technology",
    rating: 5,
    image: "📚",
    link: "https://amzn.to/3example",
  },
  {
    id: "pragmatic-programmer",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    description: "Your journey to mastery - from journeyman to master in the art of software development.",
    category: "Technology",
    rating: 5,
    image: "📚",
    link: "https://amzn.to/3example",
    featured: true,
  },
  {
    id: "effective-typescript",
    title: "Effective TypeScript",
    author: "Dan Vanderkam",
    description: "62 specific ways to improve your TypeScript code and become a more effective developer.",
    category: "Technology",
    rating: 4,
    image: "📚",
    link: "https://amzn.to/3example",
  },

  // Theology Books
  {
    id: "systematic-theology",
    title: "Systematic Theology",
    author: "Wayne Grudem",
    description: "An introduction to biblical doctrine that covers all the major areas of Christian theology.",
    category: "Theology",
    rating: 5,
    image: "📚",
    link: "https://amzn.to/3example",
    featured: true,
  },
  {
    id: "knowing-god",
    title: "Knowing God",
    author: "J.I. Packer",
    description: "A classic work that helps readers understand and know God more deeply through biblical teaching.",
    category: "Theology",
    rating: 5,
    image: "📚",
    link: "https://amzn.to/3example",
  },
  {
    id: "desiring-god",
    title: "Desiring God",
    author: "John Piper",
    description: "Meditations of a Christian Hedonist - exploring the relationship between joy and God's glory.",
    category: "Theology",
    rating: 5,
    image: "📚",
    link: "https://amzn.to/3example",
  },
  {
    id: "mere-christianity",
    title: "Mere Christianity",
    author: "C.S. Lewis",
    description: "A classic defense of the Christian faith that explains the core beliefs shared by all Christians.",
    category: "Theology",
    rating: 5,
    image: "📚",
    link: "https://amzn.to/3example",
  },
  {
    id: "gospel-according-to-jesus",
    title: "The Gospel According to Jesus",
    author: "John MacArthur",
    description: "What does Jesus mean when he says, 'Follow me'? A study of true salvation and discipleship.",
    category: "Theology",
    rating: 4,
    image: "📚",
    link: "https://amzn.to/3example",
  },

  // Personal Development
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    description: "An easy and proven way to build good habits and break bad ones.",
    category: "Personal Development",
    rating: 5,
    image: "📚",
    link: "https://amzn.to/3example",
    featured: true,
  },
  {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    description: "Rules for focused success in a distracted world.",
    category: "Personal Development",
    rating: 4,
    image: "📚",
    link: "https://amzn.to/3example",
  },
  {
    id: "essentialism",
    title: "Essentialism",
    author: "Greg McKeown",
    description: "The disciplined pursuit of less - how to focus on what matters most.",
    category: "Personal Development",
    rating: 4,
    image: "📚",
    link: "https://amzn.to/3example",
  },
  {
    id: "mindset",
    title: "Mindset",
    author: "Carol S. Dweck",
    description: "The new psychology of success - how we can learn to fulfill our potential.",
    category: "Personal Development",
    rating: 4,
    image: "📚",
    link: "https://amzn.to/3example",
  },
];

const categories = ["All", "Technology", "Theology", "Personal Development"];

export default function Bookshelf() {
  const featuredBooks = books.filter(book => book.featured);
  const technologyBooks = books.filter(book => book.category === "Technology");
  const theologyBooks = books.filter(book => book.category === "Theology");
  const personalDevelopmentBooks = books.filter(book => book.category === "Personal Development");

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Bookshelf
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A curated collection of books that have shaped my thinking and helped me grow 
            in technology, theology, and personal development.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <span key={category} className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium cursor-pointer hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors duration-200">
              {category}
            </span>
          ))}
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <a
              key={book.id}
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden p-6 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-4">{book.image}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {book.title}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                    by {book.author}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1">
                {book.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-medium">
                  {book.category}
                </span>
                <span className="text-yellow-400 text-sm ml-2">
                  {renderStars(book.rating)}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
} 