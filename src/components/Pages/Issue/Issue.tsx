import React, {
  useEffect, useState, FC, ReactElement,
} from 'react';
import './Issue.scss';
import { RouteComponentProps } from 'react-router-dom';

// Axios
import axios, { AxiosResponse, AxiosPromise } from 'axios';

// Utils
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

// Words
import words from '../../../words';

export const Issue: FC<RouteComponentProps<IssueType>> = (
  props: RouteComponentProps<IssueType>,
): ReactElement => {
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
    (async (): Promise<void | undefined | never> => {
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
            const commentsResponse: AxiosResponse = await axios.get(comments_url);
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
    // I or React dont know about destructuring (React ask props.history)
    // eslint-disable-next-line
  }, [ISSUES_URL, history]);

  const renderLabels = (): ReactElement | null => {
    const stateLabels = state.labels;
    if (stateLabels) {
      if (stateLabels.length) {
        const labels: string = stateLabels.map((item: IssueLabels) => item.name).join(', ');
        return <div className="header__title__label">{labels}</div>;
      }
      return null;
    }
    return <div className="header__title__label"><div className="loading_60" /></div>;
  };

  const renderStatus = (): ReactElement | null => {
    if (state.state === 'closed') {
      return (
        <div className="header__status">
          {state.closed_at ? `${words.ISSUE_CLOSED_AT} ${utils.formatDate(state.closed_at)}` : null}
        </div>
      );
    }
    return null;
  };

  const renderBody = (): ReactElement => {
    // eslint-disable-next-line react/no-danger
    if (state.body) return <div className="header__body" dangerouslySetInnerHTML={{ __html: state.body }} />;

    return <div className="header__body">{(utils.randomLoadingArray(6))}</div>;
  };

  const renderUsername = (): ReactElement => {
    if (state.user) return <a href={state.user.html_url} target="_blank" rel="noopener noreferrer">{state.user.login}</a>;

    return <div className="loading_60" />;
  };

  const renderCommentsCount = (): string | null => {
    if (state.comments && typeof state.comments === 'number') return ` • ${state.comments} ${utils.formatWordEnd(state.comments, words.END_OF_WORDS.comments)}`;
    return null;
  };

  const onClickHandler = (): string | null => {
    // eslint-disable-next-line no-alert
    if (title) return prompt(words.URL_CURRENT_PAGE, ISSUES_URL);
    return null;
  };

  const renderCommentsExist = (): ReactElement | string => {
    // Its ok, title loading with comments
    if (title) {
      if (state.comments_active) {
        return words.COMMENTS_TO_ISSUE;
      }
      return words.NO_COMMENTS;
    }
    return <div className="loading_220" />;
  };

  const renderWhoWritePost = (): ReactElement => {
    const { created_at, user } = state;
    if (user) {
      const { login, html_url } = user;
      return (
        <>
          <a href={html_url} target="_blank" rel="noopener noreferrer">{login}</a>

          {` ${words.WRITE_POST} `}

          {created_at ? (utils.formatDate(created_at)) : null}
        </>
      );
    }
    return <div className="loading_320" />;
  };

  return (
    <>
      <Back />

      <main className="Issue">
        <article className="header">
          <div className="header__title">
            {renderLabels()}

            <div className="header__title__username">{renderUsername()}</div>

            <span className="header__title__self">
              {title
                ? (
                  <>
                    <h1>{title}</h1>
                    <span className="header__title__self__number">{` #${state.number}`}</span>
                    <span className="header__title__self__comments">{renderCommentsCount()}</span>
                  </>
                ) : <div className="loading_80" />}
            </span>
          </div>

          {renderStatus()}
          {renderBody()}

          <aside className="header__comments">
            <div className="header__comments__info">
              <div className="header__comments__info__author">
                {renderWhoWritePost()}
              </div>

              <button type="button" className="header__comments__info__url" onClick={onClickHandler}>
                <img src={url} alt={words.URL_ON_ISSUE} />
              </button>
            </div>

            <div className="header__comments__to-issue">
              {renderCommentsExist()}
            </div>

            {state.comments_active
              ? <Comment items={state.comments_active} gProps={props} />
              : null}

          </aside>
        </article>
      </main>
    </>
  );
};
