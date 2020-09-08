// Utils
import regulars from './regulars';
import utils from '../../../utils';

// TypeScript
import { CommentType } from '../../../TypeScript/UI/Comment/Comment';
import { CommentElement } from '../../../TypeScript/Pages/Issue/Issue';
import { RegularsItem } from '../../../TypeScript/UI/Comment/regulars';

const replaceTags = (text: string, params: { login: string; repo: string }): string => {
  (regulars(params.login, params.repo) as Array<RegularsItem>).forEach((item) => {
    let m;
    const regex = item.regexp;
    // eslint-disable-next-line no-cond-assign
    while ((m = regex.exec(text)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex += 1;
      }

      // eslint-disable-next-line no-param-reassign
      text = text.replace(m[0], `<a href="${item.replaceOn}${m[1]}" target="_blank">${m[0]}</a>`);
      m = regex.exec(text);
    }
  });
  return text;
};

// eslint-disable-next-line no-return-await
export default async (props: CommentType): Promise<Array<CommentElement>> => await Promise.all(
  props.items.map(async (item) => {
    const data: string | boolean = await utils.markdownToHTML(item.body);
    if (typeof data !== 'string') {
      props.gProps.history.push('/');
    }

    return {
      user: {
        login: item.user.login,
      },
      html_url: item.html_url,
      created_at: item.created_at,
      body:
          typeof data === 'string'
            ? replaceTags(data, props.gProps.match.params)
            : item.body,
    };
  }),
);
