import React, {useEffect, useState} from 'react';
import './Main.scss';
import axios from 'axios';
import {Issue} from '../../Issue/Issue';

// const [username, repo] = ['request', 'request'];
const [username, repo] = ['negezor', 'vk-io'];

export const Main = () => {
  const [state, setState] = useState({ 
    items: [], 
    loading: false, 
    inputValue: '', 
    git: { 
      repo: null,
      username: null, 
    },
  });

  const onChangeHandler = e => {
    const inputValue = e.target.value;
    const matchInputUrl = inputValue.match(/(https|http):\/\/github.com\/(.*)\/(.*)\/issues/);
    if (matchInputUrl) {
      const [username, repo] = [matchInputUrl[2], matchInputUrl[3]];
      // localStorage.setItem('url', inputValue);
      setState({...state, inputValue, git: {repo, username}});
      return;
    };
    setState({...state, inputValue});
  };

  const getIssuesData = () => {
    const {username, repo} = state.git;
    if (username && repo) {
      setState({...state, loading: true});
      // https://github.com/negezor/vk-io/issues
      axios(`https://api.github.com/repos/${username}/${repo}/issues`)
        .then(res => {
          // const {title, url, comments, comments_url, locked, body, number, state, user, created_at, updated_at} = items;
          // const {avatar_url, html_url, login} = user;
          setState({items: res.data, loading: false});
          // https://github.com/request/request/issues
        })
        .catch(e => console.error(e));
    };
  };

  useEffect(() => {

  });

  return (
    <>
      <header className="Main">
        <div className="search">
          <div className="search__field">
            <input 
              type="text" 
              placeholder="Ссылка на issues" 
              onChange={onChangeHandler} 
              value={state.inputValue} 
              autoFocus={true}
            />
          </div>

          <div className="search__button">
            <button onClick={getIssuesData}>Найти</button>
          </div>
        </div>
      </header>

      { state.items.length || state.loading ? <main className="Main">
          <article className="content">
            <div className="issues">
              { 
                !state.loading ? state.items.map((item, key) =>
                  <Issue
                    key={key}
                    username={username}
                    repo={repo}
                    item={item}
                  />
                ): <Issue/>
              }
            </div>
          </article>
        </main> : null
      }
    </>
  );
};