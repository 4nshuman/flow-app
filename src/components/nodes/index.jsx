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
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import {base} from '../../base';
import {connect} from 'react-redux';
import {userLoggedIn, userLoggedOut} from '../../redux/currentUser/actions';
import NodeItem from '../nodeItem';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

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
      dataLoaded: false,
      unAuthorizedWorkFlowFetch: false
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
      workFlow: workFlow
    });
    base.database()
    .ref(`workFlows/${this.props.currentUser.uID}/${this.props.match.params.id}`)
    .set(this.state.workFlow)
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
      workFlow.nodes = newNodesList;
      this.setState({
        workFlow: workFlow
      });
  }

  save = () => {
    base.database()
    .ref(`workFlows/${this.props.currentUser.uID}/${this.props.match.params.id}`)
    .set(this.state.workFlow)
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value });
  };

  render(){
    const {classes} = this.props;
    const {
        id,
        nodes,
        name,
        status
    } = this.state.workFlow;
    return (
        <React.Fragment>
        <AppBar position="static" style={{background:"white"}}>
            <Toolbar>
                <TextField 
                 value={this.state.unAuthorizedWorkFlowFetch ? 'UnAuthorized' : ''}
                 id="outlined-basic" variant="outlined" label={name} type="text" onChange={this.handleChange} />
                <div className={classes.nodeButtonsDiv}>
                <Button className={classes.button} type='submit' variant="contained" style={{background: '#7600b0'}}>
                    <ShuffleRoundedIcon style={{marginRight: '5px'}} />
                    Shuffle
                </Button>
                <Button className={classes.button} type='submit' variant="contained" style={{background: '#f80929'}}>
                    <DeleteForeverRoundedIcon style={{marginRight: '5px'}} />
                    Delete
                </Button>
                <Button onClick={this.addNode} className={classes.button} type='submit' variant="contained" style={{background: '#12be51'}}>
                    <AddCircleOutlineRoundedIcon style={{marginRight: '5px'}} />
                    Add Node
                </Button>
                <Button onClick={this.save} className={classes.button} type='submit' variant="contained" style={{background: '#3c5bd8'}}>
                    <SaveRoundedIcon style={{marginRight: '5px'}} />
                    Save
                </Button>
                </div>
            </Toolbar>
        </AppBar>
        <div>
          {
            this.state.dataLoaded
            ? nodes.map((node) => (
              <NodeItem
                updateNodeData={this.updateNodeData}
                key = {node.nodeId}
                item = {node}
              />
            ))
            : 
            <div className={classes.loader}>
                <h1>Loading...</h1><br/>
                <CircularProgress />
            </div>
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
      userLoggedIn: (user) => {dispatch(userLoggedIn(user))},
      userLoggedOut: (user) => {dispatch(userLoggedOut())}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Nodes));
