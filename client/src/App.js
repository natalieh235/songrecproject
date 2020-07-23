//testing Github

import React from 'react';
import './App.css';
import UploadFace from './components/UploadFace'
import Nav from './components/Nav'
import Home from './components/Home'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

//import {FaceFormProvider} from './components/FaceFormContext'


class App extends React.Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Nav />
          <Switch>
              <Route path="/face" component={UploadFace}/>
              <Route path="/" exact component={Home}/>
          </Switch>  
        </div>
      </Router>  
    );
  }
  
}

export default App;
