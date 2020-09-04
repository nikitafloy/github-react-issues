interface IRegularsItem {
    regexp: RegExp,
    replace_on: string,
};

export interface IRegulars extends Array<IRegularsItem> {};

export default (login: string, repo: string): IRegulars => [
    {
        regexp: /(?<= |<[^>]*>)@(\w+)/gm,
        replace_on: `http://github.com/`,
    },
    {
        regexp: /(?<= |<[^>]*>)#(\d+)/gm,
        replace_on: `/issues/${login}/${repo}/`,
    },
];