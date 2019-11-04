import {createReducer, on} from '@ngrx/store';
import {listLoadedSuccess} from './actions';
import {Item} from "./item.interface";

export interface GitHubState {
    list: Item[]
}

const initialGitHubState = {
    list: []
};

const _listReducer = createReducer(
    initialGitHubState,
    on(listLoadedSuccess, (state, action) => ({
            ...state,
            list: uniteItemArrays(state.list, action.list)
        })
    )
);

export const listReducer = (state, action) => _listReducer(state, action);

function uniteItemArrays(...arrs: Item[][]) {
    return Array.from(
        new Map(arrs
            .reduce((arr: any, a: any): any => arr.concat(a))
            .map(i => [i.id, i])
        ).entries()
    ).map(e => e[1])
}
