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
import WorkFlowItem from '../workFlowItem';
import {base} from '../../base';

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
      dataLoaded: false,
      shouldNotDisplayDelete: true,
      workFlows: []
    };
    this.firestore = base.database().ref('workFlows');
  }

  componentDidMount(){
    this.firestore.on("value", this.setData, this.setError);
  }

  setData = (snapshot) => {
    const temp = [];
    snapshot.forEach((snap) => {
        if(snap.val().owner === this.props.currentUser.uID){
          console.log('test');
          temp.push(snap.val());
        }
    });
    this.setState({
      workFlows: temp,
      dataLoaded: true
    });   
  }

  setError = (errorObject) => {
    console.log("The read failed: " + errorObject.code);
  }

  handleFilter = () =>{
      console.log('handle Filter')
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value });
  };

  addWorkFlow = () =>{
    const workFlows = this.state.workflows;
    const id = workFlows.length+1;
    this.setState({
      workFlows: workFlows.push(
        {
          id: id,
          owner: this.props.currentUser.uID,
          name: `New WorkFlow : ${id}`,
          isComplete: false,
          nodes: []
        }
      )
    });
    //const workflowRef = this.firestore.push();
    this.firestore.set(this.state.workflows)
  }

  navigateToNodes = (event, id) => {
    if(event.target.tagName!='svg' && event.target.tagName!='path' && event.target.tagName!='INPUT'){
      window.open(`/workflow/${id}`);
    }
  }

  render(){
    console.log(this.state)
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
                <Button onClick={this.addWorkFlow} className={classes.addButton} type='submit' variant="contained">
                    <AddCircleOutlineRoundedIcon style={{marginRight: '5px'}} />
                    Add Workflow
                </Button>
            </Toolbar>
        </AppBar>
        <div>
          {
            this.state.dataLoaded ?
            this.state.workFlows.map((workflow) => (
              <WorkFlowItem
                deleteClickHandler={() => alert('workflow was to be deleted')}
                itemClickHandler={(e) => this.navigateToNodes(e, workflow.id)}
                stateClickHandler={(e) => console.log(e.target.tagName)}
                key = {workflow.id}
                item = {workflow}
              />
            ))
            :
            <div>Loading...</div>
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
