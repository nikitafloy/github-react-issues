import { RegularsItem } from '../../../TypeScript/UI/Comment/regulars';

export default (login: string, repo: string): Array<RegularsItem> => [
  {
    regexp: /(?<= |<[^>]*>)@(\w+)/gm,
    replaceOn: 'http://github.com/',
  },
  {
    regexp: /(?<= |<[^>]*>)#(\d+)/gm,
    replaceOn: `/issues/${login}/${repo}/`,
  },
];
