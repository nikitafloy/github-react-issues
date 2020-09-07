import React, { useEffect, useState, FC } from 'react';
import './Comment.scss';

// Utils
import utils from '../../../utils';
import bodyToMarkdown from './utils';

// TypeScript
import { CommentType, CommentState } from '../../../TypeScript/UI/Comment/Comment';
import { CommentElement } from '../../../TypeScript/Pages/Issue/Issue';

export const Comment: FC<CommentType> = (props: CommentType): JSX.Element => {
  const [state, setState] = useState<CommentState>({ items: [] });
  useEffect(() => {
    (async (): Promise<void> => {
      const items: Array<CommentElement> = await bodyToMarkdown(props);
      setState({ items });
    })();
  }, [props]);

  return (
    <>
      {state.items.length ? (
        state.items.map((item, key) => (
          <section key={key} className="Comment">
            <div className="Comment__title">
              <b>
                <a href={item.html_url} target="_blank" rel="noopener noreferrer">
                  {item.user.login}
                </a>
              </b>
              {' '}
              оставил комментарий
              {' '}
              {utils.formatDate(item.created_at) as string}
            </div>

            <div className="Comment__body" dangerouslySetInnerHTML={{ __html: item.body }} />
          </section>
        ))
      ) : (
        <section className="Comment">
          <div className="Comment__title">
            <div className="loading_100" />
          </div>

          <div className="Comment__body">
            <div className="loading_100" />
            <div className="loading_100" />
            <div className="loading_100" />
            <div className="loading_100" />
          </div>
        </section>
      )}
    </>
  );
};
