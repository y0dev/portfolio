import React from 'react';
import './css/pagination.css';

const Pagination = ({ postsPerPage, totalPosts, paginate, goToPage, active }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  for (let i = 1; i <= totalPages; i++) {
   pageNumbers.push(i);
  }

  // Function to scroll to top of articles content
  const scrollToTop = () => {
    const articlesContent = document.querySelector('.articles-content');
    if (articlesContent) {
      articlesContent.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      // Fallback to window scroll if articles-content not found
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  };

  // Show limited page numbers for better UX
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, active - delta); i <= Math.min(totalPages - 1, active + delta); i++) {
      range.push(i);
    }

    if (active - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (active + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Handle previous button click
  const handlePrevClick = () => {
    goToPage(1, totalPages);
    scrollToTop();
  };

  // Handle next button click
  const handleNextClick = () => {
    goToPage(0, totalPages);
    scrollToTop();
  };

  return (
    <nav className='pagination-nav'>
      <div className="pagination-container">
        <button 
          className="pagination-arrow prev" 
          onClick={handlePrevClick}
          disabled={active === 1}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className='pagination-numbers'>
          {getVisiblePages().map((number, index) => (
            number === '...' ? (
              <span key={`dots-${index}`} className="pagination-dots">...</span>
            ) : (
              <button 
                key={number} 
                className={`pagination-number ${number === active ? 'active' : ''}`} 
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            )
          ))}
        </div>
        
        <button 
          className="pagination-arrow next" 
          onClick={handleNextClick}
          disabled={active === totalPages}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Pagination;