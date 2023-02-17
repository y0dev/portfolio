import './css/viewarticle.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import { faShareAlt } from '@fortawesome/fontawesome-free-solid'
// import { useParams } from "react-router-dom";
import _articles from '../assets/json/articles.json';
import _notes from '../assets/json/notes.json';
import PostSection from '../sections/post_subsection';

// Add Icons from Font Awesome
fontawesome.library.add(faShareAlt);

function getPostTags(post) {
    return post.tags.map((tag, idx) => (
        <span className='post-header-tag' key={idx}>{tag}</span>
    ));
}

function getImage(post) {
    if ( post.image )
    {
        const arr = post.image.name.split(".");
        return <img className="post-header-image" src={post.image.name} alt={post.image.alt}></img>
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

    const _id = window.location.href.split('?').reverse()[0]
    // let { id } = useParams();
    // console.log(id);
    console.log(document.URL);
    let post = _articles.find(article => article.id === _id);
    if (post === undefined)
    {
        post = _notes.find(note => note.id === _id);
    }
    const image_obj = getImage(post);
    const tags = getPostTags(post);
    const sections = getSections(post);
    const date = getDate(post);
    

    return (
        <div>
            <article className='app-body' id='post-container'>
            <div className='post-header-container'>
                <div className='post-header-details'>
                    <h1 id='post-header-title'>{post.title}</h1>
                    <div className='post-header-meta'>
                        <img className='post-header-icon' src="https://i.ibb.co/HY4dx9s/headshot.jpg" alt="headshot" />
                        <p className='post-header-time'>{ date }</p>
                        <span className="post-header-divider"> | </span>
                        <button className="post-header-shareButton" id="shareButton" onClick={copyURL}>
                            <span className="post-header-shareButton-icon">
                                <FontAwesomeIcon icon="share-alt" /> 
                            </span>
                            Share
                        </button>
                    </div>
                    
                    <div className="post-header-tags">
                        {tags}                       
                    </div>
                </div>  
                {image_obj}
            </div>
            <div className='post-content'>
                {sections}
            </div>
        </article>
        </div>
    )
}

export default ViewArticlePage;