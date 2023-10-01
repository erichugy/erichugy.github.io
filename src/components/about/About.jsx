import React from 'react'
import './about.css'
import ME from '../../assets/about-me.jpg'
import {FaAward} from 'react-icons/fa'
import {BiLibrary} from 'react-icons/bi'
import {FiUsers} from 'react-icons/fi'
import constants from "../../utils/constants.json"

const About = () => {
  return (
    <section id='about'>
      <h5>Get to Know</h5>
      <h2>About Me</h2>

      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            <img src={ME} alt="About Image"/>
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards">
            <article className='about__card'>
              <FaAward className='about__icon'/>
              <h5>Experience in Programming</h5>
              <small>2+ Years</small>
            </article>
            
            <article className='about__card'>
              <BiLibrary className='about__icon'/>
              <a href="#portfolio"><h5>Projects</h5></a>
              <small>5+ projects</small>
            </article>
            
            {/* To do later */}
            <article className='about__card merge__card'>
              <FiUsers className='about__icon'/>
              <h5>Volunteering Work</h5>
              <small>Currently part of 2 incredible clubs</small>
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
