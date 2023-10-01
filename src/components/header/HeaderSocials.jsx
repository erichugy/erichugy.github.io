// Copyright (c) 2023, Eric Huang
// All rights reserved.

// This source code is licensed under the BSD-style license found in the
// LICENSE file in the root directory of this source tree. 

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