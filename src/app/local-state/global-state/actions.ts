import {createAction, props} from '@ngrx/store';


export const loadList = createAction(
    '[List] load'
);
export const listLoadedError = createAction(
    '[List] loadError',
    props<{ error: string }>()
);

export const listLoadedSuccess = createAction(
    '[List] loadSuccess',
    props<{ list: any[] }>()
);
