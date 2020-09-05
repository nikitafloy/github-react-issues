import React, { useEffect, useState } from 'react';
import './Issue.scss';
import axios, { AxiosResponse, AxiosPromise } from 'axios';
import utils from '../../utils';
import { Comment } from '../../UI/Comment/Comment';
import { Back } from '../../UI/Back/Back';
import { IIssue, IIssueState, ICommentElement } from '../../Interfaces/Pages/Issue/IIssue';
import { RouteComponentProps } from 'react-router-dom';

export const Issue = (props: RouteComponentProps<IIssue>): JSX.Element => {
  const {login, repo, id} = props.match.params;
  const ISSUES_URL = `https://api.github.com/repos/${login}/${repo}/issues/${id}`;

  const [state, setState] = useState<IIssueState>({});
  const title: string|undefined = state.title;

  useEffect(() => {
    (async () => {
      try {
        const issueResponse: AxiosResponse = await axios.get<AxiosPromise>(ISSUES_URL);
        if (issueResponse) {

          // Destructuring

          // Separate unnecessary data
          const {title, number, user, labels, state, locked, comments, created_at, updated_at, closed_at, closed_by, comments_url} = issueResponse.data;

          // User
          const {login, avatar_url, html_url} = user;

          // Labels
          const {url, name, color, description} = labels;

          // Get comments
          let comments_active: Array<ICommentElement>|undefined;
          if (comments !== 0) {
            const commentsResponse: AxiosResponse = await axios.get<AxiosPromise>(comments_url);
            comments_active = commentsResponse.data;
          };

          // Get new body - convert markdown to HTML
          const body: string|boolean = await utils.markdownToHTML(issueResponse.data.body);
          if (typeof body !== 'string') {
            // Redirect to Main page
            return props.history.push('/');
          };

          setState({
            // Title
            title, number, comments,

            // User
            user: {login, avatar_url, html_url},

            // Labels
            labels: {url, name, description, color},

            // Issue state
            state, locked,

            // Status & info
            created_at, updated_at, closed_at, closed_by,

            // Issue body
            body,

            // Comments
            comments_active,
          });
        };
      } catch (e) {
        console.error(e);
        return props.history.push('/');
      };
    })();
  }, [ISSUES_URL, props.history]);

  return <>
    <Back/>

    <main className="Issue">
        <article className="header">
          <div className="header__title">
            <div className="header__title__username">
              {state.user ? <a href={state.user.html_url} target="_blank" rel="noopener noreferrer">{state.user.login}</a> : <div className="loading_60"/>}
            </div>
          
            <span className="header__title__self">
              {
                title
                  ? <>
                      <h1>{title}</h1> 

                      <span className="header__title__self__number">{` #${state.number}`}</span>

                      <span className="header__title__self__comments">
                        {state.comments ? ` • ${state.comments} ${utils.formatWordEnd(state.comments, {nom: 'комментарий', gen: 'комментария', plu: 'комментариев'}) as string}` : null}
                      </span>
                    </>
                  : <div className="loading_80"/>
              }
            </span>
          </div>

          {
            state.body
              ? <div className="header__body" dangerouslySetInnerHTML={{__html: state.body}}/>
              : <div className="header__body">
                  <div className="loading_100"></div>
                  <div className="loading_100"></div>
                  <div className="loading_100"></div>
                  <div className="loading_100"></div>
                  <div className="loading_100"></div>
                  <div className="loading_100"></div>
                  <div className="loading_100"></div>
                </div>
          }

          <aside className="header__comments">
            <div className="header__comments__info">
              <div className="header__comments__info__author">
                {
                  state.user
                    ? <>
                        <b>
                          <a href={state.user.html_url} target="_blank" rel="noopener noreferrer">{state.user.login}</a>
                        </b> написал пост {state.created_at ? (utils.formatDate(state.created_at) as string): null}
                      </>
                    : <div className="loading_320"/>
                }
              </div>

              <button className="header__comments__info__url" onClick={() => title ? prompt('URL текущей страницы', ISSUES_URL) : null}/>
            </div>

            <div className="header__comments__to-issue">
              {title ? state.comments_active ? 'Комментарии к проблеме' : 'Комментариев нет' : <div className="loading_220"/>}
            </div>

            {state.comments_active ? <Comment items={state.comments_active} globalProps={props}/> : null}
          </aside>
        </article>
    </main>
  </>;
};