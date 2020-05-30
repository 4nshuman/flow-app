import React from 'react';
import './App.css';
import MyAppBar from './components/appBar';
import Entry from './components/entry';
import Nodes from './components/nodes';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <MyAppBar/>
      <Router>
        <Switch>
          <Route path='/' exact component={Entry}/>
          <Route path='/workflow/:id' exact component={Nodes}/>
          {/* <Route path='/workflows:id' component={}/> */}
        </Switch>
      </Router>
    </div>
    </Provider>
  );
}

export default App;
