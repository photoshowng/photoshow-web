import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, makeStyles } from '@material-ui/core';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database, getDb } from '../Firebase';
import { ref, set } from 'firebase/database';
import registerUser from '../Auth/AuthSignup';
import { useNavigate } from 'react-router-dom';
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
        [theme.breakpoints.down('sm')]: {
          width: "90%",
        },
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
    link2: {
        color: "#3248a8",
        fontSize: "18px",
        cursor: "pointer",
        padding: 0,
        margin: 0,
        textDecoration: "none"
    },
    logo: {
      width: "200px",
      height: "200px",
    },
  }));

const SignUpPage = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState("");

      const handleSignUp = async (e) => {
        e.preventDefault();
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
          const user = userCredential.user;
          const pagesLiked = {}
          const pagesFollowed = {}
    
          // Save user information to the database
          await set(ref(database, 'Users/' + user.uid), {
            userId: user.uid,
            userName: userName,
            userEmail: userEmail,
            pagesLiked, // empty object for pages liked
            pagesFollowed,
            createdAt: new Date().toISOString(),  // Store date as ISO string
            role: "user"
          });
    
          // Navigate to sign-in page after successful sign-up
          navigate('/login');
        } catch (error) {
          console.error('Error signing up:', error.message);
        }
      };

  return (
    <div className={classes.SignUpPage}>
      <img src={logo} alt='Photoshow' className={classes.logo} />
      <form className={classes.form} onSubmit={handleSignUp}>
        <Typography variant="h4" align="center" gutterBottom className={classes.heading}>
            Signup
        </Typography>
        <div className={classes.inputs}>
            <TextField
              variant="outlined"
              label="User Name"
              name="name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className={classes.input}
            />
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
            <TextField
              variant="outlined"
              label="Confirm Password"
              name="password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={classes.input}
            />
            <p>Already Have Account? <a href='/login' className={classes.link2}>Login</a></p>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Signup
            </Button>
        </div>
      </form>
    </div>
  );
};





export default SignUpPage;
