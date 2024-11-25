import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';

export const Authorization = ({ children }) => {
    return localStorage.getItem('token') ? children : <Navigate to="/" replace />;
};
export const AuthorizationForLoginPage = ({ children }) => {
    return localStorage.getItem('token') ? <Navigate to="/profile" replace /> : children;
};
export const AuthorizationForPasswordPage = ({ children }) => {
    if (localStorage.getItem('token')) {
        console.log(localStorage.getItem('token'));
        
        return <Navigate to="/profile" replace />
    }
    // else if(!localStorage.getItem('token')){
    //     return <Navigate to="/" replace />
    // }
    return localStorage.getItem('username') ? children : <Navigate to="/" replace />;
};