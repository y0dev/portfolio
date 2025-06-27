import './css/article_module.css';

import images from '../assets/images/images.js';

function ArticleModule(props) {
    let title;
    let icon;
    let date;
    let tags;
    let slug;
    let note = props.note;
    let link = note === 0 ? "/article/" : "/note/";

    if (props.title) {
        title = <h3 className="article-title">{props.title}</h3>;
        if (props.slug) {
            slug = props.slug;    
        }
    }

    if (props.image) {
        icon = <img className="article-image" src={`/${props.image.name}`} alt={props.image.alt}></img>
    }

    if (props.date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const dateObj = new Date(parseInt(props.date));
        date = <span className="article-date">{dateObj.toLocaleDateString("en-US", options)}</span>;
    }

    if (props.tags) {
        tags = props.tags.slice(0, 3).map((tag, idx) => (
            <span className='article-tag' key={idx}>{tag}</span>
        ));
    }

    return (
        <a href={link + slug} className='article-card'>
            <div className='article-card-header'>
                {icon && (
                    <div className='article-image-container'>
                        {icon}
                    </div>
                )}
                <div className='article-meta'>
                    {date}
                    {note === 1 && <span className="article-type">Note</span>}
                </div>
            </div>
            
            <div className='article-card-content'>
                {title}
                {tags && (
                    <div className='article-tags'>
                        {tags}
                        {props.tags && props.tags.length > 3 && (
                            <span className="more-tags">+{props.tags.length - 3}</span>
                        )}
                    </div>
                )}
            </div>
            
            <div className='article-card-footer'>
                <span className="read-more">
                    Read Article
                    <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
        </a>
    )
}

export default ArticleModule;