// src/auth.js

import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '../Firebase';

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from the Realtime Database
    const userData = await fetchUserData(user.uid);

    sessionStorage.setItem('userId', user.uid) // TO BE USED FOR PRIVATE ROUTING

    return userData; // return user data if needed elsewhere
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

const fetchUserData = async (userId) => {
  try {
    const userRef = ref(database, 'Users/' + userId);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.error('No user data available');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export default loginUser;
