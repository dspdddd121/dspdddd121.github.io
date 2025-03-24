import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import './styles/App.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "608019745945-f0fi38lkn37ec23gv6d54ameil7js4qv.apps.googleusercontent.com";

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Provider store={store}>
                <AuthProvider>
                    <CartProvider>
                        <FavoritesProvider>
                            <Router>
                                <div className="app">
                                    <Navbar />
                                    <main className="main-content">
                                        <Routes>
                                            <Route path="/" element={<Home />} />
                                            <Route path="/catalog" element={<Catalog />} />
                                            <Route path="/catalog/:id" element={<ProductDetails />} />
                                            <Route path="/cart" element={<Cart />} />
                                            <Route path="/login" element={<Login />} />
                                            <Route path="/register" element={<Register />} />
                                            <Route path="/profile" element={<Profile />} />
                                        </Routes>
                                    </main>
                                    <ToastContainer
                                        position="top-right"
                                        autoClose={3000}
                                        hideProgressBar={false}
                                        newestOnTop={false}
                                        closeOnClick
                                        rtl={false}
                                        pauseOnFocusLoss
                                        draggable
                                        pauseOnHover
                                        theme="light"
                                        limit={3}
                                    />
                                </div>
                            </Router>
                        </FavoritesProvider>
                    </CartProvider>
                </AuthProvider>
            </Provider>
        </GoogleOAuthProvider>
    );
}

export default App;
