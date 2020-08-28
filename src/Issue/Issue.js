import React from "react";
import './Issue.scss';
import {NavLink} from "react-router-dom";

export const Issue = params => {
  const randomAnimLength = (min, maxRandom, animString = '') => {
    for (let i = 0; i < min + Math.random() * Math.floor(maxRandom); i++) animString = animString + '⠀';
    return animString;
  };

  const randomIssuesLength = (arr = []) => {
    for (let i = 0; i < 5 + Math.random() * Math.floor(30); i++) arr.push(i);
    return arr;
  };

  const {username, repo, item} = params;
  if (item) {
    return (
      <div className="Issue">
        <div className="title">
          <NavLink to={`/issues/${username}/${repo}/${item.number}`}>
            {item.title}
          </NavLink>
        </div>

        <div className="user">
          <a href={item.user.html_url} target="_blank" rel="noopener noreferrer">
            {item.user.login}
          </a>
        </div>
      </div>
    );
  } else {
    return randomIssuesLength().map((item, key) => (
      <div key={key} className="Issue">
        <div className="title">
          <div className="loading">
            {randomAnimLength(30, 40)}
          </div>
        </div>

        <div className="user">
          <div className="loading">
            {randomAnimLength(8, 16)}
          </div>
        </div>
      </div>
    ));
  };
};