import React from 'react'
import Dashboard from '../SuperUsers/Dashboard'
import Signup from '../SuperUsers/Signup'
import Login from '../SuperUsers/Login'
import ImageUpload from '../ImageUpload'
import { Route, Routes } from 'react-router-dom'
import Footer from './Footer'
import PostsPage from '../SuperUsers/PostsPage'
import AboutUs from '../Pages/AboutUs'
import SuperProfilePage from '../SuperUsers/SuperProfilePage'

const SuperLayout = ({data}) => {
  return (
    <div style={{marginLeft: "20px"}}>
        <Routes>
            <Route exact path="" element={<Dashboard data={data}/>} />
            <Route exact path="posts" element={<PostsPage data={data}/>} />
            <Route exact path="about" element={<AboutUs />} />
            <Route exact path="super-profile" element={<SuperProfilePage />} />
            {/* <Route exact path="uploadimage" element={<ImageUpload data={data}/>} /> */}
        </Routes>
    </div>
  )
}

export default SuperLayout
