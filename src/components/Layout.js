import React from 'react';
import NavBar from './navbar';
import Footer from './footer';

const Layout = ({ children }) => {
    return (
        <React.StrictMode>
            <NavBar />
            {children}
            <Footer />
        </React.StrictMode>
    );
};

export default Layout; 