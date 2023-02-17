import './css/article_module.css';

import images from '../assets/images/images.js';


function ArticleModule(props) {
    let title;
    let icon;
    let date;
    let tags;
    let id;
    let note = props.note;
    let link = note === 0 ? "/articles/" : "/notes/";

    if (props.title)
    {
        title = <h3 className="article-title">{props.title}</h3>;
        if (props.id)
        {
            id = props.id;    
        }
    }

    if ( props.image )
    {
        // const arr = props.image.name.split(".");
        // const image = images.find(img => img.includes(arr[0]));

        icon = <img className="article-image" src={`/${props.image.name}`} alt={props.image.alt}></img>
    }

    if (props.date)
    {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const dateObj = new Date(parseInt(props.date));
        date = <span className="article-date">{dateObj.toLocaleDateString("en-US", options)}</span>;
    }

    if (props.tags)
    {
        tags = props.tags.map((tag, idx) => (
            <span className='article-tag' key={idx}>{tag}</span>
        ));
    }

    

   
   return (
       <a href={link + id} className='article-item-container'>
           {icon}
           <div className='article-content'>
               {title}
               {date}
           </div>
           <div className='article-tags'>
               {tags}
           </div>
      </a>
   )
}

export default ArticleModule;