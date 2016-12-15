import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRoute, Redirect, Route, Router, browserHistory } from 'react-router';

import Clipboard from 'clipboard';
import * as firebase from 'firebase';

import About from './container/About';
import Frame from './container/Frame';
import Group from './container/Group';
import Help from './container/Help';
import Home from './container/Home';
import InvalidGroup from './container/InvalidGroup';
import './style/style.css';
import './index.css';

const config = {
  apiKey: "AIzaSyCdD2gPik7oWg36XJMG0BKPbRdNIkbdSgg",
  authDomain: "idk-database.firebaseapp.com",
  databaseURL: "https://idk-database.firebaseio.com",
  storageBucket: "idk-database.appspot.com",
  messagingSenderId: "417807676279"
};
firebase.initializeApp(config);

new Clipboard('.clipboard');

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/idk" component={Frame}>
      <IndexRoute component={Home} />
      <Route path="about" component={About} />
      <Route path="help" component={Help} />
      <Route path=":id/invalid" component={InvalidGroup} />
      <Route path=":id" component={Group} />
      <Redirect from="*" to="/idk" />
    </Route>
  </Router>,
  document.getElementById('root')
);
