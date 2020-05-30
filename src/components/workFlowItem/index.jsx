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

    return (
        <StyledBadge 
        invisible={this.state.shouldNotDisplayDelete}
        onMouseEnter={() => this.setState({shouldNotDisplayDelete:false})}
        onMouseLeave={() => this.setState({shouldNotDisplayDelete:true})}
        className={classes.root} badgeContent={<Delete clickHandler={deleteClickHandler(item)}/>} color="secondary">
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
        </StyledBadge>
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
