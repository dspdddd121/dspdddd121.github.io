export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';

const loadCartFromStorage = () => {
    try {
        const savedCart = localStorage.getItem('userCarts');
        return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return {};
    }
};

const saveCartToStorage = (userCarts) => {
    try {
        localStorage.setItem('userCarts', JSON.stringify(userCarts));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

const initialState = {
    userCarts: loadCartFromStorage() 
};

const cartReducer = (state = initialState, action) => {
    let newState;

    switch (action.type) {
        case ADD_TO_CART: {
            const { userId, product } = action.payload;
            const userCart = state.userCarts[userId] || [];
            const existingItem = userCart.find(item => item.id === product.id);

            if (existingItem) {
                newState = {
                    ...state,
                    userCarts: {
                        ...state.userCarts,
                        [userId]: userCart.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    }
                };
            } else {
                newState = {
                    ...state,
                    userCarts: {
                        ...state.userCarts,
                        [userId]: [...userCart, { ...product, quantity: 1 }]
                    }
                };
            }
            saveCartToStorage(newState.userCarts);
            return newState;
        }

        case REMOVE_FROM_CART: {
            const { userId, productId } = action.payload;
            const userCart = state.userCarts[userId] || [];
            
            newState = {
                ...state,
                userCarts: {
                    ...state.userCarts,
                    [userId]: userCart.filter(item => item.id !== productId)
                }
            };
            saveCartToStorage(newState.userCarts);
            return newState;
        }

        case UPDATE_QUANTITY: {
            const { userId, productId, quantity } = action.payload;
            const userCart = state.userCarts[userId] || [];
            
            newState = {
                ...state,
                userCarts: {
                    ...state.userCarts,
                    [userId]: userCart.map(item =>
                        item.id === productId
                            ? { ...item, quantity }
                            : item
                    )
                }
            };
            saveCartToStorage(newState.userCarts);
            return newState;
        }

        case CLEAR_CART: {
            const { userId } = action.payload;
            const newUserCarts = { ...state.userCarts };
            delete newUserCarts[userId];
            
            newState = {
                ...state,
                userCarts: newUserCarts
            };
            saveCartToStorage(newState.userCarts);
            return newState;
        }

        default:
            return state;
    }
};

export const addToCart = (userId, product) => ({
    type: 'ADD_TO_CART',
    payload: { userId, product }
});

export const removeFromCart = (userId, productId) => ({
    type: 'REMOVE_FROM_CART',
    payload: { userId, productId }
});

export const updateQuantity = (userId, productId, quantity) => ({
    type: 'UPDATE_QUANTITY',
    payload: { userId, productId, quantity }
});

export const clearCart = (userId) => ({
    type: 'CLEAR_CART',
    payload: { userId }
});

export const selectUserCart = (state, userId) => {
    if (!userId) return { items: [], total: 0 };
    const userCart = state.cart.userCarts[userId] || [];
    const total = userCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { items: userCart, total };
};

export const selectCartItems = (state, userId) => {
    if (!userId) return [];
    return state.cart.userCarts[userId] || [];
};

export const selectCartTotal = (state, userId) => {
    if (!userId) return 0;
    const userCart = state.cart.userCarts[userId] || [];
    return userCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export default cartReducer; 