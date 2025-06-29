'use strict';

// Entry point for rendering different pages with React

// React 18+ way to render components
import { createRoot } from 'react-dom/client';

// Global styles for the application
import './index.css';
// Additional utility CSS (Tailwind, custom classes, etc.)
import './sections/css/utilities.css';

import { } from './assets/images/images'

// Layout component that wraps all pages with a common structure (e.g., header, footer)
import Layout from './components/Layout';

// Individual pages to be rendered
import ProjectsPage from './pages/projects';
import AboutMePage from './pages/aboutme';
import ArticlesPage from './pages/articles';
import ResourcesPage from './pages/resources';
import BooksPage from './pages/books';
import GospelPage from './pages/gospel';

// ----------------------------------------------
// Render each page conditionally based on the URL path
// This allows using the same JS bundle across multiple static HTML files (like a multi-page app)
// ----------------------------------------------

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    
    // Get the current pathname to determine which page to render
    const pathname = window.location.pathname;
    if (pathname.includes('/gospel')) {
        console.log('Viewing gospel:', pathname);
        root.render(
            <Layout>
                <GospelPage />
            </Layout>
        );
    } else if (pathname.includes('/projects')) {
        root.render(
            <Layout>
                <ProjectsPage />
            </Layout>
        );
    } else if (pathname.includes('/articles')) {
        root.render(
            <Layout>
                <ArticlesPage />
            </Layout>
        );
    } else if (pathname.includes('/resources/books')) {
        root.render(
            <Layout>
                <BooksPage />
            </Layout>
        );
    } else if (pathname.includes('/resources')) {
        root.render(
            <Layout>
                <ResourcesPage />
            </Layout>
        );
    } else {
        // Default to About Me page (home page)
        root.render(
            <Layout>
                <AboutMePage />
            </Layout>
        );
    }
}