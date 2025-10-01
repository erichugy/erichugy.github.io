// Copyright (c) 2023, Eric Huang
// All rights reserved.

// This source code is licensed under the BSD-style license found in the
// LICENSE file in the root directory of this source tree. 

import React, { useEffect, useState, useCallback } from 'react'
import './nav.css'
import { AiOutlineHome } from 'react-icons/ai'
import { AiOutlineUser } from 'react-icons/ai'
import { BiBook } from 'react-icons/bi'
import { BiCustomize } from 'react-icons/bi'
import { BiChat } from 'react-icons/bi'
import { FiUsers } from 'react-icons/fi'

const Nav = () => {
  const [activeNav, setActiveNav] = useState('#');

  // List of section ids in order of appearance (home header now has id="home")
  const sectionIds = ['#home', '#about', '#experience', '#portfolio', '#volunteering', '#contact'];

  const handleClick = (hash) => {
    setActiveNav(hash);
  };

  const observeSections = useCallback(() => {
    const options = {
      root: null,
      rootMargin: '0px 0px -40% 0px', // trigger a bit before section top leaves viewport
      threshold: 0.2
    };

    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) {
            const hash = id === 'home' ? '#' : `#${id}`;
            setActiveNav(hash);
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    sectionIds.forEach(hash => {
      const id = hash.startsWith('#') ? hash.substring(1) : hash;
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = observeSections();
    return () => { cleanup && cleanup(); };
  }, [observeSections]);

  return (

    <nav>
      <NavItem navItem="#" icon={<AiOutlineHome />} active={activeNav === '#'} onClick={handleClick} />
      <NavItem navItem="#about" icon={<AiOutlineUser />} active={activeNav === '#about'} onClick={handleClick} />
      <NavItem navItem="#experience" icon={<BiBook />} active={activeNav === '#experience'} onClick={handleClick} />
      <NavItem navItem="#portfolio" icon={<BiCustomize />} active={activeNav === '#portfolio'} onClick={handleClick} />
      <NavItem navItem="#volunteering" icon={<FiUsers />} active={activeNav === '#volunteering'} onClick={handleClick} />
      <NavItem navItem="#contact" icon={<BiChat />} active={activeNav === '#contact'} onClick={handleClick} />
    </nav>


    // <nav>
    //   <a href="#" className={activeNav === '#' ? 'active' : ''} onClick={() => setActiveNav('#')}><AiOutlineHome /></a>
    //   <a href="#about" className={activeNav === '#about' ? 'active' : ''} onClick={() => setActiveNav('#about')}><AiOutlineUser /></a>
    //   <a href="#experience" className={activeNav === '#experience' ? 'active' : ''} onClick={() => setActiveNav('#experience')}><BiBook /></a>
    //   {/* <a href="#services" className={activeNav === '#services' ? 'active' : ''} onClick={() => setActiveNav('#services')}><MdOutlineDesignServices /></a> */}
    //   <a href="#portfolio" className={activeNav === '#portfolio' ? 'active' : ''} onClick={() => setActiveNav('#portfolio')}><BiCustomize /></a>
    //   {/* <a href="#testimonials" className={activeNav === '#testimonials' ? 'active' : ''} onClick={() => setActiveNav('#testimonials')}><SiCodereview /></a> */}
    //   <a href="#contact" className={activeNav === '#contact' ? 'active' : ''} onClick={() => setActiveNav('#contact')}><BiChat /></a>
    // </nav>
  );
}


// Create a separate NavItem component for each navigation item
const NavItem = ({ navItem, icon, active, onClick }) => (
  <a
    href={navItem}
    className={active ? 'active' : ''}
    onClick={() => onClick(navItem)}
  >
    {icon}
  </a>
);

export default Nav
