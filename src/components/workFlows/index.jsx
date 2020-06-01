import React from 'react';
import { 
  withStyles,
  AppBar,
  Toolbar,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  IconButton
} from '@material-ui/core';
import {
  DropdownButton,
  Dropdown
} from 'react-bootstrap'
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import CloseIcon from '@material-ui/icons/Close';

import {connect} from 'react-redux';
import WorkFlowItem from '../workFlowItem';
import {base} from '../../base';
import {
  userLoggedIn,
  workFlowsLoaded,
  workFlowAdded,
  workFlowEdited,
  workFlowDeleted,
} from '../../redux/actions';

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
      isFiltering: false,
      workFlows: []
    };
    this.firestoreGetter = base.database().ref(`workFlows/${this.props.currentUser.uID}`);
  }

  componentDidMount(){
    if(!this.state.dataLoaded){
      this.firestoreGetter.on("value", this.setData, this.setError);
    }
  }

  setData = (snapshot) => {
    const temp = [];
    snapshot.forEach((snap) => {
        if(snap.val().owner === this.props.currentUser.uID){
          temp.push(snap.val());
        }
    });
    
    this.props.workFlowsLoaded(temp);
    this.setState({
      dataLoaded: true
    });
  }

  setError = (errorObject) => {
    console.log("The read failed: " + errorObject.code);
  }

  displaySnackBar(notification){
    this.setState({
      shouldDisplaySnackbar: true,
      notification
    });
  }

  addWorkFlow = () =>{
    const id = Date.now();
    const newWorkFlowItem = {
      id: id,
      owner: this.props.currentUser.uID,
      name: `New WorkFlow`,
      isComplete: false,
      nodes: []
    };
    this.props.workFlowAdded(newWorkFlowItem);
    base.database()
    .ref(`workFlows/${this.props.currentUser.uID}/${id}`)
    .set(newWorkFlowItem);
    this.displaySnackBar('New workflow has been added.');
  }

  static getDerivedStateFromProps(props, state){
    if(!state.isFiltering){
      return{
        workFlows: props.workFlows
      };
    }
  }

  navigateToNodes = (event, id) => {
    if(event.target.tagName!=='svg' && event.target.tagName!=='path' && event.target.tagName!=='INPUT'){
      window.location = `/workflow/${id}`;
    }
  }

  deleteClickHandler = (workFlowItemId) => () => {
    this.props.workFlowDeleted(workFlowItemId);
    base.database()
    .ref(`workFlows/${this.props.currentUser.uID}/${workFlowItemId}`)
    .remove();
    this.displaySnackBar(`The ${workFlowItemId} workflow has been deleted.`);
  }

  updateWorkFlow = (item) => () => {
    this.props.workFlowEdited(item);
    base.database()
      .ref(`workFlows/${this.props.currentUser.uID}/${item.id}`)
      .set(item);
  }

  filter = (event) =>{
    if(event.target.name === 'searchTerm'){
      if(event.target.value === ''){
        this.setState({
          isFiltering: false
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
          workFlows: filteredList,
          isFiltering: true
        });
      }
    }else{
      const filteredList = [];
      let isFiltering = true;
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
          isFiltering= false;
          break;
      }
      this.setState({
        workFlows: filteredList,
        isFiltering
      });
    }
  }

  handleClose = () => {
    this.setState({
      shouldDisplaySnackbar: false
    })
  }

  render(){
    const {classes} = this.props;
    return (
        <React.Fragment>
        <AppBar position="static" style={{background:"white"}}>
            <Toolbar>
                <TextField className={classes.filterFields} id="outlined-basic" variant="outlined" label="Search Workflows" type="text" name="searchTerm" onChange={this.filter} />
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
                <hr/><h3>No Workflows Present.</h3><hr/>
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
      currentUser: state.currentUser,
      workFlows: state.workFlows
  }
};

const mapDispatchToProps = dispatch => {
  return {
      userLoggedIn: (user) => {dispatch(userLoggedIn(user))},
      workFlowsLoaded: (workFlowsList) => {dispatch(workFlowsLoaded(workFlowsList))},
      workFlowAdded: (workFlow) => {dispatch(workFlowAdded(workFlow))},
      workFlowEdited: (workFlow) => {dispatch(workFlowEdited(workFlow))},
      workFlowDeleted: (workFlowItemId) => {dispatch(workFlowDeleted(workFlowItemId))}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(WorkFlow));
