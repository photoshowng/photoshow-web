import { Typography } from '@material-ui/core'
import React from 'react'
import Home from '../Pages/Home'
import Photographers from '../Pages/Photographers'
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import ProfilePage from '../Pages/ProfilePage';
import Photographer from '../Pages/Photographer';
import AboutUs from "../Pages/AboutUs";

const Layout = ({data}) => {
  return (
    <div style={{marginLeft: "20px"}}>
        <Routes>
            <Route exact path="" element={<Home data={data}/>} />
            <Route exact path="photographers" element={<Photographers />} />
            <Route exact path="photographers/:id" element={<Photographer />} />
            <Route exact path="profile" element={<ProfilePage />} />
            <Route exact path="about" element={<AboutUs />} />
        </Routes>
    </div>
  )
}

export default Layout
