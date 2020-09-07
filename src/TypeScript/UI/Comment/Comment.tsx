import { RouteComponentProps } from 'react-router-dom';
import { IssueType, CommentElement } from '../../Pages/Issue/Issue';

export type CommentState = {
  items: Array<CommentElement>;
};

export type CommentProps = {
  globalProps: RouteComponentProps<IssueType>;
};

type antiChildren = {
  children?: never;
};

export type CommentType = CommentState & CommentProps & antiChildren;
