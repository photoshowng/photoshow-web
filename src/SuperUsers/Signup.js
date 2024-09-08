import { Button, Input, TextField, Typography, makeStyles,
  MenuItem, InputLabel, FormControl, Select, Checkbox, ListItemText } from '@material-ui/core';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { push, ref, set } from 'firebase/database';
import { auth, database, storage, storeRef } from '../Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';;

// Mock list of programs
const programs = [
  "all programmes",
  "sallah",
  "wedding",
  "naming ceremony",
  "dinner",
  "engagement"
];


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
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
        borderRadius: "15px"
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
    selectInput: {
      width: "100%",
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
    inputLabel: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  }));

const Signup = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [location, setLocation] = useState('')
    const [facebookLink, setFacebookLink] = useState('')
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [image, setImage] = useState(null)
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0)
 
    const [postTitle, setPostTitle] = useState('')
    const [postContent, setPostContent] = useState('')
    const [postImage, setPostImage] = useState(null)
    const [postCaption, setPostCaption] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [selectedPrograms, setSelectedPrograms] = useState([]);

  // Handle the selection of programs
  const handleChangeProgramme = (event) => {
    const { value } = event.target;
    setSelectedPrograms(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmitProgrammes = () => {
    console.log("Selected programs: ", selectedPrograms);
    // Perform your form submission logic here
  };

    const handleUpload = async () => {
      return new Promise((resolve, reject) => {
        if (!image) {
          reject("No image selected");
          return;
        }
    
        const storageRef = storeRef(storage, `Images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
    
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Progress function
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            // Error function
            reject(error);
          },
          () => {
            // Complete function
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setUrl(downloadURL); // Set URL state
              resolve(downloadURL); // Resolve with the URL
            });
          }
        );
      });
    };
    

    const AddPhotographerToDatabase = async (user) => {
        try {
          // Generate a UUID
          const id = user.uid;
          const image = user.image

          const data = {
            id,
            image,
            userName,
            userEmail,
            location,
            facebookLink,
            whatsappNumber,
            followers: {},
            likers: {},
            posts: {},
            role: "super",
            programmes: selectedPrograms,
            createdAt: new Date().toISOString(),  // Store date as ISO string
         }  
      
          // Create a reference with the custom ID
          const dataRef = ref(database, `Photographers/${id}`); // Replace 'your-data-path' with your desired path
      
          // Set the data with the generated ID
          await set(dataRef, { ...data, id });
        } catch (error) {
          console.error('Error adding data:', error);
        }
      };

      const handleSignUp = async (e) => {
        e.preventDefault();
        
        if (userPassword !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        
        if (image && userName && userPassword && location && facebookLink && whatsappNumber && selectedPrograms) {
          try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
            const user = userCredential.user;
      
            // Upload image and wait for the URL
            const downloadURL = await handleUpload();
      
            // Now pass the URL to the database function
            await AddPhotographerToDatabase({
              ...user,
              image: downloadURL // Ensure the image URL is passed to the database
            });
      
            // Navigate to login after successful signup
            navigate("/super/login");
            
          } catch (error) {
            console.error('Error signing up:', error.message);
            setError(error.message);
          }
        } else {
          setError("All fields must be filled.");
        }
      };

  return (
    <div className={classes.SignUpPage}>
        <Typography variant="h4" align="center" gutterBottom className={classes.heading}>
            Add Logo
        </Typography>
      <form className={classes.form} onSubmit={handleSignUp}>
        <Typography variant="h4" align="center" gutterBottom className={classes.heading}>
            Add Photographer
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
            <TextField
              variant="outlined"
              label="Location"
              name="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={classes.input}
            />
            <TextField
              variant="outlined"
              label="Facebook Link"
              name="facebooklink"
              type="text"
              value={facebookLink}
              onChange={(e) => setFacebookLink(e.target.value)}
              className={classes.input}
            />
             <TextField
              variant="outlined"
              label="WhatsApp Number"
              name="whatsappnumber"
              type="nimber"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className={classes.input}
            />
            <FormControl style={{width: "80%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"}}>
              <InputLabel id="programs-label">Select Programs</InputLabel>
              <Select
                variant="outlined"
                labelId="programs-label"
                id="select-multiple-programs"
                multiple
                className={classes.selectInput}
                value={selectedPrograms}
                onChange={handleChangeProgramme}
                renderValue={(selected) => selected.join(', ')}
              >
                {programs.map((program) => (
                  <MenuItem key={program} value={program}>
                    <Checkbox checked={selectedPrograms.indexOf(program) > -1} />
                    <ListItemText primary={program} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Input
                variant="outlined"
                className={classes.input}
                type="file"
                name="image"
                onChange={(e) => setImage(e.target.files[0])}
            />
            <p>Already Have Account? <a href='/super/login' className={classes.link2}>Login</a></p>
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
  )
}

export default Signup
