import React, {  Component } from 'react';
import './css/articles.css';
import _articles from '../assets/json/articles.json';
// import _filters from '../assets/json/filters.json';
import _notes from '../assets/json/notes.json';
import ArticleModule from '../components/articlemodule';
import Pagination from '../components/pagination';

function filtered(json_object) {
    return json_object.sort((a, b) =>  b.date - a.date );
}

class ArticlesPage extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            mergeArray: [],
            postsLength:0,
            postsPerPage: 8,
            currentPostPage: 1,
            currentPosts: [],
            searchLocked: false
        }
        
        // Get both articles and notes and sort by date
        const articles_sorted = filtered(_articles);
        const notes_sorted = filtered(_notes);
        const mergeArray = filtered(articles_sorted.concat(notes_sorted));
        this.state.mergeArray = mergeArray;

        this.state.posts = mergeArray.map((article, idx) => {
            let noteValue = article['file-id'] === 'note' ? 1 : 0;
            return <ArticleModule key={idx}
                title={article.title}
                date={article.date}
                image={article.image}
                id={article.id}
                tags={article.tags}
                note={noteValue}/>
        });

        // Get current posts
        let indexOfLastPost = this.state.currentPostPage * this.state.postsPerPage;
        let indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
        this.state.currentPosts = this.state.posts.slice(indexOfFirstPost, indexOfLastPost);


        this.state.postsLength = this.state.posts.length;
        this.handleSearch = this.handleSearch.bind(this);
        this.postPaginate = this.postPaginate.bind(this);
        this.goToVerifiedPage = this.goToVerifiedPage.bind(this);
        this.goToPostPage = this.goToPostPage.bind(this);
    }

    componentDidMount() {

        // Only show paginate if greater than postsPerPage
        if (this.state.posts.length <= this.state.postsPerPage) {
            const article_pa = document.getElementById('article-paginate');
            // console.log(article_pa);
            article_pa.classList.add('hidden');
        }
    }
    
    // This is used to select number for page
    postPaginate(pageNumber)
    {
        let indexOfLastPost = pageNumber * this.state.postsPerPage;
        let indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
        this.setState({ 
            currentPostPage: pageNumber,
            currentPosts: this.state.posts.slice(indexOfFirstPost, indexOfLastPost)
        });
    }
    
    // Make sure that we are not going beyond the borders
    goToVerifiedPage(dec, currentPage, totalPages) {
        return ( dec == 0 && (currentPage < totalPages)) || ( dec == 1 && (currentPage > 1));
    }

    // This is to control arrows for going backward and forward
    goToPostPage(dec, totalPages) {
        if (dec === 1) 
        {
            if (this.goToVerifiedPage(dec, this.state.currentPostPage, totalPages)) 
            {
                let indexOfLastNote = (this.state.currentPostPage - 1) * this.state.postsPerPage;
                let indexOfFirstNote = indexOfLastNote - this.state.postsPerPage;
                this.setState({ 
                    currentPostPage: this.state.currentPostPage - 1,
                    currentPosts: this.state.posts.slice(indexOfFirstNote, indexOfLastNote)
                });
            }
        }
        else 
        {
            if (this.goToVerifiedPage(dec,this.state.currentPostPage,totalPages)) 
            {
                let indexOfLastNote = (this.state.currentPostPage + 1) * this.state.postsPerPage;
                let indexOfFirstNote = indexOfLastNote - this.state.postsPerPage;
                this.setState({ 
                    currentPostPage: this.state.currentPostPage + 1,
                    currentPosts: this.state.posts.slice(indexOfFirstNote, indexOfLastNote)
                });
                // this.setState({ currentArticlePage: this.state.currentArticlePage + 1 });
            }
        }
    }

    // Needs to be fixed
    handleSearch(event) {
        
        // Check if text field is empty
        if ( event.target.value.toLowerCase() )
        {
            // Check for all posts with search term
            console.log(event.target.value.toLowerCase());
            const str = event.target.value;//.slice(10);
            let matches = [];
            this.state.mergeArray.forEach( val => {
                val.tags.forEach( t_val => {
                    if (t_val.toLowerCase().includes(str.toLowerCase()) ) 
                    {
                        matches.push(val);
                    }
                })
            });

            // Remove Dups
            if ( matches.length <= this.state.postsLength )
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
                    currentArticles: this.state.posts
                });
            }

        }
        else {
            this.setState({ 
                articles: this.state.mergeArray.map((article,idx) => {
                    let noteValue = article['file-id'] === 'note' ? 1 : 0;
                    return <ArticleModule key={idx}
                        title={article.title}
                        date={article.date}
                        image={article.image}
                        id={article.id}
                        tags={article.tags}
                        note={noteValue}/>
                }),
                currentArticles: this.state.posts
            });
            
        }
    }
    render() {
        
        return (
            <div className='app-body' id='articles-container'>
            
                <div className='articles-header'>
                    <h2 className="articles-heading">Blog Posts</h2>
                    
                    {/* <input className="articles-search"
                        type="text" id="articleSearchInput"
                        placeholder="tag name" onChange={this.handleSearch}/> */}
                </div>
                <div className='article-list'>
                    {this.state.currentPosts}
                    <div id='article-paginate'>
                        <Pagination 
                        postsPerPage={this.state.postsPerPage}
                        totalPosts={this.state.posts.length}
                        paginate={this.postPaginate}
                        goToPage={this.goToPostPage}
                        active={this.state.currentPostPage}/>
                    </div>
                </div>
            </div>
        )
    }
}


export default ArticlesPage;