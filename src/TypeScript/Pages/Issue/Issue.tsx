export type IssueType = {
  owner: string;
  repo: string;
  id: string;
};

export type IssueLabels = {
  url: string;
  name: string;
  description: string | null;
  color: string;
};

export type IssueState = {
  title?: string;
  number?: number;
  comments?: number;
  user?: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  labels?: Array<IssueLabels>;
  state?: 'open' | 'closed';
  created_at?: string;
  updated_at?: string;
  closed_at?: string | null;
  body?: string;
  comments_active?: Array<CommentElement> | undefined;
};

export type CommentElement = {
  user: {
    login: string;
  };
  html_url: string;
  created_at: string;
  body: string;
};
