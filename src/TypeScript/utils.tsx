// Github Markdown Query Types
export type markdownPostQueryData = {
  text: string;
  mode: 'markdown';
  context: 'none';
};

export type markdownPostQueryConfig = {
  headers?: {
    Authorization: string;
  };
};

export type markdownApiUrl = 'https://api.github.com/markdown';

// "AntiChildren" type
export type antiChildren = {
  children?: never;
};
