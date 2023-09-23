import React from 'react';
import fs from 'fs';
import path from 'path';
import jsonData from './PortfolioItems.json';


function getComponent({
    img,
    title,
    github,
    demo,
}){
    return (
        <article className="portfolio__item">
          <div className="portfolio__item-image">
            <img src={img} alt={title} />
          </div>
          <h3>{title}</h3>
          <div className="portfolio__item-cta">
            <a href={github} className='btn' target='_blank'>GitHub</a>
            <a href={demo} className='btn btn-primary' target='_blank'>Live Demo</a> {/* Don't need this */}
          </div>
        </article>
    );
}

// Function to add components from jsonData to Portfolio.jsx
export function addComponentsToPortfolio() {
    const portfolioPath = path.join(__dirname, 'Portfolio.jsx');
    const portfolioContent = fs.readFileSync(portfolioPath, 'utf-8');
  
    // Parse jsonData
    const portfolioData = JSON.parse(jsonData);
  
    // Check and add components
    portfolioData.forEach((item) => {
      // Check if the component already exists in Portfolio.jsx
      const componentExists = portfolioContent.includes(`"${item.title}"`);
  
      // If it doesn't exist, add the component
      if (!componentExists) {
        const newComponent = getComponent(item);
        const updatedContent = portfolioContent.replace(
          '{/* Add new components here */}',
          `${newComponent}\n    {/* Add new components here */}`
        );
  
        // Write the updated content back to Portfolio.jsx
        fs.writeFileSync(portfolioPath, updatedContent, 'utf-8');
        console.log(`Added ${item.title} to Portfolio.jsx`);
      }
    });
  }
  

  
  
  
  
  
  
  


