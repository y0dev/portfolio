import React, {  Component } from 'react';
import './css/articles.css';
import _articles from '../assets/json/articles_clean.json';
// import _filters from '../assets/json/filters.json';
import _notes from '../assets/json/notes_clean.json';
import ArticleModule from '../components/articlemodule';
import Pagination from '../components/pagination';

function filtered(json_object) {
    return json_object.sort((a, b) =>  b.date - a.date );
}

class ArticlesPage extends Component {
    constructor() {
        super();
        this.state = {
            articles: [],
            notes: [],
            articlesLength:0,
            notesLength:0,
            postsPerPage: 5,
            currentNotePage: 1,
            currentArticlePage: 1,
            currentNotes: [],
            currentArticles: []
        }
        
        const articles_sorted = filtered(_articles);
        const notes_sorted = filtered(_notes);

        this.state.articles = articles_sorted.map((article, idx) => {
            return <ArticleModule key={idx}
                title={article.title}
                date={article.date}
                image={article.image}
                id={article.id}
                tags={article.tags}
                note={0}/>
        });

        // Get current posts
        let indexOfLastArticle = this.state.currentArticlePage * this.state.postsPerPage;
        let indexOfFirstArticle = indexOfLastArticle - this.state.postsPerPage;
        this.state.currentArticles = this.state.articles.slice(indexOfFirstArticle, indexOfLastArticle);
        
        this.state.notes = notes_sorted.map((note, idx) => {
            return <ArticleModule key={idx}
                title={note.title}
                date={note.date}
                image={note.image}
                id={note.id}
                tags={note.tags}
                note={1} />
        });

        // Get current posts
        let indexOfLastNote = this.state.currentNotePage * this.state.postsPerPage;
        let indexOfFirstNote = indexOfLastNote - this.state.postsPerPage;
        this.state.currentNotes = this.state.notes.slice(indexOfFirstNote, indexOfLastNote);

        this.state.articlesLength = this.state.articles.length;
        this.state.notesLength = this.state.notes.length;
        this.handleSearch = this.handleSearch.bind(this);
        this.articlePaginate = this.articlePaginate.bind(this);
        this.notesPaginate = this.notesPaginate.bind(this);
        this.goToPage = this.goToPage.bind(this);
        this.goToArticlePage = this.goToArticlePage.bind(this);
        this.goToNotePage = this.goToNotePage.bind(this);
    }
    componentDidMount() {

        // Only show paginate if greater than postsPerPage
        if (this.state.articles.length <= this.state.postsPerPage) {
            const article_pa = document.getElementById('article-paginate');
            // console.log(article_pa);
            article_pa.classList.add('hidden');
        }

        if (this.state.notes.length <= this.state.postsPerPage) {
            const note_pa = document.getElementById('note-paginate');
            // console.log(note_pa);
            note_pa.classList.add('hidden');
        }
    }
    
    articlePaginate(pageNumber)
    {
        this.setState({ currentArticlePage: pageNumber });
        let indexOfLastNote = pageNumber * this.state.postsPerPage;
        let indexOfFirstNote = indexOfLastNote - this.state.postsPerPage;
        this.setState({ 
            currentArticlePage: pageNumber,
            currentArticles: this.state.articles.slice(indexOfFirstNote, indexOfLastNote)
        });
    }


    notesPaginate(pageNumber)
    {
        let indexOfLastNote = pageNumber * this.state.postsPerPage;
        let indexOfFirstNote = indexOfLastNote - this.state.postsPerPage;
        this.setState({ 
            currentNotePage: pageNumber,
            currentNotes: this.state.notes.slice(indexOfFirstNote, indexOfLastNote)
        });
    }
    
    goToPage(dec,currentPage,totalPages) {
        return ( dec == 0 && (currentPage < totalPages)) || ( dec == 1 && (currentPage > 1));
    }

    goToArticlePage(dec,totalPages) {
        if (dec === 1) 
        {
            if (this.goToPage(dec,this.state.currentArticles,totalPages)) 
            {
                this.setState({ currentArticlePage: this.state.currentArticlePage - 1 });
            }
        }
        else 
        {
            if (this.goToPage(dec,this.state.currentArticles,totalPages)) 
            {
                this.setState({ currentArticlePage: this.state.currentArticlePage + 1 });
            }
        }
    }

