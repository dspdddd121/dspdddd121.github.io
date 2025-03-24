import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import productsReducer from './reducers/productsReducer';
import cartReducer from './reducers/cartReducer';
import authReducer from './reducers/authReducer';
import favoritesReducer from './reducers/favoritesReducer';
import { persistMiddleware, loadState } from './middleware/persistMiddleware';

const rootReducer = combineReducers({
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
    favorites: favoritesReducer
});

const persistedState = loadState() || {
    auth: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        registeredUsers: {}
    }
};

const store = createStore(
    rootReducer,
    persistedState,
    applyMiddleware(thunk, persistMiddleware)
);

export default store; 