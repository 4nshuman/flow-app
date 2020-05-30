import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import {connect} from 'react-redux';
import {userLoggedIn} from '../../redux/currentUser/actions';
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

const StyledBadge = withStyles((theme) => ({
    badge: {
      color: 'green'
    },
  }))(Badge);

class NodeItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isSignUpForm: false,
      bottomText: "Don't have an account ? Sign up here.",
      workFlowName: 'test',
      shouldNotDisplayDelete: true
    }
  }

  handleFilter = () =>{
      console.log('handle Filter')
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value });
  };

  render(){
    const {
      classes,
      item,
      deleteClickHandler,
      itemClickHandler,
      stateClickHandler
    } = this.props;
    const statusColor = item.isComplete ? "#17ba51" : item.inProgress ? "#3d86f9" : "#bcbcbc"

    return (
        <Badge 
        style={{color: statusColor}}
        className={classes.root} badgeContent={<Status clickHandler={deleteClickHandler}/>}>
        <Box boxShadow={3}>
            <Card variant="outlined" onClick={itemClickHandler}>
                <CardContent>
                <TextField id="outlined-basic" variant="outlined" label={item.name} type="text" />
                </CardContent>
                <CardActions className={classes.bottomText}>
                    <Typography className={classes.title} variant='h6' component="h2" color="textSecondary" gutterBottom>
                        {item.isComplete ? 'Completed' : 'Pending'}
                    </Typography>
                    <div onClick={stateClickHandler}>
                    <CheckCircleIcon className={item.isComplete ? classes.statusIconComplete : classes.statusIconPending} />
                    </div>
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