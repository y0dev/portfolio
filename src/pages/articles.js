import React, { useState } from 'react';
import './css/articles.css';
import _articles from '../assets/json/articles.json';
// import _filters from '../assets/json/filters.json';
import _notes from '../assets/json/notes.json';
import ArticleModule from '../components/articlemodule';

function filtered() {
    return _articles.sort((a, b) => b.date - a.date);
}

function ArticlesPage(props) {

    const [searchTerm, setSearchTerm] = useState('');

    const notes = _notes.map((note, idx) => {
        return <ArticleModule key={idx}
            title={note.title}
            date={note.date}
            image={note.image}
            id={note.id}
            tags={note.tags}
            note={1} />
    });

    return (
        <div className='app-body articles-container'>
            <div className='articles-header'>
                <h2 className="articles-heading">Articles</h2>
                <input className="articles-search"
                    type="text" id="articleSearchInput"
                    placeholder="Filter articles" onChange={(event) => {
                        setSearchTerm(event.target.value);
                }}/>
            </div>
            <div className='article-list'>
                {
                    filtered().filter((val) => {
                        return val.tags.filter((t_val) => {
                            if (t_val.toLowerCase().includes(searchTerm.toLowerCase())) {
                                // console.log(val);
                                return val;
                            }
                            return val;
                        });
                    }).map((article, idx) => {
                        return <ArticleModule key={idx}
                            title={article.title}
                            date={article.date}
                            image={article.image}
                            id={article.id}
                            tags={article.tags} />
                    })
                }
            </div>
            
            <div className='notes-list'>
                <h2 className="notes-heading">Notes</h2>
                {notes}
            </div>
        </div>
    )
}

export default ArticlesPage;