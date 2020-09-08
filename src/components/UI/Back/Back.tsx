import React, { ReactElement } from 'react';
import './Back.scss';
import { NavLink } from 'react-router-dom';

// Words
import words from '../../../words';

export const Back = (): ReactElement => (
  <button type="button" className="Back">
    <NavLink to="/">{words.TO_MAIN_PAGE}</NavLink>
  </button>
);
