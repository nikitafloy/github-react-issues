import { RouteComponentProps } from 'react-router-dom';
import { IssueType, CommentElement } from '../../Pages/Issue/Issue';
import { antiChildren } from '../../utils';

export type CommentState = {
  items: Array<CommentElement>;
};

export type CommentProps = {
  globalProps: RouteComponentProps<IssueType>;
};
export type CommentType = CommentState & CommentProps & antiChildren;
