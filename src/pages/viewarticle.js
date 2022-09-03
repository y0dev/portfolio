import './css/viewarticle.css';
import React from 'react';
import { useParams } from "react-router-dom";
import _articles from '../assets/json/articles.json';
import _notes from '../assets/json/notes.json';
import PostSection from '../sections/post_subsection';


import bible_icon from '../assets/images/bible-icon.png';
import family_icon from '../assets/images/family.png';
import hotel_icon from '../assets/images/hotel.png';
import house_icon from '../assets/images/house.png';
import web_dev from '../assets/images/web-dev.png';
const images = [bible_icon, family_icon, hotel_icon, house_icon, web_dev];

function getPostTags(post) {
    return post.tags.map((tag, idx) => (
        <span className='post-header-tag' key={idx}>{tag}</span>
    ));
}

function getImage(post) {
    console.log("Image",post);
    if ( post.image )
    {
        const arr = post.image.name.split(".");
        const image = images.find(img => img.includes(arr[0]));
        return <img className="post-header-image" src={image} alt={post.image.alt}></img>
    }
}

function getSections(post) {
    return post.content.map((section, idx) => {
        console.log(section);
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

function ViewArticlePage() {
    let { id } = useParams();
    let post = _articles.find(article => article.id === id);
    if (post === undefined)
    {
        post = _notes.find(note => note.id === id);
    }
    console.log(post);
    const image = getImage(post);
    const tags = getPostTags(post);
    const sections = getSections(post);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(parseInt(post.date));
    
    console.log(post);
    return (
        <article className='app-body post-container'>
            <div className='post-header-container'>
                <div className='post-header-details'>
                    <h1 id='post-header-title'>{post.title}</h1>
                    <div className='post-header-meta'>
                        <img className='post-header-icon' src="https://i.ibb.co/HY4dx9s/headshot.jpg" alt="headshot" />
                        <p className='post-header-time'>{ date.toLocaleDateString("en-US", options) }</p>
                        <span className="post-header-divider"> | </span>
                        <button className="post-header-shareButton" id="shareButton">
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
    )
}

export default ViewArticlePage;