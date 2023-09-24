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
    title: "Title 1",
    github: "https://github.com/1",
    demo: "https://youtube.com/1",
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
          portfolioItems.map(({id, image, title, github, demo}) => {
            return (
              <article key={id} className="portfolio__item">
                <div className="portfolio__item-image">
                  <img src={image} alt={title} />
                </div>
                <h3>{title}</h3>
                <div className="portfolio__item-cta">
                  <a href={github} className='btn' target='_blank'>GitHub</a>
                  <a href={demo} className='btn btn-primary' target='_blank'>Live Demo</a> {/* Don't need this */}
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
