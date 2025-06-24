// components/GospelTeaser.tsx
import Link from "next/link";

export default function GospelTeaser() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 py-16 px-6 md:px-12 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          The Most Important Question You&apos;ll Ever Consider
        </h2>

        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          🌿 If you were to die today, do you know for sure that you would go to heaven?
        </p>

        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          📖 Suppose you were to stand before God and He asked, “Why should I let you into My heaven?” — What would you say?
        </p>

        <p className="text-md text-gray-600 dark:text-gray-400 mb-8 italic">
          These aren&apos;t easy questions. But they are life-changing. The Bible offers a clear answer, and it’s not about being “good enough.”
        </p>

        <Link
          href="/gospel"
          className="inline-block px-6 py-3 bg-blue-600 text-white text-base font-semibold rounded hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-300"
        >
          Discover the Answer →
        </Link>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          The good news of the Gospel is a gift — not something we earn.
        </p>
      </div>
    </section>
  );
}
