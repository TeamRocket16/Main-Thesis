import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Swal from 'sweetalert2';
//-------------private route -------------//
import { Route, Redirect } from 'react-router-dom';

const authintication = {
  isUserLoggedIn: false,
  isBusinessLoggedIn: false,
  onUserAuthintication() {
    this.isUserLoggedIn = true;
  },
  onBusinessAuthintication() {
    this.isBusinessLoggedIn = true;
  },
  getLoginStatus() {
    return this.isLoggedIn;
  },
};
//--------------------- private route --------------//

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://material-ui.com/'>
        Side Menu
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    backgroundColor: 'white',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#f64f0f',
    color: 'white',
    height: '48px',
    // margin: ' -1px 0px 16px',
  },
  input12: {
    backgroundColor: '#ff0018',
  },
}));

function SignIn(props) {
  // const history = useHistory();
  localStorage.setItem('isLoggedIn', false);
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let handleChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };

  var checkPassword = (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    axios
      .post('/login', {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.confirmed) {
          var token = response.data.token;
          var decoded = jwtDecode(token);
          navigator.geolocation.getCurrentPosition((position) => {
            localStorage.setItem('poslatitude', position.coords.latitude);
            localStorage.setItem('poslongitude', position.coords.longitude);
          });
          console.log(
            localStorage.getItem('poslatitude'),
            localStorage.getItem('poslongitude')
          );
          //--------- private route ------------//
          // authintication.onAuthintication();
          //-------------private route ----------//
          if (decoded.userId) {
            localStorage.setItem('tokenIdBusiness', decoded.userId);
            authintication.onUserAuthintication();
            localStorage.setItem('isUserLoggedIn', true);
            // props.history.push('/user');
            localStorage.setItem('isUserLoggedInHome', 'user');
            window.location.href = '/userpage';
          } else if (decoded.idBusiness) {
            localStorage.setItem('tokenIdBusiness', decoded.idBusiness);
            authintication.onBusinessAuthintication();
            localStorage.setItem('isBusinessLoggedIn', true);
            localStorage.setItem('isBusinessLoggedInnHome', 'Business');
            window.location.href = '/res';
            // props.history.push('/res');
          }
        } else {
          Swal.fire('Please confirm your Email before you can sign in !');
        }
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Incorrect password or Email !!',
        });
      });
  };

  return (
    <div>
      <Container component='main' maxWidth='xs'>
        <div className={classes.paper}>
          <form className={classes.form} noValidate>
            <TextField
              className={classes.input1}
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              onChange={(e) => handleChange(e)}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              onChange={(e) => handleChange(e)}
            />
            <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              id='btn'
              className={classes.submit}
              onClick={(e) => checkPassword(e)}
              href='/menu'
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href='#' variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href='#' variant='body2'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
}

const UserPrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem('isUserLoggedIn') === 'true' ? (
        <Component {...props} />
      ) : (
          <Redirect to='/sign-in' />
        )
    }
  />
);
const BusinessPrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem('isBusinessLoggedIn') === 'true' ? (
        <Component {...props} />
      ) : (
          <Redirect to='/sign-in' />
        )
    }
  />
);
export { authintication, SignIn, BusinessPrivateRoute, UserPrivateRoute };
