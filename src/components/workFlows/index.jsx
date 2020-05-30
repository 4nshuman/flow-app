import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';

import {connect} from 'react-redux';
import {userLoggedIn} from '../../redux/currentUser/actions';
import WorkFlowItem from '../workFlowItems';

const styles = {
    root:{
        minWidth: 275,
        maxWidth: 400,
        left: '5%',
        marginTop: '5%',
        position: 'absolute'
    },
    addButton: {
        position: 'absolute',
        right: '5%',
        background: "#17ba51",
        color: 'white'
    },
    filterFields: {
        marginLeft: '5%'
    },
    bottomText:{
        justifyContent: 'center'
    }
};

class WorkFlow extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isSignUpForm: false,
      bottomText: "Don't have an account ? Sign up here.",
      workflows:[
        {
          id: 1,
          name: 'WorkFlow 1',
          isComplete: false,
          nodes: [
            {
              nodeId: 1,
              taskName: 'Task1',
              description: 'some description is here',
              isComplete: false,
              inProgress: true
            },
            {
              nodeId: 2,
              taskName: 'Task2',
              description: 'some description is here',
              isComplete: true,
              inProgress: false
            },
            {
              nodeId: 3,
              taskName: 'Task3',
              description: 'some description is here',
              isComplete: false,
              inProgress: false
            }
          ]
        },
        {
          id: 2,
          name: 'WorkFlow 2',
          isComplete: true,
          nodes: [
            {
              nodeId: 1,
              taskName: 'Task1',
              description: 'some description is here',
              isComplete: true,
              inProgress: false
            },
            {
              nodeId: 2,
              taskName: 'Task2',
              description: 'some description is here',
              isComplete: true,
              inProgress: false
            },
            {
              nodeId: 3,
              taskName: 'Task3',
              description: 'some description is here',
              isComplete: true,
              inProgress: false
            }
          ]
        }
      ],
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
    const {classes} = this.props;
    return (
        <React.Fragment>
        <AppBar position="static" style={{background:"white"}}>
            <Toolbar>
                <TextField className={classes.filterFields} required id="outlined-basic" variant="outlined" label="Search Workflows" type="email" name='email' onChange={this.handleChange} />
                <Button style={{marginLeft: '25px'}} type='submit' variant="contained" color="primary">
                    <FilterListRoundedIcon style={{marginRight: '5px'}} />
                    Filter
                </Button>
                <Button className={classes.addButton} type='submit' variant="contained">
                    <AddCircleOutlineRoundedIcon style={{marginRight: '5px'}} />
                    Add Workflow
                </Button>
            </Toolbar>
        </AppBar>
        <div>
          {
            this.state.workflows.map((workflow) => (
              <WorkFlowItem
                deleteClickHandler={() => alert('workflow was to be deleted')}
                itemClickHandler={(e) => console.log(e.target.tagName)}
                stateClickHandler={(e) => console.log(e.target.tagName)}
                key = {workflow.id}
                item = {workflow}
              />
            ))
          }
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(WorkFlow));
