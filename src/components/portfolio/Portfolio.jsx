// Copyright (c) 2023, Eric Huang
// All rights reserved.

// This source code is licensed under the BSD-style license found in the
// LICENSE file in the root directory of this source tree. 

import "./portfolio.css";
import React from "react";
import IMG1 from "../../assets/cc9-censorship.png"
import IMG2 from "../../assets/email-sender.png"
import IMG3 from "../../assets/trading-bot-resized.png"
import IMG4 from "../../assets/polyai-stroke.png"



const portfolioItems = [
  {
    id: 1,
    image: IMG1,
    title: "CC9 - Gesture Censorship",
    github: "https://github.com/Simard302/cc9-gesture-censorship",
    demo: "https://www.youtube.com/watch?v=8joYMFchrZo&ab_channel=AdamSimard",
    page: "video-censor.codecloud9.dev/index", 
    description:"Uses AI vision to detect and censor derogatory hand signs in videos."
  },
  {
    id: 2,
    image: IMG2,
    title: "Automatic Email Sender",
    github: "https://github.com/erichugy/Email-Sender",
    demo: "",
    description:"Automatically sends out word documents to all contacts listed in an emailing list. Used to send out emails to my mailing list."

  },
  {
    id: 3,
    image: IMG3,
    title: "Trading Bot",
    github: "https://github.com/eli0009/McHacks10-trading-bot",
    demo: "",
    description:"Analyzes up-to-date news articles to provide recommendations (buy, hold, or sell) for publicly traded stocks based on the prevailing market sentiment."
  },
  {
    id: 4,
    image: IMG4,
    title: "Stroke Predictor",
    github: "https://github.com/eli0009/CodeML_project",
    demo: "",
    description:"AI Model trained to predict the likelyhood that someone has a stroke. Created with Tensorflow for the 2022 PolyAI Hackathon. Placed 7th in our category."
  },
];

const Portfolio = () => {
  return (
    <section id="portfolio">
      <h5>My Recent Work</h5>
      <h2>Portfolio</h2>

      <div className="container portfolio__container">
        {
          portfolioItems.map(({ id, image, title, github, demo, page, description }) => {
            return (
              <article key={id} className="portfolio__item">
                <div className="portfolio__item-image">
                  <img src={image} alt={title} />
                </div>
                <h3>{title}</h3>
                <div className="portfolio__item-cta">
                  <a href={github} className='btn' target='_blank'>GitHub</a>
                  
                  {/* Don't need this */}
                  {demo ? ( 
                  <a href={demo} className='btn btn-primary' target='_blank'>Live Demo</a> 
                  ) : <a href="" className='btn btn-primary' target='_blank'><i>&#40;No Demo Yet&#41;</i></a>}

                  {/* {page ? (
                    <a href={page} className="btn secondary-btn" target="_blank">Web Page (in progress)</a>
                  ) : null} */}

                </div>
                
                { description ? (
                  <p className="description__porfolio">{description}</p> 
                ) : null }
              </article>
            );
          })
        }
      </div>
    </section>
  );
};

export default Portfolio;
