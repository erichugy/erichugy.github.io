import "./portfolio.css";
import React from "react";
import IMG1 from "../../assets/portfolio1.jpg"
import IMG2 from "../../assets/portfolio2.jpg"
import IMG3 from "../../assets/portfolio3.jpg"
// import IMG1 from "../../assets/portfolio1.jpg"
// import IMG1 from "../../assets/portfolio1.jpg"


const portfolioItems = [
  {
    id: 1,
    image: IMG1,
    title: "CC9 - Gesture Censorship",
    github: "https://github.com/Simard302/cc9-gesture-censorship",
    page: "video-censor.codecloud9.dev/index",
    demo: "https://www.youtube.com/watch?v=8joYMFchrZo&ab_channel=AdamSimard",
    description:"Using AI to censor derogatory hand signs in videos"
  },
  {
    id: 2,
    image: IMG2,
    title: "Title 2",
    github: "https://github.com/2",
    demo: "https://youtube.com/2",
  },
  {
    id: 3,
    image: IMG3,
    title: "Title 3",
    github: "https://github.com/3",
    demo: "https://youtube.com/3",
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
                  ) : null}
                  {/* {page ? (
                    <a href={page} className="btn secondary-btn" target="_blank">Web Page (in progress)</a>
                  ) : null} */}
                </div>
              </article>
            );
          })
        }
      </div>
    </section>
  );
};

export default Portfolio;
