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

export default function LoginForm() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    remember: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <form className={classes.root} autoComplete="off">
      <TextField id="standard-basic" label="Email Id" type="email" />
      <TextField id="standard-basic" label="Password" type="password" />
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
