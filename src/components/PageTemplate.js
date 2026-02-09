import React from 'react';
import Layout from './Layout';

// Example of how to create a new page using the Layout component
const PageTemplate = () => {
    return (
        <Layout>
            <div className="page-content">
                <h1>Your Page Title</h1>
                <p>Your page content goes here...</p>
            </div>
        </Layout>
    );
};

export default PageTemplate;

/*
HOW TO USE THE LAYOUT COMPONENT:

1. Create your page component (e.g., MyPage.js):
   import React from 'react';
   
   const MyPage = () => {
       return (
           <div className="my-page">
               <h1>My Page</h1>
               <p>Content here...</p>
           </div>
       );
   };
   
   export default MyPage;

2. In your main entry file (e.g., index.js or articles.js):
   import Layout from './components/Layout';
   import MyPage from './pages/MyPage';
   
   const container = document.getElementById('my-page-root');
   if (container) {
       const root = createRoot(container);
       root.render(
           <Layout>
               <MyPage />
           </Layout>
       );
   }

3. Add the corresponding HTML template with the root element:
   <div id="my-page-root"></div>

This pattern ensures all pages have consistent NavBar and Footer components
without having to import them in every page file.
*/ 