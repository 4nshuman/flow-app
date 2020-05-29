import React from 'react';
import './App.css';
import MyAppBar from './components/appBar';
import Entry from './components/entry';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <MyAppBar/>
      <Router>
        <Switch>
          <Route path='/' exact component={Entry}/>
          {/* <Route path='/workflows' exact component={}/>
          <Route path='/workflows:id' component={}/> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
