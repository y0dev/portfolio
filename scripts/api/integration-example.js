/**
 * API Integration Example for React Articles Component
 * 
 * This file demonstrates how to integrate the PHP API with your React articles.js component
 * 
 * @author Devontae Reid
 * @version 1.0
 */

// API Configuration
const API_BASE_URL = 'http://localhost/scripts/api/';
const API_ENDPOINTS = {
    articles: `${API_BASE_URL}articles`,
    projects: `${API_BASE_URL}projects`,
    testimonials: `${API_BASE_URL}testimonials`,
    books: `${API_BASE_URL}books`,
    resources: `${API_BASE_URL}resources`
};

// API Service Class
class ApiService {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    // Generic request method
    async makeRequest(endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : this.baseUrl + endpoint;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const requestOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, requestOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Articles API methods
    async getArticles(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${API_ENDPOINTS.articles}?${queryString}` : API_ENDPOINTS.articles;
        return this.makeRequest(url);
    }

    async getArticle(id) {
        return this.makeRequest(`${API_ENDPOINTS.articles}/${id}`);
    }

    async createArticle(articleData) {
        return this.makeRequest(API_ENDPOINTS.articles, {
            method: 'POST',
            body: JSON.stringify(articleData)
        });
    }

    async updateArticle(id, articleData) {
        return this.makeRequest(`${API_ENDPOINTS.articles}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(articleData)
        });
    }

    async deleteArticle(id) {
        return this.makeRequest(`${API_ENDPOINTS.articles}/${id}`, {
            method: 'DELETE'
        });
    }

    // Projects API methods
    async getProjects(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${API_ENDPOINTS.projects}?${queryString}` : API_ENDPOINTS.projects;
        return this.makeRequest(url);
    }

    async getProject(id) {
        return this.makeRequest(`${API_ENDPOINTS.projects}/${id}`);
    }

    async createProject(projectData) {
        return this.makeRequest(API_ENDPOINTS.projects, {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    }

    async updateProject(id, projectData) {
        return this.makeRequest(`${API_ENDPOINTS.projects}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(projectData)
        });
    }

    async deleteProject(id) {
        return this.makeRequest(`${API_ENDPOINTS.projects}/${id}`, {
            method: 'DELETE'
        });
    }

    // Testimonials API methods
    async getTestimonials(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${API_ENDPOINTS.testimonials}?${queryString}` : API_ENDPOINTS.testimonials;
        return this.makeRequest(url);
    }

    async getTestimonial(id) {
        return this.makeRequest(`${API_ENDPOINTS.testimonials}/${id}`);
    }

    async createTestimonial(testimonialData) {
        return this.makeRequest(API_ENDPOINTS.testimonials, {
            method: 'POST',
            body: JSON.stringify(testimonialData)
        });
    }

    async updateTestimonial(id, testimonialData) {
        return this.makeRequest(`${API_ENDPOINTS.testimonials}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(testimonialData)
        });
    }

    async deleteTestimonial(id) {
        return this.makeRequest(`${API_ENDPOINTS.testimonials}/${id}`, {
            method: 'DELETE'
        });
    }

    // Books API methods
    async getBooks(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${API_ENDPOINTS.books}?${queryString}` : API_ENDPOINTS.books;
        return this.makeRequest(url);
    }

    async getBook(id) {
        return this.makeRequest(`${API_ENDPOINTS.books}/${id}`);
    }

    async createBook(bookData) {
        return this.makeRequest(API_ENDPOINTS.books, {
            method: 'POST',
            body: JSON.stringify(bookData)
        });
    }

    async updateBook(id, bookData) {
        return this.makeRequest(`${API_ENDPOINTS.books}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(bookData)
        });
    }

    async deleteBook(id) {
        return this.makeRequest(`${API_ENDPOINTS.books}/${id}`, {
            method: 'DELETE'
        });
    }

    // Resources API methods
    async getResources(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${API_ENDPOINTS.resources}?${queryString}` : API_ENDPOINTS.resources;
        return this.makeRequest(url);
    }

    async getResource(id) {
        return this.makeRequest(`${API_ENDPOINTS.resources}/${id}`);
    }

    async createResource(resourceData) {
        return this.makeRequest(API_ENDPOINTS.resources, {
            method: 'POST',
            body: JSON.stringify(resourceData)
        });
    }

    async updateResource(id, resourceData) {
        return this.makeRequest(`${API_ENDPOINTS.resources}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(resourceData)
        });
    }

    async deleteResource(id) {
        return this.makeRequest(`${API_ENDPOINTS.resources}/${id}`, {
            method: 'DELETE'
        });
    }
}

// Create API service instance
const apiService = new ApiService();

