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

// "AntiChildren" type
export type antiChildren = {
  children?: never;
};
