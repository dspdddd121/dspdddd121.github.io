import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart, selectCartItems, selectCartTotal } from '../store/reducers/cartReducer';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const cartItems = useSelector(state => selectCartItems(state, user?.id));
    const total = useSelector(state => selectCartTotal(state, user?.id));

    const getImageUrl = (imageName) => {
        if (!imageName) return '/banner.png';
        if (imageName.startsWith('http')) return imageName;
        if (imageName.startsWith('/')) return imageName;
        return `/images/products/${imageName}`;
    };

    if (!user) {
        return (
            <div className="cart-container">
                <div className="cart-empty">
                    <h2>Для доступа к корзине необходимо войти в систему</h2>
                    <button 
                        onClick={() => navigate('/login', { state: { from: '/cart' } })} 
                        className="login-btn"
                    >
                        Войти
                    </button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-container">
                <div className="cart-empty">
                    <h2>Ваша корзина пуста</h2>
                    <button onClick={() => navigate('/catalog')} className="continue-shopping-btn">
                        Перейти к покупкам
                    </button>
                </div>
            </div>
        );
    }

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        dispatch(updateQuantity(user.id, productId, newQuantity));
        toast.info('Количество товара изменено');
    };

    const handleRemoveItem = (productId) => {
        dispatch(removeFromCart(user.id, productId));
        toast.success('Товар удален из корзины');
    };

    const handleClearCart = () => {
        dispatch(clearCart(user.id));
        toast.info('Корзина очищена');
    };

    return (
        <div className="cart-container">
            <h1>Корзина</h1>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <img 
                            src={getImageUrl(item.image)}
                            alt={item.name} 
                            className="cart-item-image"
                            onError={(e) => {
                                e.target.src = '/banner.png';
                            }}
                        />
                        <div className="cart-item-info">
                            <h3>{item.name}</h3>
                            <p className="cart-item-price">{item.price} ₽</p>
                            <div className="cart-item-quantity">
                                <button 
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    className="quantity-btn"
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button 
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    className="quantity-btn"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="remove-item-btn"
                        >
                            Удалить
                        </button>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <div className="cart-total">
                    <span>Итого:</span>
                    <span>{total} ₽</span>
                </div>
                <div className="cart-actions">
                    <button onClick={handleClearCart} className="clear-cart-btn">
                        Очистить корзину
                    </button>
                    <button 
                        className="checkout-btn"
                        onClick={() => toast.info('Функция оформления заказа находится в разработке')}
                    >
                        Оформить заказ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart; 