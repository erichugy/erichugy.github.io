
// Copyright (c) 2023, Eric Huang
// All rights reserved.

// This source code is licensed under the BSD-style license found in the
// LICENSE file in the root directory of this source tree. 

import React from 'react'
import './footer.css'
import {BsLinkedin} from 'react-icons/bs'
import {FaGithub} from 'react-icons/fa'
import constants from "../../utils/constants.json"


const Footer = () => {
return (
    <footer>
        <a href="#" className='footer__logo'>Eric Huang</a>
        {/* <ul className='permalinks'>
            <li><a href="#">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul> */}

        <div className="footer__socials">
            <a href={constants.linkedin} target='_blank'><BsLinkedin/></a>
            <a href={constants.github} target='_blank'><FaGithub/></a>
        </div>

        <div className="footer_copyright">
            <small>&copy; Eric Huang. All rights reserved.</small>
        </div>
    </footer>
)
}

export default Footer
