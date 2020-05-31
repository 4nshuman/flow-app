import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
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
    },
    loader:{
      marginTop: '5%'
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
    const workFlowList = this.props.workFlows.filter((workFlow) => (
      workFlow.id !== workFlowItem.id
    ));
    this.setState({
      workFlows: workFlowList
    }, this.props.workFlowsAdded(workFlowList));
    base.database()
    .ref(`workFlows/${this.props.currentUser.uID}/${workFlowItem.id}`)
    .remove();
  }

  updateWorkFlow = (item) => () => {
    const newWorkflowList = this.props.workFlows.map((workFlow) => {
      if(item.id === workFlow.id){
          return item;
      }
      else{
          return workFlow;
      }
    })
    this.setState({
      workFlows: newWorkflowList
    }, this.props.workFlowsAdded(newWorkflowList));
    newWorkflowList.forEach((workFlow) => {
      base.database()
      .ref(`workFlows/${this.props.currentUser.uID}/${workFlow.id}`)
      .set(workFlow);
    })
  }

  filter = (event) =>{
    if(event.target.name === 'searchTerm'){
      if(event.target.value === ''){
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
    }else{
      const filteredList = [];
      switch(event.target.name){
        case 'completed':
          this.props.workFlows.forEach((workFlow) => {
            console.log('test')
            if(workFlow.isComplete){
              filteredList.push(workFlow);
            }
          });
          break;
        case 'pending':
          this.props.workFlows.forEach((workFlow) => {
            if(!workFlow.isComplete){
              filteredList.push(workFlow);
            }
          });
          break;
        default:
          this.props.workFlows.forEach((workFlow) => {
            filteredList.push(workFlow);
          });
          break;
      }
      this.setState({
        workFlows: filteredList
      });
    }
  }

  render(){
    const {classes} = this.props;
    return (
        <React.Fragment>
        <AppBar position="static" style={{background:"white"}}>
            <Toolbar>
                <TextField className={classes.filterFields} required id="outlined-basic" variant="outlined" label="Search Workflows" type="email" name="searchTerm" onChange={this.filter} />
                <DropdownButton style={{marginLeft: '3%'}} id="dropdown-basic-button" title="Filter">
                  <Dropdown.Item name='all' value="all" onClick={this.filter}>All</Dropdown.Item>
                  <Dropdown.Item name='completed' value="completed" onClick={this.filter}>Completed</Dropdown.Item>
                  <Dropdown.Item name='pending' value="pending" onClick={this.filter}>Pending</Dropdown.Item>
                </DropdownButton>
                <Button onClick={this.addWorkFlow} className={classes.addButton} type='submit' variant="contained">
                    <AddCircleOutlineRoundedIcon style={{marginRight: '5px'}} />
                    Add Workflow
                </Button>
            </Toolbar>
        </AppBar>
        <div>
          {
            this.state.dataLoaded ? 
            ( (this.state.workFlows.length>0) ?
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
              <div className={classes.loader}>
                <hr/><h3>No Workflows Present. Add some workflows.</h3><hr/>
              </div>
            )
            :
            (
              <div className={classes.loader}>
                <h1>Loading WorkFlows...</h1><br/>
                <CircularProgress />
              </div>
            )
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
