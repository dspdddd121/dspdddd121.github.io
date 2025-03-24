import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [selectedItems, setSelectedItems] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        if (!user) {
            throw new Error('Необходима авторизация для добавления товаров в корзину');
        }

        const normalizedProduct = {
            ...product,
            image: product.image.startsWith('/') ? product.image.slice(1) : product.image
        };

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === normalizedProduct.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === normalizedProduct.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...normalizedProduct, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        setSelectedItems(prevItems => prevItems.filter(id => id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const toggleItemSelection = (productId) => {
        setSelectedItems(prevItems =>
            prevItems.includes(productId)
                ? prevItems.filter(id => id !== productId)
                : [...prevItems, productId]
        );
    };

    const getTotalPrice = () => {
        return cartItems
            .filter(item => selectedItems.includes(item.id))
            .reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const clearCart = () => {
        setCartItems([]);
        setSelectedItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            selectedItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            toggleItemSelection,
            getTotalPrice,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart должен использоваться внутри CartProvider');
    }
    return context;
}; 