import './css/article_module.css';

import bible_icon from '../assets/images/bible-icon.png';
import family_icon from '../assets/images/family.png';
import hotel_icon from '../assets/images/hotel.png';
import house_icon from '../assets/images/house.png';
import web_dev from '../assets/images/web-dev.png';
const images = [bible_icon, family_icon, hotel_icon, house_icon, web_dev];

function ArticleModule(props) {
    let title;
    let icon;
    let date;
    let tags;
    let id;

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
        const arr = props.image.name.split(".");
        const image = images.find(img => img.includes(arr[0]));
        icon = <img className="article-image" src={image} alt={props.image.name}></img>
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
       <a href={"/articles/" + id} className='article-item-container'>
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