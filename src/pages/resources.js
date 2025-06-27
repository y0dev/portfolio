import React, { Component } from 'react';
import './css/resources.css';

// API Configuration
const API_BASE_URL = 'https://devontaereid.com/scripts/api';

class ResourcesPage extends Component {
    constructor() {
        super();
        this.state = {
            resources: {
                books: [],
                tools: [],
                dev_resources: [],
                podcasts: [],
                youtube_channels: [],
                theology_resources: []
            },
            loading: true,
            error: null
        };
    }

    async componentDidMount() {
        await this.fetchAllResources();
    }

    async fetchAllResources() {
        try {
            this.setState({ loading: true, error: null });
            
            // Fetch all resource types in parallel
            const resourceTypes = [
                'books',
                'tools', 
                'dev_resources',
                'podcasts',
                'youtube_channels',
                'theology_resources'
            ];

            const fetchPromises = resourceTypes.map(type => 
                this.fetchResourceType(type)
            );

            const results = await Promise.allSettled(fetchPromises);
            
            // Process results
            const newResources = { ...this.state.resources };
            let hasErrors = false;

            results.forEach((result, index) => {
                const resourceType = resourceTypes[index];
                if (result.status === 'fulfilled' && result.value) {
                    newResources[resourceType] = result.value;
                } else {
                    console.error(`Failed to fetch ${resourceType}:`, result.reason);
                    hasErrors = true;
                }
            });

            this.setState({
                resources: newResources,
                loading: false,
                error: hasErrors ? 'Some resources failed to load. Please refresh the page.' : null
            });

        } catch (error) {
            console.error('Error fetching resources:', error);
            this.setState({ 
                error: 'Failed to load resources. Please try again later.',
                loading: false 
            });
        }
    }

