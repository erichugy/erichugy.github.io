import React from 'react'
import './nav.css'
import {AiOutlineHome} from 'react-icons/ai'
import {AiOutlineUser} from 'react-icons/ai'
import {BiBook} from 'react-icons/bi'
import {MdOutlineDesignServices} from 'react-icons/md'
import {BiCustomize} from 'react-icons/bi'
import {SiCodereview} from 'react-icons/si'
import {BiChat} from 'react-icons/bi'
import {useState} from 'react'



const Nav = () => {
    const [activeNav, setActiveNav] = useState('#');
    return (
        <nav>
            <a href="#" className={activeNav === '#' ? 'active' : ''} onClick={() => setActiveNav('#')}><AiOutlineHome /></a>
            <a href="#about" className={activeNav === '#about' ? 'active' : ''} onClick={() => setActiveNav('#about')}><AiOutlineUser /></a>
            <a href="#experience" className={activeNav === '#experience' ? 'active' : ''} onClick={() => setActiveNav('#experience')}><BiBook /></a>
            {/* <a href="#services" className={activeNav === '#services' ? 'active' : ''} onClick={() => setActiveNav('#services')}><MdOutlineDesignServices /></a> */}
            <a href="#portfolio" className={activeNav === '#portfolio' ? 'active' : ''} onClick={() => setActiveNav('#portfolio')}><BiCustomize /></a>
            {/* <a href="#testimonials" className={activeNav === '#testimonials' ? 'active' : ''} onClick={() => setActiveNav('#testimonials')}><SiCodereview /></a> */}
            <a href="#contact" className={activeNav === '#contact' ? 'active' : ''} onClick={() => setActiveNav('#contact')}><BiChat /></a>
        </nav>
    );
}

export default Nav
