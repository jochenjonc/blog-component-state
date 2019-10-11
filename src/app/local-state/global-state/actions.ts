import { createAction, props } from '@ngrx/store';


export const loadList = createAction(
  '[List] load', 
  props<{params: {[key: string]: any}}>()
);
export const listLoadedError = createAction(
  '[List] loadError', 
  props<{error: string}>()
);

export const listLoadedSuccess = createAction(
  '[List] loadSuccess', 
  props<{list: any[]}>()
);
