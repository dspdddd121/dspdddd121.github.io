import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from 'react-redux';
import { selectRegisteredUsers } from '../store/reducers/authReducer';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import "../styles/Auth.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const registeredUsers = useSelector(selectRegisteredUsers);

    const from = location.state?.from || '/';

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        'Authorization': `Bearer ${tokenResponse.access_token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userInfo = await response.json();
                
                const userData = {
                    id: userInfo.sub,
                    name: userInfo.name,
                    email: userInfo.email,
                    avatar: userInfo.picture,
                    isGoogleUser: true
                };

                login(userData);
                toast.success('Успешный вход через Google');
                navigate(from);
            } catch (error) {
                console.error('Error during Google login:', error);
                toast.error('Ошибка при входе через Google');
                setError('Не удалось войти через Google. Пожалуйста, попробуйте позже.');
            }
        },
        onError: () => {
            toast.error('Ошибка при входе через Google');
            setError('Не удалось войти через Google. Пожалуйста, попробуйте позже.');
        },
        flow: 'implicit'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        const user = registeredUsers[email];
        
        if (!user) {
            setError('Пользователь с таким email не найден');
            return;
        }

        if (user.password !== password) {
            setError('Неверный пароль');
            return;
        }

        const userData = {
            id: user.id,
            email: user.email,
            name: user.name
        };

        login(userData);
        toast.success('Успешный вход в систему');
        navigate(from);
    };

    return (
        <div className="auth-container">
            <div className="auth-banner">
                <h1>Добро пожаловать !</h1>
                <p>Войдите в свой аккаунт для доступа к персональным предложениям</p>
            </div>

            <div className="auth-form">
                <h2>Вход в систему</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Введите email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                        />
                    </div>
                    <button type="submit" className="auth-button">Войти</button>
                </form>
                
                <div className="auth-divider">
                    <span>или</span>
                </div>
                
                <button 
                    onClick={() => googleLogin()} 
                    className="google-auth-button"
                >
                    <FaGoogle /> Войти через Google
                </button>

                <p className="auth-link">
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    );
};

export default Login; 