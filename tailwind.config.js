/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        heading: 'var(--color-heading)',
        subheading: 'var(--color-subheading)',
        body: 'var(--color-body)',
        'code-bg': 'var(--color-code-bg)',
        'article-hover': 'var(--color-article-hover)',
        'about-highlight-bg': 'var(--color-about-highlight-bg)',
        'about-highlight-hover': 'var(--color-about-highlight-hover)',
      },
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 