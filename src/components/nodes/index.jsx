import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import ShuffleRoundedIcon from '@material-ui/icons/ShuffleRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {base} from '../../base';
import {connect} from 'react-redux';
import {userLoggedIn, userLoggedOut} from '../../redux/actions';
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
            this.setState({
                workFlow:{
                    id: snap.val().id,
                    isComplete: snap.val().isComplete,
                    nodes: snap.val().nodes || [],
                    name: snap.val().name,
                    owner: snap.val().owner
                }
            });
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
              alert('user not logged in');
              window.location = '/'
            }
        });
      });
    }

  addNode = () =>{
    const workFlow = this.state.workFlow;
    const id = Date.now();
    const newNode = {
        nodeId: id,
        isComplete: false,
        inProgress: false,
        taskName: 'New Task',
        description: 'Placeholder multi-line description - should be edited.'
    }
    workFlow.nodes.push(newNode);
    this.setState({
      workFlow: workFlow,
      shouldDisplaySnackbar: true,
      notification: 'Node Added Successfully.'
    }, () => {
      base.database()
    .ref(`workFlows/${this.props.currentUser.uID}/${this.props.match.params.id}`)
    .set(this.state.workFlow)
    });
  }

  updateNodeData = (nodeItem) => () => {
      const newNodesList = this.state.workFlow.nodes.map((node) => {
          if(node.nodeId === nodeItem.nodeId){
              return nodeItem;
          }
          else{
              return node;
          }
      })
      const workFlow = this.state.workFlow;
      if(!nodeItem.isComplete){
          workFlow.isComplete = false;
      }      
      workFlow.nodes = newNodesList;
      this.setState({      
        workFlow: workFlow
      });
  }

  deleteLatestNode = () => {
      let latestNodeId = -1;
      const newNodeList = [];
      if((this.state.workFlow.nodes||[]).length < 1){
          console.log('No Nodes Present');
      }
      else{
        this.state.workFlow.nodes.forEach((node) => {
            if(node.nodeId > latestNodeId){
                latestNodeId = node.nodeId
            }
        });
        this.state.workFlow.nodes.forEach((node) => {
            if(node.nodeId !== latestNodeId){
                newNodeList.push(node);
            }
        });
      }
      const workflow = this.state.workFlow;
      workflow.nodes=newNodeList;
      this.setState({
          workFlow: workflow,
          shouldDisplaySnackbar: true,
          notification: 'The last added node was removed.'
      })
    }

  save = () => {
    base.database()
    .ref(`workFlows/${this.props.currentUser.uID}/${this.props.match.params.id}`)
    .set(this.state.workFlow)
    this.setState({
      shouldDisplaySnackbar: true,
      notification: 'Nodes have been successfully saved.'
    })
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
            nodes.map((node) => (
              <NodeItem
                updateNodeData={this.updateNodeData}
                key = {node.nodeId}
                item = {node}
              />
            ))
            : 
            <div className={classes.loader}>
                <hr/><h3>No Nodes Present. Add some nodes to the workflow.</h3><hr/>
            </div>
            )
            :
            <div className={classes.loader}>
                <h1>Loading Nodes...</h1><br/>
                <CircularProgress />
            </div>
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
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
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
      userLoggedIn: (user) => {dispatch(userLoggedIn(user))},
      userLoggedOut: (user) => {dispatch(userLoggedOut())}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Nodes));
