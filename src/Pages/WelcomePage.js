import { AppBar, Box, Button, Container, Link, Toolbar, Typography, makeStyles } from '@material-ui/core'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    appBar: {
      marginBottom: theme.spacing(4),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    heroContent: {
      padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
      marginTop: theme.spacing(4),
    },
    footer: {
      marginTop: theme.spacing(4),
      padding: theme.spacing(6, 0),
    },
  }));

const WelcomePage = () => {
    const classes = useStyles()
  return (
    <div>
        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                PhotoShow
                </Typography>
                <Button color="inherit" component={RouterLink} to="/home">Home</Button>
                <Button color="inherit" component={RouterLink} to="/photograhers">Photograhers</Button>
                <Button color="inherit" component={RouterLink} to="/about-us">About Us</Button>
            </Toolbar>
        </AppBar>
       <main>
        <Container maxWidth="sm" component="main" className={classes.heroContent}>
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Welcome to PhotoShow
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Discover amazing photos from talented photographers around the world.
          </Typography>
          <div className={classes.heroButtons}>
            <Box display="flex" justifyContent="center">
              <Button variant="contained" color="primary" component={RouterLink} to="/authentication">
                Explore Photograhers
              </Button>
              <Button variant="outlined" color="primary" component={RouterLink} to="/about-us" style={{ marginLeft: '10px' }}>
                About Us
              </Button>
            </Box>
          </div>
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
