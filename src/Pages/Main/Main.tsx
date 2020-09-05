import React, {useState, useEffect, ChangeEvent, FormEvent, useRef} from 'react';
import './Main.scss';
import axios, { AxiosResponse, AxiosError, AxiosPromise } from 'axios';
import {Issues} from '../../UI/Issues/Issues';
import {IState} from '../../Interfaces/Pages/Main/IState';
import {IScrolling} from '../../Interfaces/Pages/Main/IScrolling';
import '../../UI/Loading/Loading.scss';

const EXAMPLE_URL = 'https://github.com/negezor/vk-io/issues';
export const Main = (): JSX.Element => {
  const wrapperRef = useRef<HTMLInputElement>(null);
  const [wrapperScrolling, setStateScroll] = useState<IScrolling>({isScrolling: false});
  const [state, setState] = useState<IState>({loading: false, inputValue: ''});

  useEffect(() => {
    const resultWrapper = wrapperRef.current;
    if (resultWrapper) {
      setStateScroll({isScrolling: resultWrapper.clientHeight < resultWrapper.scrollHeight});
    };
  }, [state]);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue: string = event.target.value;
    let params: IState = {...state, inputValue};
    const matchInputUrl: RegExpMatchArray | null = inputValue.match(/(https|http):\/\/github.com\/(.*)\/(.*)\/issues/);
    if (matchInputUrl) {
      const [username, repo]: string[] = [matchInputUrl[2], matchInputUrl[3]];
      params = {...params, git: {username, repo}};
    };
    setState(params);
  };

  const onClickHandler = () => 
    state.inputValue === '' 
      ? setState({...state, inputValue: EXAMPLE_URL, git: {username: 'negezor', repo: 'vk-io'}})
      : null;

  const getIssuesData = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!state.loading && state.git) {
      const {username, repo} = state.git;
      if (username && repo) {
        setState({...state, loading: true});
        (axios(`https://api.github.com/repos/${username}/${repo}/issues`) as AxiosPromise)
          .then((res: AxiosResponse) => setState({...state, items: res.data, loading: false}))
          .catch((e: AxiosError) => {
            console.error(e);
            setState({...state, loading: false, items: undefined});
          });
      };
    };
  };

  return <div className="Main">
    <header>
      <form onSubmit={getIssuesData} className="search">
        <div className="search__field">
          <input 
            placeholder={`Введите ссылку на issues, например: ${EXAMPLE_URL}`}
            onChange={onChangeHandler} 
            value={state.inputValue} 
            autoFocus={true}
          />
        </div>

        <div className="search__button">
          <button onClick={onClickHandler}>
            {state.inputValue === '' ? 'Мне лень' : 'Найти'}
          </button>
        </div>
      </form>
    </header>

    {
      state.git && (state.items || state.loading)
        ? <main className="results-container">
            <article ref={wrapperRef} className="results-wrapper">
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
  </div>;
};