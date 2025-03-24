import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerSuccess } from '../store/reducers/authReducer';
import { useAuth } from '../context/AuthContext';
import { selectRegisteredUsers } from '../store/reducers/authReducer';
import '../styles/Auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { login } = useAuth();
    const registeredUsers = useSelector(selectRegisteredUsers);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !confirmPassword) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        const users = registeredUsers || {};
        
        if (users[email]) {
            setError('Пользователь с таким email уже существует');
            return;
        }

        const userData = { email, password, name };
        const userDataForLogin = { id: Date.now(), email, name };

        try {
            dispatch(registerSuccess(userData));
            login(userDataForLogin);
            navigate('/');
        } catch (error) {
            setError('Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-banner">
                <h1>Регистрация</h1>
                <p>Создайте аккаунт для доступа ко всем возможностям</p>
            </div>

            <div className="auth-form">
                <h2>Создать аккаунт</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Имя:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
            <div className="form-group">
                 <label>Подтвердите пароль:</label>
                     <input
                         type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className='auth-button'>Зарегистрироваться</button>
                </form>
                <p className="toggle-auth">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </div>
        </div>
    );
};

export default Register; 