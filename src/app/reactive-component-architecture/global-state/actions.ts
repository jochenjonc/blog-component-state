import {createAction, props} from '@ngrx/store';
import {Item} from "./item.interface";

export const loadList = createAction(
    '[List] load',
    props<{ params?: { [key: string]: string } }>()
);
export const listLoadedError = createAction(
    '[List] loadError',
    props<{ error: string }>()
);

export const listLoadedSuccess = createAction(
    '[List] loadSuccess',
    props<{ list: Item[] }>()
);
