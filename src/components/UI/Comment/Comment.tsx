/* eslint-disable react/no-danger */
import React, {
  useEffect, useState, FC, ReactElement,
} from 'react';
import './Comment.scss';

// Utils
import utils from '../../../utils';
import bodyToMarkdown from './utils';

// TypeScript
import { CommentType, CommentState } from '../../../TypeScript/UI/Comment/Comment';
import { CommentElement } from '../../../TypeScript/Pages/Issue/Issue';

// Words
import words from '../../../words';

export const Comment: FC<CommentType> = (props: CommentType): ReactElement => {
  const [state, setState] = useState<CommentState>({ items: [] });
  useEffect(() => {
    (async (): Promise<void> => {
      const items: Array<CommentElement> = await bodyToMarkdown(props);
      setState({ items });
    })();
  }, [props]);

  const renderLoadingTemplate = (): ReactElement => (
    <section className="Comment">
      <div className="Comment__title">
        {utils.randomLoadingArray(1)}
      </div>

      <div className="Comment__body">
        {utils.randomLoadingArray(3)}
      </div>
    </section>
  );

  return (
    <>
      {state.items.length ? (
        state.items.map((item, key) => (
          // eslint-disable-next-line react/no-array-index-key
          <section key={`comment-${key}`} className="Comment">
            <div className="Comment__title">
              <a href={item.html_url} target="_blank" rel="noopener noreferrer">{item.user.login}</a>

              {` ${words.LEAVE_A_COMMENT} `}

              {utils.formatDate(item.created_at)}
            </div>

            <div className="Comment__body" dangerouslySetInnerHTML={{ __html: item.body }} />
          </section>
        ))
      ) : renderLoadingTemplate()}
    </>
  );
};
