export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('reduxState');
        if (serializedState === null) {
            return undefined;
        }
        const state = JSON.parse(serializedState);
        return {
            ...state,
            favorites: {
                userFavorites: state.favorites?.userFavorites || {}
            }
        };
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify({
            ...state,
            favorites: {
                userFavorites: state.favorites.userFavorites
            }
        });
        localStorage.setItem('reduxState', serializedState);
    } catch (err) {
        console.error('Error saving state:', err);
    }
};

export const persistMiddleware = store => next => action => {
    const result = next(action);
    
    // Сохраняем состояние только если действие связано с избранными
    if (action.type.startsWith('favorites/')) {
        saveState(store.getState());
    }
    
    return result;
}; 