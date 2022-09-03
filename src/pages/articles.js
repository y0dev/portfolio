import React from 'react';
import './css/articles.css';
import _articles from '../assets/json/articles.json';
import _filters from '../assets/json/filters.json';
import _notes from '../assets/json/notes.json';
import ArticleModule from '../components/articlemodule';

class ArticlesPage extends React.Component {

    constructor() {
        super();
        this.state = {
           selectedFilter: '',
           filterCriteria: _filters,
        };
        this.toggleCriteria = this.toggleCriteria.bind(this);
    }

    // https://www.freecodecamp.org/news/updating-state-from-child-component-onclick/
    toggleCriteria(event) {
        console.log(event.target)
        // this.setState({selectedFilters: event.target.innerHTML});
    }
    
    filtered() {
        return _articles.sort((a, b) => b.date - a.date ).filter((article) => {
           if(this.state.selectedFilter !== '' ) {
              return article.tags.includes(this.state.selectedFilter);
           }
           return article;
        })
    }
    
    render() {
        const articles = this.filtered().map((article, idx) => {
            return <ArticleModule key={idx}
                title={article.title}
                date={article.date}
                image={article.image}
                id={article.id}
                tags={article.tags} />
        });

        const notes = _notes.map((note, idx) => {
            return <ArticleModule key={idx}
                title={note.title}
                date={note.date}
                image={note.image}
                id={note.id}
                tags={note.tags} />
        });
        return (
            <div className='app-body articles-container'>
                <div className='articles-header'>
                    <h2 className="articles-heading">Articles</h2>
                    <input className="articles-search" type="text" id="articleSearchInput" placeholder="Filter articles"></input>
                </div>
                <div className='article-list'>
                    {articles}
                </div>
                
                <div className='notes-list'>
                    <h2 className="notes-heading">Notes</h2>
                    {notes}
                </div>
            </div>
        )
    }
}

export default ArticlesPage;