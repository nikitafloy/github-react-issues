import React, { FC, ReactElement } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Main } from './components/Pages/Main/Main';
import { Issue } from './components/Pages/Issue/Issue';

export const App: FC = (): ReactElement => (
  <Switch>
    <Route path="/issues/:login/:repo/:id" exact component={Issue} />
    <Route path="/" exact component={Main} />
    <Redirect to="/" />
  </Switch>
);
