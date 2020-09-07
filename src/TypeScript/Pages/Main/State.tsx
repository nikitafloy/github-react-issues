export type StateItems = {
  title: string;
  number: number;
  user: {
    login: string;
    html_url: string;
  };
};

export type IState = {
  items?: Array<StateItems>;
  loading: boolean;
  inputValue: string;
  git?: {
    repo?: string;
    username?: string;
  };
};
