import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import './myAppBar.css';

import {base} from '../../base';
import {connect} from 'react-redux';
import {userLoggedOut} from '../../redux/actions';

class MyAppBar extends React.Component{
    constructor(props){
        super(props);
    }

    handleLogOutRequest = () => {
        base.auth().signOut();
        this.props.userLoggedOut();
    }

    render(){
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