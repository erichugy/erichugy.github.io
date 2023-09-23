
import './portfolio.css'
import React, { useEffect } from 'react';
import { addComponentsToPortfolio } from "./PortfolioBuilder.js"

const Portfolio = () => {
  useEffect(() => {
    addComponentsToPortfolio(); // Call the function when the component mounts
  }, []); // The empty dependency array ensures it's called only once on mount

  return (
    <section id='portfolio'>
      <h5>My Recent Work</h5>
      <h2>Portfolio</h2>

      <div className="container portfolio__container">

      {/* Add new components here */}
      </div>
    </section>
  )
}

export default Portfolio
