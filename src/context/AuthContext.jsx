import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout as logoutAction } from '../store/reducers/authReducer';
import { toast } from 'react-toastify';
import { clearUserFavorites } from '../store/reducers/favoritesReducer';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const reduxUser = useSelector(state => state.auth.user);
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            const parsedUser = savedUser ? JSON.parse(savedUser) : null;
            if (parsedUser && parsedUser.id) {
                dispatch(loginSuccess(parsedUser));
                return parsedUser;
            }
            return null;
        } catch (error) {
            console.error('Ошибка при чтении пользователя из localStorage:', error);
            return null;
        }
    });


    useEffect(() => {
        if (reduxUser && (!user || user.id !== reduxUser.id)) {
            setUser(reduxUser);
            localStorage.setItem('user', JSON.stringify(reduxUser));
        }
    }, [reduxUser]);

    const login = (userData) => {
        try {
            if (!userData.id) {
                throw new Error('Данные пользователя должны содержать ID');
            }

            const enhancedUserData = {
                ...userData,
                isGoogleUser: userData.isGoogleUser || false,
                avatar: userData.avatar || null,
                lastLogin: new Date().toISOString()
            };

            setUser(enhancedUserData);
            localStorage.setItem('user', JSON.stringify(enhancedUserData));
            dispatch(loginSuccess(enhancedUserData));
            
            toast.success(
                userData.isGoogleUser 
                    ? 'Успешный вход через Google' 
                    : 'Успешный вход в систему'
            );
        } catch (error) {
            console.error('Ошибка при входе:', error);
            toast.error('Произошла ошибка при входе в систему');
            throw error;
        }
    };

    const logout = () => {
        try {
            if (user?.id) {
                dispatch(clearUserFavorites(user.id));
            }
            setUser(null);
            localStorage.removeItem('user');
            dispatch(logoutAction());
            toast.info('Вы успешно вышли из системы');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            toast.error('Произошла ошибка при выходе из системы');
        }
    };

    const register = (userData) => {
        try {
            if (!userData.id) {
                userData.id = Date.now().toString();
            }

            const enhancedUserData = {
                ...userData,
                isGoogleUser: false,
                avatar: null,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            setUser(enhancedUserData);
            localStorage.setItem('user', JSON.stringify(enhancedUserData));
            dispatch(loginSuccess(enhancedUserData));
            
            toast.success('Регистрация успешно завершена');
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            toast.error('Произошла ошибка при регистрации');
            throw error;
        }
    };

    const updateProfile = (updates) => {
        try {
            if (!user) {
                throw new Error('Пользователь не авторизован');
            }

            const updatedUser = {
                ...user,
                ...updates,
                lastUpdated: new Date().toISOString()
            };

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            dispatch(loginSuccess(updatedUser));
            
            toast.success('Профиль успешно обновлен');
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
            toast.error('Произошла ошибка при обновлении профиля');
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            register,
            updateProfile,
            isAuthenticated: !!user,
            isGoogleUser: user?.isGoogleUser || false
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return context;
}; 