import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { selectUserFavorites, toggleFavorite, clearUserFavorites } from '../store/reducers/favoritesReducer';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash } from 'react-icons/fa';
import '../styles/FavoriteProducts.css';

const FavoriteProducts = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const favorites = useSelector(state => user?.id ? selectUserFavorites(state, user.id) : []);
    const products = useSelector(state => state.products.items);

    useEffect(() => {
        return () => {
            if (!user?.id) {
                dispatch(clearUserFavorites(null));
            }
        };
    }, [dispatch, user]);

    const favoriteProducts = favorites.map(id => 
        products.find(product => product.id === id)
    ).filter(Boolean);

    const handleRemoveFromFavorites = (productId) => {
        if (user?.id) {
            dispatch(toggleFavorite({ userId: user.id, productId }));
        }
    };

    if (!user) {
        return (
            <div className="favorites-container">
                <h2>Избранные товары</h2>
                <p>Пожалуйста, войдите в систему, чтобы видеть избранные товары.</p>
                <Link to="/login" className="login-link">Войти</Link>
            </div>
        );
    }

    return (
        <div className="favorites-container">
            <h2>Избранные товары</h2>
            {favoriteProducts.length === 0 ? (
                <p>У вас пока нет избранных товаров</p>
            ) : (
                <div className="favorites-grid">
                    {favoriteProducts.map(product => (
                        <div key={product.id} className="favorite-item">
                            <img 
                                src={product.image} 
                                alt={product.name}
                                onError={(e) => {
                                    e.target.src = '/banner.png';
                                }}
                            />
                            <div className="favorite-item-info">
                                <h3>{product.name}</h3>
                                <p className="price">{product.price} ₽</p>
                                <div className="favorite-item-actions">
                                    <Link to={`/product/${product.id}`} className="view-button">
                                        Просмотреть
                                    </Link>
                                    <button
                                        onClick={() => handleRemoveFromFavorites(product.id)}
                                        className="remove-button"
                                        title="Удалить из избранного"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoriteProducts; 