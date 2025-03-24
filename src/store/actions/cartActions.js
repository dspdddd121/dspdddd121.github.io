import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY, CLEAR_CART } from '../reducers/cartReducer';

export const addToCart = (userId, product) => ({
    type: ADD_TO_CART,
    payload: { userId, product }
});

export const removeFromCart = (userId, productId) => ({
    type: REMOVE_FROM_CART,
    payload: { userId, productId }
});

export const updateQuantity = (userId, productId, quantity) => ({
    type: UPDATE_QUANTITY,
    payload: { userId, productId, quantity }
});

export const clearCart = (userId) => ({
    type: CLEAR_CART,
    payload: { userId }
}); 