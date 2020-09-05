export interface IStateItems {
    title: string,
    number: number,
    user: {
        login: string,
        html_url: string,
    },
};

export interface IState {
    items?: Array<IStateItems>, 
    loading: boolean, 
    inputValue: string, 
    git?: { 
        repo: string,
        username: string, 
    },
};