import React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBars, FaTimes, FaShoppingCart, FaUser } from "react-icons/fa";
import "./Navbar.css";
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../store/reducers/cartReducer';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const cartItems = useSelector(state => user ? selectCartItems(state, user.id) : []);

    const cartItemsCount = cartItems?.reduce((total, item) => total + (item?.quantity || 0), 0) || 0;

    return (
        <nav className="navbar">
            <div className="container">

                <ul className={menuOpen ? "nav-links open" : "nav-links"}>
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/catalog">Каталог</Link></li>
                </ul>

                <div className="search-box">
                    <input type="text" placeholder="Поиск..." />
                    <FaSearch className="search-icon" />
                </div>

                <div className="nav-actions">
                    {user && (
                        <>
                            <Link to="/cart" className="cart-link">
                                <FaShoppingCart />
                                {cartItemsCount > 0 && (
                                    <span className="cart-count">{cartItemsCount}</span>
                                )}
                            </Link>
                            <Link to="/profile" className="profile-link">
                                <FaUser />
                                <span className="profile-name">{user.name}</span>
                            </Link>
                        </>
                    )}

                    <div className="auth-buttons">
                        {user ? (
                            <button onClick={logout} className="nav-link">
                                Выйти
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link">Вход</Link>
                                <Link to="/register" className="nav-link">Регистрация</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
