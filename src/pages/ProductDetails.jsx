import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/actions/cartActions';
import { selectUserFavorites, toggleFavorite } from '../store/reducers/favoritesReducer';
import { selectProductById, setProducts } from '../store/reducers/productsReducer';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useAuth();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetch('/products.json');
                const data = await response.json();
                dispatch(setProducts(data));
            } catch (error) {
                console.error('Error loading products:', error);
            }
        };

        loadProducts();
    }, [dispatch]);
    
    const product = useSelector(state => selectProductById(state, parseInt(id)));
    const favorites = useSelector(state => user?.id ? selectUserFavorites(state, user.id) : []);
    const isFavorite = favorites.includes(parseInt(id));

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Пожалуйста, войдите в систему для добавления товаров в корзину');
            return;
        }
        dispatch(addToCart(user.id, product));
        toast.success('Товар добавлен в корзину');
    };

    const handleToggleFavorite = () => {
        if (!user) {
            toast.error('Пожалуйста, войдите в систему для добавления товаров в избранное');
            return;
        }
        dispatch(toggleFavorite({ userId: user.id, productId: parseInt(id) }));
        toast.success(isFavorite ? 'Товар удален из избранного' : 'Товар добавлен в избранное');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (!product) {
        return (
            <div className="product-details-container">
                <h2>Товар не найден</h2>
                <button onClick={handleGoBack} className="back-button">
                    <FaArrowLeft /> Вернуться назад
                </button>
            </div>
        );
    }

    const getImageUrl = (imageName) => {
        if (!imageName) return '/banner.png';
        if (imageName.startsWith('http')) return imageName;
        if (imageName.startsWith('/')) return imageName;
        return `/images/products/${imageName}`;
    };

    return (
        <div className="product-details-container">
            <button onClick={handleGoBack} className="back-button">
                <FaArrowLeft /> Вернуться назад
            </button>
            
            <div className="product-details">
                <div className="product-image">
                    <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name}
                        onError={(e) => {
                            e.target.src = '/banner.png';
                        }}
                    />
                </div>
                
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="description">{product.description}</p>
                    <div className="price">{product.price} ₽</div>
                    
                    <div className="product-actions">
                        <button 
                            className="add-to-cart-btn" 
                            onClick={handleAddToCart}
                        >
                            <FaShoppingCart /> Добавить в корзину
                        </button>
                        <button 
                            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                            onClick={handleToggleFavorite}
                        >
                            <FaHeart /> {isFavorite ? 'В избранном' : 'В избранное'}
                        </button>
                    </div>

                    {product.specifications && (
                        <div className="specifications">
                            <h2>Характеристики</h2>
                            <ul>
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    <li key={key}>
                                        <span className="spec-name">{key}:</span>
                                        <span className="spec-value">{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails; 