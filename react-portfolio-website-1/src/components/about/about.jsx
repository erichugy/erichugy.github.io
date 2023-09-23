import React from 'react'
import './about.css'
import ME from '../../assets/about-me.jpg'
import {FaAward} from 'react-icons/fa'
import {BiLibrary} from 'react-icons/bi'

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
              <h5>Experience</h5>
              <small>1+ Year</small>
            </article>
            <article className='about__card'>
              <BiLibrary className='about__icon'/>
              <h5>Projects</h5>
              <small>3 and counting</small>
            </article>
            {/* To do later */}
            {/* <article className='volunteering__card'>
              <FiUsers className='about__icon'/>
              <h5>Volunteering Work</h5>
              <small>Read about my adventures!</small>
            </article>
            <article className='about__card'>
              <FaAward className='about__icon'/>
              <h5>Fun Times</h5>
              <small>Read about my adventures!</small>
            </article> */}
          </div>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus optio possimus facere? Quia laudantium sapiente, repudiandae accusamus doloribus id impedit explicabo adipisci illo mollitia ad autem ab est modi corrupti.
          </p>

          <a href="#contact" className='btn btn-primary'>Let's Chat</a>
        </div>
      </div>

    </section>
  )
}

export default About