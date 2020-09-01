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
              comments_active: commentsResponse.data,
            });
          };
        };
      } catch (e) {
        console.error(e);
      };
    };
    fetchData();
  }, [ISSUES_URL, props.history]);

  return (
    <main className="Issue">
      <article className="header">
        <div className="header__title">
          <div className="header__title__username">
            <a href={state.user.html_url} target="_blank" rel="noopener noreferrer">{state.user.login}</a>
          </div>
         
          <span className="header__title__self">
            <h1>{state.title}</h1> 

            <span className="header__title__self__number">
              {` #${state.number}`}
            </span>

            <span className="header__title__self__comments">
              &nbsp; • &nbsp;
              {`${state.comments} ${utils.formatWordEnd(parseInt(state.comments), {nom: 'комментарий', gen: 'комментария', plu: 'комментариев'})}`}
            </span>
          </span>
        </div>

        <div className="header__body" dangerouslySetInnerHTML={{__html: state.body}}/>

        <aside className="header__comments">
          <div className="header__comments__info">
            <div className="header__comments__info__author">
              <b>{<a href={state.user.html_url} target="_blank" rel="noopener noreferrer">{state.user.login}</a>}</b> написал пост {utils.formatDate(state.created_at)}
            </div>            

            <button className="header__comments__info__url" onClick={() => prompt('URL текущей страницы', ISSUES_URL)}></button>
          </div>

          <div className="header__comments__to-issue">Комментарии к проблеме</div>

          <Comment items={state.comments_active} globalProps={props}/>
        </aside>
      </article>
    </main>
  );
};