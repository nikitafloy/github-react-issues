import React from 'react';
import './Issues.scss';
import {NavLink} from 'react-router-dom';
import utils from '../../utils';
import { IIssuesParams } from '../../Interfaces/UI/Issues/IIssues';
import { IStateItems } from '../../Interfaces/Pages/Main/IState';

export const Issues = (params: IIssuesParams): JSX.Element => {
  let {username, repo, items, loading} = params;
  const issuesList: Array<IStateItems>|never[] = items === undefined || loading ? utils.randomArray() : items;

  return <>
    {
      issuesList.map((item, key) => 
        <div key={key} className={`Issues ${params.isScrolling ? 'scroll' : 'no-scroll'}`}>
          <div className={`Issues__title ${loading ? 'loading_80' : ''}`}>
            { 
              item && item.title 
                ? <NavLink to={`/issues/${username}/${repo}/${item.number}`}>{item.title}</NavLink>
                : null
            }
          </div>

          <div className={`Issues__username ${loading ? 'loading_15' : ''}`}>
            {
              item && item.user
                ? <a href={item.user.html_url} target="_blank" rel="noopener noreferrer">{item.user.login}</a>
                : null
            }
          </div>
        </div>
      )
    }
  </>;
};