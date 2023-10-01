// Copyright (c) 2023, Eric Huang
// All rights reserved.

// This source code is licensed under the BSD-style license found in the
// LICENSE file in the root directory of this source tree. 
import "../volunteering/volunteering.css"
import React from "react";
import IMG1 from "../../assets/gdsc-mcgill.png"
import IMG2 from "../../assets/bolt-resized.png"


import { FaExternalLinkAlt } from 'react-icons/fa'


const portfolioItems = [
  {
    id: 1,
    image: IMG1,
    title: "Google Developer Student Clubs McGill",
    instagram: "https://www.instagram.com/gdscmcgill/",
    linktree: "https://linktr.ee/gdscmcgill",
    description: "Student lead community supported by Google for Developers Montreal. By joining GDSC McGill, students grow their knowledge in a peer-to-peer learning environment and create projects to apply their skills to advance their careers."
  },
  {
    id: 2,
    image: IMG2,
    title: "BOLT Bootcamps McGill",
    instagram: "https://www.instagram.com/gdscmcgill/",
    linktree: "https://linktr.ee/boltbootcamps",
    description: "BOLT Bootcamps is a hub of innovation, fostering collaboration between business and STEM talent, enriching the community with workshops and events designed to empower and inspire future leaders in various fields."
  },
  // {
  //   id: 3,
  //   image: IMG3,
  //   title: "Google Developer Student Clubs",
  //   instagram: "https://www.instagram.com/gdscmcgill/",
  //   linktree: "https://linktr.ee/gdscmcgill",
  //   description:"The McGill University chapter of Google Developer Student Clubs (GDSC) is a student lead community supported by Google for Developers. By joining GDSC McGill, students grow their knowledge in a peer-to-peer learning environment and create projects to apply their skills to advance their careers."
  // },
];

const Volunteering = () => {
  return (
    <section id="volunteering">
      <h5>Clubs & Activities</h5>
      <h2>Volunteering</h2>

      <div className="container portfolio__container volunteering__container">
        {
          portfolioItems.map(({ id, image, title, instagram, description }) => {
            return (
              <article key={id} className="portfolio__item">
                <div className="portfolio__item-image">
                  <img src={image} alt={title} />
                </div>
                <h3>{title}</h3>

                {description ? (
                  <p className="description__porfolio">{description}</p>
                ) : null}

                <div className="portfolio__item-cta">
                  {instagram ? (
                    <a href={instagram} className="logo__link" target='_blank'><FaExternalLinkAlt /></a>
                  ) : null}
                </div>
              </article>
            );
          })
        }
      </div>
    </section>
  );
};

export default Volunteering;
