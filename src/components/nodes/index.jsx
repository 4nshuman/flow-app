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
import {userLoggedIn} from '../../redux/currentUser/actions';
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
    this.firestore = base.database().ref('workFlows');
  }

  componentDidMount(){
    this.authListener();
    this.firestore.on("value", this.setData, this.setError);
  }

  setData = (snapshot) => {
    let invalidAuth = false
    snapshot.forEach((snap) => {
        if(snap.val().id === parseInt(this.props.match.params.id)){
            if(snap.val().owner === this.props.currentUser.uID){
                this.setState({
                    workFlow:{
                        id: snap.val().id,
                        status: snap.val().isComplete,
                        nodes: snap.val().nodes || [],
                        name: snap.val().name,
                        owner: snap.val().owner
                    }
                })
                invalidAuth = false
            }
            else{
                invalidAuth = true
            }
        }
    })
    this.setState({
        dataLoaded: !invalidAuth,
        unAuthorizedWorkFlowFetch: invalidAuth
    })
  }

  setError = (errorObject) => {
    console.log("The read failed: " + errorObject.code);
  }

  authListener = () => {
    base.auth().onAuthStateChanged((user)=>{
      if(user){
        this.props.userLoggedIn(user);
      }
      else{
        this.props.userLoggedOut();
        alert('user not logged in');
        window.location = '/'
      }
    });
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
    console.log(this.state);
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
                <Button className={classes.button} type='submit' variant="contained" style={{background: '#12be51'}}>
                    <AddCircleOutlineRoundedIcon style={{marginRight: '5px'}} />
                    Add Node
                </Button>
                <Button className={classes.button} type='submit' variant="contained" style={{background: '#3c5bd8'}}>
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
                deleteClickHandler={() => alert('workflow was to be deleted')}
                itemClickHandler={(e) => console.log(e.target.tagName)}
                stateClickHandler={(e) => console.log(e.target.tagName)}
                key = {node.nodeId}
                item = {node}
              />
            ))
            : this.state.unAuthorizedWorkFlowFetch 
            ? <Box
                className={classes.root}
                style={{width: '500px', marginLeft:'30vw'}}
                boxShadow={3}>
                    <Card variant="outlined">
                        <CardContent>
                        <TextField fullWidth={true} id="outlined-basic" variant="outlined" label="Error" value="UnAuthorized to view this Flow" type="text"/>
                        </CardContent>
                        <CardActions className={classes.bottomText}>
                            <Button variant="contained">
                                <CancelRoundedIcon style={{marginRight: '5px'}} />
                                Close
                            </Button>
                        </CardActions>
                    </Card>
                </Box>  
            : <div className={classes.loader}>
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
      userLoggedIn: (user) => {dispatch(userLoggedIn(user))}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Nodes));
