import React, { useEffect, useState, FC } from 'react';
import './Issue.scss';
import axios, { AxiosResponse, AxiosPromise } from 'axios';
import { RouteComponentProps } from 'react-router-dom';
import utils from '../../../utils';

// Icons
import url from '../../../icons/url.svg';

// Components
import { Comment } from '../../UI/Comment/Comment';
import { Back } from '../../UI/Back/Back';

// TypeScript
import {
  IssueType,
  IssueState,
  CommentElement,
  IssueLabels,
} from '../../../TypeScript/Pages/Issue/Issue';

export const Issue: FC<RouteComponentProps<IssueType>> = (props: RouteComponentProps<IssueType>): JSX.Element => {
  const {
    match: {
      params: { login, repo, id },
    },
  } = props;

  const ISSUES_URL = `https://api.github.com/repos/${login}/${repo}/issues/${id}`;

  const [state, setState] = useState<IssueState>({});
  const { title } = state;
  const { history } = props;

  useEffect(() => {
    (async (): Promise<unknown> => {
      try {
        const issueResponse: AxiosResponse = await axios.get<AxiosPromise>(ISSUES_URL);
        if (issueResponse) {
          // Destructuring

          // Separate unnecessary data
          const {
            title,
            number,
            comments,
            user,
            labels,
            state,
            created_at,
            updated_at,
            closed_at,
            comments_url,
          } = issueResponse.data;

          // User
          const { login, avatar_url, html_url } = user;

          // Get comments
          let comments_active: Array<CommentElement> | undefined;
          if (comments !== 0) {
            const commentsResponse: AxiosResponse = await axios.get<AxiosPromise>(comments_url);
            comments_active = commentsResponse.data;
          }

          // Get new body - convert markdown to HTML
          const body: string | boolean = await utils.markdownToHTML(issueResponse.data.body);
          if (typeof body !== 'string') {
            // Redirect to Main page
            return history.push('/');
          }

          return setState({
            // Title
            title,
            number,
            comments,

            // User
            user: { login, avatar_url, html_url },

            // Labels
            labels,

            // Issue state
            state,

            // Status & info
            created_at,
            updated_at,
            closed_at,

            // Issue body
            body,

            // Comments
            comments_active,
          });
        }
        return undefined;
      } catch (e) {
        props.history.push('/');
        throw new Error(e);
      }
    })();
    // I or React dont know about destructuring (react ask props.history)
    // eslint-disable-next-line
  }, [ISSUES_URL, history]);

  const renderLabels = (): JSX.Element | null => {
    const stateLabels = state.labels;
    if (stateLabels && stateLabels.length) {
      const labels: string = stateLabels.map((item: IssueLabels) => item.name).join(', ');
      return <div className="header__title__label">{labels}</div>;
    }
    return null;
  };

  const renderStatus = (): JSX.Element | null => (state.state === 'closed' ? (
    <div className="header__status">
      {state.closed_at ? `Вопрос закрыт ${utils.formatDate(state.closed_at)}` : null}
    </div>
  ) : null);

  return (
    <>
      <Back />

      <main className="Issue">
        <article className="header">
          <div className="header__title">

            {renderLabels()}

            <div className="header__title__username">
              {state.user ? (
                <a href={state.user.html_url} target="_blank" rel="noopener noreferrer">
                  {state.user.login}
                </a>
              ) : (
                <div className="loading_60" />
              )}
            </div>

            <span className="header__title__self">
              {title ? (
                <>
                  <h1>{title}</h1>

                  <span className="header__title__self__number">{` #${state.number}`}</span>

                  <span className="header__title__self__comments">
                    {state.comments
                      ? ` • ${state.comments} ${
                          utils.formatWordEnd(state.comments, {
                            nom: 'комментарий',
                            gen: 'комментария',
                            plu: 'комментариев',
                          }) as string
                      }`
                      : null}
                  </span>
                </>
              ) : (
                <div className="loading_80" />
              )}
            </span>
          </div>

          {state.body ? (
            <>
              {renderStatus()}
              <div className="header__body" dangerouslySetInnerHTML={{ __html: state.body }} />
            </>
          ) : (
            <div className="header__body">
              <div className="loading_100" />
              <div className="loading_100" />
              <div className="loading_100" />
              <div className="loading_100" />
              <div className="loading_100" />
              <div className="loading_100" />
              <div className="loading_100" />
            </div>
          )}

          <aside className="header__comments">
            <div className="header__comments__info">
              <div className="header__comments__info__author">
                {state.user ? (
                  <>
                    <b>
                      <a href={state.user.html_url} target="_blank" rel="noopener noreferrer">
                        {state.user.login}
                      </a>
                    </b>
                    {' '}
                    написал пост
                    {' '}
                    {state.created_at ? (utils.formatDate(state.created_at) as string) : null}
                  </>
                ) : (
                  <div className="loading_320" />
                )}
              </div>

              <button
                type="button"
                className="header__comments__info__url"
                onClick={(): string | null => (title ? prompt('URL текущей страницы', ISSUES_URL) : null)}
              >
                <img src={url} alt="Ссылка на issue" />
              </button>
            </div>

            <div className="header__comments__to-issue">
              {
                // eslint-disable-next-line no-nested-ternary
                title
                  ? state.comments_active
                    ? 'Комментарии к проблеме'
                    : 'Комментариев нет'
                  : <div className="loading_220" />
              }
            </div>

            {state.comments_active ? (
              <Comment items={state.comments_active} globalProps={props} />
            ) : null}
          </aside>
        </article>
      </main>
    </>
  );
};
