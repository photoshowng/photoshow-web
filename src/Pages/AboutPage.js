import { AppBar, Button, Toolbar, Typography, makeStyles } from '@material-ui/core'
import React from 'react'
import image1 from '../Assets/Images/Image1.jpg'
import Aj1 from "../Assets/Images/Aj1.jpg"
import "../Assets/Styles/AboutUs.css"
import AdComponent from '../Components/AdComponent'
import logo from "../Assets/Images/logo.png"
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    //marginBottom: theme.spacing(4),
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      fontSize: "14px",
      display: "none",
    },
  },
  logo: {
    display: "none",
    [theme.breakpoints.down('sm')]: {
      display: "block",
      width: "80px",
      height: "70px",
      marginLeft: "-30px",
    },
  },
  button: {
    margin: "10px"
  },
  link: {
    [theme.breakpoints.down('sm')]: {
      fontSize: "11px",
    },
  },
}));

const AboutPage = () => {
  const classes = useStyles()
  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <Typography variant="h6" className={classes.title}>
              PhotoShow
              </Typography>
              <img src={logo} alt='logo' className={classes.logo}/>
              <div>
                <Button color="inherit" component={RouterLink} to="/home" className={classes.link}>Home</Button>
                <Button color="inherit" component={RouterLink} to="/photograhers" className={classes.link}>Photograhers</Button>
                <Button color="inherit" component={RouterLink} to="/about-us" className={classes.link}>About Us</Button>
              </div>
            </Toolbar>
        </AppBar>
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
    </div>
  )
}

export default AboutPage
