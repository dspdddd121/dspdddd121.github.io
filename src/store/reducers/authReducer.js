const loadUsersFromStorage = () => {
    try {
        const savedUsers = localStorage.getItem('registeredUsers');
        return savedUsers ? JSON.parse(savedUsers) : {};
    } catch (error) {
        return {};
    }
};

const saveUsersToStorage = (users) => {
    try {
        localStorage.setItem('registeredUsers', JSON.stringify(users));
    } catch (error) {}
};

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    registeredUsers: loadUsersFromStorage()
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'REGISTER_REQUEST':
            return {
                ...state,
                loading: true,
                error: null
            };

        case 'REGISTER_SUCCESS': {
            const { email, password, name } = action.payload;
            const newUser = { id: Date.now(), email, name };
            const updatedUsers = {
                ...state.registeredUsers,
                [email]: { ...newUser, password }
            };
            saveUsersToStorage(updatedUsers);
            
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: newUser,
                registeredUsers: updatedUsers,
                error: null
            };
        }

        case 'REGISTER_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case 'LOGIN_REQUEST':
            return {
                ...state,
                loading: true,
                error: null
            };

        case 'LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload,
                error: null
            };

        case 'LOGIN_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                error: null
            };

        default:
            return state;
    }
};

export const register = (userData) => ({
    type: 'REGISTER_REQUEST',
    payload: userData
});

export const registerSuccess = (userData) => ({
    type: 'REGISTER_SUCCESS',
    payload: userData
});

export const registerError = (error) => ({
    type: 'REGISTER_ERROR',
    payload: error
});

export const login = (credentials) => ({
    type: 'LOGIN_REQUEST',
    payload: credentials
});

export const loginSuccess = (user) => ({
    type: 'LOGIN_SUCCESS',
    payload: user
});

export const loginError = (error) => ({
    type: 'LOGIN_ERROR',
    payload: error
});

export const logout = () => ({
    type: 'LOGOUT'
});
export const selectUser = (state) => state.auth?.user;
export const selectIsAuthenticated = (state) => state.auth?.isAuthenticated;
export const selectAuthError = (state) => state.auth?.error;
export const selectRegisteredUsers = (state) => state.auth?.registeredUsers || {};

export default authReducer; 