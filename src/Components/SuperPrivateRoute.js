import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Layout from './Layout';
import Header from "../Components/Header"
import Dashboard from '../SuperUsers/Dashboard';
import SuperLayout from './SuperLayout';
import SuperHeader from './SuperHeader';

const SuperPrivateRoute = () => {
  const { currentUser } = useAuth();

  const authId = sessionStorage.getItem('superId')

  return authId ? <SuperHeader authId = {authId}/> : <Navigate to="/welcome" />;
};

export default SuperPrivateRoute;