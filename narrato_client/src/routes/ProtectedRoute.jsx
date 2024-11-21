import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated} from '../app/slice/authSlice'
export const ProtectedRoute = ({ children }) => {


    const isAuthenticated = useSelector(selectIsAuthenticated); 
    return isAuthenticated ? <Navigate to="/signup" replace /> : children;
}
