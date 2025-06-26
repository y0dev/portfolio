import React, { Component } from 'react';
import './css/articles.css';
import _articles from '../assets/json/articles.json';
import _notes from '../assets/json/notes.json';
import ArticleModule from '../components/articlemodule';
import Pagination from '../components/pagination';

function filtered(json_object) {
    return json_object.sort((a, b) => b.date - a.date);
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
            categories: ['all', 'web development', 'programming', 'technology', 'tutorial', 'thoughts'],
            filteredPosts: []
        }
        
        // Get both articles and notes and sort by date
        const articles_sorted = filtered(_articles);
        const notes_sorted = filtered(_notes);
        const mergeArray = filtered(articles_sorted.concat(notes_sorted));
        this.state.mergeArray = mergeArray;
        this.state.filteredPosts = mergeArray;

        this.state.posts = mergeArray.map((article, idx) => {
            let noteValue = article['file-id'] === 'note' ? 1 : 0;
            return <ArticleModule key={idx}
                title={article.title}
                date={article.date}
                image={article.image}
                id={article.id}
                tags={article.tags}
                note={noteValue}/>
        });

        // Get current posts
        let indexOfLastPost = this.state.currentPostPage * this.state.postsPerPage;
        let indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
        this.state.currentPosts = this.state.posts.slice(indexOfFirstPost, indexOfLastPost);

        this.state.postsLength = this.state.posts.length;
        this.handleSearch = this.handleSearch.bind(this);
        this.handleCategoryFilter = this.handleCategoryFilter.bind(this);
        this.postPaginate = this.postPaginate.bind(this);
        this.goToVerifiedPage = this.goToVerifiedPage.bind(this);
        this.goToPostPage = this.goToPostPage.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
    }

    componentDidMount() {
        // Only show paginate if greater than postsPerPage
        if (this.state.posts.length <= this.state.postsPerPage) {
            const article_pa = document.getElementById('article-paginate');
            if (article_pa) {
                article_pa.classList.add('hidden');
            }
        }
    }
    
    // This is used to select number for page
    postPaginate(pageNumber) {
        let indexOfLastPost = pageNumber * this.state.postsPerPage;
        let indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
        this.setState({ 
            currentPostPage: pageNumber,
            currentPosts: this.state.posts.slice(indexOfFirstPost, indexOfLastPost)
        });
    }
    
    // Make sure that we are not going beyond the borders
    goToVerifiedPage(dec, currentPage, totalPages) {
        return (dec == 0 && (currentPage < totalPages)) || (dec == 1 && (currentPage > 1));
    }

    // This is to control arrows for going backward and forward
    goToPostPage(dec, totalPages) {
        if (dec === 1) {
            if (this.goToVerifiedPage(dec, this.state.currentPostPage, totalPages)) {
                let indexOfLastNote = (this.state.currentPostPage - 1) * this.state.postsPerPage;
                let indexOfFirstNote = indexOfLastNote - this.state.postsPerPage;
                this.setState({ 
                    currentPostPage: this.state.currentPostPage - 1,
                    currentPosts: this.state.posts.slice(indexOfFirstNote, indexOfLastNote)
                });
            }
        } else {
            if (this.goToVerifiedPage(dec, this.state.currentPostPage, totalPages)) {
                let indexOfLastNote = (this.state.currentPostPage + 1) * this.state.postsPerPage;
                let indexOfFirstNote = indexOfLastNote - this.state.postsPerPage;
                this.setState({ 
                    currentPostPage: this.state.currentPostPage + 1,
                    currentPosts: this.state.posts.slice(indexOfFirstNote, indexOfLastNote)
                });
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
        let filtered = this.state.mergeArray;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(article => 
                article.title.toLowerCase().includes(searchTerm) ||
                article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Filter by category
        if (category !== 'all') {
            filtered = filtered.filter(article =>
                article.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
            );
        }

        const filteredPosts = filtered.map((article, idx) => {
            let noteValue = article['file-id'] === 'note' ? 1 : 0;
            return <ArticleModule key={idx}
                title={article.title}
                date={article.date}
                image={article.image}
                id={article.id}
                tags={article.tags}
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
        this.setState({
            searchTerm: '',
            selectedCategory: 'all',
            posts: this.state.mergeArray.map((article, idx) => {
                let noteValue = article['file-id'] === 'note' ? 1 : 0;
                return <ArticleModule key={idx}
                    title={article.title}
                    date={article.date}
                    image={article.image}
                    id={article.id}
                    tags={article.tags}
                    note={noteValue}/>
            }),
            currentPostPage: 1,
            currentPosts: this.state.mergeArray.map((article, idx) => {
                let noteValue = article['file-id'] === 'note' ? 1 : 0;
                return <ArticleModule key={idx}
                    title={article.title}
                    date={article.date}
                    image={article.image}
                    id={article.id}
                    tags={article.tags}
                    note={noteValue}/>
            }).slice(0, this.state.postsPerPage)
        });
    }

    render() {
        const hasActiveFilters = this.state.searchTerm || this.state.selectedCategory !== 'all';
        
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
                                <span className="stat-number">{this.state.mergeArray.length}</span>
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
                    {this.state.posts.length > this.state.postsPerPage && (
                        <Pagination 
                            postsPerPage={this.state.postsPerPage}
                            totalPosts={this.state.posts.length}
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