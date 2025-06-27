import React, { Component } from 'react';
import Layout from '../components/Layout';
import './css/books.css';

// API Configuration
const API_BASE_URL = 'https://devontaereid.com/scripts/api';
const BOOKS_ENDPOINT = `${API_BASE_URL}/resources/books`;

class BooksPage extends Component {
    constructor() {
        super();
        this.state = {
            books: [],
            filteredBooks: [],
            searchTerm: '',
            statusFilter: 'all',
            categoryFilter: 'all',
            sortBy: 'title',
            isFilterModalOpen: false,
            loading: true,
            error: null
        };
    }

    async componentDidMount() {
        await this.fetchBooks();
    }

    async fetchBooks() {
        try {
            this.setState({ loading: true, error: null });
            
            const response = await fetch(BOOKS_ENDPOINT, {
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
                const books = data.data;
                console.log('Books loaded from API:', books.length);
                
                this.setState({
                    books: books,
                    filteredBooks: books,
                    loading: false
                });
            } else {
                throw new Error(data.message || 'Failed to fetch books');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            this.setState({ 
                error: 'Failed to load books. Please try again later.',
                loading: false 
            });
        }
    }

    getStatusColor = (status) => {
        const colorMap = {
            Read: "status-read",
            Reading: "status-reading",
            "To Read": "status-to-read"
        };
        return colorMap[status] || colorMap["To Read"];
    };

    handleSearch = (e) => {
        const searchTerm = e.target.value;
        this.setState({ searchTerm }, this.filterBooks);
    };

    handleStatusFilter = (e) => {
        const statusFilter = e.target.value;
        this.setState({ statusFilter }, this.filterBooks);
    };

    handleCategoryFilter = (e) => {
        const categoryFilter = e.target.value;
        this.setState({ categoryFilter }, this.filterBooks);
    };

    handleSort = (e) => {
        const sortBy = e.target.value;
        this.setState({ sortBy }, this.filterBooks);
    };

    filterBooks = () => {
        const { books, searchTerm, statusFilter, categoryFilter, sortBy } = this.state;
        
        let filtered = books.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                book.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
            
            return matchesSearch && matchesStatus && matchesCategory;
        });

        // Sort books
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'author':
                    return a.author.localeCompare(b.author);
                case 'rating':
                    return b.rating - a.rating;
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });

        this.setState({ filteredBooks: filtered });
    };

    clearFilters = () => {
        this.setState({
            searchTerm: '',
            statusFilter: 'all',
            categoryFilter: 'all',
            sortBy: 'title',
            filteredBooks: this.state.books
        });
    };

    getUniqueCategories = () => {
        const categories = [...new Set(this.state.books.map(book => book.category))];
        return categories.sort();
    };

    toggleFilterModal = () => {
        this.setState(prevState => ({ isFilterModalOpen: !prevState.isFilterModalOpen }));
    };

    closeFilterModal = () => {
        this.setState({ isFilterModalOpen: false });
    };

    render() {
        const { filteredBooks, searchTerm, statusFilter, categoryFilter, sortBy, isFilterModalOpen, loading, error } = this.state;
        const categories = this.getUniqueCategories();
        const hasActiveFilters = searchTerm || statusFilter !== 'all' || categoryFilter !== 'all';

        // Loading state
        if (loading) {
            return (
                <div className="books-page">
                    <section className="books-hero">
                        <div className="books-hero-container">
                            <h1 className="books-hero-title">📚 My Bookshelf</h1>
                            <p className="books-hero-subtitle">
                                A collection of books that have influenced my thinking, from programming to theology.
                            </p>
                        </div>
                    </section>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading books...</p>
                    </div>
                </div>
            );
        }

        // Error state
        if (error) {
            return (
                <div className="books-page">
                    <section className="books-hero">
                        <div className="books-hero-container">
                            <h1 className="books-hero-title">📚 My Bookshelf</h1>
                            <p className="books-hero-subtitle">
                                A collection of books that have influenced my thinking, from programming to theology.
                            </p>
                        </div>
                    </section>
                    <div className="error-container">
                        <div className="error-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3>Error Loading Books</h3>
                        <p>{error}</p>
                        <button className="retry-btn" onClick={this.fetchBooks}>
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return (
                <div className="books-page">
                    {/* Hero Section */}
                    <section className="books-hero">
                        <div className="books-hero-container">
                            <h1 className="books-hero-title">📚 My Bookshelf</h1>
                            <p className="books-hero-subtitle">
                                A collection of books that have influenced my thinking, from programming to theology.
                            </p>
                            <div className="books-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{this.state.books.length}</span>
                                    <span className="stat-label">Total Books</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">
                                        {this.state.books.filter(book => book.status === 'Read').length}
                                    </span>
                                    <span className="stat-label">Read</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">
                                        {this.state.books.filter(book => book.status === 'Reading').length}
                                    </span>
                                    <span className="stat-label">Reading</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">
                                        {this.state.books.filter(book => book.status === 'To Read').length}
                                    </span>
                                    <span className="stat-label">To Read</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Filter Controls */}
                    <section className="books-controls">
                        <div className="books-container">
                            <div className="controls-header">
                                <div className="results-summary">
                                    <p className="results-text">
                                        Showing {filteredBooks.length} of {this.state.books.length} books
                                    </p>
                                    {hasActiveFilters && (
                                        <span className="active-filters-indicator">
                                            Filters active
                                        </span>
                                    )}
                                </div>
                                
                                <div className="controls-actions">
                                    {hasActiveFilters && (
                                        <button onClick={this.clearFilters} className="clear-filters-btn">
                                            Clear Filters
                                        </button>
                                    )}
                                    <button onClick={this.toggleFilterModal} className="filter-modal-btn">
                                        <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        Filters
                                        {hasActiveFilters && <span className="filter-badge"></span>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Filter Modal */}
                    {isFilterModalOpen && (
                        <div className="filter-modal-overlay" onClick={this.closeFilterModal}>
                            <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="filter-modal-header">
                                    <h2 className="filter-modal-title">Filter & Search</h2>
                                    <button onClick={this.closeFilterModal} className="close-modal-btn">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="filter-modal-content">
                                    <div className="filter-group">
                                        <label htmlFor="search" className="filter-label">Search</label>
                                        <input
                                            type="text"
                                            id="search"
                                            placeholder="Search by title, author, or description..."
                                            value={searchTerm}
                                            onChange={this.handleSearch}
                                            className="search-input"
                                        />
                                    </div>

                                    <div className="filter-group">
                                        <label htmlFor="status" className="filter-label">Status</label>
                                        <select
                                            id="status"
                                            value={statusFilter}
                                            onChange={this.handleStatusFilter}
                                            className="filter-select"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="Read">Read</option>
                                            <option value="Reading">Reading</option>
                                            <option value="To Read">To Read</option>
                                        </select>
                                    </div>

                                    <div className="filter-group">
                                        <label htmlFor="category" className="filter-label">Category</label>
                                        <select
                                            id="category"
                                            value={categoryFilter}
                                            onChange={this.handleCategoryFilter}
                                            className="filter-select"
                                        >
                                            <option value="all">All Categories</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="filter-group">
                                        <label htmlFor="sort" className="filter-label">Sort By</label>
                                        <select
                                            id="sort"
                                            value={sortBy}
                                            onChange={this.handleSort}
                                            className="filter-select"
                                        >
                                            <option value="title">Title</option>
                                            <option value="author">Author</option>
                                            <option value="rating">Rating</option>
                                            <option value="status">Status</option>
                                            <option value="category">Category</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="filter-modal-footer">
                                    <button onClick={this.clearFilters} className="clear-filters-btn">
                                        Clear All Filters
                                    </button>
                                    <button onClick={this.closeFilterModal} className="apply-filters-btn">
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                {/* Books Grid */}
                <section className="books-display">
                    <div className="books-container">
                        {filteredBooks.length > 0 ? (
                            <div className="books-grid">
                                {filteredBooks.map(book => (
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
                                                <span className="book-category">{book.category}</span>
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
                        ) : (
                            <div className="no-results">
                                <div className="no-results-icon">📚</div>
                                <h3 className="no-results-title">No books found</h3>
                                <p className="no-results-text">
                                    Try adjusting your search terms or filters to find what you're looking for.
                                </p>
                                <button onClick={this.clearFilters} className="no-results-btn">
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        );
    }
}

export default BooksPage; 