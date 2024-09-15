import { Typography } from '@material-ui/core'
import React from 'react'
import image1 from '../Assets/Images/Image1.jpg'
import Aj1 from "../Assets/Images/Aj1.jpg"
import "../Assets/Styles/AboutUs.css"
import AdComponent from '../Components/AdComponent'

const AboutUs = () => {
  return (
    <div className='about-page'>
      <h4>About Us</h4>
      <p>Welcome to Photoshow! We are passionate about capturing the beauty of the world through the lens of our cameras. Our team of talented photographers is dedicated to providing you with the highest quality images and exceptional service.</p>
      <AdComponent />
      <div className='developers'>
        <h4>Meet Developers</h4>
        <div className='developer-card'>
          <img src={image1} alt='Dev'/>
          <p className='name'>Name: Anas Hamza</p>
          <p className='role'>Role: CEO</p>
          <p className='email'>anashamzabdw62@gmail.com</p>
        </div>
        <div className='developer-card'>
          <img src={Aj1} alt='Dev'/>
          <p className='name'>Name: Auwal Jabir</p>
          <p className='role'>Role: CTO</p>
          <p className='email'>ajbindawa21@gmail.com</p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
