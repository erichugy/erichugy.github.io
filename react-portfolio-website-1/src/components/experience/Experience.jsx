import React from 'react'
import './experience.css'
import {BsPatchCheckFill} from "react-icons/bs"

const Experience = () => {
  return (
    <section id='experience'>
      <h5>Skills</h5>
      <h2>My Experiences</h2>

      <div className="container experience__container">
        <div className="experience__frontend">
          <h3>Frontend Development</h3>
          <div className="experience__content">
            <article className="experience__details">
              <BsPatchCheckFill className='experience__detais-icon'/>
              <div>
                <h4>HTML</h4>
                <small className='text-light'>Advanced</small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className='experience__detais-icon'/>
              <div>  
                <h4>CSS</h4>
                <small className='text-light'>Basic</small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className='experience__detais-icon'/>
              <div>  
                <h4>JavaScript</h4>
                <small className='text-light'>Intermediate</small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className='experience__detais-icon'/>
              <div>  
                <h4>React</h4>
                <small className='text-light'>Basic</small>
              </div>
            </article>
          </div>
        </div>

        <div className="experience__backend">
          <h3>Backend Development</h3>
          <div className="experience__content">
            <article className="experience__details">
              <BsPatchCheckFill className='experience__detais-icon'/>
              <div>
                <h4>Python</h4>
                <small className='text-light'>Intermediate</small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className='experience__detais-icon'/>
              <div>
                <h4>Java</h4>
                <small className='text-light'>Intermediate</small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className='experience__detais-icon'/>
              <div>
                <h4>C</h4>
                <small className='text-light'>Basic</small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className='experience__detais-icon'/>
              <div>
                <h4>R</h4>
                <small className='text-light'>Intermediate</small>
              </div>
            </article>
          </div>
        </div>

        {/* To do later */}
        {/* <div className="experience__technologies">
          <h3>Technologies</h3>
          <div className="experience__content">
            <article className="experience__details">
              <BsPatchCheckFill className='experience__detais-icon'/>
              <div>
                <h4>Python</h4>
                <small className='text-light'>Intermediate</small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className='experience__detais-icon'/>
              <div>
                <h4>Java</h4>
                <small className='text-light'>Intermediate</small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className='experience__detais-icon'/>
              <div>
                <h4>C</h4>
                <small className='text-light'>Basic</small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className='experience__detais-icon'/>
              <div>
                <h4>R</h4>
                <small className='text-light'>Intermediate</small>
              </div>
            </article>
          </div>
        </div> */}


      </div>
      
    </section>
  )
}

export default Experience