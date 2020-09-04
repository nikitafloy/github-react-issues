import React, { useEffect, useState } from 'react';
import './Issue.scss';
import axios from 'axios';
import utils from '../../utils';
import { Comment } from '../../UI/Comment/Comment';
import { Back } from '../../UI/Back/Back';
import { IIssue, IIssueState, ICommentItems } from '../../Interfaces/Issue/IIssue';
import { RouteComponentProps } from 'react-router-dom';

export const Issue = (props: RouteComponentProps<IIssue>) => {
  const {login, repo, id} = props.match.params;
  const ISSUES_URL = `https://api.github.com/repos/${login}/${repo}/issues/${id}`;
  const [state, setState] = useState<IIssueState>({});

  const body = {__html: state.body!};
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
          const commentsResponseData: ICommentItems = commentsResponse.data;
          if (commentsResponseData) {
            const gitMarkdown = await utils.MarkdownToHTML(body);
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
              comments_active: commentsResponseData ? commentsResponseData : null,
            });
          };
        };
      } catch (e) {
        console.error(e);
      };
    };
    fetchData();
  }, [ISSUES_URL, props.history]);

  return (<>
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
                      <h1>{state.title}</h1> 

                      <span className="header__title__self__number">{` #${state.number}`}</span>

                      <span className="header__title__self__comments">
                        {state.comments ? `&nbsp; • &nbsp; ${state.comments} ${utils.formatWordEnd(state.comments, {nom: 'комментарий', gen: 'комментария', plu: 'комментариев'})}` : null}
                      </span>
                    </>
                  : <div className="loading_80"/>
              }
            </span>
          </div>

          {
            body.__html
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
                  state.user
                    ? <>
                        <b>
                          <a href={state.user.html_url} target="_blank" rel="noopener noreferrer">{state.user.login}</a>
                        </b> написал пост {state.created_at ? utils.formatDate(state.created_at): null}
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
  </>);
};