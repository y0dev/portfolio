import './css/viewarticle.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import { faShareAlt, faArrowLeft, faCalendarAlt, faUser } from '@fortawesome/fontawesome-free-solid'
// import { useParams } from "react-router-dom";
import data from '../assets/json/data.json';
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

function getLatestArticles(currentArticleId, limit = 3) {
    // Combine articles and notes, sort by date, and exclude current article
    const allPosts = [...data.articles, ...data.notes]
        .filter(post => post.id !== currentArticleId)
        .sort((a, b) => parseInt(b.date) - parseInt(a.date))
        .slice(0, limit);
    
    return allPosts.map(post => {
        const date = new Date(parseInt(post.date));
        const formattedDate = date.toLocaleDateString("en-US", { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        return (
            <div className="latest-article-card" key={post.id}>
                <a href={`/${post['file-id'] === 'note' ? 'note' : 'article'}/${post.id}`} className="latest-article-link">
                    {post.image && (
                        <div className="latest-article-image">
                            <img src={post.image.name} alt={post.image.alt} />
                        </div>
                    )}
                    <div className="latest-article-content">
                        <h3 className="latest-article-title">{post.title}</h3>
                        <p className="latest-article-excerpt">{post.description}</p>
                        <div className="latest-article-meta">
                            <span className="latest-article-date">{formattedDate}</span>
                            <span className="latest-article-type">{post['file-id'] === 'note' ? 'Note' : 'Article'}</span>
                        </div>
                    </div>
                </a>
            </div>
        );
    });
}

function ViewArticlePage() {
    // Extract ID from URL pathname (e.g., /article/my-article-id -> my-article-id)
    const pathname = window.location.pathname;
    const _id = pathname.split('/').pop();
    const personal = data.personal;
    
    console.log('Article ID:', _id);
    console.log('Current URL:', document.URL);
    
    let post = data.articles.find(article => article.id === _id);
    if (post === undefined) {
        post = data.notes.find(note => note.id === _id);
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
    const latestArticles = getLatestArticles(_id);

    return (
        <div className="article-page">
            {/* Back Navigation */}
            <div className="article-navigation">
                <a href="/articles" className="back-button">
                    <FontAwesomeIcon icon="arrow-left" />
                    <span>Back to Articles</span>
                </a>
            </div>

            <div className="article-layout">
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
                                    <img className='post-header-icon' src="https://i.ibb.co/HY4dx9s/headshot.jpg" alt={personal.name} />
                                    <div className="author-details">
                                        <span className="author-name">{personal.name}</span>
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

                {/* Latest Articles Sidebar */}
                <aside className="latest-articles-sidebar">
                    <div className="latest-articles-container">
                        <h2 className="latest-articles-title">Latest Articles</h2>
                        <div className="latest-articles-list">
                            {latestArticles}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Latest Articles Section for Mobile */}
            <section className="latest-articles-mobile">
                <div className="latest-articles-container">
                    <h2 className="latest-articles-title">Latest Articles</h2>
                    <div className="latest-articles-list">
                        {latestArticles}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ViewArticlePage;