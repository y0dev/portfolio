/**
 * Article Share Handler
 * Handles sharing functionality for articles
 */

class ArticleShareHandler {
    constructor() {
        this.shareButtons = document.querySelectorAll('.article-share-btn');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleShareClick(button);
            });
        });
    }

    async handleShareClick(button) {
        const articleId = button.dataset.articleId;
        const articleUrl = button.dataset.articleUrl;
        const articleTitle = button.dataset.articleTitle;
        
        if (!articleUrl) {
            console.error('No article URL found');
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
            // Try to use native Web Share API first
            if (navigator.share) {
                await navigator.share({
                    title: articleTitle || 'Check out this article',
                    url: articleUrl,
                    text: articleTitle || 'I found this interesting article'
                });
                
                // Update share count if successful
                if (articleId) {
                    this.updateShareCount(articleId);
                }
            } else {
                // Fallback to custom share menu
                this.showShareMenu(button, articleUrl, articleTitle);
            }
        } catch (error) {
            console.error('Error sharing:', error);
            // Fallback to custom share menu
            this.showShareMenu(button, articleUrl, articleTitle);
        } finally {
            // Remove loading state
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    showShareMenu(button, url, title) {
        // Create share menu
        const shareMenu = document.createElement('div');
        shareMenu.className = 'share-menu';
        shareMenu.innerHTML = `
            <div class="share-menu-content">
                <div class="share-menu-header">
                    <h3>Share Article</h3>
                    <button class="share-menu-close" aria-label="Close share menu">×</button>
                </div>
                <div class="share-options">
                    <button class="share-option" data-platform="twitter" data-url="${url}" data-title="${title}">
                        <span class="share-icon">🐦</span>
                        Twitter
                    </button>
                    <button class="share-option" data-platform="facebook" data-url="${url}" data-title="${title}">
                        <span class="share-icon">📘</span>
                        Facebook
                    </button>
                    <button class="share-option" data-platform="linkedin" data-url="${url}" data-title="${title}">
                        <span class="share-icon">💼</span>
                        LinkedIn
                    </button>
                    <button class="share-option" data-platform="copy" data-url="${url}">
                        <span class="share-icon">📋</span>
                        Copy Link
                    </button>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(shareMenu);

        // Bind events
        const closeBtn = shareMenu.querySelector('.share-menu-close');
        const shareOptions = shareMenu.querySelectorAll('.share-option');

        closeBtn.addEventListener('click', () => {
            shareMenu.remove();
        });

        shareOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const platform = e.currentTarget.dataset.platform;
                const shareUrl = e.currentTarget.dataset.url;
                const shareTitle = e.currentTarget.dataset.title;
                
                this.shareToPlatform(platform, shareUrl, shareTitle);
                shareMenu.remove();
            });
        });

        // Close on outside click
        shareMenu.addEventListener('click', (e) => {
            if (e.target === shareMenu) {
                shareMenu.remove();
            }
        });

        // Show menu
        setTimeout(() => {
            shareMenu.classList.add('show');
        }, 10);
    }

    shareToPlatform(platform, url, title) {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title || 'Check out this article');

        let shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'copy':
                this.copyToClipboard(url);
                return;
            default:
                console.error('Unknown platform:', platform);
                return;
        }

        // Open share URL in new window
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showShareMessage('Link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showShareMessage('Link copied to clipboard!');
        }
    }

    async updateShareCount(articleId) {
        try {
            const response = await fetch(`https://devontaereid.com/scripts/api/articles/${articleId}?action=share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: 'cors',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Update share count in UI
                    const shareCountElement = document.querySelector(`[data-article-id="${articleId}"] .share-count`);
                    if (shareCountElement) {
                        shareCountElement.textContent = data.data.share_count;
                    }
                }
            }
        } catch (error) {
            console.error('Error updating share count:', error);
        }
    }

    showShareMessage(message, type = 'success') {
        // Create or update message element
        let messageElement = document.getElementById('share-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'share-message';
            messageElement.className = 'share-message';
            document.body.appendChild(messageElement);
        }

        messageElement.textContent = message;
        messageElement.className = `share-message ${type}`;
        messageElement.style.display = 'block';

        // Hide message after 3 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }

    // Static method to create share button HTML
    static createShareButton(articleId, articleUrl, articleTitle, shareCount = 0) {
        return `
            <button class="article-share-btn" 
                    data-article-id="${articleId || ''}" 
                    data-article-url="${articleUrl || ''}" 
                    data-article-title="${articleTitle || ''}"
                    aria-label="Share this article">
                <span class="share-icon">📤</span>
                <span class="share-count">${shareCount}</span>
            </button>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ArticleShareHandler();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArticleShareHandler;
} 