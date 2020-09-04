export interface IState {
    items: object[], 
    loading: boolean, 
    inputValue: string, 
    git: { 
        repo?: string,
        username?: string, 
    },
};