import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import styles from '../assets/global.css'


export default function Layout ({children, wallet})
{
    return (
        <div className="layout">
        <Header wallet={wallet}/>
            <div className="main">
            {children}
            </div>
        <Footer />
        </div>
    );
};
