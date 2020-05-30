import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import {base} from '../../base';

import LoginForm from './loginForm'
import SignUpForm from './signUpForm'

const styles = {
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
};

class Entry extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isSignUpForm: false,
      bottomText: "Don't have an account ? Sign up here.",
      users:{}
    }
  }

  componentWillMount(){
    this.usersRef = base.syncState('users',{
      context: this,
      state: 'users'
    });
  }

  componentWillUnmount(){
    base.removeBinding(this.usersRef);
  }

  changeFormType = () => {
      this.setState({isSignUpForm: !this.state.isSignUpForm});
      this.state.isSignUpForm
       ? this.setState({setBottomText: "Don't have an account ? Sign up here."})
       : this.setState({setBottomText: "Existing user? Log in here."});
  }

  signUp = (data) => {
    this.setState(
      {users: data}
    );
  }

  render(){
    const {classes} = this.props;
    return (
      <Box className={classes.root} boxShadow={3}>
      <Card variant="outlined">
        <CardContent>
          <Typography className={classes.title} variant='h6' component="h2" color="textSecondary" gutterBottom>
            {this.state.isSignUpForm ? 'Sign Up' : 'Login'}
          </Typography>
          {this.state.isSignUpForm ? <SignUpForm signUp={this.signUp}/> : <LoginForm/>}
        </CardContent>
        <CardActions className={classes.bottomText}>
          <Link href="#" onClick={this.changeFormType}>
              {this.state.bottomText}
          </Link>
        </CardActions>
      </Card>
      </Box>
    );
  }
}

export default withStyles(styles)(Entry);
