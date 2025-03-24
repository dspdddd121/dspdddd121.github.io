import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ProductList from "../components/ProductList";
import productsData from "../data/products.json";
import "../styles/Catalog.css";

const categories = [
    "Все товары",
    "Наборы для рисования",
    "Материалы для рукоделия",
    "Книги по искусству",
    "Свечи"
];

const Catalog = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const filteredProducts = selectedCategory
        ? productsData.filter((product) => product.category === selectedCategory)
        : productsData;

    return (
        <div className="catalog-container">
            <Sidebar 
                setCategory={setSelectedCategory} 
                activeCategory={selectedCategory}
                categories={categories}
            />
            <div className="products-section">
                <h2 className="section-title">
                    {selectedCategory || "Все товары для творчества"}
                </h2>
                <div className="products-count">
                    Найдено товаров: {filteredProducts.length}
                </div>
                <div className="catalog-grid">
                    {filteredProducts.map((product) => (
                        <ProductList key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Catalog;