    goToNotePage(dec,totalPages) {
        if (dec === 1) 
        {
            if (this.goToPage(dec,this.state.currentNotePage,totalPages)) 
            {
                const pageNumber = this.state.currentNotePage - 1;
                const indexOfLastNote = pageNumber * this.state.postsPerPage;
                const indexOfFirstNote = indexOfLastNote - this.state.postsPerPage;
                this.setState({ 
                    currentNotePage: pageNumber,
                    currentNotes: this.state.notes.slice(indexOfFirstNote, indexOfLastNote)
                });
            }
        }
        else 
        {
            if (this.goToPage(dec,this.state.currentNotePage,totalPages)) 
            {
                const pageNumber = this.state.currentNotePage + 1;
                const indexOfLastNote = pageNumber * this.state.postsPerPage;
                const indexOfFirstNote = indexOfLastNote - this.state.postsPerPage;
                this.setState({ 
                    currentNotePage: pageNumber,
                    currentNotes: this.state.notes.slice(indexOfFirstNote, indexOfLastNote)
                });
            }
        }
    }

    handleSearch (event) {
        let locked = 0;
        if (event.target.value.toLowerCase().includes('articles:') && locked === 0)
        {
            locked = 1;
            const str = event.target.value.slice(10);
            let matches = [];
            articles_sorted.forEach( val => {
                val.tags.forEach( t_val => {
                    if (t_val.toLowerCase().includes(str.toLowerCase()) ) 
                    {
                        matches.push(val);
                    }
                })
            });

            // Remove Dups
            if ( matches.length <= this.state.articlesLength )
            {
                this.setState({ 
                    articles: matches.map((article,idx) => {
                        return <ArticleModule key={idx}
                            title={article.title}
                            date={article.date}
                            image={article.image}
                            id={article.id}
                            tags={article.tags}
                            note={1}/>
                    }),
                    currentArticles: this.state.articles
                });
            }

        }
        else if (event.target.value.toLowerCase().includes('notes:') && locked === 0)
        {
            const str = event.target.value.slice(7);
            locked = 1;
            let matches = [];
            notes_sorted.forEach(val => {
                val.tags.forEach(t_val => {
                    if (t_val.toLowerCase().includes(str.toLowerCase()) ) 
                    {
                        matches.push(val);
                    }
                })
            });

            // Remove dups
            if (matches.length <= this.state.notesLength)
            {
                this.setState({ 
                    notes: matches.map((article,idx) => {
                        return <ArticleModule key={idx}
                            title={article.title}
                            date={article.date}
                            image={article.image}
                            id={article.id}
                            tags={article.tags}
                            note={0}/>
                    }),
                    currentNotes: this.state.notes
                });
            }
        } else 
        {
            this.setState({ 
                notes: notes_sorted.map((article,idx) => {
                    return <ArticleModule key={idx}
                        title={article.title}
                        date={article.date}
                        image={article.image}
                        id={article.id}
                        tags={article.tags}
                        note={0}/>
                }),
                currentNotes: this.state.notes
            });

            this.setState({ 
                articles: articles_sorted.map((article,idx) => {
                    return <ArticleModule key={idx}
                        title={article.title}
                        date={article.date}
                        image={article.image}
                        id={article.id}
                        tags={article.tags}
                        note={0}/>
                }),
                currentArticles: this.state.articles
            });
            
        }
    }
    render() {
        
        return (
            <div className='app-body' id='articles-container'>
            
                <div className='articles-header'>
                    <h2 className="articles-heading">Articles</h2>
                    <input className="articles-search"
                        type="text" id="articleSearchInput"
                        placeholder="articles: tag name or notes: tag name" onChange={this.handleSearch}/>
                </div>
                <div className='article-list'>
                    {this.state.currentArticles}
                    <div id='article-paginate'>
                        <Pagination 
                        postsPerPage={this.state.postsPerPage}
                        totalPosts={this.state.articles.length}
                        paginate={this.articlePaginate}
                        goToPage={this.goToArticlePage}
                        active={this.state.currentArticlePage}/>
                    </div>
                </div>
            
                <div className='notes-list'>
                    <h2 className="notes-heading">Notes</h2>
                    {this.state.currentNotes}
                    <div id='note-paginate'>
                        <Pagination
                        postsPerPage={this.state.postsPerPage}
                        totalPosts={this.state.notes.length}
                        paginate={this.notesPaginate}
                        goToPage={this.goToNotePage}
                        active={this.state.currentNotePage}/>
                    </div>
                </div>
            </div>
        )
    }
}


export default ArticlesPage;