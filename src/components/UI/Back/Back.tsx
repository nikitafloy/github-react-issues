import React, { ReactElement, FC } from 'react';
import './Back.scss';
import { NavLink } from 'react-router-dom';

// TypeScript
import { antiChildren } from '../../../TypeScript/utils';

// Words
import words from '../../../words';

export const Back: FC<antiChildren> = (): ReactElement => (
  <button type="button" className="Back">
    <NavLink to="/">{words.TO_MAIN_PAGE}</NavLink>
  </button>
);
