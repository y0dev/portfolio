import './css/paragraph_module.css';
function hasLink(details)
{
    return details.search(/:linkPlace\([0-9]+\)/) >= 0;
}

function findLinks(details_prop,links)
{
    let temp_details = details_prop;
    let id;
    let a_link;
    const index = temp_details.search(/:linkPlace\([0-9]+\)/);
    
    if (index >= 0)
    {
        id = temp_details.slice(index + 11 , index + 14)

        const link = links.find((val) => val.id === id);
        var re = new RegExp(":linkPlace\\(" + id + "\\)");
        a_link = <a className='post-link' href={link.link}>{link.text}</a>
        console.log(a_link);
        temp_details = temp_details.replace(re, '');
    }
    return <p className="post-details" >{temp_details.slice(0,index)} {a_link} {temp_details.slice(index+1)}</p>;
}

function ParagraphModule(props) {
    let title;
    let image;
    let codeblock;
    let blockquote;
    let list;
    let details;
    // console.log(props);

    if (props.details) {
        if (props.links && hasLink(props.details)) {
            details = findLinks(props.details, props.links);
        } else {
            details = <p className="post-details" >{props.details}</p>;
        }
    }

    if (props.image) {
        let image_obj = props.image.filter((img) => img !== null);//props.details.contains(img.id))
        // console.log(image_obj);
        image = <div className='post-image-container'>
                    <a href={image_obj[0].link}>
                        <img className="post-image" src={image_obj[0].link} alt={image_obj[0].alt}></img>
                    </a>
                     <figcaption className="post-image-caption">{image_obj[0].caption}</figcaption>
                 </div>;
    }
    
    if(props.codeblock) {
        codeblock = <pre  className={'language-' + props.codeblock.language}>
                        <code className={'language-' + props.codeblock.language} >
                            {props.codeblock.code}
                        </code>
                    </pre>
    }
    
    if(props.blockquote) {
        blockquote = <blockquote className='post-quote' cite={props.blockquote.cite}>{props.blockquote.content}</blockquote>
    }

    

    if (props.list) {
        let items = props.list.items.map((item,idx) => {
            return <li key={idx} className='post-list-item' >{item}</li>;
        });
        if (props.list.list_type === "ordered") {
            list =  <ol>
                        {items}
                    </ol>
        }
        else {
            list =  <ul>
                        {items} 
                    </ul>
        }
    }

    return (
        <div className='post-container'>
            {title}
            {details}
            {image}
            {codeblock}
            {blockquote}
            {list}
        </div>
    )
}

export default ParagraphModule;