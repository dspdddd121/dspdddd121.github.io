import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/actions/cartActions';
import { selectUserFavorites, toggleFavorite } from '../store/reducers/favoritesReducer';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductList = React.memo(({ product }) => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const favorites = useSelector(state => user?.id ? selectUserFavorites(state, user.id) : []);
    const isFavorite = useMemo(() => favorites.includes(product.id), [favorites, product.id]);

    const handleAddToCart = useCallback(() => {
        if (user) {
            dispatch(addToCart(user.id, product));
            toast.success('Товар добавлен в корзину');
        } else {
            toast.error('Пожалуйста, войдите в систему для добавления товаров в корзину');
        }
    }, [dispatch, user, product]);

    const handleToggleFavorite = useCallback(() => {
        if (!user) {
            toast.error('Пожалуйста, войдите в систему для добавления товаров в избранное');
            return;
        }
        
        dispatch(toggleFavorite({ userId: user.id, productId: product.id }));
        toast.success(isFavorite ? 'Товар удален из избранного' : 'Товар добавлен в избранное');
    }, [dispatch, user, product.id, isFavorite]);

    if (!product) {
        return null;
    }

    const getImageUrl = useCallback((imageName) => {
        if (!imageName) return '/banner.png';
        if (imageName.startsWith('http')) return imageName;
        if (imageName.startsWith('/')) return imageName;
        return `/images/products/${imageName}`;
    }, []);

    const productImage = useMemo(() => getImageUrl(product.image), [getImageUrl, product.image]);

    return (
        <div className="product-card">
            <Link to={`/catalog/${product.id}`} className="product-image-container">
                <img 
                    src={productImage}
                    alt={product.name}
                    onError={(e) => {
                        e.target.src = '/banner.png';
                    }}
                />
            </Link>
            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                <span className="price">{product.price} ₽</span>
            </div>
            <div className="product-actions">
                <button 
                    className="add-to-cart-btn" 
                    onClick={handleAddToCart}
                >
                    <FaShoppingCart /> В корзину
                </button>
                <button 
                    className={`add-to-favorites-btn ${isFavorite ? 'active' : ''}`}
                    onClick={handleToggleFavorite}
                >
                    <FaHeart />
                </button>
            </div>
        </div>
    );
});

ProductList.displayName = 'ProductList';

export default ProductList;
