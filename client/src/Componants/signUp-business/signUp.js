import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './style.css';
import image from '../Pictures/pic.png';
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '350px',
    },
  },
}));

function SignUp() {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState({});
  const [warning, setWarning] = useState('');
  const [warning2, setWarning2] = useState('');

  let handleChange = (e) => {
    if (e.target.name === 'name') {
      setName(e.target.value);
    } else if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'phone') {
      if (
        e.target.value.length > 7 &&
        e.target.value.length < 14 &&
        e.target.value.length !== 0
      ) {
        setPhone(e.target.value);
        setWarning2('');
      } else if (e.target.value.length !== 0) {
        if (e.target.value.length < 7) {
          setPhone(e.target.value);
          setWarning2('it has to be larger than 7');
        } else {
          setPhone(e.target.value);
          setWarning2('it has to be less than 14');
        }
      } else {
        setPhone(e.target.value);
        setWarning2('');
      }
    } else if (e.target.name === 'type') {
      setType(e.target.value);
    } else if (e.target.name === 'password') {
      if (e.target.value.length < 8 && e.target.value.length !== 0) {
        setPassword(e.target.value);
        setWarning('it has to be greater than 8');
      } else {
        setWarning('');
        setPassword(e.target.value);
      }
    }
    // else if (e.target.name === 'BusinessImage') {
    // //   setBusinessImage(e.target.value);
    // }
  };
  const history = useHistory();

  ///////////////////////////////////////////////////////////

  let handleImageUpload = async (e) => {
    e.preventDefault();

    const { files } = document.querySelector('input[type="file"]');
    const formData = new FormData();
    formData.append('file', files[0]);
    // replace this with your upload preset name
    formData.append('upload_preset', 'ml_default');
    const options = {
      method: 'POST',
      body: formData,
    };
    var imgurl = '';
    let response = await fetch(
      'https://api.Cloudinary.com/v1_1/teamrocket123465/image/upload',
      options
    );

    let json = await response.json();
    imgurl = json.secure_url;

    navigator.geolocation.getCurrentPosition(function (position) {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      axios
        .post('/business/signup', {
          BusinessName: name,
          email: email,
          password: password,
          phone: Number(phone), // static phone number because post request doesnt work
          location: location,
          type: type,
          BusinessImage: imgurl,
        })
        .then((response) => {
          Swal.fire('User created successfully !!');
          Swal.fire('please confirm your email to be able to sign in');
          axios
            .post(`/confirmEmail`, {
              userId: response.data,
              email: email,
            })
            .then(() => {
              console.log('confirmEmail is sent');
            });
          //   alert(response.data);
          localStorage.setItem('singup', 'singup');
          history.push('/sign-in');
        })
        .catch((err) => {
          console.log('err signing in!', err);
        });
    });

    setName('');
    setEmail('');
    setLocation('');
    setPassword('');
    setPhone('');
    setType('');
  };

  return (
    <div className='container1'>
      <div className='in'>
        {location.lat}
        <div className='form'>
          <form
            className={classes.root}
            id='form'
            noValidate
            autoComplete='off'
          >
            <h1>Sign Up</h1>
            <TextField
              id='standard-basic'
              label='Business name'
              type='name'
              name='name'
              value={name}
              onChange={(e) => handleChange(e)}
            />{' '}
            <br></br>
            <TextField
              id='standard-basic'
              label='Business email'
              type='email'
              name='email'
              value={email}
              onChange={(e) => handleChange(e)}
            />
            <br></br>
            <TextField
              id='standard-basic'
              label='Password'
              type='password'
              name='password'
              value={password}
              style={{ marginBottom: '0px' }}
              onChange={(e) => handleChange(e)}
            />
            <h6>{warning}</h6>
            <br></br>
            <TextField
              id='standard-basic'
              label='Business phone'
              type='name'
              name='phone'
              value={phone}
              style={{ marginBottom: '0px', marginTop: '0px' }}
              onChange={(e) => handleChange(e)}
            />
            <h6>{warning2}</h6>
            <br></br>
            <TextField
              id='standard-basic'
              label='type'
              type='name'
              name='type'
              style={{ marginTop: '0px' }}
              value={type}
              onChange={(e) => handleChange(e)}
            />
            <br></br>
            <br />

            <div className='form-group'>
              <input type='file' id='img' style={{ display: 'none' }} />
              <label for='img' className='restaurant1'>Click me to upload image</label>
            </div>

            <br></br>
            <br></br>
            <Button variant='contained' id='btn' onClick={handleImageUpload}>
              Sign Up
            </Button>
          </form>
        </div>
      </div>
      <div className='in'>
        <img src={image} alt='' className='img'></img>
      </div>
    </div>
  );
}

export default SignUp;
