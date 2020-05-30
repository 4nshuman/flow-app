import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '35ch',
    },
  },
}));

export default function LoginForm(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    remember: false,
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    if(event.target.name!=='remember'){
      setState({ ...state, [event.target.name]: event.target.value });
    }
    else{
      setState({ ...state, [event.target.name]: event.target.checked });
    }

  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.logIn(state);
  }

  return (
    <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
      <TextField required id="standard-basic" label="Email Id" type="email" name='email' onChange={handleChange} />
      <TextField required id="standard-basic" label="Password" type="password" name='password' onChange={handleChange} />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.remember}
            onChange={handleChange}
            name="remember"
            color="primary"
          />
        }
        label="Remember me"
      />
      <Button type='submit' variant="contained" color="primary">
        Log In
      </Button>
    </form>
  );
}