// Example usage functions
async function testApiIntegration() {
    console.log('Testing API Integration...');

    try {
        // Test getting articles
        console.log('1. Getting articles...');
        const articlesResponse = await apiService.getArticles({
            page: 1,
            per_page: 6,
            category: 'technology'
        });
        console.log('Articles response:', articlesResponse);

        // Test creating an article
        console.log('2. Creating an article...');
        const newArticle = {
            title: 'API Integration Test',
            content: 'This is a test article created via API integration.',
            category: 'technology',
            tags: ['api', 'test', 'integration'],
            image: 'test-image.jpg'
        };
        const createResponse = await apiService.createArticle(newArticle);
        console.log('Create response:', createResponse);

        // Test updating the article
        if (createResponse.success && createResponse.data.id) {
            console.log('3. Updating the article...');
            const updateData = {
                title: 'Updated API Integration Test',
                content: 'This article has been updated via API.'
            };
            const updateResponse = await apiService.updateArticle(createResponse.data.id, updateData);
            console.log('Update response:', updateResponse);

            // Test deleting the article
            console.log('4. Deleting the article...');
            const deleteResponse = await apiService.deleteArticle(createResponse.data.id);
            console.log('Delete response:', deleteResponse);
        }

        // Test getting projects
        console.log('5. Getting projects...');
        const projectsResponse = await apiService.getProjects({
            page: 1,
            per_page: 4
        });
        console.log('Projects response:', projectsResponse);

        // Test getting testimonials
        console.log('6. Getting testimonials...');
        const testimonialsResponse = await apiService.getTestimonials({
            page: 1,
            per_page: 3
        });
        console.log('Testimonials response:', testimonialsResponse);

    } catch (error) {
        console.error('API test failed:', error);
    }
}

// React Component Integration Example
// This shows how to modify your articles.js component to use the API

const ReactApiIntegrationExample = `
// Modified ArticlesPage component using API
import React, { Component } from 'react';
import './css/articles.css';
import ArticleModule from '../components/articlemodule';
import Pagination from '../components/pagination';
import { apiService } from '../services/apiService'; // Import the API service

class ArticlesPage extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            postsLength: 0,
            postsPerPage: 6,
            currentPostPage: 1,
            currentPosts: [],
            searchTerm: '',
            selectedCategory: 'all',
            categories: ['all', 'programming', 'technology', 'tutorial', 'theology', 'health'],
            loading: false,
            error: null
        }
        
        this.handleSearch = this.handleSearch.bind(this);
        this.handleCategoryFilter = this.handleCategoryFilter.bind(this);
        this.postPaginate = this.postPaginate.bind(this);
        this.goToVerifiedPage = this.goToVerifiedPage.bind(this);
        this.goToPostPage = this.goToPostPage.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.loadArticles = this.loadArticles.bind(this);
    }

    async componentDidMount() {
        await this.loadArticles();
    }

    async loadArticles() {
        this.setState({ loading: true, error: null });

        try {
            const params = {
                page: this.state.currentPostPage,
                per_page: this.state.postsPerPage
            };

            // Add search and category filters
            if (this.state.searchTerm) {
                params.search = this.state.searchTerm;
            }
            if (this.state.selectedCategory !== 'all') {
                params.category = this.state.selectedCategory;
            }

            const response = await apiService.getArticles(params);

            if (response.success) {
                const articles = response.data.map((article, idx) => (
                    <ArticleModule 
                        key={article.id}
                        title={article.title}
                        date={article.date}
                        image={article.image}
                        id={article.id}
                        tags={article.tags}
                        note={article.type === 'note' ? 1 : 0}
                    />
                ));

                this.setState({
                    posts: articles,
                    postsLength: response.pagination.total,
                    currentPosts: articles,
                    loading: false
                });
            } else {
                throw new Error(response.message || 'Failed to load articles');
            }
        } catch (error) {
            console.error('Error loading articles:', error);
            this.setState({
                error: error.message,
                loading: false
            });
        }
    }

    async handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        this.setState({ searchTerm });
        
        // Debounce search requests
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.loadArticles();
        }, 300);
    }

    async handleCategoryFilter(category) {
        this.setState({ selectedCategory: category });
        await this.loadArticles();
    }

    async postPaginate(pageNumber) {
        this.setState({ currentPostPage: pageNumber }, () => {
            this.loadArticles();
        });
    }

    async clearFilters() {
        this.setState({
            searchTerm: '',
            selectedCategory: 'all',
            currentPostPage: 1
        }, () => {
            this.loadArticles();
        });
    }

    // ... rest of your component methods remain the same

    render() {
        const { loading, error, currentPosts, postsLength, postsPerPage, currentPostPage } = this.state;

        if (loading) {
            return (
                <div className="loading-container">
                    <div className="loading-spinner">Loading articles...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-container">
                    <h3>Error loading articles</h3>
                    <p>{error}</p>
                    <button onClick={this.loadArticles}>Try Again</button>
                </div>
            );
        }

        return (
            <div className='app-body' id='articles-container'>
                {/* Your existing JSX structure */}
                {/* ... */}
                
                {/* Articles Grid */}
                <div className='articles-content'>
                    {currentPosts.length > 0 ? (
                        <div className='articles-grid'>
                            {currentPosts}
                        </div>
                    ) : (
                        <div className="no-results">
                            <h3>No articles found</h3>
                            <p>Try adjusting your search terms or filters</p>
                            <button className="clear-filters-btn" onClick={this.clearFilters}>
                                Clear all filters
                            </button>
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {postsLength > postsPerPage && (
                        <Pagination 
                            postsPerPage={postsPerPage}
                            totalPosts={postsLength}
                            paginate={this.postPaginate}
                            goToPage={this.goToPostPage}
                            active={currentPostPage}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default ArticlesPage;
`;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiService, apiService, testApiIntegration };
}

// Run test if this file is executed directly
if (typeof window !== 'undefined') {
    // Browser environment
    window.ApiService = ApiService;
    window.apiService = apiService;
    window.testApiIntegration = testApiIntegration;
    
    // Auto-run test if in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Development environment detected. Run testApiIntegration() to test the API.');
    }
} 