import React, { useEffect, useState } from "react";
import './Issue.scss';
import axios from "axios";
import {Comment} from '../UI/Comment/Comment';
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
          const commentsResponse = await axios(issueResponse.data.comments_url);
          const {title, number, user, labels, state, locked, comments, created_at, updated_at, closed_at, closed_by, body} = issueResponse.data;
          const {login, avatar_url, html_url} = user;
          const {url, name, color, description} = labels;
          if (commentsResponse) {
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
              body,
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
  }, [ISSUES_URL]);

  return (
    // Контент с проблемой
    <main className="Issue">
      {/* Место, где развертывается непосредстенно проблема */}
      <article className="Issue">
        <div className="title">
          <div className="title__username">
            {state.user.login}
          </div>
         
          <span className="title__title">
            <h1>{state.title}</h1> 
            <span className="title__title gray">
              {`#${state.number}`}
            </span>
            &nbsp; • &nbsp;
            {`${state.comments} ${utils.formatWordEnd(parseInt(state.comments), {nom: 'комментарий', gen: 'комментария', plu: 'комментариев'})}`}
          </span>
        </div>

        <div className="issue">
          {state.body}
        </div>

        <aside className="comments">
          <div className="info">
            <div className="author">
              <b>{state.user.login}</b> написал пост {utils.formatDate(state.created_at)}
            </div>            

            <button className="url" onClick={() => prompt('URL текущей страницы', ISSUES_URL)}></button>
          </div>

          <div className="comments-to-issue">
            Комментарии к проблеме
          </div>

          <Comment item={state.comments_active}/>
        </aside>
      </article>
    </main>
  )
};