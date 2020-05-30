import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';

import {connect} from 'react-redux';
import {userLoggedIn, workFlowsAdded} from '../../redux/actions';
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
    this.firestoreGetter = base.database().ref(`workFlows/${this.props.currentUser.uID}`);
  }

  componentDidMount(){
    this.firestoreGetter.on("value", this.setData, this.setError);
  }

  setData = (snapshot) => {
    const temp = [];
    snapshot.forEach((snap) => {
        if(snap.val().owner === this.props.currentUser.uID){
          temp.push(snap.val());
        }
    });
    this.setState({
      workFlows: temp,
      dataLoaded: true
    }, this.props.workFlowsAdded(temp));   
  }

  setError = (errorObject) => {
    console.log("The read failed: " + errorObject.code);
  }

  handleFilterChange = (event) =>{
    if(event.target.value==''){
      this.setState({
        workFlows: this.props.workFlows
      })
    }
    else{
      const filteredList = [];
      this.props.workFlows.forEach((workFlow) => {
        if(workFlow.name.toLowerCase().includes(event.target.value.toLowerCase())){
          filteredList.push(workFlow);
        }
      });
      this.setState({
        workFlows: filteredList
      });
    }
  }

  addWorkFlow = () =>{
    const workFlows = this.state.workFlows;
    const id = Date.now();
    const newWorkFlow = {
      id: id,
      owner: this.props.currentUser.uID,
      name: `New WorkFlow`,
      isComplete: false,
      nodes: []
    };
    workFlows.push(newWorkFlow);
    this.setState({
      workFlows: workFlows
    });
    base.database()
    .ref(`workFlows/${this.props.currentUser.uID}/${id}`)
    .set(newWorkFlow)
  }

  navigateToNodes = (event, id) => {
    if(event.target.tagName!=='svg' && event.target.tagName!=='path' && event.target.tagName!=='INPUT'){
      window.location = `/workflow/${id}`;
    }
  }

  deleteClickHandler = (workFlowItem) => () => {
    const workFlowList = this.state.workFlows.filter((workFlow) => {
      if(workFlow.id !== workFlowItem.id){
          return true;
      }
    })
    this.setState({
      workFlows: workFlowList
    });
    base.database()
      .ref(`workFlows/${this.props.currentUser.uID}`)
      .set(workFlowList);
  }

  updateWorkFlow = (item) => () => {
    const newWorkflowList = this.state.workFlows.map((workFlow) => {
      if(item.id === workFlow.id){
          return item;
      }
      else{
          return workFlow;
      }
    })
    this.setState({
      workFlows: newWorkflowList
    });
    newWorkflowList.forEach((workFlow) => {
      base.database()
      .ref(`workFlows/${this.props.currentUser.uID}/${workFlow.id}`)
      .set(workFlow);
    })
  }

  render(){
    const {classes} = this.props;
    return (
        <React.Fragment>
        <AppBar position="static" style={{background:"white"}}>
            <Toolbar>
                <TextField className={classes.filterFields} required id="outlined-basic" variant="outlined" label="Search Workflows" type="email" name='searchTerm' onChange={this.handleFilterChange} />
                <Button  style={{marginLeft: '25px'}} type='submit' variant="contained" color="primary" >
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
                deleteClickHandler={this.deleteClickHandler}
                updateWorkFlow={this.updateWorkFlow}
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
      currentUser: state.currentUser,
      workFlows: state.workFlows
  }
};

const mapDispatchToProps = dispatch => {
  return {
      userLoggedIn: (user) => {dispatch(userLoggedIn(user))},
      workFlowsAdded: (workFlows) => {dispatch(workFlowsAdded(workFlows))}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(WorkFlow));
