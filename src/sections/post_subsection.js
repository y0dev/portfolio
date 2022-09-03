import ParagraphModule from '../components/paragraphmodule';
import './css/post_subsection.css';
// const re = new RegExp(':[a-z]+Place\([0-9]+\)');

function findImage(paragraph,idx)
{
    let temp_para = paragraph;
    let id;
    const index = temp_para.search(/:imagePlace\([0-9]+\)/);
    if (index >= 0)
    {
        id =
        {
            "image": temp_para.slice(index + 12 , index + 15),
            "index": index
        };
        temp_para = temp_para.replace(/ :imagePlace\([0-9]+\)/, '');
        console.log(id);
        // console.log(temp_para);
    }
    return [ id, temp_para, idx ];
}

function findLinks(paragraph,idx)
{
    let temp_para = paragraph;
    let id;
    const index = temp_para.search(/:linkPlace\([0-9]+\)/);
    if (index >= 0)
    {
        id =
        {
            "link": temp_para.slice(index + 11 , index + 14),
            "index": index
        };
        temp_para = temp_para.replace(/ :linkPlace\([0-9]+\)/, '');
        console.log(id);
        // console.log(temp_para);
    }
    return [ id, temp_para, idx ];
}

function findList(paragraph,idx)
{
    let temp_para = paragraph;
    let id;
    const index = temp_para.search(/:listPlace\([0-9]+\)/);
    if (index >= 0)
    {
        id =
        {
            "list": temp_para.slice(index + 11 , index + 14),
            "index": index
        };
        temp_para = temp_para.replace(/ :listPlace\([0-9]+\)/, '');
        console.log(id);
        // console.log(temp_para);
    }
    return [ id, temp_para, idx ];
}

function PostSection(props) {
    // let section;
    let title;
    let paragraphs;
    let images;
    // let codeblocks;
    // let blockquotes;
    let links;
    let lists;

    if (props.title) {
        title = props.title.tag === 'h2' ? <h2>{props.title.text}</h2> : <h3>{props.title.text}</h3>;
    }

    if (props.images) {
        images = props.images;
    }

    // if (props.codeblocks) {
    //     codeblocks = props.codeblocks;
    // }

    // if (props.blockquotes) {
    //     blockquotes = props.blockquotes;
    // }

    if (props.links) {
        links = props.links;
    }

    if (props.lists) {
        lists = props.lists;
    }

    if(props.paragraphs) {
        paragraphs = props.paragraphs.map((paragraph, p_idx) => {
            const [i_id, i_temp_para] = findImage(paragraph, p_idx);
            const [l_id, lx_temp_para] = findLinks(i_temp_para, p_idx);
            const [lt_id, lt_temp_para] = findList(lx_temp_para, p_idx);
            // console.log(i_id,l_id);
            let image, link, list;
            if (i_id !== undefined) {
                image = images.map((image, _) => {
                    return image.id === i_id.image ? image : null;
                })
            }

            if (l_id !== undefined) {
                link = links.map((link, _) => {
                    return link.id === l_id.link ? link : null;
                })
            }

            if (lt_id !== undefined) {
                list = lists.find(list => list.id === lt_id.list);
            }
            // console.log(index);
            //const para = <p key={section + "_" + p_idx} id={section + "_" + p_idx} className="post-paragraph">{temp_para}</p>
            return <ParagraphModule
                key={p_idx}
                details={lt_temp_para}
                image={image}
                link={link}
                list={list}
            />
        }); // end paragraphs ;
    }

   return (
       <div className='post-section-container'>
            {title}
            {paragraphs}
      </div>
   )
}

export default PostSection;