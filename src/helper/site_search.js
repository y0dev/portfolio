class SiteSearch {
  static create() {
    return new SiteSearch();
  }

  constructor() {
    this.getArticles();

    if (!this.allArticles) {
      return;
    }

    this.listenToSearch();
  }

  getArticles() {
    this.allArticles = document.querySelectorAll('.article-container');
  }

  listenToSearch() {
    this.searchInput = document.querySelector('#articleSearchInput');
    this.searchInput.addEventListener('keyup', this.search.bind(this));
  }

  search() {
    const query = this.searchInput.value.toLowerCase(),
      matches = [];

    this.allArticles.forEach((article) => {
      const headerText = article.querySelector('h3').innerHTML.toLowerCase(),
        meta = article.querySelector('.article-meta').innerHTML.toLowerCase();

      if (headerText.includes(query) || meta.includes(query)) {
        matches.push(article);
      }
    });

    this.updateDom(matches);
  }

  updateDom(matches) {
    const articlesList = document.querySelector('.articles-list'),
      noArticlesText = document.querySelector('.articles-noArticles');

    articlesList.innerHTML = '';

    console.log(matches.length);

    if (!matches.length) {
      noArticlesText.classList.add('show');
    } else {
      noArticlesText.classList.remove('show');
    }

    matches.forEach((match) => {
      articlesList.appendChild(match);
    });
  }
}

SiteSearch.create();