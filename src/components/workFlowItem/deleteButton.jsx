import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '50px',
    height: '50px',
    borderRadius: '50px'
  },
  delIcon:{
      marginTop: '30%'
  }
}));

export default function Delete(props){
    const classes = useStyles();
    return (
        <div className={classes.root} onClick = {props.clickHandler}>
        <DeleteIcon className={classes.delIcon} />
        </div>
    )
}