import React from 'react';
import './Issue.scss';
import {NavLink} from 'react-router-dom';
import Loading from '../Loading/Loading';

export const Issue = params => {
  const {username, repo, item} = params;
  if (item) {
    return (
      <div className="Issue">
        <div className="Issue__title">
          <NavLink to={`/issues/${username}/${repo}/${item.number}`}>
            {item.title}
          </NavLink>
        </div>

        <div className="Issue__username">
          <a href={item.user.html_url} target="_blank" rel="noopener noreferrer">
            {item.user.login}
          </a>
        </div>
      </div>
    );
  } else {
    return Loading.randomTextLength().map((_, key) => (
      <div key={key} className="Issue">
        <div className="Issue__title">
          <div className="loading">
            {Loading.randomAnimLength(30, 30)}
          </div>
        </div>

        <div className="Issue__username">
          <div className="loading">
            {Loading.randomAnimLength(12, 12)}
          </div>
        </div>
      </div>
    ));
  };
};