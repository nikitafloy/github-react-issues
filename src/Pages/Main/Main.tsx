import React, {useState, useEffect, ChangeEvent, FormEvent} from 'react';
import './Main.scss';
import axios from 'axios';
import {Issues} from '../../UI/Issues/Issues';
import {IState} from '../../Interfaces/Main/IState';
import {IScrolling} from '../../Interfaces/Main/IScrolling';

export const Main = () => {
  const [state, setState] = useState<IState>({ 
    items: [], 
    loading: false, 
    inputValue: '', 
    git: {},
  });

  const [wrapperScrolling, setStateScroll] = useState<IScrolling>({isScrolling: false});
  useEffect(() => {
    const resultWrapperCollection: HTMLCollection = document.getElementsByClassName('results-wrapper');
    const resultWrapper = resultWrapperCollection[0] as HTMLElement;
    if (resultWrapper) {
      setStateScroll({isScrolling: resultWrapper.clientHeight < resultWrapper.scrollHeight});
    };
  }, [state]);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    let params: IState = {...state, inputValue, git: {}};
    const matchInputUrl: RegExpMatchArray | null = inputValue.match(/(https|http):\/\/github.com\/(.*)\/(.*)\/issues/);
    if (matchInputUrl) {
      const [username, repo]: string[] = [matchInputUrl[2], matchInputUrl[3]];
      params = {...params, git: {repo, username}};
    };
    setState(params);
  };

  const getIssuesData = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
              <article className="results-wrapper">
                <div className="results">
                  <Issues
                    username={state.git.username}
                    repo={state.git.repo}
                    items={state.items}
                    loading={state.loading}
                    isScrolling={wrapperScrolling.isScrolling}
                  />
                </div>
              </article>
            </main>
          : null 
      }
    </div>
  );
};