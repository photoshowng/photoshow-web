import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../Firebase'; // Your Firebase database instance

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photographers, setPhotographers] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const dataRef = ref(database, `Users/${userId}`);
    
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const fetchedData = snapshot.val();
      setData(fetchedData);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const photographersRef = ref(database, `Photographers/`);
    
    const unsubscribe = onValue(photographersRef, (snapshot) => {
      const fetchedData = snapshot.val();
      if (fetchedData) {
        setPhotographers(Object.values(fetchedData));
      } else {
        setPhotographers([]); // Set to empty array if no data found
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
  }, [data, photographers, loading]);


  return (
    <DataContext.Provider value={{ data, loading, photographers, error, setError, success, setSuccess }}>
      {children}
    </DataContext.Provider>
  );
};
