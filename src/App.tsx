import React, { FC, ReactElement } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Components
import { Main } from './components/Pages/Main/Main';
import { Issue } from './components/Pages/Issue/Issue';

// TypeScript
import { antiChildren } from './TypeScript/utils';

export const App: FC<antiChildren> = (): ReactElement => (
  <Switch>
    <Route path="/issues/:owner/:repo/:id" exact component={Issue} />
    <Route path="/" exact component={Main} />
    <Redirect to="/" />
  </Switch>
);
