import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import firebase from 'firebase';
import {base} from '../../base';
import {connect} from 'react-redux';
import {userLoggedIn} from '../../redux/actions';

import LoginForm from './loginForm';
import SignUpForm from './signUpForm';
import WorkFlow from '../workFlows';

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
    fontSize: 20,
  },
  bottomText: {
    justifyContent: 'center'
  },
  loader:{
    marginTop: '5%'
  }
};

class Entry extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isSignUpForm: false,
      bottomText: "Don't have an account ? Sign up here.",
      currentUser:{},
      authLoaded: false
    }
  }
  
  componentDidMount(){
    this.authListener();
  }

  authListener = () => {
    base.auth().onAuthStateChanged((user)=>{
      if(user){
        this.setState({
          currentUser: user, authLoaded: true
        }, this.props.userLoggedIn(user))
      }
      else{
        this.setState({currentUser: null, authLoaded: true})
      }
    });
  }

  changeFormType = () => {
      this.setState({isSignUpForm: !this.state.isSignUpForm});
      this.state.isSignUpForm
       ? this.setState({setBottomText: "Don't have an account ? Sign up here."})
       : this.setState({setBottomText: "Existing user? Log in here."});
  }

  signUp = (data) => {
    base.auth().createUserWithEmailAndPassword(data.email, data.password).then((user)=>{
      console.log(user);
    }).catch((error)=>{
      console.log(error);
    })
  }

  logIn = (data) => {
    this.setState({authLoaded: false})
    let persistence = firebase.auth.Auth.Persistence.SESSION
    if(data.remember){
      persistence = firebase.auth.Auth.Persistence.LOCAL
    }
    base.auth().setPersistence(persistence)
    .then(
      base.auth().signInWithEmailAndPassword(data.email, data.password).then((u)=>{
        this.setState({currentUser: u});
      }).catch((error)=>{
        this.setState({authLoaded: true, logInError: error.message});
      })
    );
  }

  render(){
    const {classes} = this.props;
    return (
      <React.Fragment>
        { this.state.authLoaded ?
        (<div>
          {!!this.props.currentUser ? <WorkFlow/> : 
        <Box className={classes.root} boxShadow={3}>
        <Card variant="outlined">
          <CardContent>
            <Typography className={classes.title} variant='h6' component="h2" color="textSecondary" gutterBottom>
              {this.state.isSignUpForm ? 'Sign Up' : 'Login'}
            </Typography>
            {this.state.isSignUpForm ? <SignUpForm signUp={this.signUp}/> : <LoginForm logIn={this.logIn} error={this.state.logInError}/>}
          </CardContent>
          <CardActions className={classes.bottomText}>
            <Link href="#" onClick={this.changeFormType}>
                {this.state.bottomText}
            </Link>
          </CardActions>
        </Card>
        </Box>
        }
        </div>)
        :
        (<div className={classes.loader}>
              <h1>Please Wait...</h1><br/>
              <CircularProgress />
          </div>)
        }
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => {
  return {
      currentUser: state.currentUser
  }
};

const mapDispatchToProps = dispatch => {
  return {
      userLoggedIn: (user) => {dispatch(userLoggedIn(user))}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Entry));
