import React from 'react';
import './Issues.scss';
import {NavLink} from 'react-router-dom';
import Loading from '../Loading/Loading';

export const Issues = params => {
  let {username, repo, items, loading} = params;
  items = loading ? items = Loading.randomTextLength() : items;

  return items.map((item, key) => (
    <div key={key} className={`Issues ${params.isScrolling ? 'scroll' : 'no-scroll'}`}>
      <div className={`Issues__title ${loading ? 'loading_80' : ''}`}>
        { 
          item.title 
          ? <NavLink to={`/issues/${username}/${repo}/${item.number}`}>{item.title}</NavLink>
          : null
        }
      </div>

      <div className={`Issues__username ${loading ? 'loading_15' : ''}`}>
        {
          item.title
          ? <a href={item.user.html_url} target="_blank" rel="noopener noreferrer">{item.user.login}</a>
          : null
        }
      </div>
    </div>
  ));
};