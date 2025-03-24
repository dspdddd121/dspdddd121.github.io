import React, { useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import ProductList from "../components/ProductList";
import { FaShoppingBag, FaTruck, FaCreditCard, FaHeadset } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/actions/productsActions';

const features = [
    {
        icon: <FaShoppingBag />,
        title: "Широкий ассортимент",
        description: "Тысячи товаров для творчества"
    },
    {
        icon: <FaTruck />,
        title: "Быстрая доставка",
        description: "Доставка по всей России"
    },
    {
        icon: <FaCreditCard />,
        title: "Безопасная оплата",
        description: "Защищенные платежи"
    },
    {
        icon: <FaHeadset />,
        title: "Поддержка 24/7",
        description: "Всегда на связи"
    }
];

const FeatureCard = React.memo(({ feature }) => (
    <div className="feature-card">
        <div className="feature-icon">{feature.icon}</div>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
    </div>
));

FeatureCard.displayName = 'FeatureCard';

const Home = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.items);
    
    const loadProducts = useCallback(async () => {
        try {
            const response = await fetch('/products.json');
            const data = await response.json();
            dispatch(fetchProducts(data));
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }, [dispatch]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const popularProducts = useMemo(() => products.slice(0, 4), [products]);

    const renderFeatures = useMemo(() => (
        <div className="features-grid">
            {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
            ))}
        </div>
    ), []);

    return (
        <>
            <div className="home-container">
                <section className="banner">
                    <div className="banner-content">
                        <h1>Творчество начинается здесь</h1>
                        <p>Откройте для себя мир творческих возможностей с нашими товарами</p>
                        <div className="banner-buttons">
                            <Link to="/catalog" className="banner-btn primary">Перейти в каталог</Link>
                        </div>
                    </div>
                </section>
                <section className="features">
                    <h2>Почему выбирают нас</h2>
                    {renderFeatures}
                </section>
                <section className="popular-products">
                    <div className="section-header">
                        <h2>Популярные товары</h2>
                        <Link to="/catalog" className="view-all">Смотреть все</Link>
                    </div>
                    <div className="product-list">
                        {popularProducts.map((product) => (
                            <ProductList key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                <section className="about">
                    <div className="about-content">
                        <div className="about-text">
                            <h2>О нашем магазине</h2>
                            <p>
                                Мы - ваш надежный партнер в мире творчества и рукоделия. Наш магазин предлагает 
                                широкий ассортимент качественных товаров для воплощения ваших творческих идей.
                            </p>
                            <ul className="about-features">
                                <li>Только проверенные товары</li>
                                <li>Регулярные обновления ассортимента</li>
                                <li>Профессиональная консультация</li>
                                <li>Быстрая доставка по России</li>
                            </ul>
                        </div>
                        <div className="about-image">
                            <img 
                                src="/banner.png" 
                                alt="О нашем магазине"
                                onError={(e) => {
                                    e.target.src = '/banner.png';
                                }}
                            />
                        </div>
                    </div>
                </section>
            </div>

            <footer className="footer">
                <div className="footer-bottom">
                    <p>&copy; 2025 Магазин для творчества. Все права защищены.</p>
                </div>
            </footer>
        </>
    );
};

export default React.memo(Home);
