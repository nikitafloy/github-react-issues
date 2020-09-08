export type MainState = {
  items?: Array<StateItems>;
  loading: boolean;
  inputValue: string;
  isScrolling: boolean;
  git?: {
    repo?: string;
    username?: string;
  };
};

export type StateItems = {
  title: string;
  number: number;
  user: {
    login: string;
    html_url: string;
  };
};
