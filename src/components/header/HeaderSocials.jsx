import React from 'react'
import {BsLinkedin} from 'react-icons/bs'
import {FaGithub} from 'react-icons/fa'
import constants from "../../utils/constants.json"


const HeaderSocials = () => {
  return (
    <div className="header__socials">
        <a href={constants.linkedin} target='_blank'><BsLinkedin/></a>
        <a href={constants.github} target='_blank'><FaGithub/></a>
    </div>
  )
}

export default HeaderSocials