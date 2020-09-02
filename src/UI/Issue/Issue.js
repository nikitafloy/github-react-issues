import React from 'react';
import './Issue.scss';
import {NavLink} from 'react-router-dom';
import Loading from '../Loading/Loading';

export const Issue = params => {
  let {username, repo, items, loading} = params;
  items = loading ? items = Loading.randomTextLength() : items;

  return items.map((item, key) => (
    <div key={key} className="Issue">
      <div className="Issue__title">
        { 
          item.title 
          ? <NavLink to={`/issues/${username}/${repo}/${item.number}`}>{item.title}</NavLink>
          : <div className="loading">{Loading.randomAnimLength(30, 30)}</div>
        }
      </div>

      <div className="Issue__username">
        {
          item.title
          ? <a href={item.user.html_url} target="_blank" rel="noopener noreferrer">{item.user.login}</a>
          : <div className="loading">{Loading.randomAnimLength(10, 20)}</div>
        }
      </div>
    </div>
  ));
};