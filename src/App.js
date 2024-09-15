import { useEffect, useState } from 'react';
import './App.css';
import Header from './Components/Header';
import WelcomePage from './Pages/WelcomePage';
import { Route, Router, Switch, Routes } from "react-router-dom";
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import { onValue, ref } from 'firebase/database';
import { database } from './Firebase';
import { AuthProvider } from './Context/AuthContext';
import { DataProvider } from './Context/DataContext';
import PrivateRoute from './Components/PrivateRoute';
import Home from './Pages/Home';
import Layout from './Components/Layout';
import Photographers from './Pages/Photographers';
import Photographer from './Pages/Photographer';
import Profile from './Pages/ProfilePage';
import AddPhotographer from './AddPhotographer';
import ImageUpload from './ImageUpload';
import Signup from './SuperUsers/Signup';
import Login from './SuperUsers/Login';
import Dashboard from './SuperUsers/Dashboard';
import AboutUs from './Pages/AboutUs';
import SuperPrivateRoute from './Components/SuperPrivateRoute';
import AuthenticationPage from './Components/AuthenticationPage';
import AboutPage from './Pages/AboutPage';

function App() {
  const [isLogin, setIsLogin] = useState(false)

  const access = sessionStorage.getItem("userId")

  const isUser = access? true : false

  const [data, setData] = useState([]);

  useEffect(() => {
    const dataRef = ref(database, `Users/${access}`); // Update 'path/to/your/data' to the path in your database

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      setData(data);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/*" element={<PrivateRoute />}></Route>
          <Route path="/super/*" element={<SuperPrivateRoute />}></Route>
          <Route exact path="/authentication" element={<AuthenticationPage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/signup" element={<SignUpPage />} />
          <Route exact path="/super/register" element={<Signup />} />
          <Route exact path="/super/login" element={<Login />} />
          <Route exact path="/welcome" element={<WelcomePage />} />
          <Route exact path="/about-us" element={<AboutPage />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
