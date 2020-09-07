import React, { ReactElement } from 'react';
import './Back.scss';
import { NavLink } from 'react-router-dom';

export const Back = (): ReactElement => (
  <button type="button" className="Back">
    <NavLink to="/">На главную</NavLink>
  </button>
);
