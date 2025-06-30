import React, { Component } from 'react';
import './css/articles.css';
import ArticleModule from '../components/articlemodule';
import Pagination from '../components/pagination';
import data from '../assets/json/data.json';
import '../assets/js/article-likes.js';
import '../assets/js/article-share.js';

// API Configuration
const API_BASE_URL = 'https://devontaereid.com/scripts/api';
const ARTICLES_ENDPOINT = `${API_BASE_URL}/articles`;

function filtered(json_object) {
    return json_object.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

class ArticlesPage extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            mergeArray: [],
            postsLength: 0,
            postsPerPage: 6,
            currentPostPage: 1,
            currentPosts: [],
            searchTerm: '',
            selectedCategory: 'all',
            categories: ['all', 'programming', 'technology', 'tutorial', 'theology', 'health'],
            filteredPosts: [],
            loading: true,
            error: null,
            usingFallback: false,
            articles: [],
            notes: [],
            filteredArticles: [],
            filteredNotes: [],
            activeFilter: 'all',
            totalArticles: 0,
            currentPage: 1,
            totalPages: 1
        }
        
        this.handleSearch = this.handleSearch.bind(this);
        this.handleCategoryFilter = this.handleCategoryFilter.bind(this);
        this.postPaginate = this.postPaginate.bind(this);
        this.goToVerifiedPage = this.goToVerifiedPage.bind(this);
        this.goToPostPage = this.goToPostPage.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.fetchArticles = this.fetchArticles.bind(this);
        this.loadFallbackData = this.loadFallbackData.bind(this);
        this.fetchArticlesForPage = this.fetchArticlesForPage.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);
    }

    async componentDidMount() {
        await this.fetchArticles();
    }

    loadFallbackData() {
        console.log('Loading fallback data from static JSON files');
        
        // Get both articles and notes and sort by date, filter by published status
        const articles_sorted = filtered(this.state.articles.filter(article => article.status === 'published'));
        const notes_sorted = filtered(this.state.notes.filter(note => note.status === 'published'));
        const mergeArray = filtered(articles_sorted.concat(notes_sorted));
        
        console.log('Articles loaded:', this.state.articles.length);
        console.log('Notes loaded:', this.state.notes.length);
        console.log('Total items:', mergeArray.length);
        
        const posts = mergeArray.map((article, idx) => {
            // Check if it's a note based on 'type' field or 'file-id' field
            let noteValue = 0;
            if (article.type === 'note' || article['file-id'] === 'note') {
                noteValue = 1;
            }
            
            return <ArticleModule key={idx}
                id={article.id}
                title={article.title}
                date={article.date}
                image={article.image}
                slug={article.slug}
                tags={article.tags}
                likeCount={article.like_count || 0}
                note={noteValue}/>
        });

        console.log('Posts created:', posts.length);

        // Get current posts
        let indexOfLastPost = this.state.currentPostPage * this.state.postsPerPage;
        let indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
        const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

        console.log('Current posts:', currentPosts.length);

        this.setState({
            mergeArray: mergeArray,
            filteredPosts: mergeArray,
            posts: posts,
            currentPosts: currentPosts,
            postsLength: mergeArray.length, // Use total count from mergeArray
            loading: false,
            usingFallback: true,
            totalArticles: mergeArray.length // Set total for fallback data
        });

        // Only show paginate if greater than postsPerPage
        if (mergeArray.length <= this.state.postsPerPage) {
            const article_pa = document.getElementById('article-paginate');
            if (article_pa) {
                article_pa.classList.add('hidden');
            }
        }
    }

    async fetchArticles() {
        try {
            this.setState({ loading: true, error: null });
            
            const response = await fetch(`${ARTICLES_ENDPOINT}?status=published`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: 'cors', // Explicitly set CORS mode
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error text:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
            }

            const data = await response.json();
            
            if (data.success && data.data) {
                const articles = data.data;
                const pagination = data.pagination || {};
                const totalArticles = pagination.total || articles.length;
                
                console.log('API Response:', {
                    articles: articles.length,
                    total: totalArticles,
                    pagination: pagination,
                    currentPage: pagination.current_page,
                    totalPages: pagination.total_pages,
                    hasNext: pagination.has_next,
                    hasPrev: pagination.has_prev
                });
                
                const articles_sorted = filtered(articles);
                
                const posts = articles_sorted.map((article, idx) => {
                    // Check if it's a note based on 'type' field or 'file-id' field
                    let noteValue = 0;
                    if (article.type === 'note' || article['file-id'] === 'note') {
                        noteValue = 1;
                    }
                    
                    // Handle image parsing - check if it's already an object or needs parsing
                    let parsedImage = article.image;
                    if (typeof article.image === 'string') {
                        try {
                            parsedImage = JSON.parse(article.image);
                        } catch (e) {
                            console.warn('Failed to parse image JSON:', article.image);
                            parsedImage = { name: '', alt: '' };
                        }
                    }
                    
                    return <ArticleModule key={idx}
                        id={article.id}
                        title={article.title}
                        date={new Date(article.date).getTime()}
                        image={parsedImage}
                        slug={article.slug}
                        tags={article.tags}
                        likeCount={article.like_count || 0}
                        note={noteValue}/>
                });

                console.log('State being set:', {
                    postsLength: totalArticles,
                    currentPosts: posts.length,
                    totalArticles: totalArticles,
                    currentPage: pagination.current_page || 1,
                    totalPages: pagination.total_pages || Math.ceil(totalArticles / this.state.postsPerPage)
                });

                this.setState({
                    mergeArray: articles_sorted,
                    filteredPosts: articles_sorted,
                    posts: posts,
                    currentPosts: posts, // Show all articles from current page
                    postsLength: totalArticles, // Use total from pagination
                    loading: false,
                    usingFallback: false,
                    articles: articles,
                    notes: data.notes || [],
                    totalArticles: totalArticles, // Store total for reference
                    currentPage: pagination.current_page || 1,
                    totalPages: pagination.total_pages || Math.ceil(totalArticles / this.state.postsPerPage)
                });

                // Only show paginate if greater than postsPerPage
                if (totalArticles <= this.state.postsPerPage) {
                    const article_pa = document.getElementById('article-paginate');
                    if (article_pa) {
                        article_pa.classList.add('hidden');
                    }
                }
            } else {
                throw new Error(data.message || 'Failed to fetch articles');
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
            
            // Provide more specific error messages
            let errorMessage = 'Failed to load articles. Please try again later.';
            
            if (error.message.includes('CORS')) {
                errorMessage = 'CORS error: The API server is not allowing requests from this domain. Please check your server configuration.';
            } else if (error.message.includes('404')) {
                errorMessage = 'API endpoint not found (404). Please check if the API is properly deployed to your server.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Network error: Unable to connect to the API server. Please check your internet connection and server status.';
            }
            
            console.log('API failed, loading fallback data...');
            this.loadFallbackData();
        }
    }
    
    // Scroll to top of articles content
    scrollToTop() {
        const articlesContent = document.querySelector('.articles-content');
        if (articlesContent) {
            articlesContent.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    // This is used to select number for page
    postPaginate(pageNumber) {
        if (this.state.usingFallback) {
            // Use client-side pagination for fallback data
            let indexOfLastPost = pageNumber * this.state.postsPerPage;
            let indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
            this.setState({ 
                currentPostPage: pageNumber,
                currentPosts: this.state.posts.slice(indexOfFirstPost, indexOfLastPost)
            }, () => {
                // Scroll to top after state update
                this.scrollToTop();
            });
        } else {
            // Use API pagination
            this.fetchArticlesForPage(pageNumber);
        }
    }
    
    // Make sure that we are not going beyond the borders
    goToVerifiedPage(dec, currentPage, totalPages) {
        return (dec == 0 && (currentPage < totalPages)) || (dec == 1 && (currentPage > 1));
    }

    // This is to control arrows for going backward and forward
    goToPostPage(dec, totalPages) {
        if (dec === 1) {
            if (this.goToVerifiedPage(dec, this.state.currentPostPage, totalPages)) {
                const newPage = this.state.currentPostPage - 1;
                this.postPaginate(newPage);
            }
        } else {
            if (this.goToVerifiedPage(dec, this.state.currentPostPage, totalPages)) {
                const newPage = this.state.currentPostPage + 1;
                this.postPaginate(newPage);
            }
        }
    }

    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        this.setState({ searchTerm });
        this.filterPosts(searchTerm, this.state.selectedCategory);
    }

    handleCategoryFilter(category) {
        this.setState({ selectedCategory: category });
        this.filterPosts(this.state.searchTerm, category);
    }

    filterPosts(searchTerm, category) {
        let filtered = this.state.mergeArray.filter(article => article.status === 'published');

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(article => 
                article.title.toLowerCase().includes(searchTerm) ||
                (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }

        // Filter by category
        if (category !== 'all') {
            filtered = filtered.filter(article =>
                article.tags && article.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
            );
        }

        const filteredPosts = filtered.map((article, idx) => {
            // Check if it's a note based on 'type' field or 'file-id' field
            let noteValue = 0;
            if (article.type === 'note' || article['file-id'] === 'note') {
                noteValue = 1;
            }
            
            return <ArticleModule key={idx}
                id={article.id}
                title={article.title}
                date={article.date}
                image={article.image}
                slug={article.slug}
                tags={article.tags}
                likeCount={article.like_count || 0}
                note={noteValue}/>
        });

        this.setState({ 
            filteredPosts,
            posts: filteredPosts,
            currentPostPage: 1,
            currentPosts: filteredPosts.slice(0, this.state.postsPerPage)
        });
    }

    clearFilters() {
        const publishedArticles = this.state.mergeArray.filter(article => article.status === 'published');
        
        this.setState({
            searchTerm: '',
            selectedCategory: 'all',
            posts: publishedArticles.map((article, idx) => {
                // Check if it's a note based on 'type' field or 'file-id' field
                let noteValue = 0;
                if (article.type === 'note' || article['file-id'] === 'note') {
                    noteValue = 1;
                }
                
                return <ArticleModule key={idx}
                    id={article.id}
                    title={article.title}
                    date={article.date}
                    image={article.image}
                    slug={article.slug}
                    tags={article.tags}
                    likeCount={article.like_count || 0}
                    note={noteValue}/>
            }),
            currentPostPage: 1,
            currentPosts: publishedArticles.map((article, idx) => {
                // Check if it's a note based on 'type' field or 'file-id' field
                let noteValue = 0;
                if (article.type === 'note' || article['file-id'] === 'note') {
                    noteValue = 1;
                }
                
                return <ArticleModule key={idx}
                    id={article.id}
                    title={article.title}
                    date={article.date}
                    image={article.image}
                    slug={article.slug}
                    tags={article.tags}
                    likeCount={article.like_count || 0}
                    note={noteValue}/>
            }).slice(0, this.state.postsPerPage)
        });
    }

    async fetchArticlesForPage(pageNumber) {
        try {
            const response = await fetch(`${ARTICLES_ENDPOINT}?page=${pageNumber}&per_page=${this.state.postsPerPage}&status=published`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: 'cors',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.data) {
                const articles = data.data;
                const pagination = data.pagination || {};
                
                const articles_sorted = filtered(articles);
                
                const posts = articles_sorted.map((article, idx) => {
                    let noteValue = 0;
                    if (article.type === 'note' || article['file-id'] === 'note') {
                        noteValue = 1;
                    }
                    
                    let parsedImage = article.image;
                    if (typeof article.image === 'string') {
                        try {
                            parsedImage = JSON.parse(article.image);
                        } catch (e) {
                            parsedImage = { name: '', alt: '' };
                        }
                    }
                    
                    return <ArticleModule key={idx}
                        id={article.id}
                        title={article.title}
                        date={new Date(article.date).getTime()}
                        image={parsedImage}
                        slug={article.slug}
                        tags={article.tags}
                        likeCount={article.like_count || 0}
                        note={noteValue}/>
                });

                this.setState({
                    posts: posts,
                    currentPosts: posts, // Show all articles from current page
                    currentPostPage: pageNumber,
                    currentPage: pagination.current_page || pageNumber,
                    totalPages: pagination.total_pages || this.state.totalPages,
                    mergeArray: articles_sorted, // Update mergeArray for filtering
                    filteredPosts: articles_sorted // Update filteredPosts for filtering
                }, () => {
                    // Scroll to top after state update
                    this.scrollToTop();
                });
            }
        } catch (error) {
            console.error('Error fetching articles for page:', error);
            // Fall back to client-side pagination if API fails
            this.postPaginate(pageNumber);
        }
    }

    render() {
        const hasActiveFilters = this.state.searchTerm || this.state.selectedCategory !== 'all';
        
        // Debug logging
        console.log('Render state:', {
            postsLength: this.state.postsLength,
            totalArticles: this.state.totalArticles,
            currentPosts: this.state.currentPosts.length,
            posts: this.state.posts.length,
            mergeArray: this.state.mergeArray.length,
            currentPage: this.state.currentPage,
            totalPages: this.state.totalPages,
            usingFallback: this.state.usingFallback
        });
        
        // Loading state
        if (this.state.loading) {
            return (
                <div className='app-body' id='articles-container'>
                    <div className='articles-header'>
                        <div className="header-content">
                            <div className="header-text">
                                <h1 className="articles-title">Blog & Articles</h1>
                                <p className="articles-subtitle">
                                    Exploring technology, development, and thoughts on building better software
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading articles...</p>
                    </div>
                </div>
            );
        }

        // Error state
        if (this.state.error) {
            return (
                <div className='app-body' id='articles-container'>
                    <div className='articles-header'>
                        <div className="header-content">
                            <div className="header-text">
                                <h1 className="articles-title">Blog & Articles</h1>
                                <p className="articles-subtitle">
                                    Exploring technology, development, and thoughts on building better software
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="error-container">
                        <div className="error-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3>Error Loading Articles</h3>
                        <p>{this.state.error}</p>
                        <button className="retry-btn" onClick={this.fetchArticles}>
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }
        
        return (
            <div className='app-body' id='articles-container'>
                {/* Modern Header */}
                <div className='articles-header'>
                    <div className="header-content">
                        <div className="header-text">
                            <h1 className="articles-title">Blog & Articles</h1>
                            <p className="articles-subtitle">
                                Exploring technology, development, and thoughts on building better software
                            </p>
                        </div>
                        <div className="header-stats">
                            <div className="stat-item">
                                <span className="stat-number">{this.state.postsLength}</span>
                                <span className="stat-label">Total Posts</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="articles-controls">
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input 
                                className="articles-search"
                                type="text" 
                                id="articleSearchInput"
                                placeholder="Search articles by title or tags..."
                                value={this.state.searchTerm}
                                onChange={this.handleSearch}
                            />
                        </div>
                    </div>

                    <div className="filter-container">
                        <div className="category-filters">
                            {this.state.categories.map((category, index) => (
                                <button
                                    key={index}
                                    className={`category-filter ${this.state.selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => this.handleCategoryFilter(category)}
                                >
                                    {category === 'all' ? 'All Posts' : category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                        
                        {hasActiveFilters && (
                            <button className="clear-filters" onClick={this.clearFilters}>
                                <svg className="clear-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Summary */}
                {hasActiveFilters && (
                    <div className="results-summary">
                        <p>
                            Showing {this.state.posts.length} result{this.state.posts.length !== 1 ? 's' : ''}
                            {this.state.searchTerm && ` for "${this.state.searchTerm}"`}
                            {this.state.selectedCategory !== 'all' && ` in ${this.state.selectedCategory}`}
                        </p>
                    </div>
                )}

                {/* Articles Grid */}
                <div className='articles-content'>
                    {this.state.currentPosts.length > 0 ? (
                        <div className='articles-grid'>
                            {this.state.currentPosts}
                        </div>
                    ) : (
                        <div className="no-results">
                            <div className="no-results-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                                </svg>
                            </div>
                            <h3>No articles found</h3>
                            <p>Try adjusting your search terms or filters</p>
                            <button className="clear-filters-btn" onClick={this.clearFilters}>
                                Clear all filters
                            </button>
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {this.state.postsLength > this.state.postsPerPage && (
                        <Pagination 
                            postsPerPage={this.state.postsPerPage}
                            totalPosts={this.state.postsLength}
                            paginate={this.postPaginate}
                            goToPage={this.goToPostPage}
                            active={this.state.currentPostPage}
                        />
                    )}
                </div>
            </div>
        )
    }
}

export default ArticlesPage;