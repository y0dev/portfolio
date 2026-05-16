import Footer from "@/components/Footer";
import resources from "@/data/resources.json"

export const metadata = {
  title: "Bookshelf | Devontae Reid",
  description: "Recommended books on technology, theology, and personal development",
};

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  category: string;
  rating: number;
  status: string;
  image: string;
  link: string;
  featured?: boolean;
}


const categories = ["All", "Technology", "Theology", "Personal Development"];

export default function Bookshelf() {
  const books: Book[] = resources.books;

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-cream)" }}>
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
            <span key={category} className="px-4 py-2 rounded-full bg-dr-cream text-gray-700 dark:text-gray-200 font-medium cursor-pointer transition-colors duration-200 hover:text-amber-700 dark:hover:text-amber-300 border border-dr-border">
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
              className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-dr-border overflow-hidden p-6 flex flex-col"
              style={{ background: "var(--dr-surface)" }}
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-4">{book.image}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {book.title}
                  </h3>
                  <p className="font-medium text-sm" style={{ color: "var(--dr-amber-deep)" }}>
                    by {book.author}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1">
                {book.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="inline-block bg-dr-cream text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-medium border border-dr-border">
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