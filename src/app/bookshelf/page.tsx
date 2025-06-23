import Link from "next/link";

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
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Books */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Featured Books
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">{book.image}</div>
                    <p className="font-medium">{book.category}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-medium">
                      {book.category}
                    </span>
                    <div className="text-yellow-500 text-sm">
                      {renderStars(book.rating)}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    by {book.author}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                    {book.description}
                  </p>
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Books */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Technology & Programming
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologyBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-32 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-3xl mb-2">{book.image}</div>
                    <p className="text-sm font-medium">{book.category}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs font-medium">
                      {book.category}
                    </span>
                    <div className="text-yellow-500 text-xs">
                      {renderStars(book.rating)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                    by {book.author}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                    {book.description.substring(0, 100)}...
                  </p>
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    View Book →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Theology Books */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Theology & Christian Living
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {theologyBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-3xl mb-2">{book.image}</div>
                    <p className="text-sm font-medium">{book.category}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs font-medium">
                      {book.category}
                    </span>
                    <div className="text-yellow-500 text-xs">
                      {renderStars(book.rating)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                    by {book.author}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                    {book.description.substring(0, 100)}...
                  </p>
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
                  >
                    View Book →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Personal Development Books */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Personal Development
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalDevelopmentBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-32 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-3xl mb-2">{book.image}</div>
                    <p className="text-sm font-medium">{book.category}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs font-medium">
                      {book.category}
                    </span>
                    <div className="text-yellow-500 text-xs">
                      {renderStars(book.rating)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                    by {book.author}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                    {book.description.substring(0, 100)}...
                  </p>
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 dark:text-orange-400 hover:underline text-sm font-medium"
                  >
                    View Book →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reading List */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              What I'm Reading Now
            </h3>
            <p className="text-green-100 mb-6">
              Currently exploring new ideas and expanding my knowledge.
            </p>
            <div className="bg-white/10 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-lg">
                "The best way to predict the future is to invent it." - Alan Kay
              </p>
              <p className="text-sm mt-2 text-green-100">
                Always learning, always growing.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 