import { ref, remove, update } from 'firebase/database';
import { database } from './Firebase';

export const updateSpecificFields = (path, updates) => {
  update(ref(database, path), updates)
    .then(() => {
    })
    .catch((error) => {
      console.error('Error updating fields:', error);
    });
};

export const updateUserData = async (path, userId, newData) => {
  try {
    // Reference to the user's data
    const userRef = ref(database, `${path}/${userId}`);

    // Update the user's profile with new data
    await update(userRef, newData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    alert('error')
  }
};

