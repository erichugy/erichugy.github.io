import React from 'react'
import './experience.css'
import {BsPatchCheckFill} from "react-icons/bs"

const skill = {
  advanced:"Advanced",
  intermediate:"Intermediate",
  basic:"Basic",
}

const data = {
  experience__frontend:[
    {
      tech: "HTML",
      lvl: skill.intermediate
    },
    {
      tech: "CSS",
      lvl: skill.intermediate
    },
    {
      tech: "Javascript",
      lvl: skill.intermediate
    },
    {
      tech: "React",
      lvl: skill.basic
    },
  ],
  experience__backend:[
    {
      tech: "Python",
      lvl: skill.intermediate
    },
    {
      tech: "Java",
      lvl: skill.intermediate
    },
    {
      tech: "C",
      lvl: skill.basic
    },
    {
      tech: "R",
      lvl: skill.intermediate
    },
  ],
}


const Experience = () => {

  return (
    <section id='experience'>
      <h5>Skills</h5>
      <h2>My Experiences</h2>

      <div className="container experience__container">
        <div className="experience__frontend">
          <h3>Frontend Development</h3>
          <div className="experience__content">
            {
              data["experience__frontend"].map(({tech, lvl}) => {
                return(
                  <article className="experience__details">
                    <BsPatchCheckFill className='experience__details-icon'/>
                    <div>
                      <h4>{tech}</h4>
                      <small className='text-light'>{lvl}</small>
                    </div>
                  </article>
                );
              })
            }
          </div>
        </div>

        <div className="experience__backend">
          <h3>Backend Development</h3>
          <div className="experience__content">
            {
              data["experience__backend"].map((e) => {
                return(
                  <article className="experience__details">
                    <BsPatchCheckFill className='experience__details-icon'/>
                    <div>
                      <h4>{e.tech}</h4>
                      <small className='text-light'>{e.lvl}</small>
                    </div>
                  </article>
                );
              })
            }
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



