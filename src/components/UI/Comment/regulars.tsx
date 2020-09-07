import { RegularsItem } from '../../../TypeScript/UI/Comment/regulars';

export default (login: string, repo: string): Array<RegularsItem> => [
  {
    regexp: /(?<= |<[^>]*>)@(\w+)/gm,
    replace_on: 'http://github.com/',
  },
  {
    regexp: /(?<= |<[^>]*>)#(\d+)/gm,
    replace_on: `/issues/${login}/${repo}/`,
  },
];
