import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userFavorites: {}
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        toggleFavorite: (state, action) => {
            const { userId, productId } = action.payload;
            
            if (!userId) return; 
            if (!state.userFavorites[userId]) {
                state.userFavorites[userId] = [];
            }

            const userFavorites = state.userFavorites[userId];
            const index = userFavorites.indexOf(productId);

            if (index === -1) {
                userFavorites.push(productId);
            } else {
                userFavorites.splice(index, 1);
            }
        },
        clearUserFavorites: (state, action) => {
            const userId = action.payload;
            if (userId === null) {
                state.userFavorites = {};
            } else if (state.userFavorites[userId]) {
                delete state.userFavorites[userId];
            }
        }
    }
});

export const { toggleFavorite, clearUserFavorites } = favoritesSlice.actions;

export const selectUserFavorites = (state, userId) => 
    userId && state.favorites.userFavorites[userId] ? state.favorites.userFavorites[userId] : [];

export default favoritesSlice.reducer; 