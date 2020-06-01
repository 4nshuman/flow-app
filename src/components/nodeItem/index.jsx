import React from 'react';
import {
  withStyles,
  TextField,
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Badge
} from '@material-ui/core';

import {connect} from 'react-redux';
import {userLoggedIn} from '../../redux/actions';
import Status from './statusButton';

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

class NodeItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      item: this.props.item,
    }
  }

  handleChange = (event) => {
    const tmp = this.state.item;
    tmp[event.target.name] = event.target.value;
    this.setState({ 
      item: tmp
    });
  };

  static getDerivedStateFromProps(props, state){
    return {
      item: props.item
    };
  }

  render(){
    const {
      classes,
      stateHandler,
    } = this.props;
    const item = this.state.item;

    const statusColor = item.isComplete ? "#17ba51" : item.inProgress ? "#3d86f9" : "#bcbcbc"
    
    return (
        <Badge 
        style={{color: statusColor}}
        className={classes.root} badgeContent={<Status clickHandler={stateHandler(item)}/>}>
        <Box boxShadow={3}>
            <Card variant="outlined">
                <CardContent>
                <TextField name="taskName" id="outlined-basic" variant="outlined" label="Task Name" value={item.taskName} type="text" onChange={this.handleChange}/>
                </CardContent>
                <CardActions className={classes.bottomText}>
                    <Typography className={classes.title} variant='h6' component="h2" color="textSecondary" gutterBottom>
                    <TextField 
                    multiline={true} rows={10}
                    name="description" id="outlined-basic" variant="outlined" label="Task description" type="text" value={item.description} onChange={this.handleChange}/>
                    </Typography>
                </CardActions>
            </Card>
        </Box>
        </Badge>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NodeItem));
