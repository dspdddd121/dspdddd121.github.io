import axios from 'axios';

const api = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const productsAPI = {
    getProducts: () => api.get('/products.json'),
    getProductById: (id) => api.get(`/products/${id}.json`)
};

export default api; 