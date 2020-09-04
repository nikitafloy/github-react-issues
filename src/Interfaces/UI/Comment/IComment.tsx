import { IIssue, ICommentItems } from '../../Issue/IIssue';
import { RouteComponentProps } from 'react-router-dom';

export interface ICommentState {
    items: ICommentItems,
};

export interface IComment extends ICommentState {
    globalProps: RouteComponentProps<IIssue>,
};