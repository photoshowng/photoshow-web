import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useLocation, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../Firebase';
import { onValue, ref } from 'firebase/database';
import logo from "../Assets/Images/logo.png"


const useStyles = makeStyles((theme) => ({
    SignUpPage: {
        width: '100%',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh"
    },
    heading: {
        margin: "30px auto",
        fontSize: "25px",
        fontWeight: 600,
        textTransform: "uppercase"
    },
    form: {
        width: "50%",
        //backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
        borderRadius: "15px",
        position: "relative",
        [theme.breakpoints.down('sm')]: {
          width: "90%",
        },
    },
    logo: {
      width: "200px",
      height: "200px",
    },
    inputs: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
    },
    input: {
        width: "80%",
        margin: "10px"
    },
    button: {
        margin: "20px",
        width: "150px"
    },
    link: {
        color: "rgb(250, 5, 5)",
        fontSize: "18px",
        cursor: "pointer",
        padding: 0,
        margin: 0,
    },
    link2: {
        color: "#3248a8",
        fontSize: "18px",
        cursor: "pointer",
        padding: 0,
        margin: 0,
        textDecoration: "none"
    },
    closeIcon: {
        position: "absolute",
        top: "10px",
        right: "20px",
    },
    notification: {
        width: "50%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
        borderRadius: "15px",
        position: "relative",
    }
  }));

const Login = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const location = useLocation();
    const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [userData, setUserData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const sendResetLink = () => {
        setShowNotification(true)
    }

    const getData = (id, from) => {
        const userId = id;
        const dataRef = ref(database, `Photographers/${userId}`);
        
        onValue(dataRef, (snapshot) => {
          const fetchedData = snapshot.val();
          setUserData(fetchedData);
          setLoading(false);
          
          if (fetchedData !== null) {
            navigate(from, { replace: true });
          } else {
            alert('You are not a user, try logging in as a photographer');
          }
        }, {
          onlyOnce: true // Use this option to ensure onValue is called once and then detached
        });
      }
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading when the request starts
        try {
          const userCredentials = await signInWithEmailAndPassword(auth, userEmail, userPassword);
          const from = location.state?.from?.pathname || "/super";
          sessionStorage.setItem("superId", userCredentials.user.uid);
          getData(userCredentials.user.uid, from);
        } catch (error) {
          console.error("Error logging in: ", error);
          setLoading(false); // Stop loading on error
        }
      };

  return (
    <div className={classes.SignUpPage}>
      <img src={logo} alt='Photoshow' className={classes.logo} />
      {showForgotPasswordPopup ? showNotification ? <div className={classes.notification}>
        <CloseIcon className={classes.closeIcon} onClick={() => setShowNotification(false)}/>
        <p>Email Sent Successfully</p>
        <p>Check It In Your SPAM Folder If You Can't find it in Primary</p>
      </div> : <form className={classes.form}>
        <CloseIcon className={classes.closeIcon} onClick={() => setShowForgotPasswordPopup(false)}/>
        <Typography variant="h4" align="center" gutterBottom className={classes.heading}>
            Reset Password
        </Typography>
        <p style={{margin: "0 0 10px 0", padding: 0, textTransform: "capitalize"}}>Enter your registered email address to recieve password reset Link</p>
        <div className={classes.inputs}>
            <TextField
              variant="outlined"
              label="Email"
              name="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className={classes.input}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={sendResetLink}
            >
              Continue
            </Button>
        </div>
      </form> : 
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h4" align="center" gutterBottom className={classes.heading}>
            Login
        </Typography>
        <div className={classes.inputs}>
            <TextField
              variant="outlined"
              label="Email"
              name="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className={classes.input}
            />
            <TextField
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              className={classes.input}
            />
            <p className={classes.link} onClick={() => setShowForgotPasswordPopup(true)}>Forgot Password ?</p>
            <p>Don't Have Account? <a href='/super/register' className={classes.link2}>Sign Up</a></p>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Login
            </Button>
        </div>
      </form>}
    </div>
  );
};

export default Login;
