import { IIssue, ICommentElement } from '../../Pages/Issue/IIssue';
import { RouteComponentProps } from 'react-router-dom';

export interface ICommentState {
    items: Array<ICommentElement>,
};

export interface IComment extends ICommentState {
    globalProps: RouteComponentProps<IIssue>,
};