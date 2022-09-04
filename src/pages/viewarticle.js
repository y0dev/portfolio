import './css/viewarticle.css';
import React from 'react';
import { useParams } from "react-router-dom";
import _articles from '../assets/json/articles.json';
import _notes from '../assets/json/notes.json';
import PostSection from '../sections/post_subsection';
import {Helmet} from "react-helmet";

import images from '../assets/images/images.js';


function getPostTags(post) {
    return post.tags.map((tag, idx) => (
        <span className='post-header-tag' key={idx}>{tag}</span>
    ));
}

function getImage(post) {
    if ( post.image )
    {
        const arr = post.image.name.split(".");
        const image = images.find(img => img.includes(arr[0]));
        return <img className="post-header-image" src={image} alt={post.image.alt}></img>
    }
}

function getSections(post) {
    return post.content.map((section, idx) => {
        // console.log(section);
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
    
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(parseInt(post.date));
    // Create a media condition that targets viewports prefers dark color scheme
    const mediaQuery = window.matchMedia('(max-width: 460px)')
    // Check if the media query is true
    if (mediaQuery.matches) {
       // Then trigger an alert
       options = { year: 'numeric', month: 'short', day: 'numeric' };
    }
    return date.toLocaleDateString("en-US", options);
}

function copyURL(event)
{
    // console.log(document.URL);
    navigator.clipboard.writeText(document.URL);
}

function ViewArticlePage() {
    let { id } = useParams();
    let post = _articles.find(article => article.id === id);
    if (post === undefined)
    {
        post = _notes.find(note => note.id === id);
    }
    const image = getImage(post);
    const tags = getPostTags(post);
    const sections = getSections(post);
    const date = getDate(post);
    
    // console.log(post);
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{post.title}</title>
                <link rel="canonical" href={document.URL} />
                {/* <meta name="description" content="Backend & Frontend Developer, Engineer, & Theologian"/> */}
                <meta name="author" content="Devontae Reid"/>
                <meta property="og:type" content="website"/>
                <meta property="og:title" content={post.title}/>
                <meta property="og:url" content={document.URL}/>
                {/* <meta property="og:description" content="Backend & Frontend Developer, Engineer, & Theologian"/> */}
                <meta property="og:site_name" content="Devontae Reid"/>
                <meta property="og:image" content={image} />
                <meta property="twitter:title" content={post.title}/>
                {/* <meta property="twitter:description" content="Backend & Frontend Developer, Engineer, & Theologian"/> */}
                <meta property="twitter:image" content={image}/>
                <meta property="twitter:card" content="'summary_large_image"/>
                <meta property="twitter:site" content="'@_yodev_"/>
            </Helmet>
            <article className='app-body post-container'>
            <div className='post-header-container'>
                <div className='post-header-details'>
                    <h1 id='post-header-title'>{post.title}</h1>
                    <div className='post-header-meta'>
                        <img className='post-header-icon' src="https://i.ibb.co/HY4dx9s/headshot.jpg" alt="headshot" />
                        <p className='post-header-time'>{ date }</p>
                        <span className="post-header-divider"> | </span>
                        <button className="post-header-shareButton" id="shareButton" onClick={copyURL}>
                            <span className="post-header-shareButton-icon">
                                <i className="fas fa-share-alt"></i>
                            </span>
                            Share
                        </button>
                    </div>
                    
                    <div className="post-header-tags">
                        {tags}                       
                    </div>
                </div>  
                {image}
            </div>
            <div className='post-content'>
                {sections}
            </div>
        </article>
        </div>
    )
}

export default ViewArticlePage;