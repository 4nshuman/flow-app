import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton
} from '@material-ui/core';
import GroupWorkIcon from '@material-ui/icons/GroupWork';

import './myAppBar.css';
import {base} from '../../base';
import {connect} from 'react-redux';
import {userLoggedOut} from '../../redux/actions';

class MyAppBar extends React.Component{
    handleLogOutRequest = () => {
        base.auth().signOut();
        this.props.userLoggedOut();
    }

    render(){
        return(
            <AppBar position="static" style={{background:"#a901b0"}}>
                <Toolbar>
                    <Typography variant="h6" onClick={() => {window.location='/'}} >
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <GroupWorkIcon />
                        </IconButton>
                        FLOW APP
                    </Typography>
                    <div className="login-button">
                    {
                        window.location.pathname.includes('/workflow/') &&
                        (<Button style={{marginRight: '15px'}} variant="contained" onClick={() => {window.location='/'}} >Home</Button>)
                    }
                    {
                        !!this.props.currentUser &&
                        (<Button variant="contained" onClick={this.handleLogOutRequest} >Log Out</Button>)
                    }
                    </div>
                </Toolbar>
            </AppBar>
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
        userLoggedOut: () => {dispatch(userLoggedOut())}
    }
  };

export default connect(mapStateToProps, mapDispatchToProps)(MyAppBar);