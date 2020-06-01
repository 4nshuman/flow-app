import React from 'react';
import { 
  withStyles,
  TextField,
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Badge,
  Snackbar,
  IconButton
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import {connect} from 'react-redux';
import {userLoggedIn} from '../../redux/actions';
import Delete from './deleteButton';

const styles = {
    root:{
        padding: '5px',
        minWidth: 275,
        maxWidth: 400,
        marginLeft: '5%',
        marginTop: '5%',
        position: 'relative'
    },
    bottomText:{
        justifyContent: 'center'
    },
    statusIconPending:{
      color: '#bcbcbc'
    },
    statusIconComplete:{
      color: '#17ba51'
    }
};

const StyledBadge = withStyles((theme) => ({
    badge: {
      width: '50px',
      height: '50px',
      borderRadius: '50px',
    },
  }))(Badge);

class WorkFlowItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      item: this.props.item,
      shouldNotDisplayDelete: true
    }
  }

  handleFilter = () =>{
      console.log('handle Filter')
  }

  handleChange = (event) => {
    const tmp = this.state.item;
    tmp[event.target.name]= event.target.value;
    this.setState({
      item: tmp
    }, this.props.updateWorkFlow(this.state.item));
  };

  stateHandler = () => {
    const tmpItem = this.state.item;
    if(!tmpItem.nodes){
      this.setState({
        shouldDisplaySnackbar: true,
        notification: 'The workflow is empty and cannot be marked complete.'
      });
      return;
    }
    if(tmpItem.isComplete){
      tmpItem.isComplete = false;
    }else{
      let allowedToComplete = true;
      tmpItem.nodes.forEach((node)=>{
        if(!node.isComplete){
          allowedToComplete = false;
          this.setState({
            shouldDisplaySnackbar: true,
            notification: 'The workflow has one or more items pending.'
          })
          return;
        }
      })
      tmpItem.isComplete = allowedToComplete;
    }
    this.setState({
      item: tmpItem
    }, this.props.updateWorkFlow(this.state.item));
  }

  handleClose = () => {
    this.setState({
      shouldDisplaySnackbar: false
    })
  }

  render(){
    const {
      classes,
      item,
      deleteClickHandler,
      itemClickHandler
    } = this.props;

    return (
      <React.Fragment>
        <StyledBadge 
        invisible={this.state.shouldNotDisplayDelete}
        onMouseEnter={() => this.setState({shouldNotDisplayDelete:false})}
        onMouseLeave={() => this.setState({shouldNotDisplayDelete:true})}
        className={classes.root} badgeContent={<Delete clickHandler={deleteClickHandler(item.id)}/>} color="secondary">
        <Box boxShadow={3}>
            <Card variant="outlined" onClick={itemClickHandler}>
                <CardContent>
                <TextField onChange={this.handleChange} name="name" id="outlined-basic" variant="outlined" label="Workflow Name" value={item.name} type="text" />
                </CardContent>
                <CardActions className={classes.bottomText}>
                    <Typography
                      style={{marginLeft: '10%', marginRight:'auto'}}
                      className={classes.title} variant='h6' component="h2" color="textSecondary" gutterBottom>
                        {item.isComplete ? 'Completed' : 'Pending'}
                    </Typography>
                    <div onClick={this.stateHandler}>
                    <CheckCircleIcon
                      style={{width: '50px', height: '50px', position: 'absolute', right: '10%', bottom: '10%'}}
                      className={item.isComplete ? classes.statusIconComplete : classes.statusIconPending} />
                    </div>
                </CardActions>
            </Card>
        </Box>
        </StyledBadge>
        <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.state.shouldDisplaySnackbar}
        autoHideDuration={5000}
        onClose={this.handleClose}
        message={this.state.notification}
        action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
        }
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(WorkFlowItem));
