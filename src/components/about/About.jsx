// Copyright (c) 2023, Eric Huang
// All rights reserved.

// This source code is licensed under the BSD-style license found in the
// LICENSE file in the root directory of this source tree. 

import React from 'react'
import './about.css'
import ME from '../../assets/about-me.jpg'
import { FaAward } from 'react-icons/fa'
import { BiLibrary } from 'react-icons/bi'
import { FiUsers } from 'react-icons/fi'
import constants from "../../utils/constants.json"

const About = () => {
  // Get the current date
  const currentDate = new Date();

  // Extract the current year from the date
  const currentYear = currentDate.getFullYear();

  const yearsOfExperience = currentYear - constants['first-programming-year'];

  return (
    <section id='about'>
      <h5>Get to Know</h5>
      <h2>About Me</h2>

      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            <img src={ME} alt="About Image" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards">
            <article className='about__card'>
              <FaAward className='about__icon' />
              <h5>Experience in Programming</h5>
              <small>{yearsOfExperience}+ Years</small>
            </article>

            <article className='about__card clickable-card'>
              <a href="#portfolio" className='about__card-link' onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById('portfolio');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  window.history.pushState(null, '', '#portfolio');
                } else {
                  window.location.hash = 'portfolio';
                }
              }}>
                <BiLibrary className='about__icon' />
                <h5>Projects</h5>
                <small>5+ projects</small>
              </a>
            </article>

            {/* To do later */}
            <article className='about__card merge__card clickable-card'>
              <a href="#volunteering" className='about__card-link' onClick={(e) => {
                // Optional smooth scroll enhancement (native hash jump still works if JS disabled)
                e.preventDefault();
                const target = document.getElementById('volunteering');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  // Update the URL hash without instant jump
                  window.history.pushState(null, '', '#volunteering');
                } else {
                  window.location.hash = 'volunteering';
                }
              }}>
                <FiUsers className='about__icon' />
                <h5>Volunteering Work</h5>
                <small>Have been part of 2 incredible clubs</small>
              </a>
            </article>
            {/* <article className='about__card'>
              <FaAward className='about__icon'/>
              <h5>Fun Times</h5>
              <small>Read about my adventures!</small>
            </article> */}
          </div>

          <p>
            I'm passionate about leveraging technology to solve real-world problems and thrive in collaborative environments. Let's connect and explore opportunities to innovate and make a positive impact! 🚀
          </p>

          {/* <a href="#contact" className='btn btn-primary cta-chat'>Let's Chat</a> */}
        </div>
      </div>

    </section>
  )
}

export default About
