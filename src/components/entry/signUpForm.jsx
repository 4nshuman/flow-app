import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '35ch',
    },
  },
  button: {
    marginTop: '15px',
  },
  title: {
    fontSize: 16,
    color: 'red',
    fontWeight: "bold",
    justifyContent: 'center'
  }
}));

export default function SignUpForm(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
      fName:'',
      lName:'',
      email:'',
      password:'',
      cPassword:'',
      passwordMissmatch: false,
  });

  

  const handleChange = (event) => {
      setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.signUp(state);
  }

  return (
    <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
        <TextField required id="standard-basic" label="First name" type="text" name="fName" onChange={handleChange} />
        <TextField required id="standard-basic" label="Last name" type="text" name="lName" onChange={handleChange} />
        <TextField required id="standard-basic" label="Email Id" type="email" name="email" onChange={handleChange} />
        <TextField required id="standard-basic" label="Password" type="password" name="password" onChange={handleChange} />
        <TextField required id="standard-basic" label="Confirm Password" type="password" name="cPassword" onChange={handleChange} />
        <Typography className={classes.title} variant='h1'>
          {
            state.cPassword!=='' &&
            (state.password !== state.cPassword ? 'Password missmatch' : '')
          }
        </Typography>
        <Button disabled={state.password !== state.cPassword} type='submit' variant="contained" color="primary" className={classes.button}>
            Sign Up
        </Button>
    </form>
  );
}
