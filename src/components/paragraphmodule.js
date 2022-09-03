import './css/paragraph_module.css';

function ParagraphModule(props) {
    let title;
    let image;
    let codeblock;
    let blockquote;
    let link;
    let list;
    let details;
    // console.log(props);

    if(props.details) {
        details = <p className="post-details">{props.details}</p>;
    }

    if (props.image) {
        console.log(props.image);
        image = <div className='post-image-container'>
                    <a href={props.image[0].link}>
                        <img className="post-image" src={props.image[0].link} alt={props.image[0].alt}></img>
                    </a>
                     <figcaption className="post-image-caption">{props.image[0].caption}</figcaption>
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

    if(props.link) {
        link = <a className='post-link' href={props.link.url}>{props.link.content}</a>
    }
    if (props.list) {
        console.log(props.list);
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
            {link}
            {list}
        </div>
    )
}

export default ParagraphModule;