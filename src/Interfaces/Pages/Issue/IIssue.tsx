export interface IIssue {
    login: string,
    repo: string,
    id: string,
};

export interface IIssueState {
    title?: string,
    number?: number,
    comments?: number,
    user?: {
        login: string,
        avatar_url: string,
        html_url: string,
    },
    labels?: {
        url: string,
        name: string,
        description: string,
        color: string,
    },
    state?: "open"|"closed",
    locked?: boolean,
    created_at?: string,
    updated_at?: string,
    closed_at?: string|null,
    closed_by?: string|null,
    body?: string,
    comments_active?: Array<ICommentElement>|undefined,
};

export interface ICommentElement {
    user: {
        login: string,
    },
    html_url: string,
    created_at: string,
    body: string,
};