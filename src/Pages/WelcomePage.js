import { AppBar, Box, Button, Container, Link, Toolbar, Typography, makeStyles } from '@material-ui/core'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import AdComponent from '../Components/AdComponent';
import logo from "../Assets/Images/logo.png"


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    appBar: {
      marginBottom: theme.spacing(4),
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    menuButton: {
      marginRight: theme.spacing(2),
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
    heroContent: {
      padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
      marginTop: theme.spacing(4),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      [theme.breakpoints.down('sm')]: {
        flexDirection: "column",
      },
    },
    footer: {
      marginTop: theme.spacing(4),
      padding: theme.spacing(6, 0),
    },
    link: {
      [theme.breakpoints.down('sm')]: {
        fontSize: "11px",
      },
    },
    welcome : {
      [theme.breakpoints.down('sm')]: {
        padding: "10px"
      },
    },
  }));

const WelcomePage = () => {
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
       <main className={classes.welcome}>
        <Container maxWidth="sm" component="main" className={classes.heroContent}>
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Welcome to PhotoShow
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Discover amazing photos from talented photographers around the world.
          </Typography>
          <AdComponent />
            <Box className={classes.heroButtons}>
              <Button style={{margin: "10px"}} variant="contained" color="primary" component={RouterLink} to="/authentication">
                Explore Photograhers
              </Button>
              <Button style={{margin: "10px"}} variant="outlined" color="primary" component={RouterLink} to="/about-us">
                About Us
              </Button>
            </Box>
        </Container>
      </main>
      <footer className={classes.footer}>
        <Container maxWidth="lg">
          <Typography variant="h6" align="center" gutterBottom>
            PhotoShow
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            Your one-stop destination for stunning photography.
          </Typography>
          <Box mt={5}>
            <Typography variant="body2" color="textSecondary" align="center">
              {'© '}
              <Link color="inherit" href="https://photoshow.site/">
                PhotoShow
              </Link>{' '}
              {new Date().getFullYear()}
              {'.'}
            </Typography>
          </Box>
        </Container>
      </footer>
    </div>
  )
}

export default WelcomePage
