import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Layout from './Layout';
import Header from "../Components/Header"

const PrivateRoute = () => {
  const { currentUser } = useAuth();

  const authId = sessionStorage.getItem('userId')

  return authId ? <Header /> : <Navigate to="/welcome" />
};

export default PrivateRoute;
