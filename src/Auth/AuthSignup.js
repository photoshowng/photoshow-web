import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../Firebase';

const registerUser = async (email, password, additionalData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // After successful user creation, save additional data to Realtime Database
    await saveUserData(user.uid, additionalData);

    console.log('User created and data saved:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

const saveUserData = async (userId, additionalData) => {
  try {
    await set(ref(database, 'Users/' + userId), {
      userId: userId,
      userEmail: additionalData.userEmail,
      userName: additionalData.userName,
      userPassword: additionalData.userPassword,
      pagesFollowed: {"count": 0},
      pagesLiked: {"count": 0},
      createdAt: Date.now(),  // Save any other additional data
    });
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export default registerUser;