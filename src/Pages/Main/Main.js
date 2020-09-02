import React, {useState} from 'react';
import './Main.scss';
import axios from 'axios';
import {Issue} from '../../UI/Issue/Issue';

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

  const onChangeHandler = event => {
    const inputValue = event.target.value;
    let params = {...state, inputValue, git: {}};
    const matchInputUrl = inputValue.match(/(https|http):\/\/github.com\/(.*)\/(.*)\/issues/);
    if (matchInputUrl) {
      const [username, repo] = [matchInputUrl[2], matchInputUrl[3]];
      params = {...params, git: {repo, username}};
    };
    setState(params);
  };

  const getIssuesData = event => {
    event.preventDefault();

    if (!state.git) {
      return;
    };

    const {username, repo} = state.git;
    if (username && repo) {
      setState({...state, loading: true});
      axios(`https://api.github.com/repos/${username}/${repo}/issues`)
        .then(res => setState({...state, items: res.data, loading: false}))
        .catch(e => console.error(e));
    };
  };

  return (
    <div className="Main">
      <header>
        <form onSubmit={getIssuesData} className="search">
          <div className="search__field">
            <input 
              placeholder="Ссылка на issues" 
              onChange={onChangeHandler} 
              value={state.inputValue} 
              autoFocus={true}
            />
          </div>

          <div className="search__button">
            <button>Найти</button>
          </div>
        </form>
      </header>

      {
        state.items.length || state.loading 
        ? <main className="results-container">
            <article className="results">
                <Issue
                  username={state.git.username}
                  repo={state.git.repo}
                  items={state.items}
                  loading={state.loading}
                />
            </article>
          </main>
        : null 
      }
    </div>
  );
};