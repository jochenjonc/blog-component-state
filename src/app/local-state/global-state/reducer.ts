import { createReducer, on  } from '@ngrx/store';
import { listLoadedSuccess } from './actions';

export interface State {
  list: any[]
}

const _listReducer = createReducer(
  {list: [{id: 1, name: 'onee'}]}, 
  on(listLoadedSuccess, (state, action) => ({
    ...state, 
    list: Array.from(new Map([
      ...state.list, 
      ...action.list])) as any
    })
  )
);

export const listReducer = (state, action) => _listReducer(state, action);
