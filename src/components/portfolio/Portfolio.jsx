import "./portfolio.css";
import React from "react";
import IMG1 from "../../assets/cc9-censorship.png"
import IMG2 from "../../assets/trading-bot.png"
import IMG3 from "../../assets/trading-bot.png"
// import IMG1 from "../../assets/portfolio1.jpg"
// import IMG1 from "../../assets/portfolio1.jpg"


const portfolioItems = [
  {
    id: 1,
    image: IMG1,
    title: "CC9 - Gesture Censorship",
    github: "https://github.com/Simard302/cc9-gesture-censorship",
    demo: "https://www.youtube.com/watch?v=8joYMFchrZo&ab_channel=AdamSimard",
    page: "video-censor.codecloud9.dev/index", 
    description:"Using AI vision to censor derogatory hand signs in videos."
  },
  {
    id: 2,
    image: IMG2,
    title: "Trading Bot",
    github: "https://github.com/eli0009/McHacks10-trading-bot",
    demo: "",
    description:"Analyses recent news articles using natural language processing to tell you the current market sentiment of a given public security."
  },
  {
    id: 3,
    image: IMG3,
    title: "Title 3",
    github: "",
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
