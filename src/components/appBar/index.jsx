import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import './myAppBar.css';

class MyAppBar extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        console.log('captured user : ', this.props.user);
        return(
            <AppBar position="static" style={{background:"#a901b0"}}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <GroupWorkIcon />
                    </IconButton>
                    <Typography variant="h6">
                        FLOW APP
                    </Typography>
                    <div className="login-button">
                    <Button variant="outlined" onClick={()=>{alert('test')}} color="inherit">Login</Button>
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

export default MyAppBar;