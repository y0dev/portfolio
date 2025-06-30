/**
 * Article Likes Handler
 * Handles like/unlike functionality for articles
 */

class ArticleLikesHandler {
    constructor() {
        this.apiBaseUrl = 'https://devontaereid.com/scripts/api';
        this.likeButtons = document.querySelectorAll('.article-like-btn');
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateLikeCounts();
    }

    bindEvents() {
        this.likeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLikeClick(button);
            });
        });
    }

    async handleLikeClick(button) {
        const articleId = button.dataset.articleId;
        const likeCountElement = button.querySelector('.like-count');
        const likeIcon = button.querySelector('.like-icon');
        
        if (!articleId) {
            console.error('No article ID found');
            return;
        }

        // Prevent multiple clicks
        if (button.classList.contains('loading')) {
            return;
        }

        // Add loading state
        button.classList.add('loading');
        button.disabled = true;

        try {
            const response = await fetch(`${this.apiBaseUrl}/articles/${articleId}?action=like`, {
                method: 'POST',
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
            
            if (data.success) {
                // Update UI
                this.updateLikeButton(button, data.data);
                
                // Show success message
                this.showLikeMessage(data.data.action === 'liked' ? 'Liked!' : 'Unliked!');
            } else {
                throw new Error(data.message || 'Failed to update like');
            }
        } catch (error) {
            console.error('Error updating like:', error);
            this.showLikeMessage('Error updating like', 'error');
        } finally {
            // Remove loading state
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    updateLikeButton(button, data) {
        const likeCountElement = button.querySelector('.like-count');
        const likeIcon = button.querySelector('.like-icon');
        
        // Update count
        if (likeCountElement) {
            likeCountElement.textContent = data.like_count;
        }
        
        // Update button state
        if (data.liked) {
            button.classList.add('liked');
            button.setAttribute('aria-pressed', 'true');
            if (likeIcon) {
                likeIcon.innerHTML = '❤️'; // Filled heart
            }
        } else {
            button.classList.remove('liked');
            button.setAttribute('aria-pressed', 'false');
            if (likeIcon) {
                likeIcon.innerHTML = '🤍'; // Empty heart
            }
        }
    }

    updateLikeCounts() {
        // Update all like counts on page load
        this.likeButtons.forEach(button => {
            const articleId = button.dataset.articleId;
            if (articleId) {
                this.fetchArticleData(articleId).then(data => {
                    if (data) {
                        this.updateLikeButton(button, {
                            like_count: data.like_count,
                            liked: data.user_liked
                        });
                    }
                }).catch(error => {
                    console.error('Error fetching article data:', error);
                });
            }
        });
    }

    async fetchArticleData(articleId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/articles/${articleId}`, {
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
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error fetching article data:', error);
            return null;
        }
    }

    showLikeMessage(message, type = 'success') {
        // Create or update message element
        let messageElement = document.getElementById('like-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'like-message';
            messageElement.className = 'like-message';
            document.body.appendChild(messageElement);
        }

        messageElement.textContent = message;
        messageElement.className = `like-message ${type}`;
        messageElement.style.display = 'block';

        // Hide message after 3 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }

    // Static method to create like button HTML
    static createLikeButton(articleId, likeCount = 0, userLiked = false) {
        const likedClass = userLiked ? 'liked' : '';
        const pressedState = userLiked ? 'true' : 'false';
        const heartIcon = userLiked ? '❤️' : '🤍';
        
        return `
            <button class="article-like-btn ${likedClass}" 
                    data-article-id="${articleId}" 
                    aria-pressed="${pressedState}"
                    aria-label="${userLiked ? 'Unlike' : 'Like'} this article">
                <span class="like-icon">${heartIcon}</span>
                <span class="like-count">${likeCount}</span>
            </button>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ArticleLikesHandler();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArticleLikesHandler;
} 