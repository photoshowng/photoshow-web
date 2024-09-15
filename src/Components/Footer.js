import React from 'react'
import '../Assets/Styles/Footer.css'
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import { Link } from '@material-ui/core';

const Footer = () => {

  return (
    <div className='footer'>
        <p>© 2024 Photoshow.</p>
        {/* <p>All rights reserved.</p> */}
        <div class="social-icons">
            <Link href="https://wa.me/08062448758" 
              underline="none" 
              color="primary"
              target="_blank"
              rel="noopener noreferrer"
              className='icon'>
                <WhatsAppIcon />
            </Link>
            <Link 
              href="https://www.facebook.com/" 
              underline="none" 
              color="primary"
              target="_blank"
              rel="noopener noreferrer"
              className='icon'>
                <FacebookIcon />
            </Link>
            <Link href="https://twitter.com/" 
              underline="none" 
              color="primary"
              target="_blank"
              rel="noopener noreferrer"
              className='icon'>
                <TwitterIcon />
            </Link>
            <Link href="https://www.instagram.com/" 
              underline="none" 
              color="primary"
              target="_blank"
              rel="noopener noreferrer"
              className='icon'>
                <InstagramIcon />
            </Link>
            <Link href="https://www.youtube.com/c/" 
              underline="none" 
              color="primary"
              target="_blank"
              rel="noopener noreferrer"
              className='icon'>
                <YouTubeIcon />
            </Link>
            <Link href="https://www.linkedin.com/in/" 
              underline="none" 
              color="primary"
              target="_blank"
              rel="noopener noreferrer"
              className='icon'>
                <LinkedInIcon />
            </Link>
        </div>
    </div>
  )
}

export default Footer
