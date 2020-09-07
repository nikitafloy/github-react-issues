export type markdownPostQueryData = {
  text: string;
  mode: 'markdown';
  context: 'none';
};

export type markdownPostQueryConfig = {
  headers: {
    Authorization: string;
  };
};
