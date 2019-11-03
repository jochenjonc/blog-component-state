import {createAction, props} from '@ngrx/store';
import {Item} from "./item.interface";

export const fetchRepositoryList = createAction(
    '[Repository List] Fetch',
    props<{ params?: { [key: string]: string } }>()
);
export const repositoryListFetchError = createAction(
    '[Repository List] FetchError',
    props<{ error: string }>()
);

export const repositoryListFetchSuccess = createAction(
    '[Repository List] FetchSuccess',
    props<{ list: Item[] }>()
);
