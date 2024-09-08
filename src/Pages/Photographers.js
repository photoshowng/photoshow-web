import { Button, FormControl, Icon, InputLabel, MenuItem, Select, TextField, makeStyles } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import React, { useState, useEffect } from 'react'
import '../Assets/Styles/Photographers.css'
import { useNavigate } from 'react-router-dom';
import { useData } from '../Context/DataContext';
import { updateUserData } from '../DataOperations';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
    backgroundColor: '#3248a8',
    '&:hover': {
      backgroundColor: '#007bff',
    },
  },
}));

// const photographers = [
//   {
//     name: 'John Doe',
//     location: 'New York',
//     programme: 'Wedding',
//     likes: 20,
//     id: 1,
//   },
//   {
//     name: 'Jane Doe',
//     location: 'Los Angeles',
//     programme: 'Sallah',
//     likes: 17,
//     id: 2,
//   },
//   {
//     name: 'Michael Doe',
//     location: 'Chicago',
//     programme: 'Dinner',
//     likes: 25,
//     id: 3,
//   },
//   {
//     name: 'Sarah Doe',
//     location: 'San Francisco',
//     programme: 'Engagement',
//     likes: 2,
//     id: 4,
//   },
//   {
//     name: 'David Doe',
//     location: 'Boston',
//     programme: 'Naming Ceremony',
//     likes: 200,
//     id: 5,
//   },
//   {
//     name: 'Emily Doe',
//     location: 'Seattle',
//     programme: 'Sallah',
//     likes: 10,
//     id: 6,
//   },
//   {
//     name: 'Michael Doe',
//     location: 'New York',
//     programme: 'Dinner',
//     likes: 11,
//     id: 7,
//   },
//   {
//     name: 'Sarah Doe',
//     location: 'Boston',
//     programme: 'Engagement',
//     likes: 34,
//     id: 8,
//   },
// ]

const Photographers = () => {

  const { data, loading, photographers } = useData();

    const classes = useStyles();
    const navigate = useNavigate()
    const [location, setLocation] = useState('');
    const [programme, setProgramme] = useState('allprogrammes');
    const [photographerss, setPhotographerss] = useState([])

    useEffect(() => {
      setPhotographerss(photographers)
    }, [photographers])

  
    const handleChangeEvent = (e) => {
      setProgramme(e.target.value.toLowerCase());
    };

    const handleChangeLocation = (e) => {
      if (e.target.value === '') {
        setPhotographerss(photographers)
      }
      setLocation(e.target.value.toLowerCase())
    }

    const handleSearch = () => {
      if (location !== '') {
        // Filter by location (case-insensitive)
        const filteredPhotographers = photographers.filter((photographer) =>
          photographer.location.toLowerCase() === location.toLowerCase()
        );
        setPhotographerss(filteredPhotographers);
      } else if (programme.toLowerCase() !== 'all programmes') {
        // Filter by programme (case-insensitive)
        const filteredPhotographers = photographers.filter((photographer) =>
          photographer.events?.includes(programme.toLowerCase())
        );

        if (programme.toLowerCase() === 'all programmes') {
          setPhotographerss(photographers);
        } else {
          setPhotographerss(filteredPhotographers);
        }
      } else {
        // Show all photographers if no filters are applied
        setPhotographerss(photographers);
      }
    };
    const likePage = (photographer) => {
      const like = (photographer) => {
        const newUserData = {
          pagesLiked: data.pagesLiked ? [...data.pagesLiked, photographer.id] : [photographer.id]
        }
        const newPhotographerData = {
          likers: photographer.likers ? [...photographer.likers, data.userId] : [data.userId]
        }
        updateUserData("Users", data.userId, newUserData)
        updateUserData("Photographers", photographer.id, newPhotographerData)
      }
      const disLike = (photographer) => {
        const newUserData = {
          pagesLiked: data.pagesLiked?.filter((page) => page!== photographer.id)
        }
        const newPhotographerData = {
          likers: photographer.likers?.filter((user) => user!== data.userId)
        }
        updateUserData("Users", data.userId, newUserData)
        updateUserData("Photographers", photographer.id, newPhotographerData)
      }
       // Check if the page is already liked by the user
      if (data.pagesLiked?.includes(photographer.id)) {
        disLike(photographer);
      } else {
        like(photographer);
      }
    };

    const followPage = (data) => {
      navigate(`/photographers/${data}`)
    }

  return (
    <div className='main'>
      <div className='filter-section'>
        <TextField 
        id="outlined-search" 
        label="Location" 
        type="search" 
        variant="outlined"
        value={location}
        onChange={handleChangeLocation}
        className='text-field'style={{border: "none", borderRadius: "15px", outline: "none"}}/>
        <FormControl variant="filled" className={classes.formControl}
        style={{border: "none", width: '200px', borderRadius: '15px'}}>
          <InputLabel 
          id="demo-simple-select-filled-label"
          >Programmes</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={programme}
            onChange={handleChangeEvent}
          >
            <MenuItem value="allprogrammes">
              <em>All Programmes</em>
            </MenuItem>
            <MenuItem value={'sallah'}>Sallah</MenuItem>
            <MenuItem value={'wedding'}>Wedding</MenuItem>
            <MenuItem value={'naming'}>Naming Ceremony</MenuItem>
            <MenuItem value={'engagement'}>Engagement</MenuItem>
            <MenuItem value={'dinner'}>Dinner</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          Search
      </Button>
      </div>
      <div className='intro'>
        <p>Discover Amazing Photographs And Talented Photographers.</p>
      </div>
      <div className='photographers'>
        <h4>Photographers</h4>
        <div className='photographers-list'>
        {photographerss && photographerss.length > 0 ? (
          photographerss.map((photographer) => {
            return (
              <div key={photographer.id} className='photographer-card'>
                <img src={photographer.image} alt={photographer.userName} />
                <div className='details'>
                  <h5 className='name'>{photographer.userName}</h5>
                  <p className='name-profession'>{photographer.location}</p>
                  <div className="page-actions">
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      endIcon={<ThumbUpIcon />}
                      onClick={() => likePage(photographer)}
                    >
                      Like {photographer.likers ? photographer.likers.length : 0}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      endIcon={<PersonAddIcon />}
                      onClick={() => followPage(photographer.id)}
                    >
                      Follow
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>Loading...</p>
        )}
        </div>
      </div>
    </div>
  )
}

export default Photographers
