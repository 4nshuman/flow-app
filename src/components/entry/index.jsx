import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

import LoginForm from './loginForm'
import SignUpForm from './signUpForm'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 400,
    margin: 'auto',
    marginTop: 20
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 16,
  },
  bottomText: {
    justifyContent: 'center'
  },
});

export default function Entry() {
  const classes = useStyles();
  const [isSignUpForm, setIsSignUpForm] = useState(false);
  const [bottomText, setBottomText] = useState("Don't have an account ? Sign up here.");

  const changeFormType = () => {
      setIsSignUpForm(!isSignUpForm);
      isSignUpForm
       ? setBottomText("Don't have an account ? Sign up here.")
       : setBottomText('Existing user? Log in here.');
  }

  return (
    <Box className={classes.root} boxShadow={3}>
    <Card variant="outlined">
      <CardContent>
        <Typography className={classes.title} variant='h6' component="h2" color="textSecondary" gutterBottom>
          {isSignUpForm ? 'Sign Up' : 'Login'}
        </Typography>
        {isSignUpForm ? <SignUpForm/> : <LoginForm/>}
      </CardContent>
      <CardActions className={classes.bottomText}>
        <Link href="#" onClick={changeFormType}>
            {bottomText}
        </Link>
      </CardActions>
    </Card>
    </Box>
  );
}
