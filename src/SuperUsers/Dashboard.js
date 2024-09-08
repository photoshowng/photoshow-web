import { Typography } from '@material-ui/core'
import React, { useContext } from 'react'
import HomeImg from '../Assets/Images/HomeImg.png'
import '../Assets/Styles/Home.css'
import { useData } from '../Context/DataContext'

const Dashboard = ({data}) => {
  return (
  <>
    <div className='home'>
      <div className="text">
        <p>Hello <span id="emailContainer">{data?.userName}</span></p>
        <h1>Welcome to Photoshow site</h1>
        <h4>This Site Has Been Designed For world wide photographers</h4>
      </div>
      <div class="image-section">
        <img src={HomeImg} alt="Main Image" className='image'/>
      </div>
    </div>
  </>
  )
}

export default Dashboard
