import { Button, TextField, Typography, makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import HomeImg from '../Assets/Images/HomeImg.png'
import '../Assets/Styles/ProfilePage.css'
import { useData } from '../Context/DataContext';
import { updateSpecificFields } from '../DataOperations';
import { ref, update } from 'firebase/database';
import { database, handleLogout } from '../Firebase';
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    backgroundColor: '#3248a8',
    '&:hover': {
      backgroundColor: '#007bff',
    },
  },
}));


const SuperProfilePage = () => {

  const classes = useStyles()

  const { data, loading, error, setError, success, setSuccess, photographers } = useData();

  //let userEmail = ''

  const [userNameText, setUserNameText] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [editPassword, setEditPassword] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showEditPasswordButton, setShowEditPasswordButton] = useState(true)
  const [isDisabled, setIsDisabled] = useState(true);
  const [buttonValue, setButtonValue] = useState('');

  useEffect(() => {
    //if (loading) return;

    const id = sessionStorage.getItem('superId')

    const photographer = photographers?.find(photographer => photographer.id === id);

    const userName = data?.userName

    setUserNameText(photographer?.userName)
    setUserEmail(photographer?.userEmail)
  }, [photographers]);
  

  const handleFieldUpdate = () => {
    updateSpecificFields('Users/user1', { age: 25 });
  };

  const editInput = (e) => {
    setIsDisabled(!isDisabled);
    setButtonValue(e.target.value); // Store the button value
    const buttonText = e.target.textContent
    if (buttonText.toLowerCase() === 'save') {
      updateUserName(`Users/${data.userId}`, { userName: userNameText });
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password should be at least 6 characters long.');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        setError('No user is currently logged in.');
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);
      setSuccess('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      handleLogout()
    } catch (err) {
      setError(`Failed to update password: ${err.message}`);
    }
  };

  const showEditPassword = () => {
    setEditPassword(true)
    setShowEditPasswordButton(false)
  }

  const updateUserName = async (path, newData) => {
    try {
      // Reference to the user's data
      const userRef = ref(database, path);
  
      // Update the user's profile with new data
      await update(userRef, newData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('error')
    }
  };

  return (
    <div className='profile'>
      <div className="profile-container" >
        <h4>My Profile</h4>
        <div className="profile-info">
          <p>Email: {userEmail}</p>
          <div class="profile-field">
            <p className="username">User Name:</p>
            <input 
            type="text" 
            id="userName"
            value={userNameText} 
            disabled={isDisabled} 
            onChange={(e) => setUserNameText(e.target.value)}/>
            <button value={buttonValue} onClick={editInput}>{isDisabled ? 'Edit' : 'Save'}</button>
          </div>
          {showEditPasswordButton && <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={showEditPassword}
            style={{margin: "10px auto"}}
            >
              Edit Password
          </Button>}
          {editPassword &&  <div className='edit-password-container'>
            <TextField 
              id="outlined-search" 
              label="Old Password"
              variant="outlined"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className='text-field'style={{border: "none", borderRadius: "25px", outline: "none", margin: '5px', width: '90%', padding: '10px'}}/>
            <TextField
              id="outlined-search" 
              label="New Password" 
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='text-field'style={{border: "none", borderRadius: "25px", outline: "none", margin: '5px', width: '90%', padding: '10px'}}/>
            <TextField
              id="outlined-search" 
              label="New Password" 
              variant="outlined"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className='text-field'style={{border: "none", borderRadius: "25px", outline: "none", margin: '5px', width: '90%', padding: '10px'}}/>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleUpdatePassword}
              >
                Update Password
            </Button>

          </div>
          }
        </div>
      </div>
    </div>
  )
}

export default SuperProfilePage
