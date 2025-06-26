import './css/viewarticle.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import { faShareAlt, faArrowLeft, faCalendarAlt, faUser } from '@fortawesome/fontawesome-free-solid'
// import { useParams } from "react-router-dom";
import _articles from '../assets/json/articles.json';
import _notes from '../assets/json/notes.json';
import PostSection from '../sections/post_subsection';

// Add Icons from Font Awesome
fontawesome.library.add(faShareAlt, faArrowLeft, faCalendarAlt, faUser);

function getPostTags(post) {
    return post.tags.map((tag, idx) => (
        <span className='post-header-tag' key={idx}>{tag}</span>
    ));
}

function getImage(post) {
    if (post.image) {
        return (
            <div className="post-hero-image">
                <img className="post-header-image" src={post.image.name} alt={post.image.alt} />
            </div>
        );
    }
    return null;
}

function getSections(post) {
    if (!post.content) {
        return (
            <div className="post-content-placeholder">
                <div className="placeholder-content">
                    <h3>Content Coming Soon</h3>
                    <p>This article is being prepared. Check back soon for the full content!</p>
                </div>
            </div>
        );
    }
    
    return post.content.map((section, idx) => {
        return <PostSection
            key={"s_" + idx}
            section={"section_" + idx}
            title={section.title}
            paragraphs={section.paragraphs}
            images={section.images}
            codeblocks={section.code}
            blockquotes={section.blockquotes}
            links={section.links}
            lists={section.lists} />
    });
}

function getDate(post) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const date = new Date(parseInt(post.date));
    
    // Responsive date format
    const mediaQuery = window.matchMedia('(max-width: 460px)');
    if (mediaQuery.matches) {
        options.weekday = undefined;
        options.month = 'short';
    }
    
    return date.toLocaleDateString("en-US", options);
}

function copyURL() {
    navigator.clipboard.writeText(document.URL);
    
    // Show feedback (you could add a toast notification here)
    const shareButton = document.getElementById("shareButton");
    if (shareButton) {
        const originalText = shareButton.innerHTML;
        shareButton.innerHTML = '<span class="post-header-shareButton-icon">✓</span> Copied!';
        setTimeout(() => {
            shareButton.innerHTML = originalText;
        }, 2000);
    }
}

function ViewArticlePage() {
    // Extract ID from URL pathname (e.g., /articles/my-article-id -> my-article-id)
    const pathname = window.location.pathname;
    const _id = pathname.split('/').pop();
    
    console.log('Article ID:', _id);
    console.log('Current URL:', document.URL);
    
    let post = _articles.find(article => article.id === _id);
    if (post === undefined) {
        post = _notes.find(note => note.id === _id);
    }
    
    // Handle case where post is not found
    if (!post) {
        return (
            <div className='app-body'>
                <div className='error-container'>
                    <div className="error-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                        </svg>
                    </div>
                    <h1>Article Not Found</h1>
                    <p>The article you're looking for doesn't exist or may have been moved.</p>
                    <div className="error-actions">
                        <a href="/articles" className="back-link">
                            <FontAwesomeIcon icon="arrow-left" />
                            Back to Articles
                        </a>
                        <a href="/" className="home-link">
                            Go Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }
    
    const image_obj = getImage(post);
    const tags = getPostTags(post);
    const sections = getSections(post);
    const date = getDate(post);
    const isNote = post['file-id'] === 'note';

    return (
        <div className="article-page">
            {/* Back Navigation */}
            <div className="article-navigation">
                <a href="/articles" className="back-button">
                    <FontAwesomeIcon icon="arrow-left" />
                    <span>Back to Articles</span>
                </a>
            </div>

            <article className='app-body' id='post-container'>
                {/* Hero Section */}
                <div className='post-hero'>
                    <div className="post-hero-content">
                        <div className="post-meta-badge">
                            <FontAwesomeIcon icon={isNote ? "sticky-note" : "newspaper"} />
                            <span>{isNote ? 'Note' : 'Article'}</span>
                        </div>
                        
                        <h1 id='post-header-title'>{post.title}</h1>
                        
                        <div className='post-header-meta'>
                            <div className="author-info">
                                <img className='post-header-icon' src="https://i.ibb.co/HY4dx9s/headshot.jpg" alt="Devontae Reid" />
                                <div className="author-details">
                                    <span className="author-name">Devontae Reid</span>
                                    <div className="post-date">
                                        <FontAwesomeIcon icon="calendar-alt" />
                                        <span>{date}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                className="post-header-shareButton" 
                                id="shareButton" 
                                onClick={copyURL}
                                aria-label="Share article"
                            >
                                <FontAwesomeIcon icon="share-alt" />
                                <span>Share</span>
                            </button>
                        </div>
                        
                        {tags && tags.length > 0 && (
                            <div className="post-header-tags">
                                {tags}
                            </div>
                        )}
                    </div>
                    
                    {image_obj && (
                        <div className="post-hero-visual">
                            {image_obj}
                        </div>
                    )}
                </div>

                {/* Article Content */}
                <div className='post-content-wrapper'>
                    <div className='post-content'>
                        {sections}
                    </div>
                    
                    {/* Article Footer */}
                    <div className="post-footer">
                        <div className="post-footer-content">
                            <div className="post-footer-meta">
                                <p>Thanks for reading! If you found this helpful, consider sharing it.</p>
                            </div>
                            <button 
                                className="post-footer-share" 
                                onClick={copyURL}
                            >
                                <FontAwesomeIcon icon="share-alt" />
                                Share Article
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}

export default ViewArticlePage;