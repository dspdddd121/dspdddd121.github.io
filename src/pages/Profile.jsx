import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserFavorites, toggleFavorite } from '../store/reducers/favoritesReducer';
import { selectAllProducts, setProducts } from '../store/reducers/productsReducer';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCalendar, FaHeart, FaTrash } from 'react-icons/fa';
import styles from './Profile.module.css';

export default function Profile() {
    const { user, updateProfile, logout } = useAuth();
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(user?.name || '');
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetch('/products.json');
                const data = await response.json();
                dispatch(setProducts(data));
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, [dispatch]);
   
    const favorites = useSelector(state => user?.id ? selectUserFavorites(state, user.id) : []);
    const products = useSelector(selectAllProducts) || [];
    
    const favoriteProducts = products.length > 0 
        ? favorites.map(id => products.find(product => product.id === id)).filter(Boolean)
        : [];

    const handleSaveProfile = () => {
        updateProfile({ name: editedName });
        setIsEditing(false);
    };

    const handleRemoveFromFavorites = (productId) => {
        if (user?.id) {
            dispatch(toggleFavorite({ userId: user.id, productId }));
        }
    };

    const getImageUrl = (imageName) => {
        if (!imageName) return '/banner.png';
        if (imageName.startsWith('http')) return imageName;
        if (imageName.startsWith('/')) return imageName;
        return `/images/products/${imageName}`;
    };

    if (!user) {
        return (
            <div className="profile-container">
                <h2>Профиль недоступен</h2>
                <p>Пожалуйста, войдите в систему</p>
                <Link to="/login" className="login-link">Войти</Link>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.avatar ? (
                        <img src={getImageUrl(user.avatar)} alt="Аватар пользователя" />
                    ) : (
                        <FaUser size={50} />
                    )}
                </div>
                <div className="profile-info">
                    {isEditing ? (
                        <div className="edit-name-container">
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="edit-name-input"
                            />
                            <button onClick={handleSaveProfile} className="save-button">
                                Сохранить
                            </button>
                            <button onClick={() => setIsEditing(false)} className="cancel-button">
                                Отмена
                            </button>
                        </div>
                    ) : (
                        <div className="profile-name">
                            <h2>{user.name}</h2>
                            <button onClick={() => setIsEditing(true)} className="edit-button">
                                Редактировать
                            </button>
                        </div>
                    )}
                    <div className="profile-details">
                        <p><FaEnvelope /> {user.email}</p>
                        <p><FaCalendar /> Дата регистрации: {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="profile-favorites">
                <h3>Избранные товары</h3>
                {isLoading ? (
                    <p>Загрузка товаров...</p>
                ) : !products.length ? (
                    <p>Нет доступных товаров</p>
                ) : favoriteProducts.length === 0 ? (
                    <p>У вас пока нет избранных товаров</p>
                ) : (
                    <div className="favorites-grid">
                        {favoriteProducts.map(product => (
                            <div key={product.id} className="favorite-item">
                                <img 
                                    src={getImageUrl(product.image)} 
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = '/banner.png';
                                    }}
                                />
                                <div className="favorite-item-info">
                                    <h4>{product.name}</h4>
                                    <p className="price">{product.price} ₽</p>
                                    <div className="favorite-item-actions">
                                        <Link to={`/catalog/${product.id}`} className="view-button">
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

            <div className="profile-actions">
                <button onClick={logout} className="logout-button">
                    Выйти из системы
                </button>
            </div>
        </div>
    );
} 