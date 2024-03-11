import React from 'react';
import "./testingPage.css";


function ProductCard({ product }) {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">{product.price}</div>
                <div className="product-origin">{product.origin}</div>
            </div>
        </div>
    );
}

function ProductListing() {
    const products = [
        {
            name: "Heirloom tomato",
            price: "$5.99 / lb",
            origin: "Grown in San Juan Capistrano, CA",
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/457abcd58d45a0b36d20f55592ac9c44de726b07ccc9157bb9a9ab632ffee1ae?apiKey=e26ef6b93c6e420f9ea9765e3160d5d7&",
        },
        {
            name: "Organic ginger",
            price: "$12.99 / lb",
            origin: "Grown in Huntington Beach, CA",
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/1f65230af54f1daaacfa8768ba1dbc2b4f61ec5c4fadf41cdcb799c4bcc9b4b7?apiKey=e26ef6b93c6e420f9ea9765e3160d5d7&",
        },
    ];

    return (
        <div className="product-listing">
            <div className="product-grid">
                {products.map((product, index) => (
                    <div key={index} className={`column column-${index + 1}`}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProductPage() {
    return (
        <>
            <div className="product-page">
                <header className="header">
                    <div className="logo">World Peas</div>
                    <nav className="navigation">
                        <a href="#" className="nav-link">Shop</a>
                        <a href="#" className="nav-link">Newstand</a>
                        <a href="#" className="nav-link">Who we are</a>
                        <a href="#" className="nav-link">My profile</a>
                        <a href="#" className="nav-link nav-link-highlight">Basket (3)</a>
                    </nav>
                </header>
                <section className="product-section">
                    <div className="product-heading">
                        <h1 className="product-title">Produce</h1>
                        <div className="product-subtitle">
                            <span className="product-subtitle-fresh">Fresh</span>
                            <span className="product-subtitle-date"> — August 21, 2023</span>
                        </div>
                    </div>
                    <div className="product-filters">
                        <button className="filter-button filter-button-active">Default</button>
                        <button className="filter-button">A-Z</button>
                        <button className="filter-button">List view</button>
                    </div>
                </section>
                <ProductListing />
            </div>
        </>
    );
}


const TestingPage = () => {
    return (
        <>
            <ProductPage />
        </>
    );
}


export default TestingPage;