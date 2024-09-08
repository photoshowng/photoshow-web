import { Button, TextField, Typography, makeStyles } from '@material-ui/core';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { push, ref, set } from 'firebase/database';
import { database } from './Firebase';  // Adjust the path to your Firebase config

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
  }));

const AddPhotographer = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [location, setLocation] = useState('')
    const [facebookLink, setFacebookLink] = useState('')
    const [whatsappNumber, setWhatsappNumber] = useState('')

    const [postTitle, setPostTitle] = useState('')
    const [postContent, setPostContent] = useState('')
    const [postImage, setPostImage] = useState(null)
    const [postCaption, setPostCaption] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const AddPhotographerToDatabase = async () => {
        try {
          // Generate a UUID
          const id = uuidv4();

          const data = {
            id,
            userName,
            userEmail,
            location,
            facebookLink,
            whatsappNumber,
            followers: {},
            likers: {},
            posts: {}
         }  
      
          // Create a reference with the custom ID
          const dataRef = ref(database, `Photographers/${id}`); // Replace 'your-data-path' with your desired path
      
          // Set the data with the generated ID
          await set(dataRef, { ...data, id });

          alert('Data added with custom UUID:', id);
          console.log('Data added with custom UUID:', id);
        } catch (error) {
          console.error('Error adding data:', error);
        }
      };

      const AddPostToDatabase = async (event) => {
        event.preventDefault();

        const id = uuidv4();
    
        const newPost = {
            postId: id,
            title: postTitle,
            content: postContent,
            postedAt: new Date().toISOString(), // Optionally include a timestamp
        };
    
        try {
          const postsRef = ref(database, `Photographers/c699d7bc-158d-440a-a52f-4cd2dff18977/posts/${id}`); // Adjust the path as needed
          await set(postsRef, newPost);
          console.log('Post added successfully');
          setPostTitle(''); // Clear the form
          setPostContent('');
        } catch (error) {
          console.error('Error adding post:', error);
        }
      };
    

  return (
    <div className={classes.SignUpPage}>
      <Typography variant="h4" align="center" gutterBottom className={classes.heading}>
            Add Logo
        </Typography>
      <form className={classes.form} onSubmit={AddPhotographerToDatabase}>
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
      <form className={classes.form} onSubmit={AddPostToDatabase} style={{display: "none"}}>
        <Typography variant="h4" align="center" gutterBottom className={classes.heading}>
            Add Photographer
        </Typography>
        <div className={classes.inputs}>
            <TextField
              variant="outlined"
              label="Title"
              name="title"
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className={classes.input}
            />
            <TextField
              variant="outlined"
              label="Content"
              name="content"
              type="text"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className={classes.input}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              post
            </Button>
        </div>
      </form>
    </div>
  )
}

export default AddPhotographer
