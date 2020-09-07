import React from 'react';
import './Back.scss';
import { NavLink } from 'react-router-dom';

export const Back = (): JSX.Element => (
  <button className="Back">
    <NavLink to="/">На главную</NavLink>
  </button>
);