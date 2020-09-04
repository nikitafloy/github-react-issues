export interface IIssue {
    login: string,
    repo: string,
    id: string,
};

export interface IIssueState {
    title?: string,
    number?: number,
    user?: {
        login: string,
        avatar_url: string,
        html_url: string,
    },
    labels?: {
        url: string,
        name: string,
        color: string,
        description: string,
    },
    state?: string,
    locked?: boolean,
    comments?: number,
    created_at?: string,
    updated_at?: string,
    closed_at?: string | null,
    closed_by?: string | null,
    comments_active?: ICommentItems | null,
    body?: string,
};

export interface ICommentElement {
    user: {
        login: string,
    },
    html_url: string,
    created_at: string,
    body: string,
};

export interface ICommentItems extends Array<ICommentElement> {};