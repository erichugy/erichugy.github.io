// Copyright (c) 2023, Eric Huang
// All rights reserved.

// This source code is licensed under the BSD-style license found in the
// LICENSE file in the root directory of this source tree. 

import React from 'react'
import './nav.css'
import { AiOutlineHome } from 'react-icons/ai'
import { AiOutlineUser } from 'react-icons/ai'
import { BiBook } from 'react-icons/bi'
import { BiCustomize } from 'react-icons/bi'
import { BiChat } from 'react-icons/bi'
import { FiUsers } from 'react-icons/fi'
import { useState } from 'react'

const Nav = () => {
  const [activeNav, setActiveNav] = useState('#');

  // Function to handle hover events and update activeNav
  const handleHover = (navItem) => { setActiveNav(navItem); };

  return (

    <nav>
      <NavItem
        navItem="#"
        icon={<AiOutlineHome />}
        active={activeNav === '#'}
        handleHover={handleHover}
      />
      <NavItem
        navItem="#about"
        icon={<AiOutlineUser />}
        active={activeNav === '#about'}
        handleHover={handleHover}
      />
      <NavItem
        navItem="#experience"
        icon={<BiBook />}
        active={activeNav === '#experience'}
        handleHover={handleHover}
      />
      <NavItem
        navItem="#portfolio"
        icon={<BiCustomize />}
        active={activeNav === '#portfolio'}
        handleHover={handleHover}
      />
      <NavItem
        navItem="#volunteering"
        icon={<FiUsers />}
        active={activeNav === '#volunteering'}
        handleHover={handleHover}
      />
      <NavItem
        navItem="#contact"
        icon={<BiChat />}
        active={activeNav === '#contact'}
        handleHover={handleHover}
      />
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
const NavItem = ({ navItem, icon, active, handleHover }) => {
  return (
    <a
      href={navItem}
      className={active ? 'active' : ''}
      onMouseEnter={() => handleHover(navItem)} // Trigger hover event
    >
      {icon}
    </a>
  );
};

export default Nav
