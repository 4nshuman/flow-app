import React from 'react';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '50px',
    height: '50px',
    borderRadius: '50px'
  },
  statusIcon:{
    width: '50px',
    height: '50px',
    marginTop: '30%'
  }
}));

export default function Status(props){
    const classes = useStyles();

    return (
        <div className={classes.root} onClick = {props.clickHandler}>
        <CheckCircleRoundedIcon className={classes.statusIcon} />
        </div>
    )
}