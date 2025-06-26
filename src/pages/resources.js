import React, { Component } from 'react';
import './css/resources.css';
import resources from '../assets/json/resources.json';

class ResourcesPage extends Component {
    constructor() {
        super();
        this.state = {
            resources: resources
        };
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
                            {this.state.resources.books
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
                    this.state.resources.tools,
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
                    this.state.resources.dev_resources,
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
                    this.state.resources.podcasts,
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
                    this.state.resources.youtube_channels,
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
                    this.state.resources.theology_resources,
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