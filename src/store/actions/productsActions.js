import { productsAPI } from '../../api/api';

export const SET_PRODUCTS = 'SET_PRODUCTS';
export const FETCH_PRODUCTS_START = 'FETCH_PRODUCTS_START';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_ERROR = 'FETCH_PRODUCTS_ERROR';

export const setProducts = (products) => ({
    type: SET_PRODUCTS,
    payload: products
});

export const fetchProductsStart = () => ({
    type: FETCH_PRODUCTS_START
});

export const fetchProductsSuccess = (products) => ({
    type: FETCH_PRODUCTS_SUCCESS,
    payload: products
});

export const fetchProductsError = (error) => ({
    type: FETCH_PRODUCTS_ERROR,
    payload: error
});

// Thunk action creator
export const fetchProducts = () => {
    return async (dispatch) => {
        dispatch(fetchProductsStart());
        try {
            const response = await productsAPI.getProducts();
            dispatch(fetchProductsSuccess(response.data));
        } catch (error) {
            dispatch(fetchProductsError(error.message));
        }
    };
}; 