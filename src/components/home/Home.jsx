// Copyright (c) 2023, Eric Huang
// All rights reserved.

// This source code is licensed under the BSD-style license found in the
// LICENSE file in the root directory of this source tree. 

import React from 'react';
import Header from '../header/Header'
import Nav from '../nav/Nav'
import About from '../about/About'
import Experience from '../experience/Experience'
import Portfolio from '../portfolio/Portfolio'
import Volunteering from '../volunteering/Volunteering'
import Contact from '../contact/Contact'


const Home = () => {
    return (
        <>
            <Header />
            <Nav />
            <About />
            <Experience />
            <Portfolio />
            <Volunteering />
            <Contact />
        </>
    )
}

export default Home;