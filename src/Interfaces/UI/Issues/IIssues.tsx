import { IStateItems } from "../../Pages/Main/IState";

export interface IIssuesParams {
    username?: string,
    repo?: string,
    items?: Array<IStateItems>, 
    loading: boolean,
    isScrolling: boolean,
};