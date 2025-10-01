// Copyright (c) 2023, Eric Huang
// All rights reserved.

// This source code is licensed under the BSD-style license found in the
// LICENSE file in the root directory of this source tree. 

import CV from '../../assets/cv.pdf'

const CTA = () => {
  return (
    <div className="cta">
        <a
          href={CV}
          download="Eric_Huang_CV.pdf" 
          className='btn'
          aria-label='Download Eric Huang CV PDF'
        >
          Download CV
        </a>
        <a href='#contact' className='btn btn-primary'>Let's Chat</a>
    </div>
  )
}

export default CTA