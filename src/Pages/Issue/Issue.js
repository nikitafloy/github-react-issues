import React, { useEffect, useState } from 'react';
import './Issue.scss';
import axios from 'axios';
import {Comment} from '../../UI/Comment/Comment';
import utils from '../../utils';

export const Issue = props => {
  const {login, repo, id} = props.match.params;
  const ISSUES_URL = `https://api.github.com/repos/${login}/${repo}/issues/${id}`;
  const [state, setState] = useState({
    title: null,
    number: null,
    user: {
      login: null,
      avatar_url: null,
      html_url: null,
    },
    labels: {
      url: null,
      name: null,
      color: null,
      description: null,
    },
    state: null,
    locked: null,
    comments: null,
    created_at: null,
    updated_at: null,
    closed_at: null,
    body: null,
    closed_by: null,
    comments_active: [],
  });

  const body = {__html: state.body};
  const title = state.title;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issueResponse = await axios(ISSUES_URL);
        if (issueResponse) {
          const {title, number, user, labels, state, locked, comments, created_at, updated_at, closed_at, closed_by, body, comments_url} = issueResponse.data;
          const {login, avatar_url, html_url} = user;
          const {url, name, color, description} = labels;
          const commentsResponse = await axios(comments_url);
          if (commentsResponse) {
            const gitMarkdown = await utils.bodyToMarkdown(body);
            if (!gitMarkdown) {
              return props.history.push('/');
            };
  
            setState({
              title,
              number,
              user: {
                login,
                avatar_url,
                html_url,
              },
              labels: {
                url,
                name,
                color,
                description,
              },
              state,
              locked,
              comments,
              created_at,
              updated_at,
              closed_at,
              body: gitMarkdown.data,
              closed_by,
              comments_active: commentsResponse.data.length ? commentsResponse.data : null,
            });
          };
        };
      } catch (e) {
        console.error(e);
      };
    };
    fetchData();
  }, [ISSUES_URL, props.history]);

  return (<main className="Issue">
        <article className="header">
          <div className="header__title">
            <div className="header__title__username">
              {title ? <a href={state.user.html_url} target="_blank" rel="noopener noreferrer">{state.user.login}</a> : <div className="loading_60"/>}
            </div>
          
            <span className="header__title__self">
              {
                title
                  ? <>
                      <h1>{state.title}</h1> 

                      <span className="header__title__self__number">{` #${state.number}`}</span>

                      <span className="header__title__self__comments">
                        &nbsp; • &nbsp;
                        {`${state.comments} ${utils.formatWordEnd(parseInt(state.comments), {nom: 'комментарий', gen: 'комментария', plu: 'комментариев'})}`}
                      </span>
                    </>
                  : <div className="loading_80"/>
              }
            </span>
          </div>

          {
            title
              ? <div className="header__body" dangerouslySetInnerHTML={body}/>
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
                  title
                    ? <>
                        <b>
                          <a href={state.user.html_url} target="_blank" rel="noopener noreferrer">{state.user.login}</a>
                        </b> написал пост {utils.formatDate(state.created_at)}
                      </>
                    : <div className="loading_320"/>
                }
              </div>

              <button className="header__comments__info__url" onClick={title ? () => prompt('URL текущей страницы', ISSUES_URL) : null}/>
            </div>

            <div className="header__comments__to-issue">
              {title ? state.comments_active ? 'Комментарии к проблеме' : 'Комментариев нет' : <div className="loading_220"/>}
            </div>

            {state.comments_active ? <Comment items={state.comments_active} globalProps={props}/> : null}
          </aside>
        </article>
    </main>
  );
};