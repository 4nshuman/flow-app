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
      return;
    }
    if(tmpItem.isComplete){
      tmpItem.isComplete = false;
    }else{
      let allowedToComplete = true;
      tmpItem.nodes.forEach((node)=>{
        if(!node.isComplete){
          allowedToComplete = false;
          return;
        }
      })
      tmpItem.isComplete = allowedToComplete;
    }
    this.setState({
      item: tmpItem
    }, this.props.updateWorkFlow(this.state.item));
  }

  render(){
    const {
      classes,
      item,
      deleteClickHandler,
      itemClickHandler
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
