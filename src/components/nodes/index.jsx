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

import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import ShuffleRoundedIcon from '@material-ui/icons/ShuffleRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import CloseIcon from '@material-ui/icons/Close';

import {base} from '../../base';
import {connect} from 'react-redux';
import {
  userLoggedIn,
  userLoggedOut,
  nodeAdded,
  workFlowOpened,
  nodeDeleted
} from '../../redux/actions';
import NodeItem from '../nodeItem';

const styles = {
    root:{
        minWidth: 275,
        maxWidth: 400,
        left: '5%',
        marginTop: '5%',
        position: 'absolute'
    },
    nodeButtonsDiv: {
        position: 'absolute',
        right: '5%',
    },
    button:{
        color: 'white',
        marginRight: '10px'
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

class Nodes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      workFlow: {},
      dataLoaded: false
    };
  }

  componentDidMount(){
    this.authListener().then(()=>{
        base.database()
        .ref(`workFlows/${this.props.currentUser.uID}`)
        .on("value", this.setData, this.setError);
    });
  }

  setData = (snapshot) => {
    let dataLoaded = false;
    snapshot.forEach((snap) => {
        if(snap.val().id === parseInt(this.props.match.params.id)){
          this.props.workFlowOpened({
            id: snap.val().id,
            isComplete: snap.val().isComplete,
            nodes: snap.val().nodes || [],
            name: snap.val().name,
            owner: snap.val().owner
          })
          dataLoaded = true;
        }
    })
    this.setState({
        dataLoaded
    })
  }

  setError = (errorObject) => {
    console.log("The read failed: " + errorObject.code);
  }

  authListener = () => {
      return new Promise((resolve, reject) => {
        base.auth().onAuthStateChanged((user)=>{
            if(user){
              this.props.userLoggedIn(user);
              resolve();
            }
            else{
              this.props.userLoggedOut();
              window.location = '/'
            }
        });
      });
    }

    static getDerivedStateFromProps(props, state){
      if(!state.isFiltering){
        return{
          workFlow: props.openWorkFlow
        };
      }
    }

    displaySnackbar = (notification) => {
      this.setState({
        shouldDisplaySnackbar: true,
        notification
      });
    }

  addNode = () =>{
    const id = Date.now();
    const newNode = {
        nodeId: id,
        isComplete: false,
        inProgress: false,
        taskName: 'New Task',
        description: 'Placeholder multi-line description - should be edited.'
    }
    this.props.nodeAdded(newNode);
    this.displaySnackbar('Node Added Successfully.');
  }

  deleteLatestNode = () => {
    let latestNodeId = -1;
    if((this.state.workFlow.nodes||[]).length < 1){
        this.displaySnackbar('No node present to delete.')
    }
    else{
      this.state.workFlow.nodes.forEach((node) => {
          if(node.nodeId > latestNodeId){
              latestNodeId = node.nodeId
          }
      });
    }
    this.props.nodeDeleted(latestNodeId);
    this.displaySnackbar('The last added node was removed.');
  }

  stateHandler = (nodeItem) => () => {
    let canUpdateNodeStatusToComplete = true;
    this.state.workFlow.nodes.every((node) => {
      if(node.nodeId === nodeItem.nodeId){
        return false;
      }else if(!node.isComplete){
        canUpdateNodeStatusToComplete = node.isComplete;
        return false;
      }
      return true;
    });
    
    const updatedNodesList = [];
    let updateSucceedingNodes = false;
    this.state.workFlow.nodes.forEach((node) => {
      const newNode = {...node}
      if(newNode.nodeId === nodeItem.nodeId){
        if(newNode.isComplete){
          newNode.isComplete = false;
          newNode.inProgress = false;
          updateSucceedingNodes = true;
        }else if(newNode.inProgress){
          newNode.isComplete = canUpdateNodeStatusToComplete;
          newNode.inProgress = false;
          if(!canUpdateNodeStatusToComplete){
            this.setState({
              shouldDisplaySnackbar: true,
              notification: 'This node cannot be set to complete. \n Previous nodes are not completed'
            })
          }
        }else{
          newNode.isComplete = false;
          newNode.inProgress = true;
        }
      }else if(updateSucceedingNodes){
        newNode.isComplete = false;
      }
      updatedNodesList.push(newNode);
    });

    const workflow = this.state.workFlow;
    workflow.nodes = updatedNodesList;
    if(updateSucceedingNodes){
      workflow.isComplete = false;
    }
    this.setState({
      workFlow: workflow
    });
  }

  save = () => {
    base.database()
    .ref(`workFlows/${this.props.currentUser.uID}/${this.props.match.params.id}`)
    .set(this.state.workFlow)
    this.setState({
      shouldDisplaySnackbar: true,
      notification: 'Nodes have been successfully saved.'
    });
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value });
  };

  shuffler = () => {
    const workflow = this.state.workFlow;
    for (let i = workflow.nodes.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [workflow.nodes[i], workflow.nodes[j]] = [workflow.nodes[j], workflow.nodes[i]];
    }
    this.setState({
        workFlow: workflow,
        shouldDisplaySnackbar: true,
        notification: 'Shuffle Successfull !!'
    })
  }

  handleClose = () => {
    this.setState({
      shouldDisplaySnackbar: false
    })
  }

  render(){
    const {classes} = this.props;
    const {
        nodes = [],
        name
    } = this.state.workFlow;
    let shouldAllowShuffle = false;
    if(nodes.length>0) {
      shouldAllowShuffle = true;
      nodes.forEach((node) => {
        if(!node.isComplete){
          shouldAllowShuffle = false;
          return
        }
      })
    }

    return (
        <React.Fragment>
        <AppBar position="static" style={{background:"white"}}>
            <Toolbar>
                <TextField 
                 id="outlined-basic" variant="outlined" label={name} type="text" onChange={this.handleChange} />
                <div className={classes.nodeButtonsDiv}>
                <Button onClick={this.shuffler} disabled={!shouldAllowShuffle || !this.state.dataLoaded} className={classes.button} type='submit' variant="contained" style={{background: '#7600b0'}}>
                    <ShuffleRoundedIcon style={{marginRight: '5px'}} />
                    Shuffle
                </Button>
                <Button onClick={this.deleteLatestNode} disabled={!(nodes.length>0) || !this.state.dataLoaded} className={classes.button} type='submit' variant="contained" style={{background: '#f80929'}}>
                    <DeleteForeverRoundedIcon style={{marginRight: '5px'}} />
                    Delete
                </Button>
                <Button onClick={this.addNode} disabled={!this.state.dataLoaded} className={classes.button} type='submit' variant="contained" style={{background: '#12be51'}}>
                    <AddCircleOutlineRoundedIcon style={{marginRight: '5px'}} />
                    Add Node
                </Button>
                <Button onClick={this.save} disabled={!this.state.dataLoaded} className={classes.button} type='submit' variant="contained" style={{background: '#3c5bd8'}}>
                    <SaveRoundedIcon style={{marginRight: '5px'}} />
                    Save
                </Button>
                </div>
            </Toolbar>
        </AppBar>
        <div>
          {
            this.state.dataLoaded ?
            (
              nodes.length>0 ?
              (
                nodes.map((node) => (
                  <NodeItem
                    stateHandler={this.stateHandler}
                    key = {node.nodeId}
                    item = {node}
                  />
                ))
              )
              :
              ( 
                <div className={classes.loader}>
                    <hr/><h3>No Nodes Present. Add some nodes to the workflow.</h3><hr/>
                </div>
              )
            )
            :
            (
              <div className={classes.loader}>
                  <h1>Loading Nodes...</h1><br/>
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
      openWorkFlow: state.openWorkFlow
  }
};

const mapDispatchToProps = dispatch => {
  return {
      userLoggedIn: (user) => {dispatch(userLoggedIn(user))},
      userLoggedOut: (user) => {dispatch(userLoggedOut())},
      workFlowOpened: (workFlow) => {dispatch(workFlowOpened(workFlow))},
      nodeAdded: (node) => {dispatch(nodeAdded(node))},
      nodeDeleted: (nodeId) => {dispatch(nodeDeleted(nodeId))}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Nodes));
