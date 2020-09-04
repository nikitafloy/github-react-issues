import regulars from './regulars';
import utils from '../../utils';
import { IComment } from '../../Interfaces/UI/Comment/IComment';

const replaceTags = (text: string, params: {login: string, repo: string}): string => {
    regulars(params.login, params.repo).forEach(item => {
        let m;
        const regex = item.regexp;
        while ((m = regex.exec(text)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            };

            text = text.replace(m[0], `<a href="${item.replace_on}${m[1]}" target="_blank">${m[0]}</a>`);
            m = regex.exec(text);
        };
    });
    return text;
};

export default async (props: IComment): Promise<Object> => await Promise.all(props.items.map(async item => {
    const res = await utils.MarkdownToHTML(item.body);
    if (res) {
        return {
            user: {
                login: item.user.login,
            }, 
            html_url: item.html_url,
            created_at: item.created_at, 
            body: replaceTags(res.data, props.globalProps.match.params),
        };
    } else {
        console.error(res);
        setTimeout(props.globalProps.history.push, 5000, '/');
    };
}));