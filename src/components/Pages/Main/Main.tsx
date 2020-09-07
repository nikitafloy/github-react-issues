import React, {
  useState, useEffect, ChangeEvent, FormEvent, useRef, FC, ReactElement,
} from 'react';

// CSS
import './Main.scss';
import '../../UI/Loading/Loading.scss';

// Axios
import axios, { AxiosResponse, AxiosError, AxiosPromise } from 'axios';

// UI
import { Issues } from '../../UI/Issues/Issues';

// Typescript
import { IState } from '../../../TypeScript/Pages/Main/State';
import { Scrolling } from '../../../TypeScript/Pages/Main/Scrolling';

const EXAMPLE_URL = 'https://github.com/negezor/vk-io/issues';
export const Main: FC = (): ReactElement => {
  const wrapperRef = useRef<HTMLElement>(null);
  const [wrapperScrolling, setStateScroll] = useState<Scrolling>({ isScrolling: false });
  const [state, setState] = useState<IState>({ loading: false, inputValue: '' });

  useEffect(() => {
    if (wrapperRef.current instanceof HTMLElement) {
      const resultWrapper: HTMLElement = wrapperRef.current;
      if (resultWrapper) {
        setStateScroll({ isScrolling: resultWrapper.clientHeight < resultWrapper.scrollHeight });
      }
    }
  }, [state.loading]);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    const inputValue: string = event.target.value;
    let params: IState = { ...state, inputValue, git: { } };
    const matchInputUrl: RegExpMatchArray | null = inputValue.match(
      /(https|http):\/\/github.com\/(.*)\/(.*)\/issues/,
    );
    if (matchInputUrl) {
      const [username, repo]: string[] = [matchInputUrl[2], matchInputUrl[3]];
      params = { ...params, git: { username, repo } };
    }
    setState(params);
  };

  const onClickHandler = (): void | null => (state.inputValue === ''
    ? setState({ ...state, inputValue: EXAMPLE_URL, git: { username: 'negezor', repo: 'vk-io' } })
    : null);

  const getIssuesData = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!state.loading && state.git) {
      const { username, repo } = state.git;
      if (username && repo) {
        setState({ ...state, loading: true });
        (axios(`https://api.github.com/repos/${username}/${repo}/issues`) as AxiosPromise)
          .then((res: AxiosResponse) => setState({ ...state, items: res.data, loading: false }))
          .catch((e: AxiosError) => {
            setState({ ...state, loading: false, items: undefined });
            if (typeof e === 'string') {
              throw new Error(e);
            }
          });
      }
    }
  };

  return (
    <div className="Main">
      <header>
        <form onSubmit={getIssuesData} className="search">
          <div className="search__field">
            <input
              placeholder={`Введите ссылку на issues, например: ${EXAMPLE_URL}`}
              onChange={onChangeHandler}
              value={state.inputValue}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>

          <div className="search__button">
            <button type="submit" onClick={onClickHandler}>
              {state.inputValue === '' ? 'Мне лень' : 'Найти'}
            </button>
          </div>
        </form>
      </header>

      {state.git && (state.items || state.loading) ? (
        <main className="results-container">
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
      ) : null}
    </div>
  );
};
