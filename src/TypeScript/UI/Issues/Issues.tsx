import { StateItems } from '../../Pages/Main/State';

export type IssuesParams = {
  username?: string;
  repo?: string;
  items?: Array<StateItems>;
  loading: boolean;
  isScrolling: boolean;
};
