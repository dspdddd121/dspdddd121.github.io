import React from "react";
import "../styles/Catalog.css";

const Sidebar = ({ setCategory, activeCategory, categories }) => {
    return (
        <div className="sidebar">
            <h3>Категории товаров</h3>
            <ul>
                {categories.map((category) => (
                    <li
                        key={category}
                        className={`sidebar-item ${activeCategory === category || (category === "Все товары" && activeCategory === null) ? 'active' : ''}`}
                        onClick={() => setCategory(category === "Все товары" ? null : category)}
                    >
                        {category}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
