import React, { FC, ReactElement } from 'react';
import './Issues.scss';
import { NavLink } from 'react-router-dom';

// Utils
import utils from '../../../utils';

// TypeScript
import { IssuesProps } from '../../../TypeScript/UI/Issues/Issues';
import { StateItems } from '../../../TypeScript/Pages/Main/State';

export const Issues: FC<IssuesProps> = (props: IssuesProps): ReactElement => {
  const {
    username, repo, items, loading,
  } = props;
  const issuesList: Array<StateItems> | never[] = items === undefined || loading
    ? utils.randomArray() : items;

  return (
    <>
      {issuesList.map((item, key) => (
        <div key={key} className={`Issues ${props.isScrolling ? 'scroll' : 'no-scroll'}`}>
          <div className={`Issues__title ${loading ? 'loading_80' : ''}`}>
            {item && item.title ? (
              <NavLink to={`/issues/${username}/${repo}/${item.number}`}>{item.title}</NavLink>
            ) : null}
          </div>

          <div className={`Issues__username ${loading ? 'loading_15' : ''}`}>
            {item && item.user ? (
              <a href={item.user.html_url} target="_blank" rel="noopener noreferrer">
                {item.user.login}
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
};
