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
      params: { owner, repo, id },
    },
  } = props;

  const ISSUES_URL = `https://api.github.com/repos/${owner}/${repo}/issues/${id}`;
  const [issueState, setState] = useState<IssueState>({});
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
    const stateLabels = issueState.labels;
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
    if (issueState.state === 'closed') {
      return (
        <div className="header__status">
          {issueState.closed_at ? `${words.ISSUE_CLOSED_AT} ${utils.formatDate(issueState.closed_at)}` : null}
        </div>
      );
    }
    return null;
  };

  const renderBody = (): ReactElement => {
    // eslint-disable-next-line react/no-danger
    if (issueState.body) return <div className="header__body" dangerouslySetInnerHTML={{ __html: issueState.body }} />;

    return <div className="header__body">{(utils.randomLoadingArray(6))}</div>;
  };

  const renderUsername = (): ReactElement => {
    if (issueState.user) return <a href={issueState.user.html_url} target="_blank" rel="noopener noreferrer">{issueState.user.login}</a>;

    return <div className="loading_60" />;
  };

  const renderCommentsCount = (): string | null => {
    if (issueState.comments && typeof issueState.comments === 'number') return ` • ${issueState.comments} ${utils.formatWordEnd(issueState.comments, words.END_OF_WORDS.comments)}`;
    return null;
  };

  const onClickHandler = (): string | null => {
    // eslint-disable-next-line no-alert
    if (issueState.title) return prompt(words.URL_CURRENT_PAGE, ISSUES_URL);
    return null;
  };

  const renderCommentsExist = (): ReactElement | string => {
    // Its ok, title loading with comments
    if (issueState.title) {
      if (issueState.comments_active) {
        return words.COMMENTS_TO_ISSUE;
      }
      return words.NO_COMMENTS;
    }
    return <div className="loading_220" />;
  };

  const renderWhoWritePost = (): ReactElement => {
    const { created_at, user } = issueState;
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
              {issueState.title ? (
                <>
                  <h1>{issueState.title}</h1>
                  <span className="header__title__self__number">{` #${issueState.number}`}</span>
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

            <div className="header__comments__to-issue">{renderCommentsExist()}</div>

            {issueState.comments_active
              ? <Comment items={issueState.comments_active} gProps={props} />
              : null}

          </aside>
        </article>
      </main>
    </>
  );
};
