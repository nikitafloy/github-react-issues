import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
  FC,
  ReactElement,
} from 'react';

// CSS
import './Main.scss';
import '../../UI/Loading/Loading.scss';

// Axios
import axios, { AxiosResponse, AxiosError, AxiosPromise } from 'axios';

// UI
import { Issues } from '../../UI/Issues/Issues';

// Typescript
import { MainState } from '../../../TypeScript/Pages/Main/State';
import { antiChildren } from '../../../TypeScript/utils';

// Words
import words from '../../../words';

const EXAMPLE_URL = 'https://github.com/negezor/vk-io/issues';
export const Main: FC<antiChildren> = (): ReactElement => {
  const wrapperRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<MainState>({
    loading: false,
    inputValue: '',
    isScrolling: false,
  });

  useEffect(() => {
    if (wrapperRef.current instanceof HTMLElement) {
      const resultWrapper: HTMLElement = wrapperRef.current;
      if (resultWrapper) {
        setState((prevState) => ({
          ...prevState,
          isScrolling: resultWrapper.clientHeight < resultWrapper.scrollHeight,
        }));
      }
    }
  }, [state.loading]);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    const inputValue: string = event.target.value;
    let params: MainState = { ...state, inputValue, git: {} };
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
              placeholder={`${words.ENTER_URL_ISSUE_EXAMPLE}: ${EXAMPLE_URL}`}
              onChange={onChangeHandler}
              value={state.inputValue}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>

          <div className="search__button">
            <button type="submit" onClick={onClickHandler}>
              {state.inputValue === '' ? words.IM_LAZY : words.TO_FIND}
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
                isScrolling={state.isScrolling}
              />
            </div>
          </article>
        </main>
      ) : null}
    </div>
  );
};