    async fetchResourceType(resourceType) {
        try {
            const response = await fetch(`${API_BASE_URL}/resources/${resourceType}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.data) {
                console.log(`${resourceType} loaded from API:`, data.data);
                return data.data;
            } else {
                throw new Error(data.message || `Failed to fetch ${resourceType}`);
            }
        } catch (error) {
            console.error(`Error fetching ${resourceType}:`, error);
            throw error;
        }
    }

    async fetchResources() {
        // Legacy method - keeping for backward compatibility
        await this.fetchAllResources();
    }

    getStatusColor = (status) => {
        const colorMap = {
            Read: "status-read",
            Reading: "status-reading",
            "To Read": "status-to-read"
        };
        return colorMap[status] || colorMap["To Read"];
    };

    renderSection = (title, description, items, renderItem) => (
        <section className="resource-section">
            <div className="resource-container">
                <div className="section-header">
                    <h2 className="section-title">{title}</h2>
                    <p className="section-description">{description}</p>
                </div>
                <div className="resource-grid">
                    {items.map(renderItem)}
                </div>
            </div>
        </section>
    );

    render() {
        const { resources, loading, error } = this.state;

        // Loading state
        if (loading) {
            return (
                <div className="resources-page">
                    <section className="hero-section">
                        <div className="hero-container">
                            <h1 className="hero-title">Resources</h1>
                            <p className="hero-subtitle">
                                A curated collection of books, tools, and developer resources that have shaped my journey.
                            </p>
                        </div>
                    </section>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading resources...</p>
                    </div>
                </div>
            );
        }

        // Error state
        if (error) {
            return (
                <div className="resources-page">
                    <section className="hero-section">
                        <div className="hero-container">
                            <h1 className="hero-title">Resources</h1>
                            <p className="hero-subtitle">
                                A curated collection of books, tools, and developer resources that have shaped my journey.
                            </p>
                        </div>
                    </section>
                    <div className="error-container">
                        <div className="error-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3>Error Loading Resources</h3>
                        <p>{error}</p>
                        <button className="retry-btn" onClick={this.fetchAllResources}>
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="resources-page">
                {/* Hero */}
                <section className="hero-section">
                    <div className="hero-container">
                        <h1 className="hero-title">Resources</h1>
                        <p className="hero-subtitle">
                            A curated collection of books, tools, and developer resources that have shaped my journey.
                        </p>
                    </div>
                </section>

                {/* Books */}
                <section className="resource-section bookshelf-section">
                    <div className="resource-container">
                        <div className="section-header">
                            <h2 className="section-title">📚 Books</h2>
                            <p className="section-description">
                                A few of my favorite books.{" "}
                                <a href="/resources/books" className="section-link">
                                    See all books →
                                </a>
                            </p>
                        </div>
                        <div className="books-grid">
                            {resources.books
                                .filter(book => book.featured)
                                .map(book => (
                                    <a
                                        key={book.id}
                                        href={book.link || `https://www.amazon.com/s?k=${encodeURIComponent(book.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="book-card"
                                    >
                                        <div className="book-header">
                                            <span className="book-cover">{book.cover}</span>
                                            <div className="book-info">
                                                <h3 className="book-title">{book.title}</h3>
                                                <p className="book-author">by {book.author}</p>
                                            </div>
                                        </div>
                                        <p className="book-description">{book.description}</p>
                                        <div className="book-footer">
                                            <span className={`status-badge ${this.getStatusColor(book.status)}`}>
                                                {book.status}
                                            </span>
                                            <span className="book-rating">
                                                {"★".repeat(book.rating) + "☆".repeat(5 - book.rating)}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                        </div>
                    </div>
                </section>

                {/* Tools & Software */}
                {this.renderSection(
                    "🛠️ Tools & Software",
                    "Essential tools and software I use in my daily development workflow",
                    resources.tools,
                    (tool, index) => (
                        <div key={index} className="resource-card">
                            <div className="resource-content">
                                <div className="resource-icon">{tool.icon}</div>
                                <h3 className="resource-name">{tool.name}</h3>
                                <p className="resource-category">{tool.category}</p>
                                <p className="resource-description">{tool.description}</p>
                            </div>
                        </div>
                    )
                )}

                {/* Developer Resources */}
                {this.renderSection(
                    "🌐 Developer Resources",
                    "Websites and platforms I frequently visit for learning and development",
                    resources.dev_resources,
                    (item, index) => (
                        <a
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-card resource-link"
                        >
                            <div className="resource-content">
                                <div className="resource-icon">{item.icon}</div>
                                <h3 className="resource-name">{item.name}</h3>
                                <p className="resource-category">{item.category}</p>
                                <p className="resource-description">{item.description}</p>
                            </div>
                        </a>
                    )
                )}

                {/* Podcasts */}
                {this.renderSection(
                    "🎙️ Podcasts",
                    "Podcasts I recommend for developers and lifelong learners",
                    resources.podcasts,
                    (item, index) => (
                        <a
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-card resource-link"
                        >
                            <div className="resource-content">
                                <div className="resource-icon">{item.icon}</div>
                                <h3 className="resource-name">{item.name}</h3>
                                <p className="resource-description">{item.description}</p>
                            </div>
                        </a>
                    )
                )}

                {/* YouTube Channels */}
                {this.renderSection(
                    "📺 YouTube Channels",
                    "YouTube channels I recommend for learning and inspiration",
                    resources.youtube_channels,
                    (item, index) => (
                        <a
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-card resource-link"
                        >
                            <div className="resource-content">
                                <div className="resource-icon">{item.icon}</div>
                                <h3 className="resource-name">{item.name}</h3>
                                <p className="resource-description">{item.description}</p>
                            </div>
                        </a>
                    )
                )}

                {/* Theology Resources */}
                {this.renderSection(
                    "⛪ Theology Resources",
                    "Biblical teaching, sermons, evangelism, and apologetics resources",
                    resources.theology_resources,
                    (item, index) => (
                        <a
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-card resource-link"
                        >
                            <div className="resource-content">
                                <div className="resource-icon">{item.icon}</div>
                                <h3 className="resource-name">{item.name}</h3>
                                <p className="resource-category">{item.category}</p>
                                <p className="resource-description">{item.description}</p>
                            </div>
                        </a>
                    )
                )}

                {/* CTA */}
                <section className="cta-section">
                    <div className="cta-container">
                        <h2 className="cta-title">Have a Resource to Share?</h2>
                        <p className="cta-description">
                            I'm always looking for new books, tools, and resources to explore. Feel free to reach out!
                        </p>
                        <a
                            href="mailto:devontae.reid@gmail.com"
                            className="cta-button"
                        >
                            <svg className="cta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Share Resources
                        </a>
                    </div>
                </section>
            </div>
        );
    }
}

export default ResourcesPage; 