import React from 'react';
import './Pages/Main/Main.scss';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Main} from './Pages/Main/Main';
import {Issue} from "./Pages/Issue/Issue";

function App() {
  return (
    <Switch>
      <Route path="/issues/:login/:repo/:id" exact component={Issue}/>
      <Route path="/" exact component={Main}/>
      <Redirect to="/"/>
    </Switch>
  );
};

export default App;
